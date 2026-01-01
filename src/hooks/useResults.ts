import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Result = {
  id: string;
  student_id: string;
  exam_id: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number | null;
  grade: string | null;
  remarks: string | null;
  created_at: string;
  exams?: {
    title: string;
    course: string;
  };
  students?: {
    name: string;
    roll_no: string;
  };
};

export const useResults = (studentId?: string) => {
  return useQuery({
    queryKey: ["results", studentId],
    queryFn: async () => {
      let query = supabase
        .from("results")
        .select(`
          *,
          exams (title, course),
          students (name, roll_no)
        `)
        .order("created_at", { ascending: false });
      
      if (studentId) {
        query = query.eq("student_id", studentId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Result[];
    },
  });
};

export const useAddResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (result: Omit<Result, "id" | "created_at" | "exams" | "students">) => {
      const { data, error } = await supabase
        .from("results")
        .insert(result)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
    },
  });
};

export const useUpdateResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Result> & { id: string }) => {
      const { data, error } = await supabase
        .from("results")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
    },
  });
};

export const useDeleteResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("results").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
    },
  });
};
