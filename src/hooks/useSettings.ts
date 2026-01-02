import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*");
      if (error) throw error;
      return data;
    },
  });
};

export const useUniversalPassword = () => {
  return useQuery({
    queryKey: ["universal_access_password"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "universal_access_password")
        .maybeSingle();
      if (error) throw error;
      return data?.value || "123456";
    },
  });
};

export const useAdminPassword = () => {
  return useQuery({
    queryKey: ["admin_access_password"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "admin_access_password")
        .maybeSingle();
      if (error) throw error;
      return data?.value || "123456";
    },
  });
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      // Try update first, if no rows affected, insert
      const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .eq("key", key)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from("settings")
          .update({ value })
          .eq("key", key)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("settings")
          .insert({ key, value })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["universal_access_password"] });
      queryClient.invalidateQueries({ queryKey: ["admin_access_password"] });
    },
  });
};
