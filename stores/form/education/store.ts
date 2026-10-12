import { createFormStore } from "@/lib/backend/stores/genericStore";
import { emptyEducationValues, type EducationFormValues } from "@/forms/config/validations";

export const useEducationFormStore = createFormStore<EducationFormValues>({
  ...emptyEducationValues,
});
