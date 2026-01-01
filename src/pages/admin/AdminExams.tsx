import { FileText, Plus, Calendar, Link as LinkIcon, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const exams = [
  { id: 1, title: "Mid-Semester Exam", course: "BCA", date: "Jan 5, 2025", link: "forms.google.com/...", status: "upcoming" },
  { id: 2, title: "Python Quiz", course: "BCA", date: "Dec 28, 2024", link: "forms.google.com/...", status: "active" },
  { id: 3, title: "Database Test", course: "AI & ML", date: "Dec 22, 2024", link: "forms.google.com/...", status: "completed" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "upcoming":
      return <span className="status-pending">Upcoming</span>;
    case "active":
      return <span className="status-available">Active</span>;
    case "completed":
      return <span className="status-submitted">Completed</span>;
    default:
      return null;
  }
};

const AdminExams = () => {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="feature-icon-orange">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-heading">
            Exams
          </h2>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Exam
        </Button>
      </div>

      {/* Exams List */}
      <div className="space-y-3">
        {exams.map((exam) => (
          <div key={exam.id} className="card-education flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-medium text-foreground">{exam.title}</h3>
                {getStatusBadge(exam.status)}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="px-2 py-0.5 bg-education-orange-light text-education-orange rounded-md">{exam.course}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {exam.date}
                </span>
                <span className="flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5" />
                  Google Form
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Exam</DropdownMenuItem>
                <DropdownMenuItem>Copy Link</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete Exam</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminExams;
