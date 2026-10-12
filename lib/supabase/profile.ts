import { createClient } from "@/lib/supabase/server";
import type { ProfileFormValues, Skill } from "@/forms/config/validations";

export type StoredProfile = ProfileFormValues;

/** Skills are stored alongside the profile in `user_metadata.skills`. */
export async function getCurrentSkills(): Promise<Skill[]> {
  const current = await getCurrentProfile();
  return current?.skills ?? [];
}

/**
 * Profile data lives in Supabase Auth's `user_metadata` rather than the
 * `profiles` table, so it works without any migrations or RLS policies.
 *
 * Trade-off: it is only readable for the signed-in user. Once
 * `supabase/migrations/*.sql` is applied in the Supabase Dashboard, this can
 * move to the `profiles` table so the live portfolio can read it publicly.
 */
export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const metadata = user.user_metadata as
    | { profile?: Partial<StoredProfile>; role?: string; skills?: Skill[] }
    | undefined;

  const role = metadata?.role === "admin" || metadata?.role === "viewer" ? metadata.role : null;
  const skills = Array.isArray(metadata?.skills) ? metadata.skills : [];

  return { user, profile: metadata?.profile ?? null, role, skills };
}

/** Maps stored metadata onto the profile form store shape. */
export function toProfileFormValues(
  profile: Partial<StoredProfile> | null
): ProfileFormValues {
  return {
    display_name: profile?.display_name ?? "",
    headline: profile?.headline ?? "",
    bio: profile?.bio ?? "",
    avatar_url: profile?.avatar_url ?? "",
    location: profile?.location ?? "",
    github_url: profile?.github_url ?? "",
    linkedin_url: profile?.linkedin_url ?? "",
    website_url: profile?.website_url ?? "",
  };
}