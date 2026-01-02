import { FileText, ExternalLink, Calendar, Clock, Info } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";
import { Button } from "@/components/ui/button";
import { useExams } from "@/hooks/useExams";
import { format } from "date-fns";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "available":
    case "active":
      return <span className="status-available">Available</span>;
    case "submitted":
    case "completed":
      return <span className="status-submitted">Completed</span>;
    case "upcoming":
      return <span className="status-pending">Upcoming</span>;
    default:
      return null;
  }
};

const Exams = () => {
  const { data: exams = [], isLoading } = useExams();

  return (
    <StudentLayout>
      <div className="animate-fade-in bg-theme-brown min-h-[calc(100vh-8rem)] -mx-4 -my-8 px-4 py-8">
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

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-education animate-pulse">
                <div className="h-5 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Exams List */}
        {!isLoading && exams.length > 0 && (
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
                        {exam.course}
                      </span>
                      {exam.exam_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(exam.exam_date), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                    
                    {exam.instructions && (
                      <p className="text-sm text-muted-foreground">
                        {exam.instructions}
                      </p>
                    )}
                  </div>
                  
                  {(exam.status === "available" || exam.status === "active") && exam.google_form_url && (
                    <Button
                      className="gap-2 flex-shrink-0"
                      onClick={() => window.open(exam.google_form_url!, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Take Exam
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && exams.length === 0 && (
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
