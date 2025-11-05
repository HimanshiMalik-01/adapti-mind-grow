import { Card } from "@/components/ui/card";
import { Brain, Gamepad2, Timer, MessageSquare, BookOpen, LineChart } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Cognitive Profiling",
    description: "AI-powered assessment identifies your unique learning profile, including ADHD, dyslexia, autism, and other neurodiverse traits.",
    color: "text-primary",
  },
  {
    icon: BookOpen,
    title: "Adaptive Content",
    description: "Content automatically adjusts to your reading level, visual preferences, and processing speed for optimal comprehension.",
    color: "text-secondary",
  },
  {
    icon: Gamepad2,
    title: "Gamified Learning",
    description: "Engaging challenges and rewards keep you motivated while building skills at your own pace.",
    color: "text-accent",
  },
  {
    icon: Timer,
    title: "Focus Tools",
    description: "Built-in timers, breaks, and attention aids help maintain concentration and prevent overwhelm.",
    color: "text-success",
  },
  {
    icon: MessageSquare,
    title: "AI Assistant",
    description: "Voice and text support available 24/7 to answer questions and provide encouragement.",
    color: "text-primary",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    description: "Detailed insights show your growth over time and celebrate every milestone achieved.",
    color: "text-secondary",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Designed for{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Your Success
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Features built specifically for neurodiverse learners, backed by neuroscience and inclusive design principles.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-2"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center ${feature.color}`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
