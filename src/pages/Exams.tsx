import { FileText, ExternalLink, Calendar, Clock, Info } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";
import { Button } from "@/components/ui/button";

const exams = [
  {
    id: 1,
    title: "Mid-Semester Examination",
    subject: "All Subjects",
    date: "Jan 5, 2025",
    duration: "2 hours",
    status: "available",
    instructions: "Read all questions carefully. All questions are mandatory.",
  },
  {
    id: 2,
    title: "Python Programming Quiz",
    subject: "Python",
    date: "Dec 28, 2024",
    duration: "30 min",
    status: "submitted",
    instructions: "Multiple choice questions. Choose the best answer.",
  },
  {
    id: 3,
    title: "Database Design Test",
    subject: "DBMS",
    date: "Dec 22, 2024",
    duration: "1 hour",
    status: "submitted",
    instructions: "ER diagrams and SQL queries.",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "available":
      return <span className="status-available">Available</span>;
    case "submitted":
      return <span className="status-submitted">Submitted</span>;
    default:
      return null;
  }
};

const Exams = () => {
  return (
    <StudentLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="feature-icon-orange">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
              Exams
            </h1>
          </div>
          <p className="text-muted-foreground">
            Online tests and assessments for your course.
          </p>
        </div>

        {/* Info Note */}
        <div className="bg-education-blue-light rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-education-blue flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            Exams are conducted via Google Forms. Click "Take Exam" to open the exam in a new tab.
          </p>
        </div>

        {/* Exams List */}
        <div className="space-y-4">
          {exams.map((exam) => (
            <div key={exam.id} className="card-education">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">
                      {exam.title}
                    </h3>
                    {getStatusBadge(exam.status)}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span className="px-2 py-0.5 bg-muted rounded-md">
                      {exam.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {exam.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {exam.duration}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {exam.instructions}
                  </p>
                </div>
                
                {exam.status === "available" && (
                  <Button className="gap-2 flex-shrink-0">
                    <ExternalLink className="w-4 h-4" />
                    Take Exam
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {exams.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No exams scheduled.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default Exams;
