import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const assessmentQuestions = [
  {
    question: "How do you prefer to learn new concepts?",
    options: [
      "Visual demonstrations and diagrams",
      "Hands-on practice and experimentation",
      "Reading detailed explanations",
      "Listening to audio explanations"
    ]
  },
  {
    question: "When reading, do you find it helpful to:",
    options: [
      "Use a ruler or finger to follow lines",
      "Read faster by skimming",
      "Take frequent breaks",
      "Adjust font size or spacing"
    ]
  },
  {
    question: "How long can you typically focus on a task without a break?",
    options: [
      "Less than 15 minutes",
      "15-30 minutes",
      "30-60 minutes",
      "More than 60 minutes"
    ]
  },
  {
    question: "Which environment helps you concentrate best?",
    options: [
      "Quiet space with minimal distractions",
      "Background music or white noise",
      "Active environment with some activity",
      "Varied - depends on the task"
    ]
  },
  {
    question: "How do you organize and remember information?",
    options: [
      "Visual mind maps or diagrams",
      "Lists and written notes",
      "Voice recordings or verbal repetition",
      "Physical movement or gestures"
    ]
  }
];

const Assessment = () => {
  const [user, setUser] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const handleAnswer = async (answer: string) => {
    const newResponses = [...responses, answer];
    setResponses(newResponses);

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await processAssessment(newResponses);
    }
  };

  const processAssessment = async (allResponses: string[]) => {
    setIsProcessing(true);

    try {
      // Store assessment responses
      const { error: responseError } = await supabase
        .from("assessment_responses")
        .insert({
          user_id: user.id,
          assessment_type: "initial_screening",
          responses: {
            questions: assessmentQuestions.map((q, i) => ({
              question: q.question,
              answer: allResponses[i]
            }))
          }
        });

      if (responseError) throw responseError;

      // Call AI assessment function
      const { data, error } = await supabase.functions.invoke("assess-profile", {
        body: {
          responses: assessmentQuestions.map((q, i) => ({
            question: q.question,
            answer: allResponses[i]
          })),
          assessmentType: "initial_screening"
        }
      });

      if (error) throw error;

      // Store learning profile
      const { error: profileError } = await supabase
        .from("learning_profiles")
        .insert({
          user_id: user.id,
          profile_type: data.analysis.profileType,
          assessment_score: data.analysis,
          preferences: data.analysis.recommendations,
          cognitive_metrics: data.analysis.scores
        });

      if (profileError) throw profileError;

      setIsComplete(true);
      
      toast({
        title: "Assessment Complete! 🎉",
        description: `Your learning profile has been created: ${data.analysis.profileType}`,
      });

      setTimeout(() => navigate("/dashboard"), 3000);

    } catch (error: any) {
      console.error("Error processing assessment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process assessment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-hero flex items-center justify-center animate-pulse">
            <Brain className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Analyzing Your Responses...</h2>
          <p className="text-muted-foreground">
            Our AI is creating your personalized learning profile
          </p>
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-xl bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold">Profile Created Successfully!</h2>
          <p className="text-muted-foreground">
            Redirecting to your personalized dashboard...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Learning Profile Assessment</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {assessmentQuestions.length}
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-8 bg-gradient-card border-2">
          <h2 className="text-xl font-semibold mb-6">
            {assessmentQuestions[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {assessmentQuestions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto py-4 px-6 hover:bg-primary/10 hover:border-primary transition-all"
                onClick={() => handleAnswer(option)}
              >
                <span className="flex-1">{option}</span>
              </Button>
            ))}
          </div>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          This assessment helps us personalize your learning experience
        </div>
      </div>
    </div>
  );
};

export default Assessment;
