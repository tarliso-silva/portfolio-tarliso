import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skill } from "@/types/database";
import { toast } from "sonner";

export const useSkills = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["skills"],
    queryFn: async (): Promise<Skill[]> => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newSkill: Omit<Skill, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("skills")
        .insert([newSkill])
        .select()
        .single();
      if (error) throw error;
      return data as Skill;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Habilidade criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar habilidade: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (skill: Skill) => {
      const { id, created_at, ...rest } = skill;
      const { data, error } = await supabase
        .from("skills")
        .update(rest)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Skill;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Habilidade atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar habilidade: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Habilidade excluída com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir habilidade: ${error.message}`);
    },
  });

  return {
    ...query,
    createSkill: createMutation.mutateAsync,
    updateSkill: updateMutation.mutateAsync,
    deleteSkill: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useSkill = (id: string | undefined) => {
  return useQuery({
    queryKey: ["skills", id],
    queryFn: async (): Promise<Skill | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw new Error(error.message);
      return data as Skill;
    },
    enabled: !!id,
  });
};

/** Returns skill IDs linked to a given project */
export const useProjectSkills = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ["project_skills", projectId],
    queryFn: async (): Promise<string[]> => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("project_skills")
        .select("skill_id")
        .eq("project_id", projectId);
      if (error) throw new Error(error.message);
      return (data || []).map((r: { skill_id: string }) => r.skill_id);
    },
    enabled: !!projectId,
  });
};

/** Replaces all skill links for a project in a single transaction-like call */
export const useSetProjectSkills = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      skillIds,
    }: {
      projectId: string;
      skillIds: string[];
    }) => {
      // Delete existing links then insert new ones
      const { error: delError } = await supabase
        .from("project_skills")
        .delete()
        .eq("project_id", projectId);
      if (delError) throw delError;

      if (skillIds.length === 0) return;

      const rows = skillIds.map((skill_id) => ({ project_id: projectId, skill_id }));
      const { error: insError } = await supabase.from("project_skills").insert(rows);
      if (insError) throw insError;
    },
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project_skills", projectId] });
      toast.success("Habilidades do projeto salvas!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao salvar habilidades: ${error.message}`);
    },
  });
};
