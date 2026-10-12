import { createFormStore } from "@/lib/backend/stores/genericStore";
import { emptySkillValues, type SkillFormValues } from "@/forms/config/validations";

export const useSkillFormStore = createFormStore<SkillFormValues>({ ...emptySkillValues });