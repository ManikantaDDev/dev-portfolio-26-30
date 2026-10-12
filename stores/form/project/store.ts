import { createFormStore } from "@/lib/backend/stores/genericStore";
import { emptyProjectValues, type ProjectFormValues } from "@/forms/config/validations";

export const useProjectFormStore = createFormStore<ProjectFormValues>({ ...emptyProjectValues });
