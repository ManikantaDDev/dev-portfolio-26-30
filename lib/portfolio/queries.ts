import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { database } from "@/lib/supabase/database";
import { DEFAULT_SECTIONS, OWNER_SETTING_KEY, SITE_SETTING_KEYS } from "@/lib/portfolio/settings-def";
import type {
  EducationRow,
  ExperienceRow,
  ProfileRow,
  ProjectRow,
  SectionRow,
  SkillRow,
} from "@/types/database";

// ============================================================
// Session
// ============================================================

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await database();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

/** Admin pages redirect to the login screen when there is no session. */
export const requireUser = cache(async (returnTo?: string): Promise<User> => {
  const user = await getCurrentUser();

  if (!user) {
    const target = returnTo ? `/login?next=${encodeURIComponent(returnTo)}` : "/login";
    redirect(target);
  }

  return user;
});

// ============================================================
// Ownership
// ============================================================

/**
 * The uuid of the account whose portfolio is published, resolved by the
 * database so anonymous visitors get the same answer as signed-in ones.
 */
export const getOwnerId = cache(async (): Promise<string | null> => {
  const supabase = await database();
  const { data } = await supabase.rpc("portfolio_owner_id");

  return data ?? null;
});

// ============================================================
// Reads (always scoped to a user id)
// ============================================================

export const getProfileById = cache(async (id: string): Promise<ProfileRow | null> => {
  const supabase = await database();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load profile: ${error.message}`);

  return data;
});

export const getSkills = cache(async (userId: string): Promise<SkillRow[]> => {
  const supabase = await database();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("user_id", userId)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(`Failed to load skills: ${error.message}`);

  return data ?? [];
});

export const getProjects = cache(async (userId: string): Promise<ProjectRow[]> => {
  const supabase = await database();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load projects: ${error.message}`);

  return data ?? [];
});

export const getSections = cache(async (userId: string): Promise<SectionRow[]> => {
  const supabase = await database();
  const { data, error } = await supabase
    .from("sections_config")
    .select("*")
    .eq("user_id", userId)
    .order("display_order", { ascending: true });

  if (error) throw new Error(`Failed to load sections: ${error.message}`);

  return data ?? [];
});

export const getExperiences = cache(async (userId: string): Promise<ExperienceRow[]> => {
  const supabase = await database();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("user_id", userId)
    .order("display_order", { ascending: true })
    .order("start_date", { ascending: false, nullsFirst: false });

  if (error) throw new Error(`Failed to load experience: ${error.message}`);

  return data ?? [];
});

export const getEducations = cache(async (userId: string): Promise<EducationRow[]> => {
  const supabase = await database();
  const { data, error } = await supabase
    .from("educations")
    .select("*")
    .eq("user_id", userId)
    .order("display_order", { ascending: true })
    .order("start_date", { ascending: false, nullsFirst: false });

  if (error) throw new Error(`Failed to load education: ${error.message}`);

  return data ?? [];
});

/** Site settings as a plain map. Missing keys are simply absent. */
export async function getSiteSettings(): Promise<Record<string, string>> {
  const supabase = await database();
  const { data, error } = await supabase
    .from("portfolio_settings")
    .select("key, value")
    .in("key", SITE_SETTING_KEYS);

  if (error) throw new Error(`Failed to load site settings: ${error.message}`);

  return Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
}

// ============================================================
// Aggregates
// ============================================================

export type PortfolioStats = {
  skills: number;
  projects: number;
  publishedProjects: number;
  experiences: number;
  educations: number;
  hiddenSections: number;
  totalSections: number;
  profileCompletion: number;
};

