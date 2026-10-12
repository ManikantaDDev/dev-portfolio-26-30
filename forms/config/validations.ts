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
});

export const emptySkillValues: SkillFormValues = {
  id: "",
  name: "",
  category: "Frontend",
  level: "Intermediate",
  years: null,
  is_featured: false,
};