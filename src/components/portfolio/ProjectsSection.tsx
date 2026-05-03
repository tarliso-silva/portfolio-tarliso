import { useState } from "react";
import { FolderOpen, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjects, useProjectsBySkill } from "@/hooks/useProjects";
import { useSkills } from "@/hooks/useSkills";

const ProjectsSection = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const { data: allProjectsData, isLoading: loadingAll } = useProjects();
  const { data: skillProjects, isLoading: loadingSkill } = useProjectsBySkill(activeSkill);
  const { data: skills = [] } = useSkills();

  const featuredProjects = allProjectsData?.filter((p) => p.featured).slice(0, 4) || [];
  const projects = activeSkill ? (skillProjects ?? []) : featuredProjects;
  const isLoading = activeSkill ? loadingSkill : loadingAll;

  const handleSkillClick = (skillId: string) => {
    setActiveSkill((prev) => (prev === skillId ? null : skillId));
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
              onClick={() => setActiveSkill(null)}
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
            <Link key={project.id} to={`/projects/${project.id}`} className="project-card group">
              {/* Imagem do projeto */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-contain transition-transform duration-700"
                />
              </div>

              {/* Sobreposição */}
              <div className="project-overlay">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{project.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{project.shortDescription}</p>
                    <div className="flex gap-2 mt-3">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="badge-time text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </div>

              {/* Informações sempre visíveis no mobile */}
              <div className="p-4 md:hidden">
                <h4 className="text-lg font-semibold text-foreground">{project.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{project.shortDescription}</p>
                <div className="flex gap-2 mt-3">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="badge-time text-xs">
                      {tag}
                    </span>
                  ))}
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

