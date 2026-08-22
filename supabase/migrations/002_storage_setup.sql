-- =============================================================================
-- GlobeTrotter: Storage Bucket Setup & RLS Policies
-- =============================================================================
-- Run this AFTER 001_initial_schema.sql in Supabase SQL Editor.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Create Buckets
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars',     'avatars',     true),
  ('trip-covers', 'trip-covers', true)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Storage RLS Policies — avatars bucket
-- ---------------------------------------------------------------------------

-- Public SELECT (anyone can view avatar images via CDN URL)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated INSERT (user can only upload to their own folder)
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated UPDATE (user can only overwrite files in their folder)
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated DELETE
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- 3. Storage RLS Policies — trip-covers bucket
-- ---------------------------------------------------------------------------

-- Public SELECT
DROP POLICY IF EXISTS "Trip cover images are publicly accessible" ON storage.objects;
CREATE POLICY "Trip cover images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'trip-covers');

-- Authenticated INSERT (user-scoped folder)
DROP POLICY IF EXISTS "Users can upload their own trip covers" ON storage.objects;
CREATE POLICY "Users can upload their own trip covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'trip-covers' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated UPDATE
DROP POLICY IF EXISTS "Users can update their own trip covers" ON storage.objects;
CREATE POLICY "Users can update their own trip covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'trip-covers' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated DELETE
DROP POLICY IF EXISTS "Users can delete their own trip covers" ON storage.objects;
CREATE POLICY "Users can delete their own trip covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'trip-covers' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
