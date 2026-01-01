import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Lecture = {
  id: string;
  title: string;
  subject: string;
  course: string;
  video_url: string | null;
  duration: string | null;
  description: string | null;
  uploaded_at: string;
  updated_at: string;
};

export const useLectures = () => {
  return useQuery({
    queryKey: ["lectures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data as Lecture[];
    },
  });
};

export const useAddLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lecture: Omit<Lecture, "id" | "uploaded_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("lectures")
        .insert(lecture)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
    },
  });
};

export const useUpdateLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Lecture> & { id: string }) => {
      const { data, error } = await supabase
        .from("lectures")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
    },
  });
};

export const useDeleteLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lectures").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
    },
  });
};
