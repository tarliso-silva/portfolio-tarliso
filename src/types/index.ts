/**
 * Barrel export for all application types and schemas.
 *
 * Allows clean imports in new code:
 *   import { Profile, Project, Content } from "@/types";
 *
 * Existing imports using the full path still work unchanged.
 */

// Database models (Zod schemas + inferred types)
export type {
  Book,
  JourneyItem,
  Content,
  CustomPage,
  Education,
  Course,
  Experience,
  ExperienceType,
  IconType,
  Profile,
  Technology,
  Skill,
  ProjectSkill,
  Certification,
} from "./database";

export {
  BookSchema,
  JourneyItemSchema,
  ContentSchema,
  CustomPageSchema,
  EducationSchema,
  CourseSchema,
  ExperienceSchema,
  ExperienceTypeEnum,
  IconTypeEnum,
  ProfileSchema,
  SkillSchema,
  CertificationSchema,
} from "./database";

// Project view-model (camelCase shape used in UI)
export type { Project, ProjectCategory } from "./project";
export { ProjectSchema, ProjectCategoryEnum } from "./project";
