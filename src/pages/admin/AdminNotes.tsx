import { BookOpen, Plus, Calendar, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const notes = [
  { id: 1, title: "Introduction to Programming", subject: "CS", course: "BCA", uploadedAt: "Dec 20, 2024" },
  { id: 2, title: "Data Structures - Arrays", subject: "DS", course: "BCA", uploadedAt: "Dec 18, 2024" },
  { id: 3, title: "Database Management Basics", subject: "DBMS", course: "AI & ML", uploadedAt: "Dec 15, 2024" },
];

const AdminNotes = () => {
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
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Upload Notes
        </Button>
      </div>

      {/* Notes List */}
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
                  {note.uploadedAt}
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
                <DropdownMenuItem className="text-destructive">Delete Note</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotes;
