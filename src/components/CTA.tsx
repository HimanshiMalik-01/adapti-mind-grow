import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Start Learning Today</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
            Ready to Transform Your{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Learning Experience?
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of neurodiverse learners who have discovered their unique path to success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="hero" size="lg" className="group" onClick={() => window.location.href = '/auth'}>
              Begin Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/auth'}>
              Schedule a Demo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Free Assessment
              </div>
              <div className="text-lg font-bold">No Credit Card Required</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Personalized Plan
              </div>
              <div className="text-lg font-bold">Created Just for You</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Support Included
              </div>
              <div className="text-lg font-bold">24/7 AI Assistant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
