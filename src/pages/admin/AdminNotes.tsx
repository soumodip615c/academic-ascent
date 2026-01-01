import { useState } from "react";
import { BookOpen, Plus, Calendar, MoreVertical } from "lucide-react";
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
import { useNotes, useAddNote, useDeleteNote } from "@/hooks/useNotes";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminNotes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    course: "",
    file_url: "",
    description: "",
  });

  const { data: notes = [], isLoading } = useNotes();
  const addNote = useAddNote();
  const deleteNote = useDeleteNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addNote.mutateAsync(formData);
      toast.success("Note uploaded successfully!");
      setIsDialogOpen(false);
      setFormData({
        title: "",
        subject: "",
        course: "",
        file_url: "",
        description: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload note");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote.mutateAsync(id);
        toast.success("Note deleted successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete note");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="feature-icon-blue">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-heading">
            Notes
          </h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Upload Notes
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Notes</DialogTitle>
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
                <Label htmlFor="file_url">File URL</Label>
                <Input
                  id="file_url"
                  placeholder="https://drive.google.com/..."
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
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
              <Button type="submit" className="w-full" disabled={addNote.isPending}>
                {addNote.isPending ? "Uploading..." : "Upload Notes"}
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

      {/* Notes List */}
      {!isLoading && notes.length > 0 && (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="card-education flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground mb-1">{note.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="px-2 py-0.5 bg-muted rounded-md">{note.subject}</span>
                  <span className="px-2 py-0.5 bg-education-blue-light text-education-blue rounded-md">{note.course}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(note.uploaded_at), "MMM d, yyyy")}
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
                  <DropdownMenuItem>Edit Note</DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(note.id)}
                  >
                    Delete Note
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && notes.length === 0 && (
        <div className="card-education text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No notes uploaded yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminNotes;
