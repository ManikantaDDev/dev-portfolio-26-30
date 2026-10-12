"use server";

import { revalidatePath } from "next/cache";
import { database } from "@/lib/supabase/database";
import { SITE_SETTINGS } from "@/lib/portfolio/settings-def";
import { PORTFOLIO_PATHS, getActionUser } from "@/actions/_shared";

const ADMIN_PATH = "/admin/settings";

export type SiteSettingsValues = Record<string, string>;

/**
 * Upserts every managed setting in one statement. Keys whose value is empty
 * are deleted so the portfolio falls back to "not set" rather than a blank.
 */
export async function saveSiteSettingsAction(values: SiteSettingsValues) {
  const auth = await getActionUser();

  if (!auth.ok) return auth;

  const supabase = await database();

  for (const setting of SITE_SETTINGS) {
    const raw = values[setting.key] ?? "";
    const value = raw.trim();

    if (setting.field === "url" && value !== "") {
      try {
        new URL(value);
      } catch {
        return { error: `${setting.label} must be a valid URL.` };
      }
    }

    const { error } = value
      ? await supabase
          .from("portfolio_settings")
          .upsert({ key: setting.key, value }, { onConflict: "key" })
      : await supabase
          .from("portfolio_settings")
          .delete()
          .eq("key", setting.key);

    if (error) {
      return { error: `${setting.label}: ${error.message}` };
    }
  }

  revalidatePath(ADMIN_PATH);
  revalidatePath("/dashboard");
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: "Site settings saved." };
}
