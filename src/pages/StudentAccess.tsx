import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const StudentAccess = () => {
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to student dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Back Link */}
        <Link 
          to="/student-login" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
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
              This access password is provided by your teacher.
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <Button type="submit" size="lg" className="w-full h-12">
                Enter Dashboard
              </Button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Don't have the access password? Contact your teacher.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAccess;
