import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Exam = {
  id: string;
  title: string;
  course: string;
  instructions: string | null;
  google_form_url: string | null;
  status: string;
  exam_date: string | null;
  created_at: string;
  updated_at: string;
};

export const useExams = () => {
  return useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .order("exam_date", { ascending: false });
      if (error) throw error;
      return data as Exam[];
    },
  });
};

export const useAddExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exam: Omit<Exam, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("exams")
        .insert(exam)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Exam> & { id: string }) => {
      const { data, error } = await supabase
        .from("exams")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exams").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};
