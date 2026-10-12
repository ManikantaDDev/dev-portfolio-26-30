import { createFormStore } from "@/lib/backend/stores/genericStore";
import {
  emptyExperienceValues,
  type ExperienceFormValues,
} from "@/forms/config/validations";

export const useExperienceFormStore = createFormStore<ExperienceFormValues>({
  ...emptyExperienceValues,
});
