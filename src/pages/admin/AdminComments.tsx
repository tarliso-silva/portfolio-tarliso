import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trash2, MessageSquare, Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";

interface AdminComment {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  body: string;
  created_at: string;
  reply_to_name?: string | null;
}

export default function AdminComments() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("all");

  const { data: projects = [] } = useProjects();

  const { data: comments = [], isLoading } = useQuery<AdminComment[]>({
    queryKey: ["admin_comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_comments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("project_comments")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_comments"] });
      toast.success("Comentário removido.");
    },
    onError: () => toast.error("Erro ao remover comentário."),
  });

  // Build a map: project_id → title / slug for linking
  const projectMap = Object.fromEntries(
    projects.map((p) => [p.id, { title: p.title, slug: p.slug || p.id }])
  );

  const filtered = comments.filter((c) => {
    const matchProject = filterProject === "all" || c.project_id === filterProject;
    const matchSearch =
      !search ||
      c.user_name.toLowerCase().includes(search.toLowerCase()) ||
      c.body.toLowerCase().includes(search.toLowerCase());
    return matchProject && matchSearch;
  });

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Comentários</h1>
          <span className="text-sm text-muted-foreground">({comments.length} total)</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuário ou texto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">Todos os projetos</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-secondary/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          Nenhum comentário encontrado.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => {
            const proj = projectMap[c.project_id];
            return (
              <div
                key={c.id}
                className="glass-panel p-4 rounded-xl flex items-start gap-4 group"
              >
                {/* Avatar */}
                {c.user_avatar ? (
                  <img
                    src={c.user_avatar}
                    alt={c.user_name}
                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-border"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-primary text-xs font-bold uppercase">
                    {c.user_name.charAt(0)}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-medium text-foreground">{c.user_name}</span>
                    {c.reply_to_name && (
                      <span className="text-[11px] text-muted-foreground">
                        ↳ @{c.reply_to_name}
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {proj && (
                      <Link
                        to={`/projects/${proj.slug}`}
                        target="_blank"
                        className="flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary transition-colors ml-auto"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {proj.title}
                      </Link>
                    )}
                  </div>
                  <p className="text-[14px] text-foreground/65 line-clamp-2">{c.body}</p>
                </div>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={() => deleteComment.mutate(c.id)}
                  disabled={deleteComment.isPending}
                  aria-label="Remover comentário"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
