// types/database.ts
// Hand-maintained mirror of supabase/migrations/*.sql.
// Keep in sync whenever a migration changes a table shape.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamps = { created_at: string; updated_at: string };

/**
 * `OptionalInsert` lists the columns the database fills in itself (defaults,
 * generated ids, trigger-populated timestamps), so they stay optional on
 * insert but required on read.
 */
type Table<Row extends Timestamps, OptionalInsert extends Partial<Row> = never> = {
  Row: Row;
  Insert: Omit<Row, keyof Timestamps | keyof OptionalInsert> &
    Partial<Pick<Row, keyof Timestamps>> &
    OptionalInsert;
  Update: Partial<Row>;
  Relationships: [];
};

export type ProfileRow = {
  id: string;
  email: string;
  role: "admin" | "viewer";
  display_name: string | null;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
};

export type PortfolioSettingRow = {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
};

export type SectionRow = {
  id: string;
  user_id: string | null;
  name: string;
  label: string | null;
  heading: string | null;
  description: string | null;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SkillRow = {
  id: string;
  user_id: string | null;
  name: string;
  category: string;
  level: string;
  years: number | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ExperienceRow = {
  id: string;
  user_id: string | null;
  company: string;
  title: string;
  location: string | null;
  employment_type: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  summary: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type EducationRow = {
  id: string;
  user_id: string | null;
  institution: string;
  degree: string | null;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  grade: string | null;
  summary: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        ProfileRow,
        Partial<
          Pick<
            ProfileRow,
            | "role"
            | "display_name"
            | "headline"
            | "bio"
            | "avatar_url"
            | "location"
            | "github_url"
            | "linkedin_url"
            | "website_url"
          >
        >
      >;
      portfolio_settings: Table<PortfolioSettingRow, Partial<Pick<PortfolioSettingRow, "id">>>;
      sections_config: Table<
        SectionRow,
        Partial<Pick<SectionRow, "id" | "user_id" | "label" | "heading" | "description">>
      >;
      projects: Table<
        ProjectRow,
        Partial<Pick<ProjectRow, "id" | "user_id" | "published_at" | "deleted_at">>
      >;
      skills: Table<SkillRow, Partial<Pick<SkillRow, "id" | "user_id">>>;
      experiences: Table<ExperienceRow, Partial<Pick<ExperienceRow, "id" | "user_id">>>;
      educations: Table<EducationRow, Partial<Pick<EducationRow, "id" | "user_id">>>;
    };
    Views: Record<never, never>;
    Functions: {
      portfolio_owner_id: { Args: Record<never, never>; Returns: string | null };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

export type TableName = keyof Database["public"]["Tables"];
export type RowOf<T extends TableName> = Database["public"]["Tables"][T]["Row"];
