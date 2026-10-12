-- ============================================================
-- Admin portfolio storage + ownership based RLS
-- ============================================================
-- Run AFTER:
--   00000000000000_init_schema.sql
--   20260101000000_profile_fields.sql
--
-- Adds:
--   1. skills
--   2. experiences
--   3. educations
--   4. extra columns on projects / sections_config
--   5. public.portfolio_owner_id() resolver
--   6. RLS policies keyed on row ownership instead of the admin role
--
-- The portfolio has a single public owner, recorded in
-- portfolio_settings under the key 'owner_id'. Anonymous visitors may
-- read only that user's published rows.
-- ============================================================


-- ============================================================
-- 0. REMOVE THE LEGACY ADMIN POLICIES FIRST
-- ============================================================
-- 00000000000000_init_schema.sql defines "Admins can view all
-- profiles" with an inline EXISTS over public.profiles. A policy
-- that reads its own table makes Postgres raise
--   "infinite recursion detected in policy for relation profiles"
-- for every authenticated request, so it has to go before anything
-- else here runs.

DROP POLICY IF EXISTS "Anyone can view published projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can create projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

DROP POLICY IF EXISTS "Anyone can view visible sections" ON public.sections_config;
DROP POLICY IF EXISTS "Admins can manage sections" ON public.sections_config;

DROP POLICY IF EXISTS "Anyone can view portfolio settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Admins can manage portfolio settings" ON public.portfolio_settings;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;


-- ============================================================
-- 1. SKILLS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Other',
    level TEXT NOT NULL DEFAULT 'Intermediate',
    years NUMERIC(4, 1),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_user_order
    ON public.skills(user_id, display_order);


-- ============================================================
-- 2. EXPERIENCES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT,
    employment_type TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    summary TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experiences_user_order
    ON public.experiences(user_id, display_order);


-- ============================================================
-- 3. EDUCATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT,
    field_of_study TEXT,
    start_date DATE,
    end_date DATE,
    grade TEXT,
    summary TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_educations_user_order
    ON public.educations(user_id, display_order);


-- ============================================================
-- 4. EXTRA COLUMNS ON EXISTING TABLES
-- ============================================================

-- `name` on sections_config is the stable section key (hero, about, ...).
-- The unique constraint moves from name -> (user_id, name) so the same
-- section can exist for different users.
ALTER TABLE public.sections_config
    DROP CONSTRAINT IF EXISTS sections_config_name_key;

ALTER TABLE public.sections_config
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS label TEXT,
    ADD COLUMN IF NOT EXISTS heading TEXT,
    ADD COLUMN IF NOT EXISTS description TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sections_config_user_name
    ON public.sections_config(user_id, name);

ALTER TABLE public.projects
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_projects_user_order
    ON public.projects(user_id, display_order);

-- Existing rows predate ownership, so they are unowned until claimed.
CREATE INDEX IF NOT EXISTS idx_projects_user
    ON public.projects(user_id);


-- ============================================================
-- 5. OWNER RESOLVER
-- ============================================================
-- SECURITY DEFINER so it can read portfolio_settings without tripping
-- that table's own RLS policies (which would recurse through this
-- function).

CREATE OR REPLACE FUNCTION public.portfolio_owner_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT NULLIF(value, '')::UUID
    FROM public.portfolio_settings
    WHERE key = 'owner_id'
    LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.portfolio_owner_id() TO anon, authenticated;


-- ============================================================
-- 6. UPDATED_AT TRIGGERS FOR NEW TABLES
-- ============================================================

DROP TRIGGER IF EXISTS skills_updated_at ON public.skills;
CREATE TRIGGER skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS experiences_updated_at ON public.experiences;
CREATE TRIGGER experiences_updated_at
BEFORE UPDATE ON public.experiences
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS educations_updated_at ON public.educations;
CREATE TRIGGER educations_updated_at
BEFORE UPDATE ON public.educations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ============================================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 8. REPLACE ADMIN-ROLE POLICIES WITH OWNERSHIP POLICIES
-- ============================================================

-- projects
DROP POLICY IF EXISTS "Anyone can view published projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can create projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

CREATE POLICY "Anyone can view the owner's published projects"
    ON public.projects FOR SELECT TO anon, authenticated
    USING (
        is_published = TRUE
        AND deleted_at IS NULL
        AND user_id = public.portfolio_owner_id()
    );

