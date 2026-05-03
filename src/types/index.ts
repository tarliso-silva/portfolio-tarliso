/**
 * Exportação centralizada dos tipos e schemas da aplicação.
 *
 * Permite imports centralizados em código novo:
 *   import { Profile, Project, Content } from "@/types";
 *
 * Imports existentes pelo caminho completo continuam funcionando.
 */

// Modelos de banco (schemas Zod + tipos inferidos)
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

// View-model de projeto (camelCase usado na interface)
export type { Project, ProjectCategory } from "./project";
export { ProjectSchema, ProjectCategoryEnum } from "./project";
