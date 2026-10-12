import { createFormStore } from "@/lib/backend/stores/genericStore";
import type { ForgotPasswordFormValues } from "@/forms/config/validations";

export const useForgotPasswordFormStore = createFormStore<ForgotPasswordFormValues>({
  email: "",
});