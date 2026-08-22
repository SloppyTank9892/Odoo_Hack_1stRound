import { getSupabaseClient, isSupabaseConfigured } from "./supabase";
import { CityDiscovery, ActivityDiscovery, Trip } from "@/types/trip";
import { curatedDestinations as mockDestinations } from "@/data/curatedDestinations";
import { curatedActivities as mockActivities } from "@/data/curatedActivities";
import { recalculateTrip } from "./tripCalculations";

const initialTrips: Trip[] = [];

// Database row schemas
interface DestinationRow {
  id: string;
  name: string;
  country: string;
  region: string;
  image: string;
  cost_index: "$" | "$$" | "$$$" | "$$$$";
  popularity: number;
  tags: string[];
  description: string;
  avg_daily_cost: number;
  suggested_days: number;
  lat: number;
  lng: number;
}

interface ActivityRow {
  id: string;
  city_name: string;
  name: string;
  description: string;
  category: string;
  cost: number;
  duration_minutes: number;
  rating: number;
  review_count: number;
  image: string;
  tags: string[];
  best_time_of_day: "Morning" | "Afternoon" | "Evening" | "Night";
}

interface TripRow {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cover_image: string;
  start_date: string;
  end_date: string;
  stops: any;
  days: any;
  budget: any;
  is_public: boolean;
  share_code: string;
  status: "planning" | "active" | "completed";
  created_at?: string;
}

// Convert DB row to CityDiscovery model
const mapRowToDestination = (row: DestinationRow): CityDiscovery => ({
  id: row.id,
  name: row.name,
  country: row.country,
  region: row.region,
  image: row.image,
  costIndex: row.cost_index,
  popularity: Number(row.popularity) || 90,
  tags: Array.isArray(row.tags) ? row.tags : [],
  description: row.description || "",
  avgDailyCost: Number(row.avg_daily_cost) || 4000,
  suggestedDays: Number(row.suggested_days) || 3,
  lat: Number(row.lat) || 26.9124,
  lng: Number(row.lng) || 75.7873,
});

// Convert CityDiscovery to DB row
const mapDestinationToRow = (dest: CityDiscovery): DestinationRow => ({
  id: dest.id,
  name: dest.name,
  country: dest.country,
  region: dest.region,
  image: dest.image,
  cost_index: dest.costIndex,
  popularity: dest.popularity,
  tags: dest.tags,
  description: dest.description,
  avg_daily_cost: dest.avgDailyCost,
  suggested_days: dest.suggestedDays,
  lat: dest.lat,
  lng: dest.lng,
});

// Convert DB row to ActivityDiscovery model
const mapRowToActivity = (row: ActivityRow): ActivityDiscovery => ({
  id: row.id,
  cityName: row.city_name,
  name: row.name,
  description: row.description || "",
  category: row.category as any,
  cost: Number(row.cost) || 0,
  durationMinutes: Number(row.duration_minutes) || 120,
  rating: Number(row.rating) || 4.8,
  reviewCount: Number(row.review_count) || 100,
  image: row.image,
  tags: Array.isArray(row.tags) ? row.tags : [],
  bestTimeOfDay: row.best_time_of_day || "Morning",
});

// Convert ActivityDiscovery to DB row
const mapActivityToRow = (act: ActivityDiscovery): ActivityRow => ({
  id: act.id,
  city_name: act.cityName,
  name: act.name,
  description: act.description,
  category: act.category,
  cost: act.cost,
  duration_minutes: act.durationMinutes,
  rating: act.rating,
  review_count: act.reviewCount,
  image: act.image,
  tags: act.tags,
  best_time_of_day: act.bestTimeOfDay,
});

// Convert DB row to Trip model
const mapRowToTrip = (row: TripRow): Trip => ({
  id: row.id,
  name: row.name,
  tagline: row.tagline || "",
  description: row.description || "",
  coverImage: row.cover_image,
  startDate: row.start_date,
  endDate: row.end_date,
  stops: Array.isArray(row.stops) ? row.stops : [],
  days: Array.isArray(row.days) ? row.days : [],
  budget: row.budget || {
    targetBudget: 60000,
    currency: "₹",
    categories: { transport: 10000, accommodation: 20000, activities: 15000, meals: 10000, misc: 5000 },
  },
  isPublic: Boolean(row.is_public),
  shareCode: row.share_code,
  status: row.status || "planning",
  createdAt: row.created_at || new Date().toISOString().split("T")[0],
});

// Convert Trip to DB row
const mapTripToRow = (trip: Trip): TripRow => ({
  id: trip.id,
  name: trip.name,
  tagline: trip.tagline,
  description: trip.description,
  cover_image: trip.coverImage,
  start_date: trip.startDate,
  end_date: trip.endDate,
  stops: trip.stops,
  days: trip.days,
  budget: trip.budget,
  is_public: trip.isPublic,
  share_code: trip.shareCode,
  status: trip.status,
});

