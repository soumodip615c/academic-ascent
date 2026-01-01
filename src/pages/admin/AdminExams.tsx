import { useState } from "react";
import { FileText, Plus, Calendar, Link as LinkIcon, MoreVertical } from "lucide-react";
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
import { useExams, useAddExam, useDeleteExam } from "@/hooks/useExams";
import { toast } from "sonner";
import { format } from "date-fns";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "upcoming":
      return <span className="status-pending">Upcoming</span>;
    case "active":
    case "available":
      return <span className="status-available">Active</span>;
    case "completed":
      return <span className="status-submitted">Completed</span>;
    default:
      return null;
  }
};

const AdminExams = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    instructions: "",
    google_form_url: "",
    status: "upcoming",
    exam_date: "",
  });

  const { data: exams = [], isLoading } = useExams();
  const addExam = useAddExam();
  const deleteExam = useDeleteExam();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExam.mutateAsync({
        ...formData,
        exam_date: formData.exam_date ? new Date(formData.exam_date).toISOString() : null,
      });
      toast.success("Exam created successfully!");
      setIsDialogOpen(false);
      setFormData({
        title: "",
        course: "",
        instructions: "",
        google_form_url: "",
        status: "upcoming",
        exam_date: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create exam");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      try {
        await deleteExam.mutateAsync(id);
        toast.success("Exam deleted successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete exam");
      }
    }
  };

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Exam</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Exam Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Input
                    id="course"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam_date">Exam Date</Label>
                <Input
                  id="exam_date"
                  type="date"
                  value={formData.exam_date}
                  onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google_form_url">Google Form URL</Label>
                <Input
                  id="google_form_url"
                  placeholder="https://forms.google.com/..."
                  value={formData.google_form_url}
                  onChange={(e) => setFormData({ ...formData, google_form_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={addExam.isPending}>
                {addExam.isPending ? "Creating..." : "Create Exam"}
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

      {/* Exams List */}
      {!isLoading && exams.length > 0 && (
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
                  {exam.exam_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(exam.exam_date), "MMM d, yyyy")}
                    </span>
                  )}
                  {exam.google_form_url && (
                    <span className="flex items-center gap-1">
                      <LinkIcon className="w-3.5 h-3.5" />
                      Google Form
                    </span>
                  )}
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
                  {exam.google_form_url && (
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(exam.google_form_url!)}>
                      Copy Link
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(exam.id)}
                  >
                    Delete Exam
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && exams.length === 0 && (
        <div className="card-education text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No exams created yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminExams;
