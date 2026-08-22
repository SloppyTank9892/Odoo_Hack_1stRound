-- =============================================================================
-- GlobeTrotter: Admin Curation Schema Migration
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Add is_admin to profiles
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- 2. Create curated_destinations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.curated_destinations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  trip_count  integer NOT NULL DEFAULT 0,
  growth      text NOT NULL,
  rank        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 3. Create curated_activities
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.curated_activities (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  city        text NOT NULL,
  views       integer NOT NULL DEFAULT 0,
  category    text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 4. Enable RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.curated_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_activities ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 5. RLS Policies
-- ---------------------------------------------------------------------------

-- curated_destinations
DROP POLICY IF EXISTS "Curated destinations are viewable by all" ON public.curated_destinations;
CREATE POLICY "Curated destinations are viewable by all"
  ON public.curated_destinations FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Only admins can modify curated destinations" ON public.curated_destinations;
CREATE POLICY "Only admins can modify curated destinations"
  ON public.curated_destinations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- curated_activities
DROP POLICY IF EXISTS "Curated activities are viewable by all" ON public.curated_activities;
CREATE POLICY "Curated activities are viewable by all"
  ON public.curated_activities FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Only admins can modify curated activities" ON public.curated_activities;
CREATE POLICY "Only admins can modify curated activities"
  ON public.curated_activities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  );
