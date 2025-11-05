-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for neurodiverse profiles
CREATE TYPE learning_profile_type AS ENUM ('adhd', 'dyslexia', 'autism', 'mixed', 'neurotypical');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE module_type AS ENUM ('reading', 'math', 'science', 'language', 'social_skills', 'executive_function');

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  age INTEGER,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning profiles table (stores neurodiversity assessments)
CREATE TABLE public.learning_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile_type learning_profile_type NOT NULL,
  assessment_score JSONB NOT NULL, -- Stores detailed assessment results
  preferences JSONB, -- Font, colors, reading speed, etc.
  cognitive_metrics JSONB, -- Attention span, processing speed, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Learning modules table
CREATE TABLE public.learning_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  module_type module_type NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  content JSONB NOT NULL, -- Adaptive content structure
  estimated_duration INTEGER, -- in minutes
  xp_reward INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started', -- not_started, in_progress, completed
  progress_percentage INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  attempts INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  performance_metrics JSONB, -- Accuracy, speed, focus time, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Achievements and gamification
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_required INTEGER NOT NULL,
  badge_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- User stats (XP, level, streaks)
CREATE TABLE public.user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  modules_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Assessment responses (stores quiz/screening answers)
CREATE TABLE public.assessment_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL, -- 'initial_screening', 'cognitive_test', 'behavioral_test'
  responses JSONB NOT NULL,
  score JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for learning_profiles
CREATE POLICY "Users can view their own learning profile"
  ON public.learning_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning profile"
  ON public.learning_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning profile"
  ON public.learning_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for learning_modules (all authenticated users can view)
CREATE POLICY "Authenticated users can view modules"
  ON public.learning_modules FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for achievements (all authenticated users can view)
CREATE POLICY "Authenticated users can view achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_stats
CREATE POLICY "Users can view their own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for assessment_responses
CREATE POLICY "Users can view their own assessment responses"
  ON public.assessment_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment responses"
  ON public.assessment_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Initialize user stats
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_profiles_updated_at
  BEFORE UPDATE ON public.learning_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();