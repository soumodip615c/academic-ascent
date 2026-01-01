import { Video, Play, Calendar, Clock, Youtube, ExternalLink } from "lucide-react";
import StudentLayout from "@/components/StudentLayout";
import { Button } from "@/components/ui/button";
import { useLectures } from "@/hooks/useLectures";
import { format } from "date-fns";

const Lectures = () => {
  const { data: lectures = [], isLoading } = useLectures();

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      videoId = new URL(url).searchParams.get("v") || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1]?.split("?")[0] || "";
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const handleWatch = (url: string) => {
    window.open(url, "_blank");
  };

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
            {lectures.map((lecture) => {
              const embedUrl = lecture.video_url ? getYouTubeEmbedUrl(lecture.video_url) : null;
              const isYoutube = lecture.video_url ? isYouTubeUrl(lecture.video_url) : false;

              return (
                <div key={lecture.id} className="card-education">
                  {/* Video Preview / Embed */}
                  {embedUrl ? (
                    <div className="rounded-lg aspect-video mb-4 overflow-hidden">
                      <iframe
                        src={embedUrl}
                        title={lecture.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : lecture.video_url ? (
                    <div className="rounded-lg aspect-video mb-4 overflow-hidden bg-muted">
                      <video
                        src={lecture.video_url}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    </div>
                  ) : (
                    <div className="bg-muted rounded-lg aspect-video flex items-center justify-center mb-4">
                      <div className="w-14 h-14 bg-card rounded-full flex items-center justify-center shadow-card">
                        <Play className="w-6 h-6 text-education-teal ml-1" />
                      </div>
                    </div>
                  )}
                  
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

                  {lecture.description && (
                    <p className="text-sm text-muted-foreground mb-4">{lecture.description}</p>
                  )}
                  
                  {lecture.video_url && (
                    <Button
                      className="w-full gap-2"
                      variant="outline"
                      onClick={() => handleWatch(lecture.video_url!)}
                    >
                      {isYoutube ? (
                        <>
                          <Youtube className="w-4 h-4" />
                          Open in YouTube
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          Open in New Tab
                        </>
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
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
