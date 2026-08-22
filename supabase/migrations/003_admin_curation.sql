-- =============================================================================
-- GlobeTrotter: Admin Curation Schema Migration & Initial Seed
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

-- ---------------------------------------------------------------------------
-- 6. Initial Seed Data
-- ---------------------------------------------------------------------------

-- Seed Curated Destinations
INSERT INTO public.curated_destinations (name, trip_count, growth, rank)
SELECT * FROM (VALUES
  ('Jaipur, India', 3420, '+28%', '#1'),
  ('Udaipur, India', 2890, '+24%', '#2'),
  ('Tokyo, Japan', 5120, '+35%', '#3'),
  ('Kyoto, Japan', 4890, '+19%', '#4'),
  ('Rome, Italy', 4150, '+15%', '#5'),
  ('Positano, Italy', 2310, '+31%', '#6'),
  ('Bali, Indonesia', 3820, '+22%', '#7'),
  ('Zermatt, Switzerland', 1980, '+18%', '#8')
) AS v(name, trip_count, growth, rank)
WHERE NOT EXISTS (SELECT 1 FROM public.curated_destinations LIMIT 1);

-- Seed Curated Activities
INSERT INTO public.curated_activities (name, city, views, category)
SELECT * FROM (VALUES
  ('Amber Fort & Sheesh Mahal Exploration', 'Jaipur', 3420, 'culture'),
  ('Shibuya Crossing & Hidden Izakaya Crawl', 'Tokyo', 5120, 'food'),
  ('Fushimi Inari 10,000 Torii Gates Dawn Hike', 'Kyoto', 4890, 'nature'),
  ('Old Delhi Chandni Chowk Midnight Food Trail', 'Delhi', 4200, 'food'),
  ('Udaipur City Palace Museum & Crystal Gallery', 'Udaipur', 3100, 'culture'),
  ('Chokhi Dhani Rajasthani Village Experience', 'Jaipur', 2890, 'food'),
  ('Private Sunset Boat Charter on Lake Pichola', 'Udaipur', 2150, 'sightseeing'),
  ('Hawa Mahal & Old Bazaar Guided Walk', 'Jaipur', 1950, 'sightseeing')
) AS v(name, city, views, category)
WHERE NOT EXISTS (SELECT 1 FROM public.curated_activities LIMIT 1);

