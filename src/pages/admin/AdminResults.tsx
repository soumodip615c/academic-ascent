import { useState } from "react";
import { BarChart3, Plus, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useResults, useAddResult, useDeleteResult } from "@/hooks/useResults";
import { useStudents } from "@/hooks/useStudents";
import { useExams } from "@/hooks/useExams";
import { toast } from "sonner";
import { format } from "date-fns";

const getGradeColor = (percentage: number | null) => {
  if (!percentage) return "text-muted-foreground";
  if (percentage >= 85) return "text-education-green";
  if (percentage >= 70) return "text-education-blue";
  if (percentage >= 50) return "text-education-orange";
  return "text-destructive";
};

const AdminResults = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    exam_id: "",
    marks_obtained: "",
    total_marks: "",
    grade: "",
    remarks: "",
  });

  const { data: results = [], isLoading } = useResults();
  const { data: students = [] } = useStudents();
  const { data: exams = [] } = useExams();
  const addResult = useAddResult();
  const deleteResult = useDeleteResult();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const marksObtained = parseInt(formData.marks_obtained);
    const totalMarks = parseInt(formData.total_marks);
    const percentage = totalMarks > 0 ? Math.round((marksObtained / totalMarks) * 100) : 0;

    try {
      await addResult.mutateAsync({
        student_id: formData.student_id,
        exam_id: formData.exam_id,
        marks_obtained: marksObtained,
        total_marks: totalMarks,
        percentage,
        grade: formData.grade || null,
        remarks: formData.remarks || null,
      });
      toast.success("Result added successfully!");
      setIsDialogOpen(false);
      setFormData({
        student_id: "",
        exam_id: "",
        marks_obtained: "",
        total_marks: "",
        grade: "",
        remarks: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to add result");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this result?")) {
      try {
        await deleteResult.mutateAsync(id);
        toast.success("Result deleted successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete result");
      }
    }
  };

  return (
    <div className="animate-fade-in bg-theme-brown -m-4 md:-m-6 p-4 md:p-6 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="feature-icon-green">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-heading">
            Results
          </h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Result
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Student Result</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student_id">Student</Label>
                <Select
                  value={formData.student_id}
                  onValueChange={(value) => setFormData({ ...formData, student_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.roll_no})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam_id">Exam</Label>
                <Select
                  value={formData.exam_id}
                  onValueChange={(value) => setFormData({ ...formData, exam_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.title} ({exam.course})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marks_obtained">Marks Obtained</Label>
                  <Input
                    id="marks_obtained"
                    type="number"
                    min="0"
                    value={formData.marks_obtained}
                    onChange={(e) => setFormData({ ...formData, marks_obtained: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_marks">Total Marks</Label>
                  <Input
                    id="total_marks"
                    type="number"
                    min="1"
                    value={formData.total_marks}
                    onChange={(e) => setFormData({ ...formData, total_marks: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade (Optional)</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => setFormData({ ...formData, grade: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C+">C+</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  rows={2}
                  placeholder="Any additional comments..."
                />
              </div>
              <Button type="submit" className="w-full" disabled={addResult.isPending}>
                {addResult.isPending ? "Adding..." : "Add Result"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-education animate-pulse">
              <div className="h-5 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Results Table */}
      {!isLoading && results.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Student</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Exam</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-foreground">Marks</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-foreground">%</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-foreground">Grade</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">Date</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr 
                    key={result.id}
                    className={index !== results.length - 1 ? "border-b border-border" : ""}
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-foreground">{result.students?.name || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{result.students?.roll_no}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-foreground">{result.exams?.title || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{result.exams?.course}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-foreground">
                      {result.marks_obtained}/{result.total_marks}
                    </td>
                    <td className={`px-4 py-3 text-sm text-center font-semibold ${getGradeColor(result.percentage)}`}>
                      {result.percentage ? `${result.percentage}%` : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {result.grade ? (
                        <span className="px-2 py-0.5 bg-education-blue-light text-education-blue rounded-md text-xs font-medium">
                          {result.grade}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {format(new Date(result.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(result.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Result
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
        <div className="card-education text-center py-12">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No results added yet.</p>
          <p className="text-sm text-muted-foreground">
            Add student results after they complete Google Forms exams.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminResults;
