import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSkill, useSkills } from "@/hooks/useSkills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SkillForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: skill, isLoading } = useSkill(id);
  const { createSkill, updateSkill, isCreating, isUpdating } = useSkills();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    color: "text-primary",
    display_order: 0,
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || "",
        description: skill.description || "",
        icon: skill.icon || "",
        color: skill.color || "text-primary",
        display_order: skill.display_order ?? 0,
      });
    }
  }, [skill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && skill) {
        await updateSkill({ ...skill, ...formData });
      } else {
        await createSkill(formData);
      }
      navigate("/admin/skills");
    } catch (error) {
      console.error("Erro ao salvar habilidade:", error);
    }
  };

  if (isEditing && isLoading) {
    return <div className="text-muted-foreground animate-pulse">Carregando...</div>;
  }

  const isSaving = isCreating || isUpdating;

  return (
    <div className="max-w-2xl animate-fade-up">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/skills")}>
          ← Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Habilidade" : "Nova Habilidade"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Power BI & Visualização"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Desenvolvimento de dashboards interativos com DAX e Power Query."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">
                  Ícone{" "}
                  <span className="text-xs text-muted-foreground">(nome Lucide ou Si)</span>
                </Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Ex: BarChart3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">
                  Cor{" "}
                  <span className="text-xs text-muted-foreground">(classe Tailwind)</span>
                </Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Ex: text-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Ordem de Exibição</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Habilidade"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/skills")}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
