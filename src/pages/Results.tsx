import { BarChart3, TrendingUp, Award } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";

const results = [
  {
    id: 1,
    exam: "Python Programming Quiz",
    subject: "Python",
    date: "Dec 28, 2024",
    marksObtained: 42,
    totalMarks: 50,
    percentage: 84,
  },
  {
    id: 2,
    exam: "Database Design Test",
    subject: "DBMS",
    date: "Dec 22, 2024",
    marksObtained: 38,
    totalMarks: 50,
    percentage: 76,
  },
  {
    id: 3,
    exam: "Web Development Assignment",
    subject: "Web Technologies",
    date: "Dec 15, 2024",
    marksObtained: 45,
    totalMarks: 50,
    percentage: 90,
  },
  {
    id: 4,
    exam: "Java Fundamentals Test",
    subject: "Java",
    date: "Dec 10, 2024",
    marksObtained: 40,
    totalMarks: 50,
    percentage: 80,
  },
];

const getGradeColor = (percentage: number) => {
  if (percentage >= 85) return "text-education-green";
  if (percentage >= 70) return "text-education-blue";
  if (percentage >= 50) return "text-education-orange";
  return "text-destructive";
};

const Results = () => {
  const averagePercentage = Math.round(
    results.reduce((acc, r) => acc + r.percentage, 0) / results.length
  );

  return (
    <StudentLayout>
      <div className="animate-fade-in">
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

        {/* Summary Cards */}
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
            <p className="text-2xl font-bold text-foreground">
              {results.reduce((acc, r) => acc + r.marksObtained, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Marks Earned</p>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Exam
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Subject
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
                      {result.exam}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {result.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {result.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-foreground">
                      {result.marksObtained}/{result.totalMarks}
                    </td>
                    <td className={`px-6 py-4 text-sm text-center font-semibold ${getGradeColor(result.percentage)}`}>
                      {result.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default Results;
