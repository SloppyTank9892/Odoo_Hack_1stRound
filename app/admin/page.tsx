"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart3,
  Users,
  MapPinned,
  Compass,
  TrendingUp,
  Activity,
  Globe2,
  Share2,
} from "lucide-react";

export default function AdminPage() {
  const topCities = [
    { name: "Jaipur, India", count: 1840, growth: "+28%", rank: "#1" },
    { name: "Tokyo, Japan", count: 1620, growth: "+34%", rank: "#2" },
    { name: "Udaipur, India", count: 1410, growth: "+19%", rank: "#3" },
    { name: "Rome, Italy", count: 1290, growth: "+22%", rank: "#4" },
    { name: "Positano, Italy", count: 980, growth: "+45%", rank: "#5" },
  ];

  const popularActivities = [
    { name: "Taj Mahal Sunrise Visit", city: "Agra", views: 4200, category: "sightseeing" },
    { name: "Amber Fort Exploration", city: "Jaipur", views: 3890, category: "culture" },
    { name: "Lake Pichola Sunset Boat", city: "Udaipur", views: 3410, category: "sightseeing" },
    { name: "teamLab Planets Art", city: "Tokyo", views: 3200, category: "culture" },
  ];

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
            <div className="text-2xl font-black text-[#181818] dark:text-[#F5F3EF]">14,280</div>
            <p className="text-[11px] text-[#1B8755] dark:text-[#34D399] font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18.4% this month
            </p>
          </Card>

          <Card className="p-5 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#9E978E] dark:text-[#7A746B] uppercase tracking-wider">
                Itineraries Generated
              </span>
              <MapPinned className="w-4 h-4 text-[#F4A62A]" />
            </div>
            <div className="text-2xl font-black text-[#181818] dark:text-[#F5F3EF]">38,420</div>
            <p className="text-[11px] text-[#1B8755] dark:text-[#34D399] font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +24.1% creation rate
            </p>
          </Card>

          <Card className="p-5 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#9E978E] dark:text-[#7A746B] uppercase tracking-wider">
                &quot;Copy Trip&quot; Actions
              </span>
              <Share2 className="w-4 h-4 text-[#2B6CB0] dark:text-[#60A5FA]" />
            </div>
            <div className="text-2xl font-black text-[#181818] dark:text-[#F5F3EF]">9,850</div>
            <p className="text-[11px] text-[#1B8755] dark:text-[#34D399] font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 25.6% viral conversion
            </p>
          </Card>

          <Card className="p-5 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#9E978E] dark:text-[#7A746B] uppercase tracking-wider">
                Managed Travel Spend
              </span>
              <Activity className="w-4 h-4 text-[#1B8755] dark:text-[#34D399]" />
            </div>
            <div className="text-2xl font-black text-[#181818] dark:text-[#F5F3EF]">₹42.6 Cr</div>
            <p className="text-[11px] text-[#6B655E] dark:text-[#A8A196] mt-1">Calculated budget volume</p>
          </Card>
        </div>

        {/* Top Cities & Activities Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Destinations */}
          <Card className="lg:col-span-6 p-6 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
            <h3 className="text-base font-bold font-editorial text-[#181818] dark:text-[#F5F3EF] mb-4">
              Top Trending Destination Stops
            </h3>
            <div className="divide-y divide-[#E7E2D8]/60 dark:divide-[#33302B]/60">
              {topCities.map((city) => (
                <div key={city.name} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#76546F] dark:text-[#B88BAF] w-6">{city.rank}</span>
                    <div>
                      <h5 className="font-bold text-[#181818] dark:text-[#F5F3EF]">{city.name}</h5>
                      <span className="text-[11px] text-[#9E978E] dark:text-[#7A746B]">{city.count} trips added</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1B8755] dark:text-[#34D399] bg-[#EDF7F2] dark:bg-[#132D20] px-2 py-0.5 rounded">
                    {city.growth}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Popular Activities */}
          <Card className="lg:col-span-6 p-6 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
            <h3 className="text-base font-bold font-editorial text-[#181818] dark:text-[#F5F3EF] mb-4">
              Most Scheduled Itinerary Activities
            </h3>
            <div className="divide-y divide-[#E7E2D8]/60 dark:divide-[#33302B]/60">
              {popularActivities.map((act) => (
                <div key={act.name} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-[#181818] dark:text-[#F5F3EF]">{act.name}</h5>
                    <span className="text-[11px] text-[#6B655E] dark:text-[#A8A196]">
                      {act.city} · <span className="capitalize">{act.category}</span>
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#181818] dark:text-[#F5F3EF] bg-[#FAF9F5] dark:bg-[#24221E] px-2.5 py-1 rounded-lg border border-[#E7E2D8] dark:border-[#33302B]">
                    {act.views.toLocaleString()} additions
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
