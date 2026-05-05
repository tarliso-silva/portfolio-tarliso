/**
 * Mapeadores da tabela `projects`.
 *
 * - mapDbToProject  : snake_case DB row  → camelCase Project view-model
 * - mapProjectToDb  : camelCase Project  → snake_case DB row (for inserts/updates)
 *
 * Manter transformações aqui separa modelagem de dados do React Query
 * em useProjects.ts, mantendo cada parte legível e testável de forma isolada.
 */
import type { Project } from "@/types/project";

export const mapDbToProject = (data: Record<string, unknown>): Project => ({
  id: data.id as string,
  title: data.title as string,
  category: data.category as string,
  shortDescription: (data.description as string) || "",
  description: ((data.business_problem ?? data.description) as string) || "",
  content: (data.markdown as string) || "",
  coverImage: (data.image_url as string) || "",
  tags: (data.technologies as string[]) || [],
  stack: (data.technologies as string[]) || [],
  featured: (data.is_published as boolean) || false,
  isPublished: (data.is_published as boolean) || false,
  displayOrder: (data.display_order as number) || 0,
  slug: (data.slug as string) || "",
  githubUrl: (data.github_url as string) || "",
  demoUrl: (data.demo_url as string) || "",
  link: ((data.demo_url ?? data.github_url) as string) || "",
  businessProblemImage: (data.business_problem_image as string) || "",
  contextImage: (data.context_image as string) || "",
  premisesImage: (data.premises_image as string) || "",
  strategyImage: (data.strategy_image as string) || "",
  resultsImage: (data.results_image as string) || "",
  nextStepsImage: (data.next_steps_image as string) || "",
  galleryImages: (data.gallery_images as string[]) || [],
  premises: (data.premises as string[]) || [],
  strategy: (data.strategy as string[]) || [],
  insights: (data.insights as string[]) || [],
  results: (data.results as string[]) || [],
  nextSteps: (data.next_steps as string[]) || [],
  overview: (data.overview as string) || "",
  role: (data.role as string) || "",
  methodology: (data.methodology as string) || "",
  tools: (data.tools as string[]) || [],
  context: (data.context as string) || "",
  cardProblem: (data.card_problem as string) || "",
  cardSolution: (data.card_solution as string) || "",
  cardResult: (data.card_result as string) || "",
  businessProblem: (data.business_problem as string) || "",
  stats: Array.isArray(data.results)
    ? (data.results as string[]).slice(0, 4).map((res) => {
        const parts = res.split(":");
        return {
          label: parts[1]?.trim() || "Resultado",
          value: parts[0]?.trim() || res,
        };
      })
    : [],
});

export const mapProjectToDb = (project: Project): Record<string, unknown> => ({
  id: project.id,
  title: project.title,
  category: project.category,
  description: project.shortDescription,
  business_problem: project.description,
  image_url: project.coverImage,
  markdown: project.content,
  technologies: project.tags,
  is_published: project.isPublished,
  display_order: project.displayOrder,
  slug: project.slug || "",
  github_url: project.githubUrl,
  demo_url: project.demoUrl,
  business_problem_image: project.businessProblemImage,
  context_image: project.contextImage,
  premises_image: project.premisesImage,
  strategy_image: project.strategyImage,
  results_image: project.resultsImage,
  next_steps_image: project.nextStepsImage,
  gallery_images: project.galleryImages,
  premises: project.premises,
  strategy: project.strategy,
  insights: project.insights,
  results: project.results,
  next_steps: project.nextSteps,
  overview: project.overview,
  role: project.role,
  methodology: project.methodology,
  tools: project.tools,
  context: project.context,
  card_problem: project.cardProblem,
  card_solution: project.cardSolution,
  card_result: project.cardResult,
});
