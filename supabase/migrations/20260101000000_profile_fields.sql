-- ============================================================
-- Portfolio profile fields + profiles RLS
-- ============================================================
-- Adds editable portfolio columns to public.profiles, creates a
-- profiles row automatically on signup, and grants users write
-- access to their OWN row only.
--
-- role is deliberately excluded from the UPDATE/INSERT column
-- grants below so a user cannot promote themselves to admin.
--
-- Run this file after 00000000000000_init_schema.sql
-- ============================================================


-- ============================================================
-- 1. PORTFOLIO PROFILE COLUMNS
-- ============================================================

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS display_name TEXT,
    ADD COLUMN IF NOT EXISTS headline TEXT,
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS location TEXT,
    ADD COLUMN IF NOT EXISTS github_url TEXT,
    ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
    ADD COLUMN IF NOT EXISTS website_url TEXT;


-- ============================================================
-- 2. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data ->> 'name',
            NEW.raw_user_meta_data ->> 'full_name',
            split_part(NEW.email, '@', 1)
        ),
        'viewer'
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- Backfill a profile row for any account created before this trigger.
INSERT INTO public.profiles (id, email, display_name, role)
SELECT
    u.id,
    u.email,
    COALESCE(
        u.raw_user_meta_data ->> 'name',
        u.raw_user_meta_data ->> 'full_name',
        split_part(u.email, '@', 1)
    ),
    'viewer'
FROM auth.users AS u
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 3. PROFILES POLICIES
-- ============================================================

-- Users can insert their own profile (used to self-heal a missing row).
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());


-- Users can update their own profile.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());


-- ============================================================
-- 4. COLUMN-LEVEL GRANTS
-- ============================================================
-- RLS limits WHICH ROWS a user can touch. These grants limit WHICH
-- COLUMNS they can touch, so `role` cannot be self-escalated.

REVOKE UPDATE ON public.profiles FROM authenticated;

GRANT UPDATE (display_name, headline, bio, avatar_url, location, github_url, linkedin_url, website_url)
ON public.profiles
TO authenticated;


REVOKE INSERT ON public.profiles FROM authenticated;

GRANT INSERT (id, email, display_name, headline, bio, avatar_url, location, github_url, linkedin_url, website_url)
ON public.profiles
TO authenticated;


-- ============================================================
-- DONE
-- ============================================================