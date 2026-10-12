"use server";

import { revalidatePath } from "next/cache";
import { database } from "@/lib/supabase/database";
import { skillSchema, type SkillFormValues } from "@/forms/config/validations";
import { PORTFOLIO_PATHS, getActionUser } from "@/actions/_shared";

const ADMIN_PATH = "/admin/skills";

export async function saveSkillAction(values: SkillFormValues) {
  const parsed = skillSchema.safeParse(values);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();
  const { id, ...fields } = parsed.data;
  const isUpdate = id !== "";
  const payload = { ...fields, years: fields.years ?? null };

  const { error } = isUpdate
    ? await supabase
        .from("skills")
        .update(payload)
        .eq("id", id)
        .eq("user_id", auth.userId)
    : await supabase.from("skills").insert({ ...payload, user_id: auth.userId });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: isUpdate ? "Skill updated." : "Skill added." };
}

export async function deleteSkillAction(id: string) {
  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();
  const { error } = await supabase
    .from("skills")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: "Skill removed." };
}
