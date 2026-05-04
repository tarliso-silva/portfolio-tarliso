import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSkill, useSkills } from "@/hooks/useSkills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Zap, Code, Database, Cpu, Brain, Laptop, Server, Globe, Shield,
  Smartphone, Search, Terminal, Code2, Table2, BarChart3, Cloud,
  LineChart, PieChart, FileSpreadsheet, FileText, HardDrive,
  Workflow, Layers, GitBranch, Lock, Eye, Boxes, Binary,
  FlaskConical, Settings2, Network, Bot, Braces,
} from "lucide-react";
import {
  SiPython, SiDocker, SiJavascript, SiTypescript, SiReact, SiHtml5,
  SiCss, SiTailwindcss, SiGit, SiGithub, SiFigma, SiSupabase,
  SiPostgresql, SiMongodb, SiMysql, SiNodedotjs, SiApacheairflow,
  SiApachespark, SiDatabricks, SiPandas, SiGooglecloud, SiN8N,
  SiDbt, SiSnowflake, SiApachekafka, SiElasticsearch, SiRedis, SiSqlite,
  SiJira, SiConfluence, SiGrafana, SiLinux, SiUbuntu, SiAnsible,
  SiTerraform, SiKubernetes, SiApache, SiScipy, SiNumpy,
  SiScikitlearn, SiTensorflow, SiPytorch, SiPlotly, SiLooker,
} from "react-icons/si";

