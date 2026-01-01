import { Video, Play, Calendar, Clock } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";
import { Button } from "@/components/ui/button";
import { useLectures } from "@/hooks/useLectures";
import { format } from "date-fns";

const Lectures = () => {
  const { data: lectures = [], isLoading } = useLectures();

  return (
    <StudentLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="feature-icon-teal">
              <Video className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
              Lectures
            </h1>
          </div>
          <p className="text-muted-foreground">
            Recorded classes and learning videos for your course.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-education animate-pulse">
                <div className="bg-muted rounded-lg aspect-video mb-4"></div>
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Lectures Grid */}
        {!isLoading && lectures.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lectures.map((lecture) => (
              <div key={lecture.id} className="card-education">
                {/* Thumbnail Placeholder */}
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center mb-4">
                  <div className="w-14 h-14 bg-card rounded-full flex items-center justify-center shadow-card">
                    <Play className="w-6 h-6 text-education-teal ml-1" />
                  </div>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2">
                  {lecture.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  <span className="px-2 py-0.5 bg-muted rounded-md">
                    {lecture.subject}
                  </span>
                  <span className="px-2 py-0.5 bg-education-teal-light text-education-teal rounded-md">
                    {lecture.course}
                  </span>
                  {lecture.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {lecture.duration}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(lecture.uploaded_at), "MMM d, yyyy")}
                  </span>
                </div>
                
                <Button
                  className="w-full gap-2"
                  onClick={() => lecture.video_url && window.open(lecture.video_url, "_blank")}
                  disabled={!lecture.video_url}
                >
                  <Play className="w-4 h-4" />
                  Watch Lecture
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && lectures.length === 0 && (
          <div className="text-center py-16">
            <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No lectures available yet.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default Lectures;
