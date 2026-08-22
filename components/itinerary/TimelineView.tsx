"use client";

import React, { useState } from "react";
import { Trip } from "@/types/trip";
import { DayCard } from "@/components/itinerary/DayCard";
import { StopDurationEditor } from "@/components/trip/StopDurationEditor";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Calendar, Layers, Sliders } from "lucide-react";

interface TimelineViewProps {
  trip: Trip;
}

export function TimelineView({ trip }: TimelineViewProps) {
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("all");

  const filteredDays = trip.days.filter((day) => {
    if (selectedCityFilter === "all") return true;
    return day.cityId === selectedCityFilter;
  });

  return (
    <div className="space-y-8">
      {/* Dynamic Stop Duration Managers (The WOW Engine Bar) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F4A62A]" />
            <h3 className="text-base font-bold text-[#181818] font-editorial">
              Multi-City Stop Allocations & Duration Engine
            </h3>
          </div>
          <span className="text-xs text-[#76546F] font-semibold">
            {trip.stops.length} Stops · {trip.days.length} Total Days
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {trip.stops.map((stop) => (
            <StopDurationEditor
              key={stop.id}
              trip={trip}
              stop={stop}
              isJaipurDemo={stop.id === "jaipur"}
            />
          ))}
        </div>
      </div>

      {/* Day Filter Chips */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#E7E2D8] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCityFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCityFilter === "all"
                ? "bg-[#181818] text-white"
                : "bg-white text-[#6B655E] hover:text-[#181818] border border-[#E7E2D8]"
            }`}
          >
            All Days ({trip.days.length})
          </button>
          {trip.stops.map((stop) => (
            <button
              key={stop.id}
              onClick={() => setSelectedCityFilter(stop.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCityFilter === stop.id
                  ? "bg-[#FEF7EC] text-[#B86E00] border border-[#FCD89C]"
                  : "bg-white text-[#6B655E] hover:text-[#181818] border border-[#E7E2D8]"
              }`}
            >
              <span>{stop.cityName}</span>
              <span className="text-[10px] opacity-75">({stop.daysCount}d)</span>
            </button>
          ))}
        </div>

        <span className="text-xs text-[#9E978E] hidden sm:inline">
          Showing {filteredDays.length} of {trip.days.length} days
        </span>
      </div>

      {/* Chronological Timeline Container */}
      <div className="pt-2">
        {filteredDays.map((day) => (
          <DayCard
            key={`${day.cityId}-${day.dayNumber}`}
            trip={trip}
            day={day}
            totalDays={trip.days.length}
          />
        ))}
      </div>
    </div>
  );
}
