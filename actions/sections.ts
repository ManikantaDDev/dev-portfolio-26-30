"use server";

import { revalidatePath } from "next/cache";
import { database } from "@/lib/supabase/database";
import { PORTFOLIO_PATHS, blankToNull, getActionUser } from "@/actions/_shared";

const ADMIN_PATH = "/admin/sections";

export type SectionValues = {
  id: string;
  label: string;
  heading: string;
  description: string;
};

export async function saveSectionAction(values: SectionValues) {
  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();
  const { id, label, heading, description } = values;

  const { error } = await supabase
    .from("sections_config")
    .update({
      label: blankToNull(label),
      heading: blankToNull(heading),
      description: blankToNull(description),
    })
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: "Section updated." };
}

export async function setSectionVisibilityAction(id: string, isVisible: boolean) {
  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();
  const { error } = await supabase
    .from("sections_config")
    .update({ is_visible: isVisible })
    .eq("id", id)
    .eq("user_id", auth.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(ADMIN_PATH);
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: isVisible ? "Section shown." : "Section hidden." };
}

/**
 * Swaps a section's position with its neighbour. `display_order` carries no
 * unique constraint, so the two rows can simply exchange their values.
 */
export async function moveSectionAction(id: string, direction: "up" | "down") {
  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();
  const { data: sections, error } = await supabase
    .from("sections_config")
    .select("id, display_order")
    .eq("user_id", auth.userId)
    .order("display_order", { ascending: true });

  if (error) return { error: error.message };

  const ordered = sections ?? [];
  const index = ordered.findIndex((section) => section.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || swapIndex < 0 || swapIndex >= ordered.length) {
    return { error: "That section is already at the end of the list." };
  }

  const current = ordered[index];
  const neighbour = ordered[swapIndex];

  const [first, second] = await Promise.all([
    supabase
      .from("sections_config")
      .update({ display_order: neighbour.display_order })
      .eq("id", current.id)
      .eq("user_id", auth.userId),
    supabase
      .from("sections_config")
      .update({ display_order: current.display_order })
      .eq("id", neighbour.id)
      .eq("user_id", auth.userId),
  ]);

  if (first.error) return { error: first.error.message };
  if (second.error) return { error: second.error.message };

  revalidatePath(ADMIN_PATH);
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: "Sections reordered." };
}
