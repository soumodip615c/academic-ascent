import { useMemo, useState } from "react";
import { BookOpen, Download, Eye, Calendar, FileText } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNotes } from "@/hooks/useNotes";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Notes = () => {
  const { data: notes = [], isLoading } = useNotes();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("PDF Preview");

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
      // If downloads/popups are blocked in embedded previews, at least show the preview.
      openPreview(url, title);
    }
  };

  return (
    <StudentLayout>
      <div className="animate-fade-in bg-theme-brown min-h-[calc(100vh-8rem)] -mx-4 -my-8 px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="feature-icon-blue">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
              Notes
            </h1>
          </div>
          <p className="text-muted-foreground">
            Below are the study materials for your course.
          </p>
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
              <div
                key={note.id}
                className="card-education flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground">{note.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="px-2 py-0.5 bg-muted rounded-md">
                      {note.subject}
                    </span>
                    <span className="px-2 py-0.5 bg-education-blue-light text-education-blue rounded-md">
                      {note.course}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(note.uploaded_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  {note.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {note.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {note.file_url && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => openPreview(note.file_url!, note.title)}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => handleDownload(note.file_url!, note.title)}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && notes.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notes available yet.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default Notes;
