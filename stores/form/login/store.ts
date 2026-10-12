import { createFormStore } from "@/lib/backend/stores/genericStore";
import type { LoginFormValues } from "@/forms/config/validations";

export const useLoginFormStore = createFormStore<LoginFormValues>({
  email: "",
  password: "",
});