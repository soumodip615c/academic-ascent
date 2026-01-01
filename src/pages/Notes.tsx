import { BookOpen, Download, Eye, Calendar, FileText } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/useNotes";
import { format } from "date-fns";

const Notes = () => {
  const { data: notes = [], isLoading } = useNotes();

  const handleDownload = async (url: string, title: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      // Fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  const handleView = (url: string) => {
    // For PDFs, we can use Google Docs viewer for better compatibility
    if (url.includes(".pdf")) {
      window.open(url, "_blank");
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <StudentLayout>
      <div className="animate-fade-in">
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
                    <h3 className="font-semibold text-foreground">
                      {note.title}
                    </h3>
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
                    <p className="text-sm text-muted-foreground mt-2">{note.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {note.file_url && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleView(note.file_url!)}
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
