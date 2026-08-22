"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TripGridCard } from "@/components/trip/TripGridCard";
import { CreateTripModal } from "@/components/trip/CreateTripModal";
import { useTrips } from "@/context/TripContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MapPinned, Plus, Sparkles, Filter, Compass } from "lucide-react";

export default function MyTripsPage() {
  const { trips, searchQuery } = useTrips();
  const [filterStatus, setFilterStatus] = useState<"all" | "planning" | "active" | "completed">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredTrips = trips.filter((trip) => {
    const matchesStatus = filterStatus === "all" || trip.status === filterStatus;
    const matchesSearch =
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.stops.some((s) => s.cityName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <AppShell>
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold font-editorial text-[#181818]">
              My Trip Collection
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#6B655E]">
            {trips.length} active and planned journeys synchronized with your workspace
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
        >
          Plan New Trip
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {(
          [
            { id: "all" as const, label: `All Trips (${trips.length})` },
            { id: "planning" as const, label: `Planning (${trips.filter((t) => t.status === "planning").length})` },
            { id: "active" as const, label: `Active (${trips.filter((t) => t.status === "active").length})` },
            { id: "completed" as const, label: `Completed (${trips.filter((t) => t.status === "completed").length})` },
          ]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterStatus === tab.id
                ? "bg-[#181818] text-white shadow-xs"
                : "bg-white text-[#6B655E] hover:text-[#181818] border border-[#E7E2D8] hover:bg-[#FAF9F5]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trips Grid or Empty State */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripGridCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 px-6 bg-white max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FEF7EC] text-[#F4A62A] flex items-center justify-center mx-auto mb-4 border border-[#FCD89C]">
            <Compass className="w-8 h-8 stroke-[2]" />
          </div>
          <h3 className="text-lg font-bold text-[#181818] mb-1 font-editorial">
            No journeys found
          </h3>
          <p className="text-xs text-[#6B655E] mb-6 max-w-xs mx-auto">
            {searchQuery
              ? `No itineraries matching "${searchQuery}". Try a different city.`
              : "Your next grand adventure starts here. Plan a multi-city route in seconds."}
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Plan Your First Trip
          </Button>
        </Card>
      )}

      {/* Create Modal */}
      <CreateTripModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </AppShell>
  );
}