CREATE POLICY "Users can view their own projects"
    ON public.projects FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own projects"
    ON public.projects FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own projects"
    ON public.projects FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own projects"
    ON public.projects FOR DELETE TO authenticated
    USING (user_id = auth.uid());


-- sections_config
DROP POLICY IF EXISTS "Anyone can view visible sections" ON public.sections_config;
DROP POLICY IF EXISTS "Admins can manage sections" ON public.sections_config;

CREATE POLICY "Anyone can view the owner's visible sections"
    ON public.sections_config FOR SELECT TO anon, authenticated
    USING (
        is_visible = TRUE
        AND user_id = public.portfolio_owner_id()
    );

CREATE POLICY "Users can view their own sections"
    ON public.sections_config FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own sections"
    ON public.sections_config FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own sections"
    ON public.sections_config FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own sections"
    ON public.sections_config FOR DELETE TO authenticated
    USING (user_id = auth.uid());


-- portfolio_settings: site-wide settings stay global, but 'owner_id'
-- is only ever readable by signed-in users.
DROP POLICY IF EXISTS "Anyone can view portfolio settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Admins can manage portfolio settings" ON public.portfolio_settings;

CREATE POLICY "Anyone can view public portfolio settings"
    ON public.portfolio_settings FOR SELECT TO anon, authenticated
    USING (key <> 'owner_id');

CREATE POLICY "Users can view owner_id"
    ON public.portfolio_settings FOR SELECT TO authenticated
    USING (key = 'owner_id');

CREATE POLICY "Users can manage portfolio settings"
    ON public.portfolio_settings FOR ALL TO authenticated
    USING (key <> 'owner_id')
    WITH CHECK (key <> 'owner_id');


-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Anyone can view the owner's profile"
    ON public.profiles FOR SELECT TO anon, authenticated
    USING (id = public.portfolio_owner_id());

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT TO authenticated
    WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());


-- skills
DROP POLICY IF EXISTS "Anyone can view skills" ON public.skills;
DROP POLICY IF EXISTS "Users can view own skills" ON public.skills;
DROP POLICY IF EXISTS "Users can create own skills" ON public.skills;
DROP POLICY IF EXISTS "Users can update own skills" ON public.skills;
DROP POLICY IF EXISTS "Users can delete own skills" ON public.skills;

CREATE POLICY "Anyone can view the owner's skills"
    ON public.skills FOR SELECT TO anon, authenticated
    USING (user_id = public.portfolio_owner_id());

CREATE POLICY "Users can view their own skills"
    ON public.skills FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own skills"
    ON public.skills FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own skills"
    ON public.skills FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own skills"
    ON public.skills FOR DELETE TO authenticated
    USING (user_id = auth.uid());


-- experiences
DROP POLICY IF EXISTS "Anyone can view experiences" ON public.experiences;
DROP POLICY IF EXISTS "Users can view own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Users can create own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Users can update own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Users can delete own experiences" ON public.experiences;

CREATE POLICY "Anyone can view the owner's experiences"
    ON public.experiences FOR SELECT TO anon, authenticated
    USING (user_id = public.portfolio_owner_id());

CREATE POLICY "Users can view their own experiences"
    ON public.experiences FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own experiences"
    ON public.experiences FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own experiences"
    ON public.experiences FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own experiences"
    ON public.experiences FOR DELETE TO authenticated
    USING (user_id = auth.uid());


-- educations
DROP POLICY IF EXISTS "Anyone can view educations" ON public.educations;
DROP POLICY IF EXISTS "Users can view own educations" ON public.educations;
DROP POLICY IF EXISTS "Users can create own educations" ON public.educations;
DROP POLICY IF EXISTS "Users can update own educations" ON public.educations;
DROP POLICY IF EXISTS "Users can delete own educations" ON public.educations;

CREATE POLICY "Anyone can view the owner's educations"
    ON public.educations FOR SELECT TO anon, authenticated
    USING (user_id = public.portfolio_owner_id());

CREATE POLICY "Users can view their own educations"
    ON public.educations FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own educations"
    ON public.educations FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own educations"
    ON public.educations FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own educations"
    ON public.educations FOR DELETE TO authenticated
    USING (user_id = auth.uid());


-- ============================================================
-- 9. COLUMN-LEVEL GRANTS ON PROFILES
-- ============================================================
-- Supabase grants ALL to anon/authenticated by default. profiles is the
-- one table holding identity data, so writes are restricted to the
-- signed-in user and role/email stay out of reach.

REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon;
GRANT SELECT ON public.profiles TO anon;


-- ============================================================
-- DONE
-- ============================================================
