-- ============================================================
-- Allow an account to claim the published portfolio
-- ============================================================
-- 20260201000000_admin_portfolio.sql installs
--
--   "Users can manage portfolio settings" FOR ALL
--     USING (key <> 'owner_id') WITH CHECK (key <> 'owner_id')
--
-- which deliberately locks the owner_id row down. That also blocks the
-- very INSERT that claims ownership in the first place, so the admin
-- layout can never seed a portfolio.
--
-- This migration adds a narrow INSERT-only policy for that one key.
-- "First write wins" is enforced in public.claimPortfolio(), which
-- checks for an existing owner before writing; UPDATE and DELETE on
-- owner_id stay blocked, so nobody can steal or unpublish a portfolio
-- through the API.
--
-- Run AFTER 20260201000000_admin_portfolio.sql
-- ============================================================

DROP POLICY IF EXISTS "Users can manage portfolio settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Users can claim the portfolio" ON public.portfolio_settings;

-- Every setting except owner_id: full read/write for signed-in users.
CREATE POLICY "Users can manage portfolio settings"
ON public.portfolio_settings
FOR ALL
TO authenticated
USING (key <> 'owner_id')
WITH CHECK (key <> 'owner_id');

-- owner_id: insertable by a signed-in account, but only ever once.
CREATE POLICY "Users can claim the portfolio"
ON public.portfolio_settings
FOR INSERT
TO authenticated
WITH CHECK (key = 'owner_id');
