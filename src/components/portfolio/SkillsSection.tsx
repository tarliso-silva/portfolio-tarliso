import { Zap, Code, Database, Cpu, Brain, Laptop, Server, Globe, Smartphone, Shield, Search, Terminal, Database as DbIcon, Code2, Loader2, Table2, BarChart3, Cloud, X, LineChart, PieChart, FileSpreadsheet, FileText, HardDrive, Workflow, Layers, GitBranch, Lock, Eye, Boxes, Binary, FlaskConical, Settings2, Network, Bot, Braces } from "lucide-react";
import {
  SiPython, SiDocker, SiJavascript, SiTypescript, SiReact, SiHtml5, SiCss, SiTailwindcss,
  SiGit, SiGithub, SiFigma,
  SiSupabase, SiPostgresql, SiMongodb, SiMysql, SiNodedotjs,
  SiApacheairflow, SiApachespark, SiDatabricks, SiPandas,
  SiGooglecloud, SiN8N,
  SiDbt, SiSnowflake,
  SiApachekafka, SiElasticsearch, SiRedis, SiSqlite, SiJira, SiConfluence,
  SiGrafana, SiLinux, SiUbuntu, SiAnsible, SiTerraform, SiKubernetes,
  SiApache,
  SiScipy, SiNumpy, SiScikitlearn, SiTensorflow, SiPytorch, SiPlotly,
  SiLooker,
} from "react-icons/si";
import { useSkills } from "@/hooks/useSkills";

const iconMap: Record<string, React.ElementType> = {
  // ── Lucide ───────────────────────────────────────────────────
  Zap, Code, Database, Cpu, Brain, Laptop, Server, Globe, Smartphone, Shield,
  Search, Terminal, Code2, Cloud, LineChart, PieChart, FileSpreadsheet,
  Workflow, Layers, GitBranch, Lock, Eye, Boxes, Binary, FlaskConical,
  Settings2, Network, Bot, Braces, BarChart3, Table2,
  "Db": DbIcon,

  // ── Python ecosystem ─────────────────────────────────────────
  SiPython, "Python": SiPython, "python": SiPython,
  SiPandas, "Pandas": SiPandas, "pandas": SiPandas,
  SiNumpy, "NumPy": SiNumpy, "numpy": SiNumpy,
  SiScipy, "SciPy": SiScipy, "scipy": SiScipy,
  SiScikitlearn, "Scikit-learn": SiScikitlearn, "sklearn": SiScikitlearn,
  SiTensorflow, "TensorFlow": SiTensorflow, "tensorflow": SiTensorflow,
  SiPytorch, "PyTorch": SiPytorch, "pytorch": SiPytorch,
  SiPlotly, "Plotly": SiPlotly, "plotly": SiPlotly,

  // ── BI & Visualização ─────────────────────────────────────────
  "PowerBI": BarChart3, "powerbi": BarChart3, "Power BI": BarChart3,
  "Tableau": PieChart, "tableau": PieChart,
  SiLooker, "Looker": SiLooker, "looker": SiLooker,
  SiGrafana, "Grafana": SiGrafana, "grafana": SiGrafana,

  // ── Bancos de dados ───────────────────────────────────────────
  SiPostgresql, "PostgreSQL": SiPostgresql, "postgresql": SiPostgresql, "postgres": SiPostgresql,
  SiMysql, "MySQL": SiMysql, "mysql": SiMysql,
  SiMongodb, "MongoDB": SiMongodb, "mongodb": SiMongodb, "mongo": SiMongodb,
  SiSqlite, "SQLite": SiSqlite, "sqlite": SiSqlite,
  SiRedis, "Redis": SiRedis, "redis": SiRedis,
  SiSnowflake, "Snowflake": SiSnowflake, "snowflake": SiSnowflake,
  SiElasticsearch, "Elasticsearch": SiElasticsearch, "elastic": SiElasticsearch,
  SiSupabase, "Supabase": SiSupabase, "supabase": SiSupabase,

  // ── Engenharia de dados / ETL ─────────────────────────────────
  SiApacheairflow, "Airflow": SiApacheairflow, "airflow": SiApacheairflow,
  SiApachespark, "Spark": SiApachespark, "spark": SiApachespark,
  SiApachekafka, "Kafka": SiApachekafka, "kafka": SiApachekafka,
  SiApache, "Apache": SiApache,
  SiDatabricks, "Databricks": SiDatabricks, "databricks": SiDatabricks,
  SiDbt, "dbt": SiDbt, "DBT": SiDbt,
  SiN8N, "n8n": SiN8N, "N8N": SiN8N,

  // ── Cloud ─────────────────────────────────────────────────────
  SiGooglecloud, "GCP": SiGooglecloud, "gcp": SiGooglecloud, "GoogleCloud": SiGooglecloud,
  "Azure": Cloud, "azure": Cloud,
  "AWS": Server, "aws": Server,

  // ── DevOps / Infra ────────────────────────────────────────────
  SiDocker, "Docker": SiDocker, "docker": SiDocker,
  SiKubernetes, "Kubernetes": SiKubernetes, "k8s": SiKubernetes,
  SiTerraform, "Terraform": SiTerraform, "terraform": SiTerraform,
  SiAnsible, "Ansible": SiAnsible, "ansible": SiAnsible,
  SiLinux, "Linux": SiLinux, "linux": SiLinux,
  SiUbuntu, "Ubuntu": SiUbuntu, "ubuntu": SiUbuntu,

  // ── Microsoft Office ──────────────────────────────────────────
  "Excel": FileSpreadsheet, "excel": FileSpreadsheet,
  "Word": FileText, "word": FileText,
  "OneDrive": HardDrive,

  // ── Web / Frontend ────────────────────────────────────────────
  SiJavascript, "JavaScript": SiJavascript, "javascript": SiJavascript, "js": SiJavascript,
  SiTypescript, "TypeScript": SiTypescript, "typescript": SiTypescript, "ts": SiTypescript,
  SiReact, "React": SiReact, "react": SiReact,
  SiNodedotjs, "Node.js": SiNodedotjs, "Node": SiNodedotjs, "nodejs": SiNodedotjs,
  SiHtml5, "HTML": SiHtml5, "html": SiHtml5, "HTML5": SiHtml5,
  SiCss, "CSS": SiCss, "css": SiCss, "CSS3": SiCss,
  SiTailwindcss, "Tailwind": SiTailwindcss, "tailwind": SiTailwindcss,

  // ── Ferramentas ───────────────────────────────────────────────
  SiGit, "Git": SiGit, "git": SiGit,
  SiGithub, "GitHub": SiGithub, "github": SiGithub,
  SiFigma, "Figma": SiFigma, "figma": SiFigma,
  SiJira, "Jira": SiJira, "jira": SiJira,
  SiConfluence, "Confluence": SiConfluence, "confluence": SiConfluence,
};

