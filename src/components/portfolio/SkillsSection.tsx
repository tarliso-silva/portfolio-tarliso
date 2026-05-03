import { Zap, Code, Database, Cpu, Brain, Laptop, Server, Globe, Smartphone, Shield, Search, Terminal, Database as DbIcon, Code2, Loader2, Table2, BarChart3, Cloud, X } from "lucide-react";
import {
  SiPython, SiDocker, SiJavascript, SiTypescript, SiReact, SiHtml5, SiCss, SiTailwindcss,
  SiGit, SiGithub, SiFigma,
  SiSupabase, SiPostgresql, SiMongodb, SiMysql, SiNodedotjs,
  SiApacheairflow, SiApachespark, SiDatabricks, SiPandas,
  SiGooglecloud, SiN8N,
} from "react-icons/si";
import { useSkills } from "@/hooks/useSkills";

const iconMap: Record<string, React.ElementType> = {
  // Ícones Lucide
  Zap, Code, Database, Cpu, Brain, Laptop, Server, Globe, Smartphone, Shield, Search, Terminal, Code2, Cloud,
  "Db": DbIcon, "Table": Table2, "BarChart": BarChart3,

  // Ícones de marca (react-icons/si) com aliases amigáveis
  SiPython, "Python": SiPython, "python": SiPython,
  SiDocker, "Docker": SiDocker, "docker": SiDocker,
  SiJavascript, "JavaScript": SiJavascript, "javascript": SiJavascript, "js": SiJavascript,
  SiTypescript, "TypeScript": SiTypescript, "typescript": SiTypescript, "ts": SiTypescript,
  SiReact, "React": SiReact, "react": SiReact,
  SiNodedotjs, "Node.js": SiNodedotjs, "Node": SiNodedotjs, "node": SiNodedotjs, "nodejs": SiNodedotjs,
  SiHtml5, "HTML": SiHtml5, "html": SiHtml5, "html5": SiHtml5, "HTML5": SiHtml5,
  SiCss, "CSS": SiCss, "css": SiCss, "css3": SiCss, "CSS3": SiCss,
  SiTailwindcss, "Tailwind": SiTailwindcss, "tailwind": SiTailwindcss, "tailwindcss": SiTailwindcss,
  SiGit, "Git": SiGit, "git": SiGit,
  SiGithub, "GitHub": SiGithub, "github": SiGithub,
  SiFigma, "Figma": SiFigma, "figma": SiFigma,
  SiSupabase, "Supabase": SiSupabase, "supabase": SiSupabase,
  SiPostgresql, "PostgreSQL": SiPostgresql, "postgresql": SiPostgresql, "postgres": SiPostgresql,
  SiMongodb, "MongoDB": SiMongodb, "mongodb": SiMongodb, "mongo": SiMongodb,
  SiMysql, "MySQL": SiMysql, "mysql": SiMysql,
  SiApacheairflow, "Airflow": SiApacheairflow, "airflow": SiApacheairflow, "ApacheAirflow": SiApacheairflow,
  SiApachespark, "Spark": SiApachespark, "spark": SiApachespark, "ApacheSpark": SiApachespark,
  SiDatabricks, "Databricks": SiDatabricks, "databricks": SiDatabricks,
  SiPandas, "Pandas": SiPandas, "pandas": SiPandas,
  SiGooglecloud, "GCP": SiGooglecloud, "gcp": SiGooglecloud, "GoogleCloud": SiGooglecloud,
  SiN8N, "n8n": SiN8N, "N8N": SiN8N,

  // Aliases de fallback para Ícones ausentes em react-icons/si v5.6
  "Excel": Table2, "excel": Table2, "SiMicrosoftexcel": Table2,
  "PowerBI": BarChart3, "powerbi": BarChart3, "Power BI": BarChart3, "SiPowerbi": BarChart3,
  "Azure": Cloud, "azure": Cloud, "SiMicrosoftazure": Cloud,
  "AWS": Cloud, "aws": Cloud, "SiAmazonwebservices": Cloud,
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
