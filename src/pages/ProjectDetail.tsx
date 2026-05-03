import { isValidElement, useEffect, useState, type ReactNode } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown, { type Components } from "react-markdown";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
import { projectCategories } from "@/types/project";
import { useProject } from "@/hooks/useProjects";
import SEOHead from "@/components/SEOHead";
import remarkGfm from "remark-gfm";

/* ---------------------------------------------
   BARRA DE PROGRESSO DA ROLAGEM
--------------------------------------------- */
const ScrollProgress = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-50 bg-foreground/5">
      <div
        className="h-full bg-foreground/60 transition-all duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

/* ---------------------------------------------
   BLOCO DE CÓDIGO COM CÓPIA
--------------------------------------------- */
const CodeBlock = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const text = String(children ?? "");
  const lang = className?.replace("language-", "") ?? "code";

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-8 group">
      <div className="flex items-center justify-between px-5 py-2.5 bg-foreground/[0.04] border border-foreground/8 rounded-t-xl">
        <span className="text-[10px] font-mono tracking-widest uppercase text-foreground/30">
          {lang}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] text-foreground/30 hover:text-foreground/70 transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="bg-card border border-t-0 border-foreground/8 rounded-b-xl p-6 overflow-x-auto">
        <code className={`text-sm font-mono text-foreground/70 leading-relaxed ${className ?? ""}`}>
          {text}
        </code>
      </pre>
    </div>
  );
};

type CodeElementProps = {
  className?: string;
  children?: ReactNode;
};

const getCodeElementProps = (children: ReactNode): CodeElementProps => {
  if (isValidElement<CodeElementProps>(children)) {
    return {
      className: children.props.className,
      children: children.props.children,
    };
  }

  return { children };
};

const markdownComponents: Components = {
  pre: ({ children }) => {
    const codeProps = getCodeElementProps(children);
    return <CodeBlock className={codeProps.className}>{codeProps.children}</CodeBlock>;
  },
  code: ({ className, children }) => <code className={className}>{children}</code>,
};

/* ---------------------------------------------
   RÓTULO DE SEÇÃO
--------------------------------------------- */
const SectionLabel = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 mb-6">
    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/80">
      {label}
    </p>
  </div>
);

/* ---------------------------------------------
   CHIP / MARCADOR
--------------------------------------------- */
type ChipVariant = "default" | "role" | "tool";
const chipStyles: Record<ChipVariant, string> = {
  default:
    "border border-foreground/10 text-foreground/50 bg-foreground/[0.03] hover:border-foreground/20 hover:text-foreground/70",
  role: "border border-emerald-500/30 text-emerald-400/80 bg-emerald-500/5",
  tool: "border border-blue-500/20 text-blue-400/70 bg-blue-500/5",
};
const Chip = ({
  label,
  variant = "default",
}: {
  label: string;
  variant?: ChipVariant;
}) => (
  <span
    className={`inline-block px-3 py-1 text-[11px] font-medium tracking-wide rounded-full transition-colors ${chipStyles[variant]}`}
  >
    {label}
  </span>
);

