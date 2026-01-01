import { useState } from "react";
import { Users, Plus, Search, MoreVertical, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const students = [
  { id: 1, name: "Rahul Kumar", email: "rahul@email.com", phone: "9876543210", course: "BCA", status: "active" },
  { id: 2, name: "Priya Singh", email: "priya@email.com", phone: "9876543211", course: "BCA", status: "active" },
  { id: 3, name: "Amit Sharma", email: "amit@email.com", phone: "9876543212", course: "AI & ML", status: "active" },
  { id: 4, name: "Sneha Das", email: "sneha@email.com", phone: "9876543213", course: "Web Dev", status: "inactive" },
];

const AdminStudents = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="feature-icon-blue">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground font-heading">
            Students
          </h2>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground hidden md:table-cell">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Course</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr 
                  key={student.id}
                  className={index !== filteredStudents.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground md:hidden">{student.email}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" />
                      {student.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" />
                      {student.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {student.course}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={student.status === "active" ? "status-available" : "status-pending"}>
                      {student.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Student</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remove Student</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
