"use server";

import { revalidatePath } from "next/cache";
import { database } from "@/lib/supabase/database";
import { profileSchema, type ProfileFormValues } from "@/forms/config/validations";
import { PORTFOLIO_PATHS, blankToNull, getActionUser } from "@/actions/_shared";

const ADMIN_PATH = "/admin/profile";

export async function updateProfileAction(values: ProfileFormValues) {
  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();
  const {
    display_name,
    headline,
    bio,
    avatar_url,
    location,
    github_url,
    linkedin_url,
    website_url,
  } = parsed.data;

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name,
      headline: blankToNull(headline),
      bio: blankToNull(bio),
      avatar_url: blankToNull(avatar_url),
      location: blankToNull(location),
      github_url: blankToNull(github_url),
      linkedin_url: blankToNull(linkedin_url),
      website_url: blankToNull(website_url),
    })
    .eq("id", auth.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  revalidatePath("/profile");
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: "Profile updated successfully." };
}
