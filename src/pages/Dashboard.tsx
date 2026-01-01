import { Link } from "react-router-dom";
import { BookOpen, Video, FileText, BarChart3, CreditCard, User } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";

const features = [
  {
    title: "Notes",
    description: "Study materials provided by your teacher",
    icon: BookOpen,
    url: "/dashboard/notes",
    iconClass: "feature-icon-blue",
  },
  {
    title: "Lectures",
    description: "Recorded classes and learning videos",
    icon: Video,
    url: "/dashboard/lectures",
    iconClass: "feature-icon-teal",
  },
  {
    title: "Exams",
    description: "Online tests and assessments",
    icon: FileText,
    url: "/dashboard/exams",
    iconClass: "feature-icon-orange",
  },
  {
    title: "Results",
    description: "Your performance and marks",
    icon: BarChart3,
    url: "/dashboard/results",
    iconClass: "feature-icon-green",
  },
  {
    title: "Fees",
    description: "Fee status and payment details",
    icon: CreditCard,
    url: "/dashboard/fees",
    iconClass: "feature-icon-purple",
  },
];

const Dashboard = () => {
  // Mock student data
  const student = {
    name: "Rahul Kumar",
    course: "BCA - Semester 3",
    rollNo: "SCW2024001",
  };

  return (
    <StudentLayout>
      <div className="animate-fade-in">
        {/* Welcome Banner */}
        <div className="bg-education-blue-light rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-card rounded-xl flex items-center justify-center shadow-card">
              <User className="w-7 h-7 text-education-blue" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground font-heading mb-1">
                Welcome, {student.name}
              </h1>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{student.course}</span>
                <span className="mx-2">•</span>
                Roll No: {student.rollNo}
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <h2 className="text-lg font-semibold text-foreground mb-4 font-heading">
          Quick Access
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.url}
              className="card-education group"
            >
              <div className={feature.iconClass}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2 font-heading group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default Dashboard;
