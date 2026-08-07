-- ============================================================
-- Migration: Enable Row Level Security (RLS) on all tables
-- ============================================================
-- 
-- CONTEXT:
-- This backend uses Prisma + Express with custom JWT auth.
-- It does NOT use Supabase Auth (auth.uid()). All application
-- traffic comes via DATABASE_URL (role: postgres/supabase owner)
-- which BYPASSES RLS by default. RLS is enabled here solely to
-- block direct PostgREST/REST API access via the anon/public key.
--
-- STRATEGY:
-- 1. Enable RLS on all application tables
-- 2. Add a DENY-ALL default (no policy = no access for restricted roles)
-- 3. The postgres connection (used by Prisma) bypasses RLS automatically
--
-- TABLES:
-- users, profiles, organization_members, announcements, events, gallery
-- ============================================================

-- Step 1: Enable RLS on all application tables (including Prisma internal table)
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "announcements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gallery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Step 2: Revoke all direct access from public/anon PostgREST roles
-- This closes the gap where anon key holders could directly query tables
REVOKE ALL ON TABLE "users" FROM anon, authenticated;
REVOKE ALL ON TABLE "profiles" FROM anon, authenticated;
REVOKE ALL ON TABLE "organization_members" FROM anon, authenticated;
REVOKE ALL ON TABLE "announcements" FROM anon, authenticated;
REVOKE ALL ON TABLE "events" FROM anon, authenticated;
REVOKE ALL ON TABLE "gallery" FROM anon, authenticated;
REVOKE ALL ON TABLE "_prisma_migrations" FROM anon, authenticated;

-- Step 3: No RLS policies are created intentionally.
-- With RLS enabled and NO policies defined, the default is DENY ALL
-- for any role that is subject to RLS (anon, authenticated, etc.).
-- The postgres/owner role used by Prisma is EXEMPT from RLS and
-- retains full access, so the Express API continues to function normally.
--
-- NOTE: If you ever add Supabase Auth in the future and want to expose
-- specific data via PostgREST, add explicit policies here, e.g.:
--
-- CREATE POLICY "Allow public read on profiles"
--   ON "profiles" FOR SELECT TO anon USING (true);
