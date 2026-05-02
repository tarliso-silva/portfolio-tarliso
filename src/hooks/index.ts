/**
 * Barrel export for all application hooks.
 *
 * Allows clean imports in new code:
 *   import { useProjects, useProfile } from "@/hooks";
 *
 * Existing imports using the full path still work unchanged.
 */

// — Data hooks (Supabase / React Query) —
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

// — UI hooks —
export { useIsMobile } from "./use-mobile";
export { default as useDynamicFavicon } from "./useDynamicFavicon";