// ==============================================================================
// DESTINATIONS CRUD SERVICE
// ==============================================================================

export async function fetchDestinationsDB(): Promise<CityDiscovery[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("destinations")
      .select("*")
      .order("popularity", { ascending: false });

    if (error) {
      console.warn("Supabase fetchDestinationsDB error:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      // Auto-seed if table exists but is empty
      await seedDestinationsDB(mockDestinations);
      return mockDestinations;
    }

    return (data as DestinationRow[]).map(mapRowToDestination);
  } catch (err) {
    console.warn("Supabase connection failed for destinations:", err);
    return null;
  }
}

export async function upsertDestinationDB(destination: CityDiscovery): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = mapDestinationToRow(destination);
    const { error } = await client
      .from("destinations")
      .upsert(row, { onConflict: "id" });

    if (error) {
      console.error("Supabase upsertDestinationDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to upsert destination:", err);
    return false;
  }
}

export async function deleteDestinationDB(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from("destinations").delete().eq("id", id);
    if (error) {
      console.error("Supabase deleteDestinationDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to delete destination:", err);
    return false;
  }
}

export async function seedDestinationsDB(destinations: CityDiscovery[]): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const rows = destinations.map(mapDestinationToRow);
    const { error } = await client.from("destinations").upsert(rows, { onConflict: "id" });
    if (error) {
      console.error("Supabase seedDestinationsDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to seed destinations:", err);
    return false;
  }
}

// ==============================================================================
// ACTIVITIES CRUD SERVICE
// ==============================================================================

export async function fetchActivitiesDB(): Promise<ActivityDiscovery[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("catalog_activities")
      .select("*")
      .order("rating", { ascending: false });

    if (error) {
      console.warn("Supabase fetchActivitiesDB error:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      await seedActivitiesDB(mockActivities);
      return mockActivities;
    }

    return (data as ActivityRow[]).map(mapRowToActivity);
  } catch (err) {
    console.warn("Supabase connection failed for activities:", err);
    return null;
  }
}

export async function upsertActivityDB(activity: ActivityDiscovery): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = mapActivityToRow(activity);
    const { error } = await client
      .from("catalog_activities")
      .upsert(row, { onConflict: "id" });

    if (error) {
      console.error("Supabase upsertActivityDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to upsert activity:", err);
    return false;
  }
}

export async function deleteActivityDB(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from("catalog_activities").delete().eq("id", id);
    if (error) {
      console.error("Supabase deleteActivityDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to delete activity:", err);
    return false;
  }
}

export async function seedActivitiesDB(activities: ActivityDiscovery[]): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const rows = activities.map(mapActivityToRow);
    const { error } = await client.from("catalog_activities").upsert(rows, { onConflict: "id" });
    if (error) {
      console.error("Supabase seedActivitiesDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to seed activities:", err);
    return false;
  }
}

// ==============================================================================
// TRIPS CRUD SERVICE
// ==============================================================================

export async function fetchTripsDB(): Promise<Trip[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from("trips").select("*").order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchTripsDB error:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      const seeded = initialTrips.map(recalculateTrip);
      await seedTripsDB(seeded);
      return seeded;
    }

    return (data as TripRow[]).map(mapRowToTrip).map(recalculateTrip);
  } catch (err) {
    console.warn("Supabase connection failed for trips:", err);
    return null;
  }
}

export async function upsertTripDB(trip: Trip): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = mapTripToRow(trip);
    const { error } = await client.from("trips").upsert(row, { onConflict: "id" });
    if (error) {
      console.error("Supabase upsertTripDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to upsert trip:", err);
    return false;
  }
}

export async function deleteTripDB(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from("trips").delete().eq("id", id);
    if (error) {
      console.error("Supabase deleteTripDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to delete trip:", err);
    return false;
  }
}

export async function seedTripsDB(trips: Trip[]): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const rows = trips.map(mapTripToRow);
    const { error } = await client.from("trips").upsert(rows, { onConflict: "id" });
    if (error) {
      console.error("Supabase seedTripsDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to seed trips:", err);
    return false;
  }
}

// Master One-Click Database Seeder
export async function seedAllToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
    };
  }

  const dOk = await seedDestinationsDB(mockDestinations);
  const aOk = await seedActivitiesDB(mockActivities);

  if (dOk && aOk) {
    return { success: true, message: "Successfully synced and seeded all catalog data into Supabase!" };
  } else {
    return { success: false, message: "Partial sync completed. Check console for table error details." };
  }
}
