-- ==============================================================================
-- GLOBETROTTER SUPABASE POSTGRESQL CATALOG SCHEMA & SEED SCRIPT
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Create Destinations Catalog Table
CREATE TABLE IF NOT EXISTS public.destinations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    region TEXT NOT NULL,
    image TEXT NOT NULL,
    cost_index TEXT NOT NULL DEFAULT '$$',
    popularity INTEGER NOT NULL DEFAULT 90,
    tags TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL DEFAULT '',
    avg_daily_cost NUMERIC NOT NULL DEFAULT 4000,
    suggested_days INTEGER NOT NULL DEFAULT 3,
    lat DOUBLE PRECISION NOT NULL DEFAULT 26.9124,
    lng DOUBLE PRECISION NOT NULL DEFAULT 75.7873,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Catalog Activities Discovery Table
CREATE TABLE IF NOT EXISTS public.catalog_activities (
    id TEXT PRIMARY KEY,
    city_name TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'culture',
    cost NUMERIC NOT NULL DEFAULT 0,
    duration_minutes INTEGER NOT NULL DEFAULT 120,
    rating NUMERIC NOT NULL DEFAULT 4.8,
    review_count INTEGER NOT NULL DEFAULT 100,
    image TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    best_time_of_day TEXT NOT NULL DEFAULT 'Morning',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_activities ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read destinations" ON public.destinations;
CREATE POLICY "Allow public read destinations" ON public.destinations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read catalog_activities" ON public.catalog_activities;
CREATE POLICY "Allow public read catalog_activities" ON public.catalog_activities FOR SELECT USING (true);

-- Allow public / authenticated write & update access
DROP POLICY IF EXISTS "Allow public insert destinations" ON public.destinations;
CREATE POLICY "Allow public insert destinations" ON public.destinations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update destinations" ON public.destinations;
CREATE POLICY "Allow public update destinations" ON public.destinations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete destinations" ON public.destinations;
CREATE POLICY "Allow public delete destinations" ON public.destinations FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public insert catalog_activities" ON public.catalog_activities;
CREATE POLICY "Allow public insert catalog_activities" ON public.catalog_activities FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update catalog_activities" ON public.catalog_activities;
CREATE POLICY "Allow public update catalog_activities" ON public.catalog_activities FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete catalog_activities" ON public.catalog_activities;
CREATE POLICY "Allow public delete catalog_activities" ON public.catalog_activities FOR DELETE USING (true);

-- ==============================================================================
-- INITIAL SEED DATA (Curated Destinations & Activities Catalog)
-- ==============================================================================

INSERT INTO public.destinations (id, name, country, region, image, cost_index, popularity, tags, description, avg_daily_cost, suggested_days, lat, lng)
VALUES
    ('jaipur', 'Jaipur', 'India', 'Rajasthan', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', '$$', 95, ARRAY['Heritage', 'Architecture', 'Palaces', 'Bazaars', 'Culture'], 'The pink-hued gem of Rajasthan boasting astronomical observatories, hilltop forts, and intricate palaces.', 3500, 3, 26.9124, 75.7873),
    ('udaipur', 'Udaipur', 'India', 'Rajasthan', 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80', '$$$', 96, ARRAY['Lakes', 'Romance', 'Heritage', 'Sunsets', 'Fine Dining'], 'Serene marble palaces floating on shimmering lakes against the backdrop of rolling Aravalli mountains.', 4500, 3, 24.5854, 73.7125),
    ('tokyo', 'Tokyo', 'Japan', 'Kanto', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80', '$$$$', 99, ARRAY['Metropolis', 'Food', 'Technology', 'Temples', 'Nightlife'], 'A neon-lit tapestry of futuristic skyscrapers, tranquil Shinto shrines, and world-leading gastronomy.', 9500, 4, 35.6762, 139.6503),
    ('kyoto', 'Kyoto', 'Japan', 'Kansai', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', '$$$', 97, ARRAY['Zen Gardens', 'Bamboo', 'Geisha', 'Tradition', 'Tea Ceremony'], 'Over a thousand years of imperial history captured in golden pavilions, vermilion torii gates, and bamboo groves.', 8200, 3, 35.0116, 135.7681),
    ('rome', 'Rome', 'Italy', 'Lazio', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', '$$$$', 98, ARRAY['Antiquity', 'Art', 'Pasta', 'Architecture', 'Piazzas'], 'An open-air museum where ancient triumphal arches and Baroque fountains anchor lively sidewalk cafe culture.', 11000, 4, 41.9028, 12.4964),
    ('positano', 'Positano', 'Italy', 'Campania', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80', '$$$$', 94, ARRAY['Coastline', 'Cliffside', 'Boating', 'Luxury', 'Seafood'], 'Cascading pastel villas clinging to cliff faces above the azure waters of the Amalfi Coast.', 14500, 3, 40.6281, 14.4850),
    ('bali', 'Bali (Ubud & Canggu)', 'Indonesia', 'Southeast Asia', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', '$$', 96, ARRAY['Rice Terraces', 'Wellness', 'Surfing', 'Temples', 'Nature'], 'Tropical paradise combining emerald rice terraces, cliffside water temples, and vibrant coastal cafe life.', 4200, 5, -8.5069, 115.2625),
    ('zermatt', 'Zermatt & Matterhorn', 'Switzerland', 'Valais', 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80', '$$$$', 93, ARRAY['Alps', 'Matterhorn', 'Hiking', 'Skiing', 'Scenic Trains'], 'Car-free Alpine sanctuary beneath the dramatic pyramid peak of the world-famous Matterhorn.', 16000, 3, 45.9765, 7.7491)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    country = EXCLUDED.country,
    region = EXCLUDED.region,
    image = EXCLUDED.image,
    cost_index = EXCLUDED.cost_index,
    popularity = EXCLUDED.popularity,
    tags = EXCLUDED.tags,
    description = EXCLUDED.description,
    avg_daily_cost = EXCLUDED.avg_daily_cost,
    suggested_days = EXCLUDED.suggested_days,
    lat = EXCLUDED.lat,
    lng = EXCLUDED.lng;

INSERT INTO public.catalog_activities (id, city_name, name, description, category, cost, duration_minutes, rating, review_count, image, tags, best_time_of_day)
VALUES
    ('act-jpr-1', 'Jaipur', 'Amber Fort & Sheesh Mahal Exploration', 'Ascend the royal ramparts of Amer, marveling at the mirror-inlaid palace ceilings and hilltop battlements.', 'culture', 800, 180, 4.9, 3420, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80', ARRAY['Must See', 'Heritage', 'Photography'], 'Morning'),
    ('act-jpr-2', 'Jaipur', 'Chokhi Dhani Rajasthani Village Experience', 'Immersive traditional evening featuring Kalbelia dancers, camel rides, puppet shows, and royal thali dinner.', 'food', 1600, 240, 4.8, 2890, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', ARRAY['Culinary', 'Folklore', 'Evening'], 'Evening'),
    ('act-jpr-3', 'Jaipur', 'Hawa Mahal & Old Bazaar Guided Walk', 'Decode the architectural secrets of the Palace of Winds and hunt for hand-block printed textiles.', 'sightseeing', 450, 120, 4.7, 1950, 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=600&q=80', ARRAY['Architecture', 'Walking', 'Shopping'], 'Afternoon'),
    ('act-jpr-4', 'Jaipur', 'Sunrise Hot Air Balloon over Amer Citadel', 'Float peacefully over the Aravalli peaks, desert hamlets, and royal fortifications as the sun breaks.', 'adventure', 8500, 150, 4.9, 680, 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80', ARRAY['Thrills', 'Sunrise', 'Premium'], 'Morning'),
    ('act-jpr-5', 'Jaipur', 'Nahargarh Fort Sunset & Stepwell Stroll', 'Watch the sun dip behind the Pink City skyline from the highest fortification ridge.', 'nature', 350, 120, 4.8, 1420, 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80', ARRAY['Sunset', 'Views', 'Stepwell'], 'Evening'),
    ('act-uda-1', 'Udaipur', 'Private Sunset Boat Charter on Lake Pichola', 'Sail past the Jag Mandir and Lake Palace with refreshments as dusk turns the water gold.', 'sightseeing', 1500, 90, 4.9, 2150, 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80', ARRAY['Boating', 'Romance', 'Sunset'], 'Evening'),
    ('act-uda-2', 'Udaipur', 'Udaipur City Palace Museum & Crystal Gallery', 'Discover ornate Mewar glass mosaics, courtyards, and centuries of royal armory.', 'culture', 950, 180, 4.8, 3100, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80', ARRAY['Palace', 'Art', 'Mewar'], 'Morning'),
    ('act-uda-3', 'Udaipur', 'Rajasthani Culinary Masterclass by the Lake', 'Learn the secrets of authentic Gatte ki Sabzi, Daal Baati Churma, and Ker Sangri in a heritage home.', 'food', 1800, 180, 4.9, 840, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', ARRAY['Cooking', 'Culinary', 'Local Chef'], 'Afternoon'),
    ('act-del-1', 'Delhi', 'Old Delhi Heritage Rickshaw & Spice Route', 'Navigate Asia''s largest spice market in Khari Baoli and historic havelis of Shahjahanabad.', 'food', 1100, 150, 4.8, 2200, 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', ARRAY['Spices', 'Rickshaw', 'Heritage'], 'Morning'),
    ('act-tok-1', 'Tokyo', 'teamLab Planets Immersive Digital Art', 'Wade through water and infinity mirror installations in Toyosu''s groundbreaking interactive museum.', 'culture', 3200, 120, 4.9, 5400, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', ARRAY['Modern Art', 'Sensory', 'Digital'], 'Afternoon'),
    ('act-tok-2', 'Tokyo', 'Tsukiji Outer Market Morning Seafood Tour', 'Savor fresh sea urchin, king crab legs, wagyu skewers, and tamagoyaki rolled omelet.', 'food', 2800, 150, 4.9, 3900, 'https://images.unsplash.com/photo-1590559899731-a3f30b9630c7?auto=format&fit=crop&w=600&q=80', ARRAY['Sushi', 'Seafood', 'Morning'], 'Morning')
ON CONFLICT (id) DO UPDATE SET
    city_name = EXCLUDED.city_name,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    cost = EXCLUDED.cost,
    duration_minutes = EXCLUDED.duration_minutes,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    image = EXCLUDED.image,
    tags = EXCLUDED.tags,
    best_time_of_day = EXCLUDED.best_time_of_day;
