"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================================
// Destinations
// ============================================================================

export async function addCuratedDestination(data: {
  name: string;
  trip_count: number;
  growth: string;
  rank: string;
}) {
  try {
    const supabase = await createClient();
    const { data: inserted, error } = await supabase
      .from("curated_destinations")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("addCuratedDestination error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, data: inserted };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add destination";
    return { success: false, error: msg };
  }
}

export async function deleteCuratedDestination(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("curated_destinations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("deleteCuratedDestination error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete destination";
    return { success: false, error: msg };
  }
}

// ============================================================================
// Activities
// ============================================================================

export async function addCuratedActivity(data: {
  name: string;
  city: string;
  views: number;
  category: string;
}) {
  try {
    const supabase = await createClient();
    const { data: inserted, error } = await supabase
      .from("curated_activities")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("addCuratedActivity error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, data: inserted };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add activity";
    return { success: false, error: msg };
  }
}

export async function deleteCuratedActivity(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("curated_activities")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("deleteCuratedActivity error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete activity";
    return { success: false, error: msg };
  }
}

// ============================================================================
// Seed / Sync Default Curated Data
// ============================================================================

export async function seedCuratedData() {
  try {
    const supabase = await createClient();

    const defaultDestinations = [
      { name: "Jaipur, India", trip_count: 3420, growth: "+28%", rank: "#1" },
      { name: "Udaipur, India", trip_count: 2890, growth: "+24%", rank: "#2" },
      { name: "Tokyo, Japan", trip_count: 5120, growth: "+35%", rank: "#3" },
      { name: "Kyoto, Japan", trip_count: 4890, growth: "+19%", rank: "#4" },
      { name: "Rome, Italy", trip_count: 4150, growth: "+15%", rank: "#5" },
      { name: "Positano, Italy", trip_count: 2310, growth: "+31%", rank: "#6" },
      { name: "Bali, Indonesia", trip_count: 3820, growth: "+22%", rank: "#7" },
      { name: "Zermatt, Switzerland", trip_count: 1980, growth: "+18%", rank: "#8" },
    ];

    const defaultActivities = [
      { name: "Amber Fort & Sheesh Mahal Exploration", city: "Jaipur", views: 3420, category: "culture" },
      { name: "Shibuya Crossing & Hidden Izakaya Crawl", city: "Tokyo", views: 5120, category: "food" },
      { name: "Fushimi Inari 10,000 Torii Gates Dawn Hike", city: "Kyoto", views: 4890, category: "nature" },
      { name: "Old Delhi Chandni Chowk Midnight Food Trail", city: "Delhi", views: 4200, category: "food" },
      { name: "Udaipur City Palace Museum & Crystal Gallery", city: "Udaipur", views: 3100, category: "culture" },
      { name: "Chokhi Dhani Rajasthani Village Experience", city: "Jaipur", views: 2890, category: "food" },
      { name: "Private Sunset Boat Charter on Lake Pichola", city: "Udaipur", views: 2150, category: "sightseeing" },
      { name: "Hawa Mahal & Old Bazaar Guided Walk", city: "Jaipur", views: 1950, category: "sightseeing" },
    ];

    const { data: insertedDest, error: destErr } = await supabase
      .from("curated_destinations")
      .upsert(defaultDestinations, { onConflict: "name", ignoreDuplicates: true })
      .select();

    const { data: insertedAct, error: actErr } = await supabase
      .from("curated_activities")
      .upsert(defaultActivities, { onConflict: "name", ignoreDuplicates: true })
      .select();

    if (destErr || actErr) {
      console.error("Seed error:", destErr || actErr);
      return { 
        success: false, 
        error: (destErr?.message || "") + " " + (actErr?.message || "") 
      };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { 
      success: true, 
      destinations: insertedDest || defaultDestinations, 
      activities: insertedAct || defaultActivities 
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to seed curated data";
    return { success: false, error: msg };
  }
}

