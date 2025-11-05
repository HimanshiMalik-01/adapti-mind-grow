import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, LogOut, Target, Trophy, Zap, Book, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await fetchUserData(session.user.id);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/auth");
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(profileData);

      // Fetch stats
      const { data: statsData } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", userId)
        .single();

      setStats(statsData);

      // Check if user needs to complete assessment
      const { data: learningProfile } = await supabase
        .from("learning_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (!learningProfile) {
        toast({
          title: "Welcome! Let's get started 🎯",
          description: "Complete your assessment to unlock personalized learning",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-hero flex items-center justify-center animate-pulse">
            <Brain className="w-10 h-10 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const xpToNextLevel = stats ? (stats.level * 1000) - stats.total_xp : 1000;
  const levelProgress = stats ? ((stats.total_xp % 1000) / 1000) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NeuroLearn</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {profile?.full_name || "Learner"}!
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-card border-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-2xl font-bold">{stats?.total_xp || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-bold">{stats?.level || 1}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{stats?.current_streak || 0} days</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Book className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats?.modules_completed || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="p-6 mb-8 bg-gradient-card border-2">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Level {stats?.level || 1} Progress</h3>
              <span className="text-sm text-muted-foreground">
                {stats?.total_xp || 0} / {stats ? stats.level * 1000 : 1000} XP
              </span>
            </div>
            <Progress value={levelProgress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {xpToNextLevel} XP until next level
            </p>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-2 cursor-pointer"
                onClick={() => navigate("/assessment")}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">Start Assessment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete your learning profile to get personalized content
                </p>
                <Button variant="outline">Begin Assessment</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-2">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">AI Learning Assistant</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get help from your personal AI tutor anytime
                </p>
                <Button variant="secondary">Chat Now</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Coming Soon Section */}
        <Card className="p-8 mt-8 bg-gradient-card border-2 text-center">
          <h3 className="text-2xl font-bold mb-2">More Features Coming Soon! 🚀</h3>
          <p className="text-muted-foreground mb-4">
            Learning modules, progress tracking, and achievements are being built
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Interactive Lessons
            </span>
            <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
              Gamified Challenges
            </span>
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
              Achievement Badges
            </span>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
