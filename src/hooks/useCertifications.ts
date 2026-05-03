import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Certification } from "@/types/database";
import { toast } from "sonner";

export const useCertifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["certifications"],
    queryFn: async (): Promise<Certification[]> => {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (cert: Omit<Certification, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("certifications")
        .insert([cert])
        .select()
        .single();
      if (error) throw error;
      return data as Certification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      toast.success("Certificação criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar certificação: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (cert: Certification) => {
      const { id, created_at, ...rest } = cert;
      const { data, error } = await supabase
        .from("certifications")
        .update(rest)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Certification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      toast.success("Certificação atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar certificação: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("certifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      toast.success("Certificação excluída com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir certificação: ${error.message}`);
    },
  });

  return {
    ...query,
    createCertification: createMutation.mutateAsync,
    updateCertification: updateMutation.mutateAsync,
    deleteCertification: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useCertification = (id: string | undefined) => {
  return useQuery({
    queryKey: ["certifications", id],
    queryFn: async (): Promise<Certification | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw new Error(error.message);
      return data as Certification;
    },
    enabled: !!id,
  });
};