/** Catálogo completo de ícones disponíveis para habilidades */
const ICON_CATALOG: { key: string; label: string; Icon: React.ElementType; group: string }[] = [
  // Lucide — genéricos
  { key: "Zap",           label: "Zap",           Icon: Zap,           group: "Genérico" },
  { key: "Brain",         label: "Brain",          Icon: Brain,         group: "Genérico" },
  { key: "Cpu",           label: "Cpu",            Icon: Cpu,           group: "Genérico" },
  { key: "Code",          label: "Code",           Icon: Code,          group: "Genérico" },
  { key: "Code2",         label: "Code2",          Icon: Code2,         group: "Genérico" },
  { key: "Braces",        label: "Braces",         Icon: Braces,        group: "Genérico" },
  { key: "Terminal",      label: "Terminal",       Icon: Terminal,      group: "Genérico" },
  { key: "Database",      label: "Database",       Icon: Database,      group: "Genérico" },
  { key: "Server",        label: "Server",         Icon: Server,        group: "Genérico" },
  { key: "Cloud",         label: "Cloud",          Icon: Cloud,         group: "Genérico" },
  { key: "Globe",         label: "Globe",          Icon: Globe,         group: "Genérico" },
  { key: "Laptop",        label: "Laptop",         Icon: Laptop,        group: "Genérico" },
  { key: "BarChart3",     label: "BarChart3",      Icon: BarChart3,     group: "Genérico" },
  { key: "LineChart",     label: "LineChart",      Icon: LineChart,     group: "Genérico" },
  { key: "PieChart",      label: "PieChart",       Icon: PieChart,      group: "Genérico" },
  { key: "Table2",        label: "Table2",         Icon: Table2,        group: "Genérico" },
  { key: "FileSpreadsheet", label: "FileSpreadsheet", Icon: FileSpreadsheet, group: "Genérico" },
  { key: "Workflow",      label: "Workflow",       Icon: Workflow,      group: "Genérico" },
  { key: "Layers",        label: "Layers",         Icon: Layers,        group: "Genérico" },
  { key: "GitBranch",     label: "GitBranch",      Icon: GitBranch,     group: "Genérico" },
  { key: "Lock",          label: "Lock",           Icon: Lock,          group: "Genérico" },
  { key: "Eye",           label: "Eye",            Icon: Eye,           group: "Genérico" },
  { key: "Boxes",         label: "Boxes",          Icon: Boxes,         group: "Genérico" },
  { key: "Binary",        label: "Binary",         Icon: Binary,        group: "Genérico" },
  { key: "FlaskConical",  label: "FlaskConical",   Icon: FlaskConical,  group: "Genérico" },
  { key: "Settings2",     label: "Settings2",      Icon: Settings2,     group: "Genérico" },
  { key: "Network",       label: "Network",        Icon: Network,       group: "Genérico" },
  { key: "Bot",           label: "Bot",            Icon: Bot,           group: "Genérico" },
  { key: "Shield",        label: "Shield",         Icon: Shield,        group: "Genérico" },
  { key: "Smartphone",    label: "Smartphone",     Icon: Smartphone,    group: "Genérico" },
  { key: "Search",        label: "Search",         Icon: Search,        group: "Genérico" },
  // BI & Visualização
  { key: "PowerBI",       label: "Power BI",       Icon: BarChart3,     group: "BI" },
  { key: "Tableau",       label: "Tableau",        Icon: PieChart,      group: "BI" },
  { key: "Looker",        label: "Looker",         Icon: SiLooker,      group: "BI" },
  { key: "Grafana",       label: "Grafana",        Icon: SiGrafana,     group: "BI" },
  { key: "Plotly",        label: "Plotly",         Icon: SiPlotly,      group: "BI" },
  // Python
  { key: "Python",        label: "Python",         Icon: SiPython,      group: "Python" },
  { key: "Pandas",        label: "Pandas",         Icon: SiPandas,      group: "Python" },
  { key: "NumPy",         label: "NumPy",          Icon: SiNumpy,       group: "Python" },
  { key: "SciPy",         label: "SciPy",          Icon: SiScipy,       group: "Python" },
  { key: "Scikit-learn",  label: "Scikit-learn",   Icon: SiScikitlearn, group: "Python" },
  { key: "TensorFlow",    label: "TensorFlow",     Icon: SiTensorflow,  group: "Python" },
  { key: "PyTorch",       label: "PyTorch",        Icon: SiPytorch,     group: "Python" },
  // Bancos de dados
  { key: "PostgreSQL",    label: "PostgreSQL",     Icon: SiPostgresql,  group: "Banco" },
  { key: "MySQL",         label: "MySQL",          Icon: SiMysql,       group: "Banco" },
  { key: "MongoDB",       label: "MongoDB",        Icon: SiMongodb,     group: "Banco" },
  { key: "SQLite",        label: "SQLite",         Icon: SiSqlite,      group: "Banco" },
  { key: "Redis",         label: "Redis",          Icon: SiRedis,       group: "Banco" },
  { key: "Snowflake",     label: "Snowflake",      Icon: SiSnowflake,   group: "Banco" },
  { key: "Elasticsearch", label: "Elasticsearch",  Icon: SiElasticsearch, group: "Banco" },
  { key: "Supabase",      label: "Supabase",       Icon: SiSupabase,    group: "Banco" },
  // Engenharia de dados
  { key: "Airflow",       label: "Airflow",        Icon: SiApacheairflow, group: "Engenharia" },
  { key: "Spark",         label: "Spark",          Icon: SiApachespark, group: "Engenharia" },
  { key: "Kafka",         label: "Kafka",          Icon: SiApachekafka, group: "Engenharia" },
  { key: "Databricks",    label: "Databricks",     Icon: SiDatabricks,  group: "Engenharia" },
  { key: "dbt",           label: "dbt",            Icon: SiDbt,         group: "Engenharia" },
  { key: "n8n",           label: "n8n",            Icon: SiN8N,         group: "Engenharia" },
  { key: "Apache",        label: "Apache",         Icon: SiApache,      group: "Engenharia" },
  // Cloud
  { key: "GCP",           label: "Google Cloud",   Icon: SiGooglecloud, group: "Cloud" },
  { key: "Azure",         label: "Azure",          Icon: Cloud,         group: "Cloud" },
  { key: "AWS",           label: "AWS",            Icon: Server,        group: "Cloud" },
  // DevOps
  { key: "Docker",        label: "Docker",         Icon: SiDocker,      group: "DevOps" },
  { key: "Kubernetes",    label: "Kubernetes",     Icon: SiKubernetes,  group: "DevOps" },
  { key: "Terraform",     label: "Terraform",      Icon: SiTerraform,   group: "DevOps" },
  { key: "Linux",         label: "Linux",          Icon: SiLinux,       group: "DevOps" },
  { key: "Ubuntu",        label: "Ubuntu",         Icon: SiUbuntu,      group: "DevOps" },
  { key: "Ansible",       label: "Ansible",        Icon: SiAnsible,     group: "DevOps" },
  // Microsoft
  { key: "Excel",         label: "Excel",          Icon: FileSpreadsheet, group: "Microsoft" },
  { key: "Word",          label: "Word",           Icon: FileText,      group: "Microsoft" },
  { key: "OneDrive",      label: "OneDrive",       Icon: HardDrive,     group: "Microsoft" },
  // Web
  { key: "JavaScript",    label: "JavaScript",     Icon: SiJavascript,  group: "Web" },
  { key: "TypeScript",    label: "TypeScript",     Icon: SiTypescript,  group: "Web" },
  { key: "React",         label: "React",          Icon: SiReact,       group: "Web" },
  { key: "Node.js",       label: "Node.js",        Icon: SiNodedotjs,   group: "Web" },
  { key: "HTML",          label: "HTML5",          Icon: SiHtml5,       group: "Web" },
  { key: "CSS",           label: "CSS3",           Icon: SiCss,         group: "Web" },
  { key: "Tailwind",      label: "Tailwind",       Icon: SiTailwindcss, group: "Web" },
  // Ferramentas
  { key: "Git",           label: "Git",            Icon: SiGit,         group: "Ferramentas" },
  { key: "GitHub",        label: "GitHub",         Icon: SiGithub,      group: "Ferramentas" },
  { key: "Figma",         label: "Figma",          Icon: SiFigma,       group: "Ferramentas" },
  { key: "Jira",          label: "Jira",           Icon: SiJira,        group: "Ferramentas" },
  { key: "Confluence",    label: "Confluence",     Icon: SiConfluence,  group: "Ferramentas" },
];

