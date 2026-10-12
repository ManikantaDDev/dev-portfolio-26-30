"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/forms/config/validations";

export async function updateProfileAction(values: ProfileFormValues) {
  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to update your profile." };
  }

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

  const { error } = await supabase.auth.updateUser({
    data: {
      profile: {
        display_name,
        headline,
        bio,
        avatar_url,
        location,
        github_url,
        linkedin_url,
        website_url,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/profile");

  return { message: "Profile updated successfully." };
}