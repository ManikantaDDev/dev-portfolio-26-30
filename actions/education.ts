"use server";

import { revalidatePath } from "next/cache";
import { database } from "@/lib/supabase/database";
import { educationSchema, type EducationFormValues } from "@/forms/config/validations";
import { PORTFOLIO_PATHS, blankToNull, getActionUser } from "@/actions/_shared";

const ADMIN_PATH = "/admin/education";

export async function saveEducationAction(values: EducationFormValues) {
  const parsed = educationSchema.safeParse(values);

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
    degree: blankToNull(fields.degree),
    field_of_study: blankToNull(fields.field_of_study),
    start_date: blankToNull(fields.start_date),
    end_date: blankToNull(fields.end_date),
    grade: blankToNull(fields.grade),
    summary: blankToNull(fields.summary),
  };

  const { error } = isUpdate
    ? await supabase
        .from("educations")
        .update(payload)
        .eq("id", id)
        .eq("user_id", auth.userId)
    : await supabase.from("educations").insert({ ...payload, user_id: auth.userId });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: isUpdate ? "Education updated." : "Education added." };
}

export async function deleteEducationAction(id: string) {
  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();
  const { error } = await supabase
    .from("educations")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: "Education removed." };
}
