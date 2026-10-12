"use server";

import { revalidatePath } from "next/cache";
import { database } from "@/lib/supabase/database";
import {
  experienceSchema,
  type ExperienceFormValues,
} from "@/forms/config/validations";
import { PORTFOLIO_PATHS, blankToNull, getActionUser } from "@/actions/_shared";

const ADMIN_PATH = "/admin/experience";

export async function saveExperienceAction(values: ExperienceFormValues) {
  const parsed = experienceSchema.safeParse(values);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();
  const { id, ...fields } = parsed.data;
  const isUpdate = id !== "";

  const payload = {
    ...fields,
    location: blankToNull(fields.location),
    employment_type: blankToNull(fields.employment_type),
    start_date: blankToNull(fields.start_date),
    // A current role has no end date, so the field is ignored rather than stored.
    end_date: fields.is_current ? null : blankToNull(fields.end_date),
    summary: blankToNull(fields.summary),
  };

  const { error } = isUpdate
    ? await supabase
        .from("experiences")
        .update(payload)
        .eq("id", id)
        .eq("user_id", auth.userId)
    : await supabase.from("experiences").insert({ ...payload, user_id: auth.userId });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: isUpdate ? "Experience updated." : "Experience added." };
}

export async function deleteExperienceAction(id: string) {
  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();
  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: "Experience removed." };
}
