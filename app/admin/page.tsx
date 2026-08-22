import React from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  // Fetch counts in parallel
  const [
    { count: totalUsers },
    { count: totalTrips },
    { count: publicTrips },
    { data: destinations },
    { data: activities }
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("trips").select("*", { count: "exact", head: true }),
    supabase.from("trips").select("*", { count: "exact", head: true }).eq("is_public", true),
    supabase.from("curated_destinations").select("*").order("created_at", { ascending: true }),
    supabase.from("curated_activities").select("*").order("created_at", { ascending: true })
  ]);

  const stats = {
    totalUsers: totalUsers || 0,
    totalTrips: totalTrips || 0,
    publicTrips: publicTrips || 0,
  };

  return (
    <AdminDashboard 
      stats={stats} 
      destinations={destinations || []} 
      activities={activities || []} 
    />
  );
}
