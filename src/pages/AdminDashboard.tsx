import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  Video, 
  FileText, 
  CreditCard, 
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  UserPlus,
  FileUp,
  ClipboardList,
  Key
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.jpeg";
import { useStudents } from "@/hooks/useStudents";
import { useNotes } from "@/hooks/useNotes";
import { useLectures } from "@/hooks/useLectures";
import { useExams } from "@/hooks/useExams";
import { useFees } from "@/hooks/useFees";
import { useUniversalPassword, useAdminPassword, useUpdateSetting } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Students", url: "/admin/students", icon: Users },
  { title: "Notes", url: "/admin/notes", icon: BookOpen },
  { title: "Lectures", url: "/admin/lectures", icon: Video },
  { title: "Exams", url: "/admin/exams", icon: FileText },
  { title: "Payments", url: "/admin/payments", icon: CreditCard },
];

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const isActive = (url: string) => {
    if (url === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(url);
  };

  return (
    <div className="min-h-screen bg-theme-sky flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card/95 backdrop-blur border-r border-theme-sky transform transition-transform duration-200
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-theme-sky">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="font-heading font-semibold text-foreground text-sm">
            Admin Panel
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden ml-auto"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.url)
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center px-4 gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-semibold text-foreground">
            SUCCESS CODING WORLD
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Admin Overview Component
export const AdminOverview = () => {
  const { toast } = useToast();
  const { data: students = [] } = useStudents();
  const { data: notes = [] } = useNotes();
  const { data: lectures = [] } = useLectures();
  const { data: exams = [] } = useExams();
  const { data: fees = [] } = useFees();
  const { data: universalPassword = "123456" } = useUniversalPassword();
  const { data: adminPassword = "123456" } = useAdminPassword();
  const updateSetting = useUpdateSetting();
  const [newPassword, setNewPassword] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  const pendingPayments = fees.filter((f) => f.status === "pending").length;
  const activeExams = exams.filter((e) => e.status === "active" || e.status === "available").length;

  const stats = [
    { title: "Total Students", value: students.length.toString(), icon: Users, color: "blue" },
    { title: "Notes Uploaded", value: notes.length.toString(), icon: BookOpen, color: "teal" },
    { title: "Pending Payments", value: pendingPayments.toString(), icon: CreditCard, color: "orange" },
    { title: "Active Exams", value: activeExams.toString(), icon: FileText, color: "purple" },
  ];

  const quickActions = [
    { title: "Add Student", icon: UserPlus, url: "/admin/students" },
    { title: "Upload Notes", icon: FileUp, url: "/admin/notes" },
    { title: "Create Exam", icon: ClipboardList, url: "/admin/exams" },
  ];

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updateSetting.mutateAsync({ 
        key: "universal_access_password", 
        value: newPassword 
      });
      toast({
        title: "Success",
        description: "Student access password updated successfully!",
      });
      setNewPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAdminPassword = async () => {
    if (!newAdminPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a new admin password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updateSetting.mutateAsync({ 
        key: "admin_access_password", 
        value: newAdminPassword 
      });
      toast({
        title: "Success",
        description: "Admin access password updated successfully!",
      });
      setNewAdminPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update admin password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-foreground mb-6 font-heading">
        Dashboard Overview
      </h2>

      {/* Universal Access Password Card */}
      <div className="card-education mb-8 border-2 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="feature-icon-orange">
            <Key className="w-5 h-5" />
      </div>

      {/* Admin Access Password Card */}
      <div className="card-education mb-8 border-2 border-accent/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="feature-icon-purple">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Admin Access Password</h3>
            <p className="text-sm text-muted-foreground">
              This password is required for admin login to the dashboard
            </p>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <p className="text-sm text-muted-foreground">Current Admin Password:</p>
          <p className="font-mono text-lg font-bold text-accent">{adminPassword}</p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="newAdminPassword" className="sr-only">New Admin Password</Label>
            <Input
              id="newAdminPassword"
              placeholder="Enter new admin password"
              value={newAdminPassword}
              onChange={(e) => setNewAdminPassword(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleUpdateAdminPassword}
            disabled={updateSetting.isPending}
            className="bg-accent hover:bg-accent/90"
          >
            {updateSetting.isPending ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
          <div>
            <h3 className="font-semibold text-foreground">Student Access Password</h3>
            <p className="text-sm text-muted-foreground">
              This universal password is required for all students to access their dashboard
            </p>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <p className="text-sm text-muted-foreground">Current Password:</p>
          <p className="font-mono text-lg font-bold text-primary">{universalPassword}</p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="newPassword" className="sr-only">New Password</Label>
            <Input
              id="newPassword"
              placeholder="Enter new access password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleUpdatePassword}
            disabled={updateSetting.isPending}
          >
            {updateSetting.isPending ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="card-education">
            <div className={`feature-icon-${stat.color} mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 className="text-lg font-semibold text-foreground mb-4 font-heading">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.url}
            className="card-education flex items-center gap-4 hover:border-primary/50 border border-transparent"
          >
            <div className="feature-icon-blue">
              <action.icon className="w-5 h-5" />
            </div>
            <span className="font-medium text-foreground">{action.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
