"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================================
// Destinations
// ============================================================================

export async function addCuratedDestination(data: { name: string; trip_count: number; growth: string; rank: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from("curated_destinations").insert([data]);
  
  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCuratedDestination(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("curated_destinations").delete().eq("id", id);
  
  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

// ============================================================================
// Activities
// ============================================================================

export async function addCuratedActivity(data: { name: string; city: string; views: number; category: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from("curated_activities").insert([data]);
  
  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCuratedActivity(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("curated_activities").delete().eq("id", id);
  
  if (error) return { success: false, error: error.message };
  
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}