interface SkillsSectionProps {
  selectedSkill?: string | null;
  onSkillSelect?: (id: string | null) => void;
}

const SkillsSection = ({ selectedSkill, onSkillSelect }: SkillsSectionProps) => {
  const { data: skills = [], isLoading } = useSkills();

  const mappedSkills = skills.map((skill) => ({
    id: skill.id,
    icon: iconMap[skill.icon || "Zap"] ?? Zap,
    name: skill.name,
    description: skill.description,
    color: skill.color || "text-primary",
  }));

  const handleClick = (id: string) => {
    if (!onSkillSelect) return;
    onSkillSelect(selectedSkill === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (mappedSkills.length === 0) return null;

  return (
    <section className="animate-fade-up delay-400 mt-16">
      {/* Cabeçalho da seção */}
      <div className="section-header">
        <div className="section-icon">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Habilidades e Tecnologias</h3>
        {selectedSkill && onSkillSelect && (
          <button
            onClick={() => onSkillSelect(null)}
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" />
            Limpar filtro
          </button>
        )}
      </div>

      {/* Grade de habilidades — máx 4 colunas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mappedSkills.map((skill) => {
          const isActive = selectedSkill === skill.id;
          return (
            <button
              key={skill.id}
              onClick={() => handleClick(skill.id)}
              disabled={!onSkillSelect}
              className={`skill-card text-left transition-all duration-200 ${
                onSkillSelect ? "cursor-pointer" : "cursor-default"
              } ${
                isActive
                  ? "border-primary/60 bg-primary/5 shadow-[0_0_12px_hsl(var(--primary)/0.15)]"
                  : onSkillSelect
                  ? "hover:border-primary/30 hover:bg-secondary/60"
                  : ""
              }`}
            >
              <div className="skill-icon">
                <skill.icon className={`w-6 h-6 ${skill.color}`} />
              </div>
              <div>
                <h4 className={`font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                  {skill.name}
                </h4>
                <p className="text-sm text-muted-foreground">{skill.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default SkillsSection;
