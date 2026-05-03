import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
import { useSkills, useProjectSkills, useSetProjectSkills } from "@/hooks/useSkills";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function ProjectSkillsForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading: loadingProject } = useProject(id);
  const { data: skills = [], isLoading: loadingSkills } = useSkills();
  const { data: linkedSkillIds = [], isLoading: loadingLinks } = useProjectSkills(id);
  const setProjectSkills = useSetProjectSkills();

  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (linkedSkillIds.length > 0) {
      setSelected(new Set(linkedSkillIds));
    }
  }, [linkedSkillIds]);

  const toggle = (skillId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        next.add(skillId);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!id) return;
    await setProjectSkills.mutateAsync({ projectId: id, skillIds: Array.from(selected) });
    navigate("/admin");
  };

  const isLoading = loadingProject || loadingSkills || loadingLinks;

  if (isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando...</div>;
  }

  if (!project) {
    return <div className="text-muted-foreground">Projeto não encontrado.</div>;
  }

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin")}>
          ← Voltar para Projetos
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Habilidades do Projeto</CardTitle>
          <CardDescription>
            Projeto: <span className="font-medium text-foreground">{project.title}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhuma habilidade cadastrada.{" "}
              <a href="/admin/skills/new" className="text-primary underline">
                Criar habilidade
              </a>
            </p>
          ) : (
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-3">
                  <Checkbox
                    id={skill.id}
                    checked={selected.has(skill.id)}
                    onCheckedChange={() => toggle(skill.id)}
                  />
                  <Label htmlFor={skill.id} className="cursor-pointer">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    {skill.description && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        — {skill.description}
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t border-border">
            <Button
              onClick={handleSave}
              disabled={setProjectSkills.isPending}
            >
              {setProjectSkills.isPending ? "Salvando..." : "Salvar Vínculos"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin")}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
