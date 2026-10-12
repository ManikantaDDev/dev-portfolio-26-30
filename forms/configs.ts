"use client";

import type { FormConfig } from "@/forms/config/form";
import type { FormKey } from "@/forms/stores";
import { EducationFormConfig } from "@/forms/config/education";
import { ExperienceFormConfig } from "@/forms/config/experience";
import { ForgotPasswordFormConfig } from "@/forms/config/forgot-password";
import { LoginFormConfig } from "@/forms/config/login";
import { ProfileFormConfig } from "@/forms/config/profile";
import { ProjectFormConfig } from "@/forms/config/project";
import { RegisterFormConfig } from "@/forms/config/register";
import { ResetPasswordFormConfig } from "@/forms/config/reset-password";
import { SkillFormConfig } from "@/forms/config/skill";

/**
 * Config factories can take their own options, so the parameter type is the
 * bottom type `never` to stay contravariantly assignable.
 */
export type FormConfigFactory = (options?: never) => FormConfig;

/**
 * Form configs hold icons and zod schemas, neither of which can be serialized
 * across the server -> client boundary. Server components therefore reference
 * a form by key and the config is built inside the client.
 */
export const formConfigs: Record<FormKey, FormConfigFactory> = {
  login: LoginFormConfig.formConfig,
  "forgot-password": ForgotPasswordFormConfig.formConfig,
  register: RegisterFormConfig.formConfig,
  "reset-password": ResetPasswordFormConfig.formConfig,
  profile: ProfileFormConfig.formConfig,
  skill: SkillFormConfig.formConfig,
  project: ProjectFormConfig.formConfig,
  experience: ExperienceFormConfig.formConfig,
  education: EducationFormConfig.formConfig,
};
