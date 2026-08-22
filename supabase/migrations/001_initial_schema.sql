-- =============================================================================
-- GlobeTrotter: Initial Schema Migration
-- =============================================================================
-- Run this in Supabase SQL Editor.
-- Idempotent: uses IF NOT EXISTS, CREATE OR REPLACE, DROP POLICY IF EXISTS.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

-- profiles: extends auth.users, created automatically via trigger
CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name      text,
  last_name       text,
  phone_number    text,
  city            text,
  country         text,
  bio             text,
  avatar_url      text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- trips
CREATE TABLE IF NOT EXISTS public.trips (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           text NOT NULL,
  description     text,
  cover_image_url text,
  start_date      date,
  end_date        date,
  total_budget    numeric(12, 2),
  is_public       boolean NOT NULL DEFAULT false,
  status          text NOT NULL DEFAULT 'upcoming'
                    CHECK (status IN ('ongoing', 'upcoming', 'completed')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- trip_stops
CREATE TABLE IF NOT EXISTS public.trip_stops (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id          uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  city_name        text NOT NULL,
  country          text NOT NULL,
  start_date       date,
  end_date         date,
  allocated_budget numeric(12, 2),
  order_index      integer NOT NULL DEFAULT 0
);

-- activities
CREATE TABLE IF NOT EXISTS public.activities (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_id     uuid NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
  day_number  integer NOT NULL DEFAULT 1,
  title       text NOT NULL,
  category    text,
  cost        numeric(10, 2) NOT NULL DEFAULT 0,
  order_index integer NOT NULL DEFAULT 0
);

-- community_posts
CREATE TABLE IF NOT EXISTS public.community_posts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trip_id    uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  title      text NOT NULL,
  content    text NOT NULL,
  rating     integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. Utility: updated_at trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Attach to profiles
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Auto-Profile Trigger: creates a profile row on new auth user signup
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4. Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_trips_user_id         ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_is_public        ON public.trips(is_public);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id     ON public.trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_stop_id     ON public.activities(stop_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_trip_id ON public.community_posts(trip_id);

-- ---------------------------------------------------------------------------
-- 5. Row-Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- ---- profiles ----
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ---- trips ----
DROP POLICY IF EXISTS "Public trips are viewable by all" ON public.trips;
CREATE POLICY "Public trips are viewable by all"
  ON public.trips FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

DROP POLICY IF EXISTS "Users can view their own trips" ON public.trips;
CREATE POLICY "Users can view their own trips"
  ON public.trips FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own trips" ON public.trips;
CREATE POLICY "Users can insert their own trips"
  ON public.trips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own trips" ON public.trips;
CREATE POLICY "Users can update their own trips"
  ON public.trips FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own trips" ON public.trips;
CREATE POLICY "Users can delete their own trips"
  ON public.trips FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ---- trip_stops ----
DROP POLICY IF EXISTS "Stops are viewable if trip is public or user owns trip" ON public.trip_stops;
DROP POLICY IF EXISTS "Public trip stops are viewable by all" ON public.trip_stops;
DROP POLICY IF EXISTS "Users can view stops for their trips" ON public.trip_stops;
CREATE POLICY "Stops are viewable if trip is public or user owns trip"
  ON public.trip_stops FOR SELECT
  TO anon, authenticated
  USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE is_public = true OR user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert stops for their trips" ON public.trip_stops;
CREATE POLICY "Users can insert stops for their trips"
  ON public.trip_stops FOR INSERT
  TO authenticated
  WITH CHECK (
    trip_id IN (
      SELECT id FROM public.trips WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update stops for their trips" ON public.trip_stops;
CREATE POLICY "Users can update stops for their trips"
  ON public.trip_stops FOR UPDATE
  TO authenticated
  USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete their own stops" ON public.trip_stops;
DROP POLICY IF EXISTS "Users can delete stops for their trips" ON public.trip_stops;
CREATE POLICY "Users can delete their own stops"
  ON public.trip_stops FOR DELETE
  TO authenticated
  USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE user_id = auth.uid()
    )
  );

-- ---- activities ----
DROP POLICY IF EXISTS "Activities are viewable if trip is public or user owns trip" ON public.activities;
DROP POLICY IF EXISTS "Public activities are viewable by all" ON public.activities;
DROP POLICY IF EXISTS "Users can view activities for their trips" ON public.activities;
CREATE POLICY "Activities are viewable if trip is public or user owns trip"
  ON public.activities FOR SELECT
  TO anon, authenticated
  USING (
    stop_id IN (
      SELECT ts.id FROM public.trip_stops ts
      JOIN public.trips t ON t.id = ts.trip_id
      WHERE t.is_public = true OR t.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert activities for their trips" ON public.activities;
CREATE POLICY "Users can insert activities for their trips"
  ON public.activities FOR INSERT
  TO authenticated
  WITH CHECK (
    stop_id IN (
      SELECT ts.id FROM public.trip_stops ts
      JOIN public.trips t ON t.id = ts.trip_id
      WHERE t.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update activities for their trips" ON public.activities;
CREATE POLICY "Users can update activities for their trips"
  ON public.activities FOR UPDATE
  TO authenticated
  USING (
    stop_id IN (
      SELECT ts.id FROM public.trip_stops ts
      JOIN public.trips t ON t.id = ts.trip_id
      WHERE t.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete activities for their trips" ON public.activities;
CREATE POLICY "Users can delete activities for their trips"
  ON public.activities FOR DELETE
  TO authenticated
  USING (
    stop_id IN (
      SELECT ts.id FROM public.trip_stops ts
      JOIN public.trips t ON t.id = ts.trip_id
      WHERE t.user_id = auth.uid()
    )
  );

-- ---- community_posts ----
DROP POLICY IF EXISTS "Public posts are viewable by all" ON public.community_posts;
CREATE POLICY "Public posts are viewable by all"
  ON public.community_posts FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own posts" ON public.community_posts;
CREATE POLICY "Users can insert their own posts"
  ON public.community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.community_posts;
CREATE POLICY "Users can update their own posts"
  ON public.community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.community_posts;
CREATE POLICY "Users can delete their own posts"
  ON public.community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
