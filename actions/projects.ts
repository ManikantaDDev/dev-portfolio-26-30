"use server";

import { revalidatePath } from "next/cache";
import { database } from "@/lib/supabase/database";
import { parseTags, projectSchema, type ProjectFormValues } from "@/forms/config/validations";
import { PORTFOLIO_PATHS, blankToNull, getActionUser } from "@/actions/_shared";

const ADMIN_PATH = "/admin/projects";

export async function saveProjectAction(values: ProjectFormValues) {
  const parsed = projectSchema.safeParse(values);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();
  const { id, tags, ...fields } = parsed.data;
  const isUpdate = id !== "";

  const payload = {
    ...fields,
    tags: parseTags(tags),
    image_url: blankToNull(fields.image_url),
    live_url: blankToNull(fields.live_url),
    github_url: blankToNull(fields.github_url),
    published_at: fields.is_published ? new Date().toISOString() : null,
  };

  const { error } = isUpdate
    ? await supabase
        .from("projects")
        .update(payload)
        .eq("id", id)
        .eq("user_id", auth.userId)
    : await supabase.from("projects").insert({ ...payload, user_id: auth.userId });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: isUpdate ? "Project updated." : "Project added." };
}

export async function deleteProjectAction(id: string) {
  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: "Project removed." };
}

/** Publish state lives on the row, so toggling it from the table is a write. */
export async function setProjectPublishedAction(id: string, isPublished: boolean) {
  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();
  const { error } = await supabase
    .from("projects")
    .update({ is_published: isPublished, published_at: isPublished ? new Date().toISOString() : null })
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: isPublished ? "Project published." : "Project unpublished." };
}