const GROUPS = Array.from(new Set(ICON_CATALOG.map((i) => i.group)));

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
  const [iconSearch, setIconSearch] = useState("");

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

  const filteredIcons = iconSearch
    ? ICON_CATALOG.filter(
        (i) =>
          i.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
          i.key.toLowerCase().includes(iconSearch.toLowerCase()) ||
          i.group.toLowerCase().includes(iconSearch.toLowerCase())
      )
    : ICON_CATALOG;

  const selectedEntry = ICON_CATALOG.find((i) => i.key === formData.icon);
  const SelectedIcon = selectedEntry?.Icon;

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

            {/* SELETOR DE ÍCONE */}
            <div className="space-y-3">
              <Label>Ícone</Label>

              {/* Prévia do selecionado */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30">
                {SelectedIcon ? (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <SelectedIcon className="w-5 h-5 text-primary" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-border flex items-center justify-center text-muted-foreground text-xs">
                    ?
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{selectedEntry?.label ?? "Nenhum selecionado"}</p>
                  <p className="text-xs text-muted-foreground font-mono">{formData.icon || "—"}</p>
                </div>
                {formData.icon && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-muted-foreground"
                    onClick={() => setFormData({ ...formData, icon: "" })}
                  >
                    Limpar
                  </Button>
                )}
              </div>

              {/* Busca */}
              <Input
                placeholder="Buscar ícone... (ex: chart, python, cloud)"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
              />

              {/* Grade de ícones */}
              <div className="border border-border rounded-xl overflow-y-auto max-h-64 p-3 space-y-4">
                {(iconSearch ? [{ group: "Resultado", icons: filteredIcons }] : GROUPS.map((g) => ({ group: g, icons: ICON_CATALOG.filter((i) => i.group === g) }))).map(({ group, icons }) =>
                  icons.length === 0 ? null : (
                    <div key={group}>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">{group}</p>
                      <div className="flex flex-wrap gap-2">
                        {icons.map(({ key, label, Icon }) => (
                          <button
                            key={key}
                            type="button"
                            title={`${label} → "${key}"`}
                            onClick={() => setFormData({ ...formData, icon: key })}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all w-16 ${
                              formData.icon === key
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-border-hover hover:bg-secondary"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="truncate w-full text-center leading-tight">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
                {filteredIcons.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum ícone encontrado</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">
                  Cor <span className="text-xs text-muted-foreground">(classe Tailwind)</span>
                </Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Ex: text-primary"
                />
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
