import { useMemo, useState, useRef } from "react";
import {
  BookOpen,
  Plus,
  Calendar,
  MoreVertical,
  Upload,
  FileText,
  Link as LinkIcon,
  Download,
  Eye,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotes, useAddNote, useDeleteNote } from "@/hooks/useNotes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminNotes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"file" | "url">("file");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("PDF Preview");

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

  const parsePublicStorageUrl = useMemo(() => {
    return (url: string): { bucket: string; path: string } | null => {
      try {
        const u = new URL(url);
        const marker = "/storage/v1/object/public/";
        const idx = u.pathname.indexOf(marker);
        if (idx === -1) return null;
        const rest = u.pathname.substring(idx + marker.length);
        const [bucket, ...pathParts] = rest.split("/");
        const path = pathParts.join("/");
        if (!bucket || !path) return null;
        return { bucket, path };
      } catch {
        return null;
      }
    };
  }, []);

  const openPreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setIsPreviewOpen(true);
  };

  const handleDownload = async (url: string, title: string) => {
    try {
      const storageRef = parsePublicStorageUrl(url);
      const blob = storageRef
        ? await (async () => {
            const { data, error } = await supabase.storage
              .from(storageRef.bucket)
              .download(storageRef.path);
            if (error) throw error;
            return data;
          })()
        : await (async () => {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Download failed");
            return await response.blob();
          })();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch {
      openPreview(url, title);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size must be less than 20MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("notes")
      .upload(fileName, file, { contentType: "application/pdf" });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("notes").getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let fileUrl = formData.file_url;

      if (uploadType === "file" && selectedFile) {
        fileUrl = await uploadFile(selectedFile);
      }

      if (!fileUrl) {
        toast.error("Please upload a PDF file or enter a URL");
        setIsUploading(false);
        return;
      }

      await addNote.mutateAsync({ ...formData, file_url: fileUrl });
      toast.success("Note uploaded successfully!");
      setIsDialogOpen(false);
      setFormData({
        title: "",
        subject: "",
        course: "",
        file_url: "",
        description: "",
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      toast.error(error.message || "Failed to upload note");
    } finally {
      setIsUploading(false);
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
          <h2 className="text-2xl font-bold text-foreground font-heading">Notes</h2>
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

              {/* Upload Type Tabs */}
              <Tabs value={uploadType} onValueChange={(v) => setUploadType(v as "file" | "url")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </TabsTrigger>
                  <TabsTrigger value="url" className="gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Enter URL
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="file" className="space-y-2">
                  <Label>PDF File</Label>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">{selectedFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload PDF (max 20MB)</p>
                      </>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="url" className="space-y-2">
                  <Label htmlFor="file_url">File URL</Label>
                  <Input
                    id="file_url"
                    placeholder="https://drive.google.com/..."
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  />
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isUploading || addNote.isPending}>
                {isUploading ? "Uploading..." : "Upload Notes"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Preview Dialog (works even when new tabs are blocked) */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewTitle}</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <iframe
              src={previewUrl}
              title={previewTitle}
              className="w-full h-[70vh] rounded-md border border-border"
            />
          )}
        </DialogContent>
      </Dialog>

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

                  {note.file_url && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreview(note.file_url!, note.title);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(note.file_url!, note.title);
                        }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </Button>
                    </div>
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