/* ---------------------------------------------
   PÁGINA PRINCIPAL
--------------------------------------------- */
const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  /* Carregamento */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-foreground/10 rounded-full border-t-foreground/40 animate-spin" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/25">
            Carregando
          </p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const categoryInfo = projectCategories[project.category];

  /* Flags de visibilidade das seções */
  const hasOverview =
    !!project.overview?.trim() || !!project.description?.trim();
  const hasContext =
    !!project.context?.trim() || !!project.businessProblem?.trim();
  const hasInsights = project.insights && project.insights.length > 0;
  const hasResults =
    (project.results && project.results.length > 0) ||
    (project.stats && project.stats.length > 0);
  const hasMethodology =
    !!project.methodology?.trim() ||
    (project.premises && project.premises.length > 0) ||
    (project.strategy && project.strategy.length > 0);
  const hasNextSteps = project.nextSteps && project.nextSteps.length > 0;
  const hasGallery = project.galleryImages && project.galleryImages.length > 0;
  const hasContent = !!project.content?.trim();
  const hasMeta =
    !!project.role ||
    (project.tools && project.tools.length > 0) ||
    (project.tags && project.tags.length > 0);
  const hasSidebar =
    !!(project.cardProblem || project.cardSolution || project.cardResult) ||
    (project.tags && project.tags.length > 0) ||
    !!(project.link || project.githubUrl);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground/20 pt-16">
      <SEOHead
        title={`${project.title} - Projeto`}
        description={
          project.shortDescription ||
          project.overview ||
          project.description ||
          `Projeto: ${project.title}`
        }
        canonical={`https://tarlisodoria.com/projects/${project.id}`}
        ogImage={project.coverImage}
        ogType="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description:
            project.shortDescription || project.overview || project.description,
          url: `https://tarlisodoria.com/projects/${project.id}`,
          author: { "@type": "Person", name: "Tarliso Dória" },
          ...(project.coverImage && { image: project.coverImage }),
          keywords: project.tags?.join(", "),
        }}
      />
      <ScrollProgress />

      {/* Navegação superior */}
      <header className="fixed top-16 left-0 right-0 z-30 flex items-center justify-between px-8 py-3 bg-background/80 backdrop-blur-xl border-b border-foreground/[0.04]">
        <Link
          to="/projects"
          className="flex items-center gap-2 text-sm text-foreground/40 hover:text-foreground/80 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Projetos
        </Link>
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/25 hidden sm:block">
          {categoryInfo?.label || project.category}
        </span>
        <div className="flex items-center gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-foreground/40 hover:text-foreground/80 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Código</span>
            </a>
          )}
          {project.link && project.link !== "#" && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs sm:text-sm px-4 py-1.5 border border-emerald-500/30 rounded-full text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              Demo
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </header>

      {/* Destaque principal */}
      <section className="pt-20 pb-0 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto animate-[fadeInUp_0.6s_ease-out_both]">
        {project.coverImage ? (
          <div className="relative w-full rounded-2xl overflow-hidden mb-10 border border-border bg-card shadow-2xl">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-auto block max-h-[800px] object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-6 sm:pb-10">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/40 mb-2 sm:mb-3">
                {categoryInfo?.label || project.category}
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.05]">
                {project.title}
              </h1>
            </div>
          </div>
        ) : (
          <div className="mb-10 pt-8">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/30 mb-4">
              {categoryInfo?.label || project.category}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-foreground leading-[1.05] max-w-3xl">
              {project.title}
            </h1>
          </div>
        )}

        {/* Meta row: role chip · tool chips · technology chips */}
        {hasMeta && (
          <div className="flex flex-wrap items-center gap-2 mb-16 pb-8 border-b border-foreground/[0.05]">
            {project.role && <Chip label={project.role} variant="role" />}
            {project.tools?.map((t) => (
              <Chip key={t} label={t} variant="tool" />
            ))}
            {project.tags?.map((t) => (
              <Chip key={t} label={t} />
            ))}
          </div>
        )}
        {!hasMeta && <div className="mb-16" />}
      </section>

      {/* Corpo: conteúdo principal e lateral */}
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 pb-40">
        <div
          className={`flex flex-col lg:grid gap-12 lg:gap-20 ${
            hasSidebar ? "lg:grid-cols-[1fr_300px]" : ""
          }`}
        >
          {/* Coluna principal: seções estruturadas */}
          <main className="min-w-0 space-y-0">

            {/* 1. VISÃO GERAL */}
            {hasOverview && (
              <section className="py-12 border-t border-foreground/[0.06]">
                <SectionLabel label="Visão Geral" />
                <p className="text-[16px] text-foreground/65 leading-[2] max-w-3xl">
                  {project.overview?.trim() || project.description?.trim()}
                </p>
              </section>
            )}

            {/* 2. CONTEXTO E OBJETIVOS */}
            {hasContext && (
              <section className="py-12 border-t border-foreground/[0.06]">
                <SectionLabel label="Contexto e Objetivos" />
                <div className="space-y-8">
                  {project.businessProblem?.trim() && (
                    <div>
                      <p className="text-[11px] font-semibold tracking-widest uppercase text-foreground/30 mb-3">
                        Problema de Negócio
                      </p>
                      <p className="text-[15px] text-foreground/60 leading-[1.9]">
                        {project.businessProblem}
                      </p>
                    </div>
                  )}
                  {project.context?.trim() && (
                    <div>
                      <p className="text-[11px] font-semibold tracking-widest uppercase text-foreground/30 mb-3">
                        Cenário
                      </p>
                      <p className="text-[15px] text-foreground/60 leading-[1.9]">
                        {project.context}
                      </p>
                    </div>
                  )}
                  {project.contextImage && (
                    <img
                      src={project.contextImage}
                      alt="Contexto do projeto"
                      className="w-full rounded-xl border border-border"
                    />
                  )}
                </div>
              </section>
            )}

            {/* 3. INSIGHTS E DESCOBERTAS */}
            {hasInsights && (
              <section className="py-12 border-t border-foreground/[0.06]">
                <SectionLabel label="Insights e Descobertas" />
                <ul className="space-y-4">
                  {project.insights!.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="w-5 h-5 rounded-full border border-emerald-500/20 flex items-center justify-center mt-0.5 shrink-0 group-hover:border-emerald-500/40 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                      </div>
                      <span className="text-[14px] text-foreground/55 leading-[1.8] group-hover:text-foreground/75 transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 4. RESULTADOS E IMPACTO */}
            {hasResults && (
              <section className="py-12 border-t border-foreground/[0.06]">
                <SectionLabel label="Resultados e Impacto" />

                {/* Stats grid */}
                {project.stats && project.stats.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-foreground/[0.05] rounded-xl overflow-hidden mb-8 border border-foreground/[0.05]">
                    {project.stats.slice(0, 4).map((s, i) => (
                      <div key={i} className="bg-background px-6 py-5">
                        <p className="text-3xl font-light text-foreground tracking-tight">
                          {s.value}
                        </p>
                        <p className="text-[11px] tracking-widest uppercase text-foreground/30 mt-1">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lista de resultados */}
                {project.results && project.results.length > 0 && (
                  <ul className="space-y-3">
                    {project.results.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <ChevronRight className="w-4 h-4 text-emerald-500/40 mt-0.5 shrink-0 group-hover:text-emerald-500/70 transition-colors" />
                        <span className="text-[14px] text-foreground/55 leading-[1.8] group-hover:text-foreground/75 transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {project.resultsImage && (
                  <img
                    src={project.resultsImage}
                    alt="Resultados"
                    className="w-full rounded-xl border border-border mt-6"
                  />
                )}
              </section>
            )}

            {/* 5. METODOLOGIA E ABORDAGEM */}
            {hasMethodology && (
              <section className="py-12 border-t border-foreground/[0.06]">
                <SectionLabel label="Metodologia e Abordagem" />

                {project.methodology?.trim() && (
                  <p className="text-[15px] text-foreground/60 leading-[1.9] mb-8">
                    {project.methodology}
                  </p>
                )}

                {project.premises && project.premises.length > 0 && (
                  <div className="mb-6">
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-foreground/30 mb-3">
                      Premissas
                    </p>
                    <ul className="space-y-2">
                      {project.premises.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-[13px] text-foreground/50 leading-relaxed"
                        >
                          <div className="w-1 h-1 rounded-full bg-foreground/20 mt-2 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.strategy && project.strategy.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-foreground/30 mb-3">
                      Estratégia
                    </p>
                    <ol className="space-y-2">
                      {project.strategy.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-[13px] text-foreground/50 leading-relaxed"
                        >
                          <span className="text-[10px] text-foreground/25 mt-0.5 shrink-0 font-mono">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {project.strategyImage && (
                  <img
                    src={project.strategyImage}
                    alt="Estratégia"
                    className="w-full rounded-xl border border-border mt-4"
                  />
                )}
              </section>
            )}

            {/* 6. PRÓXIMOS PASSOS */}
            {hasNextSteps && (
              <section className="py-12 border-t border-foreground/[0.06]">
                <SectionLabel label="Próximos Passos" />
                <ul className="space-y-3">
                  {project.nextSteps!.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="w-1 h-1 rounded-full bg-foreground/20 mt-2.5 shrink-0" />
                      <span className="text-[14px] text-foreground/50 leading-[1.8] group-hover:text-foreground/70 transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {project.nextStepsImage && (
                  <img
                    src={project.nextStepsImage}
                    alt="Próximos Passos"
                    className="w-full rounded-xl border border-border mt-6"
                  />
                )}
              </section>
            )}

            {/* 7. GALERIA */}
            {hasGallery && (
              <section className="py-12 border-t border-foreground/[0.06]">
                <SectionLabel label="Galeria" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.galleryImages!.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${project.title} - imagem ${i + 1}`}
                      className="w-full rounded-xl border border-border object-cover hover:scale-[1.01] transition-transform duration-300"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 8. DOCUMENTAÇÃO TÉCNICA (Markdown) */}
            {hasContent && (
              <section className="py-12 border-t border-foreground/[0.06]">
                <SectionLabel label="Documentação Técnica" />
                <article
                  className="
                    prose dark:prose-invert max-w-none

                    prose-headings:font-light prose-headings:tracking-tight
                    prose-h1:text-5xl prose-h1:text-foreground prose-h1:mt-0 prose-h1:mb-10 prose-h1:leading-[1.05]
                    prose-h2:text-3xl prose-h2:text-foreground prose-h2:mt-20 prose-h2:mb-6 prose-h2:pb-5 prose-h2:border-b prose-h2:border-border
                    prose-h3:text-xl prose-h3:text-foreground/75 prose-h3:mt-14 prose-h3:mb-4
                    prose-h4:text-base prose-h4:text-foreground/60 prose-h4:mt-10 prose-h4:mb-3 prose-h4:tracking-wide

                    prose-p:text-foreground/70 prose-p:leading-[2] prose-p:text-[16px] prose-p:my-6

                    prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/20
                    hover:prose-a:text-primary/80 hover:prose-a:border-primary/60 prose-a:transition-colors prose-a:pb-px

                    prose-strong:text-foreground prose-strong:font-medium
                    prose-em:text-foreground/60 prose-em:not-italic prose-em:font-light

                    prose-blockquote:border-l-[3px] prose-blockquote:border-primary/20
                    prose-blockquote:pl-7 prose-blockquote:not-italic
                    prose-blockquote:text-foreground/50 prose-blockquote:text-[15px]
                    prose-blockquote:my-12 prose-blockquote:leading-[2]

                    prose-li:text-foreground/70 prose-li:leading-[1.9] prose-li:text-[15px] prose-li:my-2
                    prose-ul:my-8 prose-ol:my-8

                    prose-hr:border-border prose-hr:my-16

                    prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:shadow-2xl prose-img:my-12

                    prose-code:text-primary prose-code:bg-primary/5 prose-code:px-2
                    prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] prose-code:font-mono
                    prose-code:before:content-none prose-code:after:content-none

                    prose-table:text-sm prose-table:border-collapse
                    prose-th:text-foreground/60 prose-th:font-medium prose-th:tracking-wide
                    prose-th:border-b prose-th:border-border prose-th:pb-3 prose-th:text-left
                    prose-td:text-foreground/50 prose-td:border-b prose-td:border-border/50 prose-td:py-3
                  "
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {project.content}
                  </ReactMarkdown>
                </article>
              </section>
            )}

            {/* Estado vazio */}
            {!hasOverview &&
              !hasContext &&
              !hasInsights &&
              !hasResults &&
              !hasMethodology &&
              !hasGallery &&
              !hasContent && (
                <div className="py-24 text-center border border-foreground/[0.04] rounded-2xl">
                  <p className="text-sm text-foreground/25 mb-4">
                    Este projeto ainda não possui conteúdo detalhado.
                  </p>
                  <Link
                    to="/projects"
                    className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors underline underline-offset-4"
                  >
                    Ver outros projetos
                  </Link>
                </div>
              )}
          </main>

          {/* Coluna lateral */}
          {hasSidebar && (
            <aside className="block order-first lg:order-none">
              <div className="sticky top-28 space-y-0">

                {/* Card: problem / solution / result */}
                {(project.cardProblem ||
                  project.cardSolution ||
                  project.cardResult) && (
                  <div className="mb-4 p-6 border border-foreground/[0.06] rounded-xl space-y-5 bg-foreground/[0.015]">
                    {project.cardProblem && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                          <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-foreground/80">
                            Problema
                          </p>
                        </div>
                        <p className="text-[13px] text-foreground/55 leading-relaxed">
                          {project.cardProblem}
                        </p>
                      </div>
                    )}
                    {project.cardSolution && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                          <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-foreground/80">
                            Solução
                          </p>
                        </div>
                        <p className="text-[13px] text-foreground/55 leading-relaxed">
                          {project.cardSolution}
                        </p>
                      </div>
                    )}
                    {project.cardResult && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                          <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-foreground/80">
                            Resultado
                          </p>
                        </div>
                        <p className="text-[13px] text-foreground/55 leading-relaxed">
                          {project.cardResult}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Role + Tools */}
                {(project.role ||
                  (project.tools && project.tools.length > 0)) && (
                  <div className="py-6 border-t border-foreground/[0.06]">
                    {project.role && (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/80">
                            Papel
                          </p>
                        </div>
                        <p className="text-[13px] text-foreground/60">
                          {project.role}
                        </p>
                      </div>
                    )}
                    {project.tools && project.tools.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/80">
                            Ferramentas
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tools.map((t) => (
                            <Chip key={t} label={t} variant="tool" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tecnologias */}
                {project.tags && project.tags.length > 0 && (
                  <div className="py-6 border-t border-foreground/[0.06]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/80">
                        Tecnologias
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((t) => (
                        <Chip key={t} label={t} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="pt-6 border-t border-foreground/[0.06] space-y-3">
                  {project.link && project.link !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-between w-full px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(142 71% 45% / 0.1) 0%, hsl(142 71% 45% / 0.05) 100%)",
                        border: "1px solid hsl(142 71% 45% / 0.3)",
                        color: "hsl(142 71% 65%)",
                        boxShadow: "0 0 20px hsl(142 71% 45% / 0.1)",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative z-10 flex items-center gap-2">
                        Ver Demo ao Vivo
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      </span>
                      <ExternalLink className="relative z-10 w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      <div className="absolute -inset-1 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-5 py-3.5 border border-foreground/[0.06] rounded-xl text-sm text-foreground/35 hover:border-foreground/15 hover:text-foreground/60 transition-colors group"
                    >
                      Ver Código
                      <Github className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80 transition-opacity" />
                    </a>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Chamada final */}
      <footer className="border-t border-foreground/[0.05] py-24 px-8 sm:px-12 lg:px-20 max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/20 mb-2">
            Próximo passo
          </p>
          <p className="text-2xl font-light text-foreground/70">
            Vamos conversar sobre o seu projeto.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/#contact"
            className="group relative px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-500 hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, hsl(142 71% 45%) 0%, hsl(142 60% 35%) 100%)",
              color: "hsl(0 0% 4%)",
              boxShadow:
                "0 0 25px hsl(142 71% 45% / 0.25), 0 4px 15px hsl(0 0% 0% / 0.3)",
            }}
          >
            Entrar em contato
          </Link>
          <Link
            to="/projects"
            className="px-7 py-3 text-sm text-foreground/30 hover:text-foreground/60 transition-colors"
          >
            Ver mais projetos {"->"}
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default ProjectDetail;

