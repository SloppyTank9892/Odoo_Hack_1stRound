"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, MapPinned, Share2, TrendingUp, Activity, Trash2, Plus } from "lucide-react";
import { addCuratedDestination, deleteCuratedDestination, addCuratedActivity, deleteCuratedActivity } from "@/lib/actions/admin";

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
  const [destLoading, setDestLoading] = useState(false);
  const [actLoading, setActLoading] = useState(false);

  // Simple unmanaged state for forms to keep it inline
  const handleAddDestination = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDestLoading(true);
    const formData = new FormData(e.currentTarget);
    await addCuratedDestination({
      name: formData.get("name") as string,
      trip_count: Number(formData.get("trip_count")),
      growth: formData.get("growth") as string,
      rank: formData.get("rank") as string,
    });
    setDestLoading(false);
    e.currentTarget.reset();
  };

  const handleAddActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActLoading(true);
    const formData = new FormData(e.currentTarget);
    await addCuratedActivity({
      name: formData.get("name") as string,
      city: formData.get("city") as string,
      views: Number(formData.get("views")),
      category: formData.get("category") as string,
    });
    setActLoading(false);
    e.currentTarget.reset();
  };

  return (
    <AppShell>
      <div className="space-y-6">
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
              Aggregated traveler behavior, top multi-city corridors &amp; itinerary copy metrics
            </p>
          </div>
          <Badge variant="purple" size="md">
            Live Telemetry Active
          </Badge>
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
            <h3 className="text-base font-bold font-editorial text-[#181818] dark:text-[#F5F3EF] mb-4">
              Top Trending Destination Stops (Curated)
            </h3>
            
            {/* Add form */}
            <form onSubmit={handleAddDestination} className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-50 dark:bg-black/20 rounded-lg">
              <input name="name" placeholder="City, Country" required className="flex-1 min-w-[120px] text-xs px-2 py-1.5 border rounded dark:bg-[#1C1B18] dark:border-[#33302B]" />
              <input name="trip_count" type="number" placeholder="Count" required className="w-20 text-xs px-2 py-1.5 border rounded dark:bg-[#1C1B18] dark:border-[#33302B]" />
              <input name="growth" placeholder="Growth (e.g. +28%)" required className="w-24 text-xs px-2 py-1.5 border rounded dark:bg-[#1C1B18] dark:border-[#33302B]" />
              <input name="rank" placeholder="Rank (e.g. #1)" required className="w-16 text-xs px-2 py-1.5 border rounded dark:bg-[#1C1B18] dark:border-[#33302B]" />
              <button disabled={destLoading} className="bg-[#181818] text-white px-3 py-1.5 rounded text-xs flex items-center gap-1 dark:bg-[#F5F3EF] dark:text-[#181818]">
                <Plus className="w-3 h-3" /> Add
              </button>
            </form>

            <div className="divide-y divide-[#E7E2D8]/60 dark:divide-[#33302B]/60">
              {destinations.map((city) => (
                <div key={city.id} className="py-3 flex items-center justify-between text-xs group">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#76546F] dark:text-[#B88BAF] w-6">{city.rank}</span>
                    <div>
                      <h5 className="font-bold text-[#181818] dark:text-[#F5F3EF]">{city.name}</h5>
                      <span className="text-[11px] text-[#9E978E] dark:text-[#7A746B]">{city.trip_count} trips added</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1B8755] dark:text-[#34D399] bg-[#EDF7F2] dark:bg-[#132D20] px-2 py-0.5 rounded">
                      {city.growth}
                    </span>
                    <button 
                      onClick={() => deleteCuratedDestination(city.id)}
                      className="p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {destinations.length === 0 && (
                <p className="text-xs text-gray-500 py-4 text-center">No curated destinations found.</p>
              )}
            </div>
          </Card>

          {/* Popular Activities */}
          <Card className="lg:col-span-6 p-6 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
            <h3 className="text-base font-bold font-editorial text-[#181818] dark:text-[#F5F3EF] mb-4">
              Most Scheduled Itinerary Activities (Curated)
            </h3>

            {/* Add form */}
            <form onSubmit={handleAddActivity} className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-50 dark:bg-black/20 rounded-lg">
              <input name="name" placeholder="Activity Name" required className="flex-1 min-w-[120px] text-xs px-2 py-1.5 border rounded dark:bg-[#1C1B18] dark:border-[#33302B]" />
              <input name="city" placeholder="City" required className="w-24 text-xs px-2 py-1.5 border rounded dark:bg-[#1C1B18] dark:border-[#33302B]" />
              <input name="views" type="number" placeholder="Views" required className="w-20 text-xs px-2 py-1.5 border rounded dark:bg-[#1C1B18] dark:border-[#33302B]" />
              <select name="category" className="w-24 text-xs px-2 py-1.5 border rounded dark:bg-[#1C1B18] dark:border-[#33302B]">
                <option value="sightseeing">Sightseeing</option>
                <option value="culture">Culture</option>
                <option value="food">Food</option>
                <option value="nature">Nature</option>
              </select>
              <button disabled={actLoading} className="bg-[#181818] text-white px-3 py-1.5 rounded text-xs flex items-center gap-1 dark:bg-[#F5F3EF] dark:text-[#181818]">
                <Plus className="w-3 h-3" /> Add
              </button>
            </form>

            <div className="divide-y divide-[#E7E2D8]/60 dark:divide-[#33302B]/60">
              {activities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between text-xs group">
                  <div>
                    <h5 className="font-bold text-[#181818] dark:text-[#F5F3EF]">{act.name}</h5>
                    <span className="text-[11px] text-[#6B655E] dark:text-[#A8A196]">
                      {act.city} · <span className="capitalize">{act.category}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#181818] dark:text-[#F5F3EF] bg-[#FAF9F5] dark:bg-[#24221E] px-2.5 py-1 rounded-lg border border-[#E7E2D8] dark:border-[#33302B]">
                      {act.views.toLocaleString()} additions
                    </span>
                    <button 
                      onClick={() => deleteCuratedActivity(act.id)}
                      className="p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-xs text-gray-500 py-4 text-center">No curated activities found.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
