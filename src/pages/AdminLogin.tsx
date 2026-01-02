import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the universal access password from settings
      const { data: settings, error: settingsError } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "universal_access_password")
        .single();

      if (settingsError || !settings) {
        toast({
          title: "Error",
          description: "Access password not configured. Please contact support.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Verify the access password
      if (password !== settings.value) {
        toast({
          title: "Invalid Credentials",
          description: "The access password is incorrect.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Store admin info in session storage
      sessionStorage.setItem("adminEmail", email);
      sessionStorage.setItem("isAdminLoggedIn", "true");

      toast({
        title: "Login Successful",
        description: "Welcome to the Admin Dashboard!",
      });

      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="shadow-card">
          <CardHeader className="text-center pb-2">
            {/* Icon */}
            <div className="w-16 h-16 bg-education-teal-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-education-teal" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground font-heading">
              Admin Login
            </h1>
            <p className="text-muted-foreground mt-2">
              Access the administration panel.
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@successcodingworld.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Access Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter access password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 bg-accent hover:bg-accent/90"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Login as Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
