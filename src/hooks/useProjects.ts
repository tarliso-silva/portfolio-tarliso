import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Project, ProjectSchema } from "@/types/project";
import { toast } from "sonner";
import { mapDbToProject, mapProjectToDb } from "@/lib/mappers/project";

export const useProjects = () => {
  const queryClient = useQueryClient();

  const fetchProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: false });
    
    if (error) {
      console.error("Error fetching projects:", error);
      throw new Error(error.message);
    }
    
    if (!data) return [];
    
    return data.map((item) => mapDbToProject(item));
  };

  const query = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const createMutation = useMutation({
    mutationFn: async (newProject: Project) => {
      const snakeCaseData = mapProjectToDb(newProject);
      const { data, error } = await supabase
        .from("projects")
        .insert([snakeCaseData])
        .select()
        .single();
        
      if (error) throw error;
      return mapDbToProject(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar projeto: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedProject: Project) => {
      const snakeCaseData = mapProjectToDb(updatedProject);
      const { data, error } = await supabase
        .from("projects")
        .update(snakeCaseData)
        .eq("id", updatedProject.id)
        .select()
        .single();
        
      if (error) throw error;
      return mapDbToProject(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar projeto: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto excluído com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir projeto: ${error.message}`);
    },
  });

  return {
    ...query,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useProject = (id: string | undefined) => {
  const fetchProject = async (): Promise<Project | null> => {
    if (!id) return null;
    
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    
    return mapDbToProject(data);
  };

  return useQuery({
    queryKey: ["project", id],
    queryFn: fetchProject,
    enabled: !!id,
  });
};