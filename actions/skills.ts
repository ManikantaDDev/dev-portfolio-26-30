"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { skillSchema, type Skill, type SkillFormValues } from "@/forms/config/validations";

const REVALIDATE_PATHS = ["/admin/skills", "/profile"];

async function getUserAndSkills() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, skills: [] as Skill[] };
  }

  const metadata = user.user_metadata as { skills?: Skill[] } | undefined;
  const skills = Array.isArray(metadata?.skills) ? metadata.skills : [];

  return { supabase, user, skills };
}

export async function saveSkillAction(values: SkillFormValues) {
  const parsed = skillSchema.safeParse(values);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { supabase, user, skills } = await getUserAndSkills();

  if (!user) {
    return { error: "You must be signed in to manage skills." };
  }

  const { id, ...fields } = parsed.data;
  const isUpdate = skills.some((skill) => skill.id === id);

  const nextSkills = isUpdate
    ? skills.map((skill) => (skill.id === id ? { id, ...fields } : skill))
    : [{ id: crypto.randomUUID(), ...fields }, ...skills];

  const { error } = await supabase.auth.updateUser({ data: { skills: nextSkills } });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(REVALIDATE_PATHS[0]);
  revalidatePath(REVALIDATE_PATHS[1]);

  return { message: isUpdate ? "Skill updated." : "Skill added." };
}

export async function deleteSkillAction(id: string) {
  const { supabase, user, skills } = await getUserAndSkills();

  if (!user) {
    return { error: "You must be signed in to manage skills." };
  }

  const nextSkills = skills.filter((skill) => skill.id !== id);

  if (nextSkills.length === skills.length) {
    return { error: "That skill no longer exists." };
  }

  const { error } = await supabase.auth.updateUser({ data: { skills: nextSkills } });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(REVALIDATE_PATHS[0]);
  revalidatePath(REVALIDATE_PATHS[1]);

  return { message: "Skill removed." };
}