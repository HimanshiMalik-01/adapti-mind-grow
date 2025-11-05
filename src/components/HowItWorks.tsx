import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    phase: "Phase 1",
    title: "Assessment",
    description: "Complete our interactive screening through games and activities. No stress, just fun tasks that help us understand how you learn best.",
    highlights: [
      "Psychometric evaluation",
      "Speech and reading analysis",
      "Attention and processing tests",
    ],
  },
  {
    phase: "Phase 2",
    title: "Personalization",
    description: "Our AI creates your unique learning profile and customizes every aspect of your educational experience.",
    highlights: [
      "Cognitive load optimization",
      "Visual and audio preferences",
      "Pace and complexity adjustment",
    ],
  },
  {
    phase: "Phase 3",
    title: "Learning Journey",
    description: "Start learning with content that adapts in real-time. Your AI assistant is always there to help, and your progress is celebrated every step of the way.",
    highlights: [
      "Adaptive content delivery",
      "Real-time support",
      "Achievement tracking",
    ],
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Your Path to{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Success
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Three simple phases to unlock your full potential
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -translate-x-1/2 z-0" />
              )}
              
              <Card className="relative p-8 space-y-6 bg-gradient-card border-2 hover:shadow-elevated transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero text-primary-foreground font-bold text-xl">
                  {index + 1}
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-primary uppercase tracking-wider">
                    {step.phase}
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                <ul className="space-y-3">
                  {step.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
