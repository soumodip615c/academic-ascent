import { useState } from "react";
import { Users, Plus, Search, MoreVertical, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useStudents, useAddStudent, useDeleteStudent } from "@/hooks/useStudents";
import { toast } from "sonner";

const AdminStudents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    roll_no: "",
    semester: "",
    access_password: "123456",
  });

  const { data: students = [], isLoading } = useStudents();
  const addStudent = useAddStudent();
  const deleteStudent = useDeleteStudent();

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addStudent.mutateAsync({
        ...formData,
        is_active: true,
      });
      toast.success("Student added successfully!");
      setIsDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        course: "",
        roll_no: "",
        semester: "",
        access_password: "123456",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to add student");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this student?")) {
      try {
        await deleteStudent.mutateAsync(id);
        toast.success("Student removed successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to remove student");
      }
    }
  };

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roll_no">Roll Number</Label>
                <Input
                  id="roll_no"
                  value={formData.roll_no}
                  onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="access_password">Access Password</Label>
                <Input
                  id="access_password"
                  value={formData.access_password}
                  onChange={(e) => setFormData({ ...formData, access_password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={addStudent.isPending}>
                {addStudent.isPending ? "Adding..." : "Add Student"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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

      {/* Loading State */}
      {isLoading && (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      )}

      {/* Students List */}
      {!isLoading && filteredStudents.length > 0 && (
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
                      {student.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          {student.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={student.is_active ? "status-available" : "status-pending"}>
                        {student.is_active ? "Active" : "Inactive"}
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
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(student.id)}
                          >
                            Remove Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredStudents.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No students found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
