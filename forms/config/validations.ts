import { z } from "zod";
import { registerSchema, resetPasswordSchema } from "@/app/api/models/user/user";

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

export const Validations = {
  email: z.email("Enter a valid email address").trim(),

  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(PASSWORD_MAX_LENGTH, `Password must be at most ${PASSWORD_MAX_LENGTH} characters`),

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),

  phone: z
    .string()
    .trim()
    .regex(/^[+]?[0-9\s()-]{6,20}$/, "Enter a valid phone number"),

  url: z.url("Enter a valid URL").trim(),

  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export type ProfileFormValues = {
  display_name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  website_url: string;
};

export const PROFILE_LIMITS = {
  displayName: 100,
  headline: 120,
  bio: 600,
  avatarUrl: 500,
  location: 100,
  websiteUrl: 300,
} as const;

const optionalUrl = z.union([z.literal(""), z.url("Enter a valid URL")]);

const optionalText = (max: number, label: string) =>
  z.string().trim().max(max, `${label} must be at most ${max} characters`);

export const loginSchema = z.object({
  email: Validations.email,
  password: z.string().trim().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: Validations.email,
});

export { registerSchema, resetPasswordSchema };

export const profileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(PROFILE_LIMITS.displayName, `Name must be at most ${PROFILE_LIMITS.displayName} characters`),
  headline: optionalText(PROFILE_LIMITS.headline, "Headline"),
  bio: optionalText(PROFILE_LIMITS.bio, "Bio"),
  avatar_url: z.union([
    z.literal(""),
    z.url("Enter a valid avatar URL").max(PROFILE_LIMITS.avatarUrl),
  ]),
  location: optionalText(PROFILE_LIMITS.location, "Location"),
  github_url: optionalUrl,
  linkedin_url: optionalUrl,
  website_url: z.union([
    z.literal(""),
    z.url("Enter a valid website URL").max(PROFILE_LIMITS.websiteUrl),
  ]),
});

// ============================================================
// Skills
// ============================================================

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Design",
  "Other",
] as const;

export const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  years: number | null;
  is_featured: boolean;
  display_order: number;
};

export type SkillFormValues = Omit<Skill, "id"> & { id: string };

export const SKILL_LIMITS = {
  name: 60,
  years: 60,
} as const;

export const skillSchema = z.object({
  // Not rendered as an input; carries the row id through an update.
  id: z.string(),
  name: z
    .string()
    .trim()
    .min(2, "Skill name must be at least 2 characters")
    .max(SKILL_LIMITS.name, `Skill name must be at most ${SKILL_LIMITS.name} characters`),
  category: z.enum(SKILL_CATEGORIES, { message: "Select a category" }),
  level: z.enum(SKILL_LEVELS, { message: "Select a level" }),
  years: z.number().min(0, "Years cannot be negative").max(SKILL_LIMITS.years).nullish(),
  is_featured: z.boolean(),
  display_order: z.number().int().min(0).max(999),
});

export const emptySkillValues: SkillFormValues = {
  id: "",
  name: "",
  category: "Frontend",
  level: "Intermediate",
  years: null,
  is_featured: false,
  display_order: 0,
};


// ============================================================
// Portfolio sections
// ============================================================

export const SECTION_KEYS = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const isSectionKey = (value: string): value is SectionKey =>
  (SECTION_KEYS as readonly string[]).includes(value);


// ============================================================
// Projects
// ============================================================

export const PROJECT_LIMITS = {
  title: 120,
  description: 1000,
  tags: 200,
  urls: 500,
} as const;

export type ProjectFormValues = {
  id: string;
  title: string;
  description: string;
  /** Comma separated in the form, split before it reaches the database. */
  tags: string;
  image_url: string;
  live_url: string;
  github_url: string;
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
};

const optionalUrlWithLimit = (max: number) =>
  z.union([z.literal(""), z.url("Enter a valid URL").max(max)]);

export const projectSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(PROJECT_LIMITS.title, `Title must be at most ${PROJECT_LIMITS.title} characters`),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(PROJECT_LIMITS.description, `Description must be at most ${PROJECT_LIMITS.description} characters`),
  tags: z
    .string()
    .trim()
    .max(PROJECT_LIMITS.tags, `Tags must be at most ${PROJECT_LIMITS.tags} characters`),
  image_url: optionalUrlWithLimit(PROJECT_LIMITS.urls),
  live_url: optionalUrlWithLimit(PROJECT_LIMITS.urls),
  github_url: optionalUrlWithLimit(PROJECT_LIMITS.urls),
  is_published: z.boolean(),
  is_featured: z.boolean(),
  display_order: z.number().int().min(0).max(999),
});

export const emptyProjectValues: ProjectFormValues = {
  id: "",
  title: "",
  description: "",
  tags: "",
  image_url: "",
  live_url: "",
  github_url: "",
  is_published: false,
  is_featured: false,
  display_order: 0,
};

/** "React, Next.js , SQL" -> ["React", "Next.js", "SQL"] */
export function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12);
}


// ============================================================
// Experience
// ============================================================

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
] as const;

export const EXPERIENCE_LIMITS = {
  company: 120,
  title: 120,
  location: 120,
  summary: 1000,
} as const;

const optionalDate = z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")]);

export type ExperienceFormValues = {
  id: string;
  company: string;
  title: string;
  location: string;
  employment_type: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  summary: string;
  display_order: number;
};

export const experienceSchema = z.object({
  id: z.string(),
  company: z
    .string()
    .trim()
    .min(2, "Company must be at least 2 characters")
    .max(EXPERIENCE_LIMITS.company, `Company must be at most ${EXPERIENCE_LIMITS.company} characters`),
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(EXPERIENCE_LIMITS.title, `Title must be at most ${EXPERIENCE_LIMITS.title} characters`),
  location: optionalText(EXPERIENCE_LIMITS.location, "Location"),
  employment_type: z.string().trim(),
  start_date: optionalDate,
  end_date: optionalDate,
  is_current: z.boolean(),
  summary: optionalText(EXPERIENCE_LIMITS.summary, "Summary"),
  display_order: z.number().int().min(0).max(999),
});

export const emptyExperienceValues: ExperienceFormValues = {
  id: "",
  company: "",
  title: "",
  location: "",
  employment_type: "",
  start_date: "",
  end_date: "",
  is_current: false,
  summary: "",
  display_order: 0,
};


// ============================================================
// Education
// ============================================================

export const EDUCATION_LIMITS = {
  institution: 160,
  degree: 120,
  fieldOfStudy: 120,
  grade: 60,
  summary: 1000,
} as const;

export type EducationFormValues = {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  grade: string;
  summary: string;
  display_order: number;
};

export const educationSchema = z.object({
  id: z.string(),
  institution: z
    .string()
    .trim()
    .min(2, "Institution must be at least 2 characters")
    .max(EDUCATION_LIMITS.institution, `Institution must be at most ${EDUCATION_LIMITS.institution} characters`),
  degree: optionalText(EDUCATION_LIMITS.degree, "Degree"),
  field_of_study: optionalText(EDUCATION_LIMITS.fieldOfStudy, "Field of study"),
  start_date: optionalDate,
  end_date: optionalDate,
  grade: optionalText(EDUCATION_LIMITS.grade, "Grade"),
  summary: optionalText(EDUCATION_LIMITS.summary, "Summary"),
  display_order: z.number().int().min(0).max(999),
});

export const emptyEducationValues: EducationFormValues = {
  id: "",
  institution: "",
  degree: "",
  field_of_study: "",
  start_date: "",
  end_date: "",
  grade: "",
  summary: "",
  display_order: 0,
};