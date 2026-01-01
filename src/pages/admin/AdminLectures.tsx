import { useState } from "react";
import { Video, Plus, Calendar, Clock, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useLectures, useAddLecture, useDeleteLecture } from "@/hooks/useLectures";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminLectures = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    course: "",
    video_url: "",
    duration: "",
    description: "",
  });

  const { data: lectures = [], isLoading } = useLectures();
  const addLecture = useAddLecture();
  const deleteLecture = useDeleteLecture();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addLecture.mutateAsync(formData);
      toast.success("Lecture uploaded successfully!");
      setIsDialogOpen(false);
      setFormData({
        title: "",
        subject: "",
        course: "",
        video_url: "",
        duration: "",
        description: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload lecture");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this lecture?")) {
      try {
        await deleteLecture.mutateAsync(id);
        toast.success("Lecture deleted successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete lecture");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="feature-icon-teal">
            <Video className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-heading">
            Lectures
          </h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Upload Lecture
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Lecture</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Input
                    id="course"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL (YouTube/Drive)</Label>
                <Input
                  id="video_url"
                  placeholder="https://youtube.com/..."
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (e.g., "45 min")</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={addLecture.isPending}>
                {addLecture.isPending ? "Uploading..." : "Upload Lecture"}
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

      {/* Lectures List */}
      {!isLoading && lectures.length > 0 && (
        <div className="space-y-3">
          {lectures.map((lecture) => (
            <div key={lecture.id} className="card-education flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground mb-1">{lecture.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="px-2 py-0.5 bg-muted rounded-md">{lecture.subject}</span>
                  <span className="px-2 py-0.5 bg-education-teal-light text-education-teal rounded-md">{lecture.course}</span>
                  {lecture.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {lecture.duration}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(lecture.uploaded_at), "MMM d, yyyy")}
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
                  <DropdownMenuItem>Edit Lecture</DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(lecture.id)}
                  >
                    Delete Lecture
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && lectures.length === 0 && (
        <div className="card-education text-center py-12">
          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No lectures uploaded yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminLectures;
