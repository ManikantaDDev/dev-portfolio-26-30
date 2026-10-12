"use client";

import { useForgotPasswordFormStore } from "@/stores/form/forgot-password/store";
import { useLoginFormStore } from "@/stores/form/login/store";
import { useRegisterFormStore } from "@/stores/form/register/store";
import { useResetPasswordFormStore } from "@/stores/form/reset-password/store";

/**
 * Single registry so a form can be referenced by key from either a server or a
 * client component, without passing the zustand hook across the boundary.
 */
export const formStores = {
  login: useLoginFormStore,
  "forgot-password": useForgotPasswordFormStore,
  register: useRegisterFormStore,
  "reset-password": useResetPasswordFormStore,
};

export type FormKey = keyof typeof formStores;