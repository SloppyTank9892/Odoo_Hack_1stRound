"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Users, 
  MapPinned, 
  Share2, 
  Activity, 
  Trash2, 
  Plus, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { 
  addCuratedDestination, 
  deleteCuratedDestination, 
  addCuratedActivity, 
  deleteCuratedActivity,
  seedCuratedData
} from "@/lib/actions/admin";
import { useRouter } from "next/navigation";

type Destination = { id: string; name: string; trip_count: number; growth: string; rank: string };
type ActivityItem = { id: string; name: string; city: string; views: number; category: string };

type AdminDashboardProps = {
  stats: {
    totalUsers: number;
    totalTrips: number;
    publicTrips: number;
  };
  destinations: Destination[];
  activities: ActivityItem[];
};

export function AdminDashboard({ stats, destinations, activities }: AdminDashboardProps) {
  const router = useRouter();
  const [destList, setDestList] = useState<Destination[]>(destinations || []);
  const [actList, setActList] = useState<ActivityItem[]>(activities || []);
  
  const [destLoading, setDestLoading] = useState(false);
  const [actLoading, setActLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    setDestList(destinations || []);
  }, [destinations]);

  useEffect(() => {
    setActList(activities || []);
  }, [activities]);

  const showNotify = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleAddDestination = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDestLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const newDest = {
      name: formData.get("name") as string,
      trip_count: Number(formData.get("trip_count")) || 0,
      growth: (formData.get("growth") as string) || "+10%",
      rank: (formData.get("rank") as string) || `#${destList.length + 1}`,
    };

    const res = await addCuratedDestination(newDest);
    setDestLoading(false);

    if (res.success && res.data) {
      setDestList((prev) => [...prev, res.data as Destination]);
      form.reset();
      showNotify("success", `Added "${newDest.name}" to curated destinations.`);
      router.refresh();
    } else {
      showNotify("error", res.error || "Failed to save destination to database.");
    }
  };

  const handleDeleteDestination = async (id: string, name: string) => {
    const res = await deleteCuratedDestination(id);
    if (res.success) {
      setDestList((prev) => prev.filter((d) => d.id !== id));
      showNotify("success", `Removed "${name}" from curated list.`);
      router.refresh();
    } else {
      showNotify("error", res.error || "Failed to delete destination.");
    }
  };

  const handleAddActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newAct = {
      name: formData.get("name") as string,
      city: formData.get("city") as string,
      views: Number(formData.get("views")) || 0,
      category: (formData.get("category") as string) || "sightseeing",
    };

    const res = await addCuratedActivity(newAct);
    setActLoading(false);

    if (res.success && res.data) {
      setActList((prev) => [...prev, res.data as ActivityItem]);
      form.reset();
      showNotify("success", `Added "${newAct.name}" to curated activities.`);
      router.refresh();
    } else {
      showNotify("error", res.error || "Failed to save activity to database.");
    }
  };

  const handleDeleteActivity = async (id: string, name: string) => {
    const res = await deleteCuratedActivity(id);
    if (res.success) {
      setActList((prev) => prev.filter((a) => a.id !== id));
      showNotify("success", `Removed "${name}" from curated list.`);
      router.refresh();
    } else {
      showNotify("error", res.error || "Failed to delete activity.");
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    const res = await seedCuratedData();
    setSeeding(false);

    if (res.success) {
      if (res.destinations) setDestList(res.destinations as Destination[]);
      if (res.activities) setActList(res.activities as ActivityItem[]);
      showNotify("success", "Successfully seeded default curated destinations and activities!");
      router.refresh();
    } else {
      showNotify("error", res.error || "Failed to seed default data into database.");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Toast / Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between shadow-md transition-all animate-in fade-in slide-in-from-top-2 ${
              notification.type === "success"
                ? "bg-[#EDF7F2] dark:bg-[#132D20] text-[#1B8755] dark:text-[#34D399] border border-[#1B8755]/30"
                : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs opacity-75 hover:opacity-100 font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#76546F] dark:bg-[#B88BAF]" />
              <h1 className="text-2xl sm:text-3xl font-extrabold font-editorial text-[#181818] dark:text-[#F5F3EF]">
                GlobeTrotter Platform Intelligence
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#6B655E] dark:text-[#A8A196]">
              Aggregated traveler behavior, top multi-city corridors &amp; live database curation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FAF9F5] dark:bg-[#24221E] hover:bg-[#F3EFE6] dark:hover:bg-[#33302B] text-[#181818] dark:text-[#F5F3EF] border border-[#E7E2D8] dark:border-[#33302B] transition-all shadow-xs disabled:opacity-50"
              title="Import all default curated destinations & activities to Supabase"
            >
              {seeding ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#76546F]" />
              ) : (
                <Database className="w-3.5 h-3.5 text-[#F4A62A]" />
              )}
              <span>{seeding ? "Importing..." : "Sync / Import Curated Data"}</span>
            </button>
            <Badge variant="purple" size="md">
              Live Telemetry Active
            </Badge>
          </div>
        </div>

        {/* High-level KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#9E978E] dark:text-[#7A746B] uppercase tracking-wider">
                Total Explorers
              </span>
              <Users className="w-4 h-4 text-[#76546F] dark:text-[#B88BAF]" />
            </div>
            <div className="text-2xl font-black text-[#181818] dark:text-[#F5F3EF]">{stats.totalUsers.toLocaleString()}</div>
          </Card>

          <Card className="p-5 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#9E978E] dark:text-[#7A746B] uppercase tracking-wider">
                Itineraries Generated
              </span>
              <MapPinned className="w-4 h-4 text-[#F4A62A]" />
            </div>
            <div className="text-2xl font-black text-[#181818] dark:text-[#F5F3EF]">{stats.totalTrips.toLocaleString()}</div>
          </Card>

          <Card className="p-5 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#9E978E] dark:text-[#7A746B] uppercase tracking-wider">
                Public Trips
              </span>
              <Share2 className="w-4 h-4 text-[#2B6CB0] dark:text-[#60A5FA]" />
            </div>
            <div className="text-2xl font-black text-[#181818] dark:text-[#F5F3EF]">{stats.publicTrips.toLocaleString()}</div>
          </Card>

          <Card className="p-5 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#9E978E] dark:text-[#7A746B] uppercase tracking-wider">
                System Status
              </span>
              <Activity className="w-4 h-4 text-[#1B8755] dark:text-[#34D399]" />
            </div>
            <div className="text-2xl font-black text-[#181818] dark:text-[#F5F3EF]">Healthy</div>
          </Card>
        </div>

        {/* Top Cities & Activities Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Destinations */}
          <Card className="lg:col-span-6 p-6 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
                Top Trending Destination Stops (Database Curated)
              </h3>
              <span className="text-xs text-[#9E978E] dark:text-[#7A746B] font-medium">
                {destList.length} items
              </span>
            </div>
            
            {/* Add form */}
            <div className="mb-6 p-4 bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl">
              <h4 className="text-sm font-bold text-[#181818] dark:text-[#F5F3EF] mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#1B8755]" /> Add Destination to Database
              </h4>
              <form onSubmit={handleAddDestination} className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input 
                    name="name" 
                    placeholder="City, Country (e.g. Kyoto, Japan)" 
                    required 
                    className="flex-1 text-sm px-3 py-2 border rounded-md dark:bg-[#1C1B18] dark:border-[#33302B] dark:text-[#F5F3EF] focus:outline-[#F4A62A]" 
                  />
                  <input 
                    name="trip_count" 
                    type="number" 
                    placeholder="Trip Count" 
                    required 
                    className="w-32 text-sm px-3 py-2 border rounded-md dark:bg-[#1C1B18] dark:border-[#33302B] dark:text-[#F5F3EF] focus:outline-[#F4A62A]" 
                  />
                </div>
                <div className="flex gap-2">
                  <input 
                    name="growth" 
                    placeholder="Growth (e.g. +28%)" 
                    required 
                    className="flex-1 text-sm px-3 py-2 border rounded-md dark:bg-[#1C1B18] dark:border-[#33302B] dark:text-[#F5F3EF] focus:outline-[#F4A62A]" 
                  />
                  <input 
                    name="rank" 
                    placeholder="Rank (e.g. #1)" 
                    required 
                    className="flex-1 text-sm px-3 py-2 border rounded-md dark:bg-[#1C1B18] dark:border-[#33302B] dark:text-[#F5F3EF] focus:outline-[#F4A62A]" 
                  />
                  <button 
                    type="submit"
                    disabled={destLoading} 
                    className="bg-[#1B8755] hover:bg-[#146c43] transition-colors text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {destLoading ? "Saving..." : "Add to Database"}
                  </button>
                </div>
              </form>
            </div>

            <div className="divide-y divide-[#E7E2D8]/60 dark:divide-[#33302B]/60 max-h-[420px] overflow-y-auto pr-1">
              {destList.map((city) => (
                <div key={city.id || city.name} className="py-3 flex items-center justify-between text-xs group">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#76546F] dark:text-[#B88BAF] w-6">{city.rank}</span>
                    <div>
                      <h5 className="font-bold text-[#181818] dark:text-[#F5F3EF] text-sm">{city.name}</h5>
                      <span className="text-[11px] text-[#9E978E] dark:text-[#7A746B]">{city.trip_count.toLocaleString()} trips added</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#1B8755] dark:text-[#34D399] bg-[#EDF7F2] dark:bg-[#132D20] px-2 py-1 rounded">
                      {city.growth}
                    </span>
                    <button 
                      onClick={() => handleDeleteDestination(city.id, city.name)}
                      className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded transition-colors cursor-pointer"
                      title="Delete this destination from database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {destList.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-[#6B655E] dark:text-[#A8A196] italic mb-3">No curated destinations in database.</p>
                  <button
                    onClick={handleSeedData}
                    className="text-xs font-bold text-[#1B8755] underline hover:no-underline"
                  >
                    Click to import default destinations
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* Popular Activities */}
          <Card className="lg:col-span-6 p-6 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
                Most Scheduled Itinerary Activities (Database Curated)
              </h3>
              <span className="text-xs text-[#9E978E] dark:text-[#7A746B] font-medium">
                {actList.length} items
              </span>
            </div>

            {/* Add form */}
            <div className="mb-6 p-4 bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl">
              <h4 className="text-sm font-bold text-[#181818] dark:text-[#F5F3EF] mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#2B6CB0]" /> Add Activity to Database
              </h4>
              <form onSubmit={handleAddActivity} className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input 
                    name="name" 
                    placeholder="Activity Name (e.g. Sunset Boat Charter)" 
                    required 
                    className="flex-1 text-sm px-3 py-2 border rounded-md dark:bg-[#1C1B18] dark:border-[#33302B] dark:text-[#F5F3EF] focus:outline-[#F4A62A]" 
                  />
                  <input 
                    name="city" 
                    placeholder="City (e.g. Udaipur)" 
                    required 
                    className="w-32 text-sm px-3 py-2 border rounded-md dark:bg-[#1C1B18] dark:border-[#33302B] dark:text-[#F5F3EF] focus:outline-[#F4A62A]" 
                  />
                </div>
                <div className="flex gap-2">
                  <input 
                    name="views" 
                    type="number" 
                    placeholder="Views / Additions" 
                    required 
                    className="flex-1 text-sm px-3 py-2 border rounded-md dark:bg-[#1C1B18] dark:border-[#33302B] dark:text-[#F5F3EF] focus:outline-[#F4A62A]" 
                  />
                  <select 
                    name="category" 
                    className="flex-1 text-sm px-3 py-2 border rounded-md dark:bg-[#1C1B18] dark:border-[#33302B] dark:text-[#F5F3EF] focus:outline-[#F4A62A]"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="culture">Culture</option>
                    <option value="food">Food</option>
                    <option value="nature">Nature</option>
                    <option value="adventure">Adventure</option>
                  </select>
                  <button 
                    type="submit"
                    disabled={actLoading} 
                    className="bg-[#2B6CB0] hover:bg-[#1e4e8c] transition-colors text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {actLoading ? "Saving..." : "Add to Database"}
                  </button>
                </div>
              </form>
            </div>

            <div className="divide-y divide-[#E7E2D8]/60 dark:divide-[#33302B]/60 max-h-[420px] overflow-y-auto pr-1">
              {actList.map((act) => (
                <div key={act.id || act.name} className="py-3 flex items-center justify-between text-xs group">
                  <div>
                    <h5 className="font-bold text-[#181818] dark:text-[#F5F3EF] text-sm">{act.name}</h5>
                    <span className="text-[11px] text-[#6B655E] dark:text-[#A8A196]">
                      {act.city} · <span className="capitalize">{act.category}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#181818] dark:text-[#F5F3EF] bg-[#FAF9F5] dark:bg-[#24221E] px-2.5 py-1 rounded-lg border border-[#E7E2D8] dark:border-[#33302B]">
                      {act.views.toLocaleString()} additions
                    </span>
                    <button 
                      onClick={() => handleDeleteActivity(act.id, act.name)}
                      className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded transition-colors cursor-pointer"
                      title="Delete this activity from database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {actList.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-[#6B655E] dark:text-[#A8A196] italic mb-3">No curated activities in database.</p>
                  <button
                    onClick={handleSeedData}
                    className="text-xs font-bold text-[#2B6CB0] underline hover:no-underline"
                  >
                    Click to import default activities
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

