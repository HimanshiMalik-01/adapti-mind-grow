import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Target } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered Adaptive Learning</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Every Mind Learns{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Differently
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Personalized education for neurodiverse learners. Our AI adapts to your unique learning style, pace, and needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" onClick={() => window.location.href = '/auth'}>
                Start Your Journey
              </Button>
              <Button variant="outline" size="lg" onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Learn More
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Student Engagement</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-secondary">40%</div>
                <div className="text-sm text-muted-foreground">Faster Progress</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-accent">100+</div>
                <div className="text-sm text-muted-foreground">Adaptive Modules</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
            <img
              src={heroImage}
              alt="Diverse students engaged in interactive digital learning"
              className="relative rounded-3xl shadow-elevated w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
