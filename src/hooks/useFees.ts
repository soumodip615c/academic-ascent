import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Fee = {
  id: string;
  student_id: string;
  course: string;
  amount: number;
  due_date: string;
  status: string;
  payment_proof_url: string | null;
  payment_date: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  students?: {
    name: string;
    roll_no: string;
  };
};

export const useFees = (studentId?: string) => {
  return useQuery({
    queryKey: ["fees", studentId],
    queryFn: async () => {
      let query = supabase
        .from("fees")
        .select(`
          *,
          students (name, roll_no)
        `)
        .order("created_at", { ascending: false });
      
      if (studentId) {
        query = query.eq("student_id", studentId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Fee[];
    },
  });
};

export const useAddFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fee: Omit<Fee, "id" | "created_at" | "updated_at" | "students">) => {
      const { data, error } = await supabase
        .from("fees")
        .insert(fee)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
    },
  });
};

export const useUpdateFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Fee> & { id: string }) => {
      const { data, error } = await supabase
        .from("fees")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
    },
  });
};

export const useDeleteFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fees").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
    },
  });
};
