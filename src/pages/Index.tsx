import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpeg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-theme-sky">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md mx-auto animate-fade-in">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src={logo} 
              alt="SUCCESS CODING WORLD" 
              className="w-40 h-40 mx-auto object-contain"
            />
          </div>

          {/* Institution Name */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-heading">
            SUCCESS CODING WORLD
          </h1>
          
          {/* Powered By */}
          <p className="text-muted-foreground mb-4">
            Powered by <span className="font-medium text-foreground">Subhajit Paul</span>
          </p>

          {/* Trust Line */}
          <p className="text-lg text-muted-foreground mb-10">
            Learning made simple. Guidance that works.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              asChild 
              size="lg" 
              className="w-full text-lg py-6"
            >
              <Link to="/student-login">Student Login</Link>
            </Button>
            
            <Link 
              to="/admin-login" 
              className="inline-block text-muted-foreground hover:text-primary transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Phone className="w-4 h-4" />
            <span>91233 52552</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SUCCESS CODING WORLD
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
