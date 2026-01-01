import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StudentAccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verify access password against the database
      const { data: student, error } = await supabase
        .from("students")
        .select("*")
        .eq("email", email)
        .eq("access_password", accessCode)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;

      if (!student) {
        toast({
          title: "Access Denied",
          description: "Invalid email or access password. Please try again.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Store student data in session for dashboard
      sessionStorage.setItem("studentId", student.id);
      sessionStorage.setItem("studentName", student.name);
      sessionStorage.setItem("studentCourse", student.course);
      sessionStorage.setItem("studentEmail", student.email);
      sessionStorage.setItem("studentRollNo", student.roll_no);

      toast({
        title: "Welcome back!",
        description: `Hello ${student.name}, you're now logged in.`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-education-blue-light px-4 py-12">
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
            <div className="w-16 h-16 bg-education-orange-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-education-orange" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground font-heading">
              Student Entry Access
            </h1>
            <p className="text-muted-foreground mt-2">
              Enter your email and access password provided by your teacher.
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessCode">Access Password</Label>
                <Input
                  id="accessCode"
                  type="password"
                  placeholder="Enter the access password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  required
                  className="h-12 text-center tracking-widest"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12"
                disabled={isLoading || !email || !accessCode}
              >
                {isLoading ? "Verifying..." : "Enter Dashboard"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Don't have an account?{" "}
              <Link to="/student-login" className="text-education-blue hover:underline">
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAccess;
