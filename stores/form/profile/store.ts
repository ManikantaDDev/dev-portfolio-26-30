import { createFormStore } from "@/lib/backend/stores/genericStore";
import type { ProfileFormValues } from "@/forms/config/validations";

export const useProfileFormStore = createFormStore<ProfileFormValues>({
  display_name: "",
  headline: "",
  bio: "",
  avatar_url: "",
  location: "",
  github_url: "",
  linkedin_url: "",
  website_url: "",
});