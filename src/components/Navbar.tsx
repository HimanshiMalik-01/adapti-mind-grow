import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">NeuroLearn</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
              How It Works
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
            <Button variant="hero" onClick={() => window.location.href = '/auth'}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
