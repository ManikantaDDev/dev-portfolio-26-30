 
```sql
-- ============================================================
-- Initial Portfolio Database Schema
-- ============================================================
-- Creates:
--   1. profiles
--   2. portfolio_settings
--   3. sections_config
--   4. projects
--
-- Run this entire file in:
-- Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================


-- ============================================================
-- 1. PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'viewer'
        CHECK (role IN ('admin', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 2. PORTFOLIO SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.portfolio_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 3. SECTIONS CONFIG
-- ============================================================

CREATE TABLE IF NOT EXISTS public.sections_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sections_config_display_order
ON public.sections_config(display_order);


-- ============================================================
-- 4. PROJECTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    live_url TEXT,
    github_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_projects_published
ON public.projects(is_published);

CREATE INDEX IF NOT EXISTS idx_projects_deleted
ON public.projects(deleted_at);


-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS profiles_updated_at
ON public.profiles;

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();


DROP TRIGGER IF EXISTS portfolio_settings_updated_at
ON public.portfolio_settings;

CREATE TRIGGER portfolio_settings_updated_at
BEFORE UPDATE ON public.portfolio_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();


DROP TRIGGER IF EXISTS sections_config_updated_at
ON public.sections_config;

CREATE TRIGGER sections_config_updated_at
BEFORE UPDATE ON public.sections_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();


DROP TRIGGER IF EXISTS projects_updated_at
ON public.projects;

CREATE TRIGGER projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();


-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- PROJECT POLICIES
-- ============================================================

-- Anyone can view published projects.
CREATE POLICY "Anyone can view published projects"
ON public.projects
FOR SELECT
TO anon, authenticated
USING (
    is_published = TRUE
    AND deleted_at IS NULL
);


-- Authenticated admins can view all projects.
CREATE POLICY "Admins can view all projects"
ON public.projects
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);


-- Only admins can create projects.
CREATE POLICY "Admins can create projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);


-- Only admins can update projects.
CREATE POLICY "Admins can update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);


-- Only admins can delete projects.
CREATE POLICY "Admins can delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);


-- ============================================================
-- SECTIONS CONFIG POLICIES
-- ============================================================

-- Public visitors can see visible sections.
CREATE POLICY "Anyone can view visible sections"
ON public.sections_config
FOR SELECT
TO anon, authenticated
USING (is_visible = TRUE);


-- Admins can manage section configuration.
CREATE POLICY "Admins can manage sections"
ON public.sections_config
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);


-- ============================================================
-- PORTFOLIO SETTINGS POLICIES
-- ============================================================

-- Public visitors can read portfolio settings.
CREATE POLICY "Anyone can view portfolio settings"
ON public.portfolio_settings
FOR SELECT
TO anon, authenticated
USING (TRUE);


-- Only admins can modify settings.
CREATE POLICY "Admins can manage portfolio settings"
ON public.portfolio_settings
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);


-- ============================================================
-- PROFILES POLICIES
-- ============================================================

-- Users can view their own profile.
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());


-- Admins can view all profiles.
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles AS p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
);


-- ============================================================
-- DONE
-- ============================================================
```
