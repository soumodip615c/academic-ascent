import { BarChart3, TrendingUp, Award } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";
import { useResults } from "@/hooks/useResults";
import { format } from "date-fns";

const getGradeColor = (percentage: number | null) => {
  if (!percentage) return "text-muted-foreground";
  if (percentage >= 85) return "text-education-green";
  if (percentage >= 70) return "text-education-blue";
  if (percentage >= 50) return "text-education-orange";
  return "text-destructive";
};

const Results = () => {
  const { data: results = [], isLoading } = useResults();

  const averagePercentage = results.length > 0
    ? Math.round(
        results.reduce((acc, r) => acc + (r.percentage || 0), 0) / results.length
      )
    : 0;

  const totalMarksEarned = results.reduce((acc, r) => acc + r.marks_obtained, 0);

  return (
    <StudentLayout>
      <div className="animate-fade-in bg-theme-brown min-h-[calc(100vh-8rem)] -mx-4 -my-8 px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="feature-icon-green">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
              Results
            </h1>
          </div>
          <p className="text-muted-foreground">
            Your academic performance is shown below.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-education animate-pulse">
                  <div className="h-8 bg-muted rounded w-8 mx-auto mb-2"></div>
                  <div className="h-6 bg-muted rounded w-12 mx-auto mb-1"></div>
                  <div className="h-4 bg-muted rounded w-20 mx-auto"></div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Summary Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="card-education text-center">
              <Award className="w-8 h-8 text-education-blue mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{results.length}</p>
              <p className="text-sm text-muted-foreground">Tests Completed</p>
            </div>
            <div className="card-education text-center">
              <TrendingUp className="w-8 h-8 text-education-green mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{averagePercentage}%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
            <div className="card-education text-center">
              <BarChart3 className="w-8 h-8 text-education-teal mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalMarksEarned}</p>
              <p className="text-sm text-muted-foreground">Total Marks Earned</p>
            </div>
          </div>
        )}

        {/* Results Table */}
        {!isLoading && results.length > 0 && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Exam
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Course
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">
                      Marks
                    </th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr 
                      key={result.id}
                      className={index !== results.length - 1 ? "border-b border-border" : ""}
                    >
                      <td className="px-6 py-4 text-sm text-foreground font-medium">
                        {result.exams?.title || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {result.exams?.course || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {format(new Date(result.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-foreground">
                        {result.marks_obtained}/{result.total_marks}
                      </td>
                      <td className={`px-6 py-4 text-sm text-center font-semibold ${getGradeColor(result.percentage)}`}>
                        {result.percentage ? `${result.percentage}%` : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && results.length === 0 && (
          <div className="text-center py-16">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No results available yet.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default Results;
