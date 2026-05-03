import { Link } from "react-router-dom";
import { useSkills } from "@/hooks/useSkills";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SkillsDashboard() {
  const { data: skills = [], isLoading, deleteSkill } = useSkills();

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar esta habilidade?")) {
      await deleteSkill(id);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando dados...</div>;
  }

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Habilidades</h1>
          <p className="text-muted-foreground mt-1">Gerencie as habilidades exibidas no portfólio.</p>
        </div>
        <Link to="/admin/skills/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Habilidade
          </Button>
        </Link>
      </div>

      <div className="bg-secondary/30 rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">Descrição</th>
                <th className="px-6 py-4 font-medium">Ícone</th>
                <th className="px-6 py-4 font-medium">Ordem</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {skills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma habilidade cadastrada.
                  </td>
                </tr>
              ) : (
                skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{skill.name}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                      {skill.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {skill.icon || "-"}
                    </td>
                    <td className="px-6 py-4 text-foreground font-mono">
                      {skill.display_order}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/skills/${skill.id}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(skill.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
