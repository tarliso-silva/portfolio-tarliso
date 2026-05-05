import { useState } from "react";
import { FolderOpen, ArrowUpRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjects, useProjectsBySkill } from "@/hooks/useProjects";
import { useSkills } from "@/hooks/useSkills";

interface ProjectsSectionProps {
  /** ID de habilidade controlado externamente (ex: clique em SkillsSection). */
  selectedSkillId?: string | null;
  /** Callback para o pai atualizar o estado quando o filtro interno muda. */
  onSkillChange?: (id: string | null) => void;
}

const ProjectsSection = ({ selectedSkillId, onSkillChange }: ProjectsSectionProps) => {
  const [internalSkill, setInternalSkill] = useState<string | null>(null);

  // Prop externa tem prioridade; caso ausente, usa estado interno
  const activeSkill = selectedSkillId !== undefined ? selectedSkillId : internalSkill;

  const { data: allProjectsData, isLoading: loadingAll } = useProjects();
  const { data: skillProjects, isLoading: loadingSkill } = useProjectsBySkill(activeSkill);
  const { data: skills = [] } = useSkills();

  const featuredProjects = allProjectsData?.filter((p) => p.featured).slice(0, 4) || [];
  const projects = activeSkill ? (skillProjects ?? []) : featuredProjects;
  const isLoading = activeSkill ? loadingSkill : loadingAll;

  const handleSkillClick = (skillId: string) => {
    const next = activeSkill === skillId ? null : skillId;
    if (selectedSkillId !== undefined) {
      onSkillChange?.(next);
    } else {
      setInternalSkill(next);
    }
  };

  const clearFilter = () => {
    if (selectedSkillId !== undefined) {
      onSkillChange?.(null);
    } else {
      setInternalSkill(null);
    }
  };

  return (
    <section className="animate-fade-up delay-300 mt-16">
      {/* Cabeçalho da seção */}
      <div className="section-header">
        <div className="section-icon">
          <FolderOpen className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          {activeSkill ? "Projetos por Habilidade" : "Projetos em Destaque"}
        </h3>
      </div>

      {/* Filtro de habilidades */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 mb-6">
          {skills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => handleSkillClick(skill.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                activeSkill === skill.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {skill.name}
            </button>
          ))}
          {activeSkill && (
            <button
              onClick={clearFilter}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Limpar filtro ×
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Carregando projetos...</div>
      ) : projects.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          Nenhum projeto encontrado para esta habilidade.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.slug || project.id}`} className="project-card group block">
              {/* Imagem 16:9 */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Conteúdo abaixo da imagem */}
              <div className="p-5 flex flex-col gap-2">
                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="badge-time text-xs">{tag}</span>
                    ))}
                  </div>
                )}

                {/* Título */}
                <h4 className="text-base font-bold text-foreground leading-snug mt-1">
                  {project.title}
                </h4>

                {/* Descrição */}
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {project.shortDescription}
                </p>

                {/* Métrica de resultado */}
                {project.cardResult && (
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {project.cardResult}
                  </p>
                )}

                {/* CTA */}
                <div className="pt-3 mt-1 border-t border-border/40">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--neon-glow)/0.45)]">
                    <Search className="w-4 h-4" />
                    Ver detalhes
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Link para ver todos */}
      <div className="mt-8 text-center">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          Ver todos os projetos
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default ProjectsSection;

