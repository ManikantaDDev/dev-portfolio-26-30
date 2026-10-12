import { createFormStore } from "@/lib/backend/stores/genericStore";
import type { RegisterFormValues } from "@/forms/config/validations";

export const useRegisterFormStore = createFormStore<RegisterFormValues>({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});