-- ============================================================
-- Diagnose (and repair) the portfolio schema
-- ============================================================
-- Run each block in Supabase Dashboard -> SQL Editor and read
-- the output before running the next one.
-- ============================================================


-- ============================================================
-- 1. Which schema do the tables actually live in?
-- ============================================================

SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name IN (
    'profiles', 'projects', 'sections_config', 'portfolio_settings',
    'skills', 'experiences', 'educations'
)
ORDER BY table_schema, table_name;

-- EXPECTED: seven rows, all table_schema = 'public'.
-- If they say 'api', your project exposes the api schema instead
-- of public and every migration needs retargeting.


-- ============================================================
-- 2. Which schema does PostgREST actually expose?
-- ============================================================

SHOW pgrst.db_schemas;

-- EXPECTED: public  (or "public, graphql_public")
-- If this says something else, that is why every REST call 404s
-- with PGRST205 "Could not find the table 'api.profiles'".


-- ============================================================
-- 3. Which RLS policies are currently on profiles?
-- ============================================================

SELECT policyname, cmd, roles, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- "Admins can view all profiles" is the recursive one: its qual
-- contains an EXISTS over public.profiles.


-- ============================================================
-- 4. REPAIR: drop the recursive policy
-- ============================================================
-- This alone unblocks every authenticated request. Safe to run
-- more than once. If block 3 does not list that policy, the
-- database is not the one you think it is - check the output of
-- blocks 1 and 2 first.

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;


-- ============================================================
-- 5. Tell PostgREST to re-read the schema
-- ============================================================
-- PostgREST caches the schema and does not always notice DDL run
-- from the SQL editor. Without this, correctly created tables stay
-- invisible and every query 404s with PGRST205.

NOTIFY pgrst, 'reload schema';

-- If that does not work: Project Settings -> API -> Restart.


-- ============================================================
-- 6. Verify PostgREST can now see the tables
-- ============================================================
-- In the Table Editor you should see profiles, projects,
-- sections_config, portfolio_settings, skills, experiences and
-- educations under the public schema.
-- ============================================================
