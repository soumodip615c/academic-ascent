import { BookOpen, Download, Eye, Calendar } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";
import { Button } from "@/components/ui/button";

const notes = [
  {
    id: 1,
    title: "Introduction to Programming",
    subject: "Computer Science",
    uploadedAt: "Dec 20, 2024",
    type: "PDF",
  },
  {
    id: 2,
    title: "Data Structures - Arrays & Linked Lists",
    subject: "Data Structures",
    uploadedAt: "Dec 18, 2024",
    type: "PDF",
  },
  {
    id: 3,
    title: "Database Management Basics",
    subject: "DBMS",
    uploadedAt: "Dec 15, 2024",
    type: "PDF",
  },
  {
    id: 4,
    title: "Object Oriented Programming Concepts",
    subject: "OOP",
    uploadedAt: "Dec 10, 2024",
    type: "PDF",
  },
];

const Notes = () => {
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

        {/* Notes List */}
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="card-education flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {note.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="px-2 py-0.5 bg-muted rounded-md">
                    {note.subject}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {note.uploadedAt}
                  </span>
                  <span className="px-2 py-0.5 bg-education-blue-light text-education-blue rounded-md text-xs font-medium">
                    {note.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>

        {notes.length === 0 && (
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
