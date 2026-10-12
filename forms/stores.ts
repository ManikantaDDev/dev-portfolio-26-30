"use client";

import { useForgotPasswordFormStore } from "@/stores/form/forgot-password/store";
import { useLoginFormStore } from "@/stores/form/login/store";
import { useProfileFormStore } from "@/stores/form/profile/store";
import { useRegisterFormStore } from "@/stores/form/register/store";
import { useResetPasswordFormStore } from "@/stores/form/reset-password/store";
import { useSkillFormStore } from "@/stores/form/skill/store";

/**
 * Single registry so a form can be referenced by key from either a server or a
 * client component, without passing the zustand hook across the boundary.
 */
export const formStores = {
  login: useLoginFormStore,
  "forgot-password": useForgotPasswordFormStore,
  register: useRegisterFormStore,
  "reset-password": useResetPasswordFormStore,
  profile: useProfileFormStore,
  skill: useSkillFormStore,
};

export type FormKey = keyof typeof formStores;