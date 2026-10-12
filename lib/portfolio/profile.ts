import type { ProfileFormValues } from "@/forms/config/validations";
import type { ProfileRow } from "@/types/database";

/** Maps a stored profile row onto the shape the profile form store expects. */
export function toProfileFormValues(profile: ProfileRow): ProfileFormValues {
  return {
    display_name: profile.display_name ?? "",
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    avatar_url: profile.avatar_url ?? "",
    location: profile.location ?? "",
    github_url: profile.github_url ?? "",
    linkedin_url: profile.linkedin_url ?? "",
    website_url: profile.website_url ?? "",
  };
}
