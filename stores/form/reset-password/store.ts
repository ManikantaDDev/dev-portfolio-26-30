import { createFormStore } from "@/lib/backend/stores/genericStore";
import type { ResetPasswordFormValues } from "@/forms/config/validations";

export const useResetPasswordFormStore = createFormStore<ResetPasswordFormValues>({
  password: "",
  confirmPassword: "",
});