export async function getPortfolioStats(userId: string): Promise<PortfolioStats> {
  const [skills, projects, sections, experiences, educations, profile] = await Promise.all([
    getSkills(userId),
    getProjects(userId),
    getSections(userId),
    getExperiences(userId),
    getEducations(userId),
    getProfileById(userId),
  ]);

  const PROFILE_FIELDS = [
    "display_name",
    "headline",
    "bio",
    "avatar_url",
    "location",
    "github_url",
    "linkedin_url",
    "website_url",
  ] as const;

  const filled = PROFILE_FIELDS.filter((field) => Boolean(profile?.[field])).length;

  return {
    skills: skills.length,
    projects: projects.length,
    publishedProjects: projects.filter((project) => project.is_published).length,
    experiences: experiences.length,
    educations: educations.length,
    hiddenSections: sections.filter((section) => !section.is_visible).length,
    totalSections: sections.length,
    profileCompletion: Math.round((filled / PROFILE_FIELDS.length) * 100),
  };
}

export type PublicPortfolio = {
  owner: ProfileRow;
  settings: Record<string, string>;
  sections: SectionRow[];
  skills: SkillRow[];
  projects: ProjectRow[];
  experiences: ExperienceRow[];
  educations: EducationRow[];
};

/**
 * Everything the public page renders, in one round trip batch. Returns null
 * when no portfolio has been claimed, so the page can render an honest empty
 * state instead of invented placeholder content.
 */
export async function getPublicPortfolio(): Promise<PublicPortfolio | null> {
  const ownerId = await getOwnerId();

  if (!ownerId) return null;

  const supabase = await database();

  const [
    { data: owner },
    { data: settings },
    { data: sections },
    { data: skills },
    { data: projects },
    { data: experiences },
    { data: educations },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", ownerId).maybeSingle(),
    supabase
      .from("portfolio_settings")
      .select("key, value")
      .in("key", SITE_SETTING_KEYS),
    supabase
      .from("sections_config")
      .select("*")
      .eq("user_id", ownerId)
      .eq("is_visible", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("skills")
      .select("*")
      .eq("user_id", ownerId)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", ownerId)
      .eq("is_published", true)
      .is("deleted_at", null)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("experiences")
      .select("*")
      .eq("user_id", ownerId)
      .order("display_order", { ascending: true })
      .order("start_date", { ascending: false, nullsFirst: false }),
    supabase
      .from("educations")
      .select("*")
      .eq("user_id", ownerId)
      .order("display_order", { ascending: true })
      .order("start_date", { ascending: false, nullsFirst: false }),
  ]);

  if (!owner) return null;

  return {
    owner,
    settings: Object.fromEntries((settings ?? []).map((row) => [row.key, row.value])),
    sections: sections ?? [],
    skills: skills ?? [],
    projects: projects ?? [],
    experiences: experiences ?? [],
    educations: educations ?? [],
  };
}

// ============================================================
// Writes
// ============================================================

/**
 * Makes the signed-in account the published owner and seeds the sections and
 * settings it starts with. Safe to call repeatedly.
 */
export async function claimPortfolio(userId: string, email: string): Promise<void> {
  const supabase = await database();

  const { data: existingOwner } = await supabase.rpc("portfolio_owner_id");

  if (!existingOwner) {
    // A plain INSERT rather than an upsert: the owner row is write-once, and
    // a losing race (unique violation) just means somebody else claimed it
    // first, which is not an error.
    const { error } = await supabase
      .from("portfolio_settings")
      .insert({ key: OWNER_SETTING_KEY, value: userId });

    if (error && error.code !== "23505") {
      throw new Error(`Failed to claim the portfolio: ${error.message}`);
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    // `role` is deliberately excluded from the INSERT column grant so a user
    // cannot promote themselves, so the default applies here.
    const { error } = await supabase.from("profiles").insert({ id: userId, email });

    if (error) throw new Error(`Failed to create your profile: ${error.message}`);
  }

  const { data: sections } = await supabase
    .from("sections_config")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (!sections || sections.length === 0) {
    const { error } = await supabase.from("sections_config").insert(
      DEFAULT_SECTIONS.map((section) => ({
        user_id: userId,
        name: section.name,
        label: section.label,
        is_visible: true,
        display_order: section.display_order,
      })),
    );

    if (error) throw new Error(`Failed to seed sections: ${error.message}`);
  }
}
