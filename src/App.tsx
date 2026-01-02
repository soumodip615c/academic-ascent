import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentAccess from "./pages/StudentAccess";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Lectures from "./pages/Lectures";
import Exams from "./pages/Exams";
import Results from "./pages/Results";
import Fees from "./pages/Fees";
import AdminDashboard, { AdminOverview } from "./pages/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminNotes from "./pages/admin/AdminNotes";
import AdminLectures from "./pages/admin/AdminLectures";
import AdminExams from "./pages/admin/AdminExams";
import AdminResults from "./pages/admin/AdminResults";
import AdminPayments from "./pages/admin/AdminPayments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/student-access" element={<StudentAccess />} />
          
          {/* Student Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/notes" element={<Notes />} />
          <Route path="/dashboard/lectures" element={<Lectures />} />
          <Route path="/dashboard/exams" element={<Exams />} />
          <Route path="/dashboard/results" element={<Results />} />
          <Route path="/dashboard/fees" element={<Fees />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="notes" element={<AdminNotes />} />
            <Route path="lectures" element={<AdminLectures />} />
            <Route path="exams" element={<AdminExams />} />
            <Route path="results" element={<AdminResults />} />
            <Route path="payments" element={<AdminPayments />} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
