import { Video, Plus, Calendar, Clock, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const lectures = [
  { id: 1, title: "Python Basics - Variables", subject: "Python", course: "BCA", duration: "45 min", uploadedAt: "Dec 22, 2024" },
  { id: 2, title: "Web Development Intro", subject: "Web Tech", course: "Web Dev", duration: "1 hr", uploadedAt: "Dec 20, 2024" },
  { id: 3, title: "SQL Queries", subject: "DBMS", course: "BCA", duration: "55 min", uploadedAt: "Dec 18, 2024" },
];

const AdminLectures = () => {
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
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Upload Lecture
        </Button>
      </div>

      {/* Lectures List */}
      <div className="space-y-3">
        {lectures.map((lecture) => (
          <div key={lecture.id} className="card-education flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground mb-1">{lecture.title}</h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="px-2 py-0.5 bg-muted rounded-md">{lecture.subject}</span>
                <span className="px-2 py-0.5 bg-education-teal-light text-education-teal rounded-md">{lecture.course}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {lecture.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {lecture.uploadedAt}
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
                <DropdownMenuItem className="text-destructive">Delete Lecture</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLectures;
