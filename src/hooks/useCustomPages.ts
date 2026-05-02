import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { CustomPage } from "@/types/database";

export const useCustomPages = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["customPages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao carregar páginas", { description: error.message });
        throw error;
      }

      return data as CustomPage[];
    },
  });

  const createPage = useMutation({
    mutationFn: async (newPage: Partial<CustomPage>) => {
      const { data, error } = await supabase
        .from("custom_pages")
        .insert([newPage])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
      toast.success("Página criada", { description: "A página foi criada com sucesso." });
    },
    onError: (error) => {
      toast.error("Erro ao criar página", { description: error.message });
    },
  });

  const updatePage = useMutation({
    mutationFn: async (page: Partial<CustomPage> & { id: string }) => {
      const { id, ...updateData } = page;
      const { data, error } = await supabase
        .from("custom_pages")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
      toast.success("Página atualizada", { description: "As alterações foram salvas com sucesso." });
    },
    onError: (error) => {
      toast.error("Erro ao atualizar", { description: error.message });
    },
  });

  const deletePage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("custom_pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customPages"] });
      toast.success("Página excluída", { description: "A página foi removida com sucesso." });
    },
    onError: (error) => {
      toast.error("Erro ao excluir", { description: error.message });
    },
  });

  return {
    data,
    isLoading,
    createPage,
    updatePage,
    deletePage,
  };
};
