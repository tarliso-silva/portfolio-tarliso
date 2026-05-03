/**
 * Exportação centralizada dos hooks da aplicação.
 *
 * Permite imports centralizados em código novo:
 *   import { useProjects, useProfile } from "@/hooks";
 *
 * Imports existentes pelo caminho completo continuam funcionando.
 */

// Hooks de dados (Supabase / React Query)
export { useProfiles, useProfile } from "./useProfile";
export { useProjects, useProject } from "./useProjects";
export { useContents, useContent, useRelatedContents } from "./useContents";
export { useBooks } from "./useBooks";
export { useCourses } from "./useCourses";
export { useCustomPages } from "./useCustomPages";
export { useEducationList } from "./useEducation";
export { useExperiences } from "./useExperiences";
export { useJourneyList } from "./useJourney";
export { useTechnologies } from "./useTechnologies";
export { useStorage } from "./useStorage";

// Hooks de interface
export { useIsMobile } from "./use-mobile";
export { default as useDynamicFavicon } from "./useDynamicFavicon";
