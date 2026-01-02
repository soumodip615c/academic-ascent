import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddStudent } from "@/hooks/useStudents";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const COURSES = [
  "BTech",
  "BCA",
  "MCA", 
  "Class 10",
  "Class 12",
  "AI & ML",
  "Web Development",
  "Python Programming"
];

const StudentLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addStudent = useAddStudent();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [phone, setPhone] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, verify the access password
      const { data: passwordSetting, error: passwordError } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "universal_access_password")
        .maybeSingle();

      if (passwordError) throw passwordError;

      const universalPassword = passwordSetting?.value || "123456";

      if (accessPassword !== universalPassword) {
        toast({
          title: "Invalid Access Password",
          description: "Please enter the correct access password provided by your teacher.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Generate a roll number
      const rollNo = `SCW${Date.now().toString().slice(-6)}`;
      
      const studentData = await addStudent.mutateAsync({
        name,
        email,
        course,
        phone: phone || null,
        roll_no: rollNo,
        semester: null,
        access_password: "123456",
        is_active: true
      });

      toast({
        title: "Registration Successful!",
        description: "Welcome! Redirecting to your dashboard.",
      });

      // Store student info in session for dashboard
      sessionStorage.setItem("student", JSON.stringify({
        id: studentData.id,
        name: studentData.name,
        course: studentData.course,
        email: studentData.email,
        roll_no: studentData.roll_no,
        semester: studentData.semester
      }));

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-sky px-4 py-12">
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
            <div className="w-16 h-16 bg-education-blue-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-education-blue" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground font-heading">
              Student Registration
            </h1>
            <p className="text-muted-foreground mt-2">
              Register to start your learning journey.
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

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
                <Label htmlFor="course">Select Course</Label>
                <Select value={course} onValueChange={setCourse} required>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose your course" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessPassword">Access Password</Label>
                <Input
                  id="accessPassword"
                  type="password"
                  placeholder="Enter access password from teacher"
                  value={accessPassword}
                  onChange={(e) => setAccessPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12"
                disabled={isLoading || !name || !email || !course || !accessPassword}
              >
                {isLoading ? "Registering..." : "Register & Continue"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button 
                type="button"
                variant="outline"
                size="lg" 
                className="w-full h-12"
                onClick={() => navigate("/student-access")}
              >
                Already Registered? Login Here
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentLogin;
