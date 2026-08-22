"use client";

import React, { useState } from "react";
import { DayPlan, Trip } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ActivityItem } from "@/components/itinerary/ActivityItem";
import { AddActivityDrawer } from "@/components/itinerary/AddActivityDrawer";
import { formatCurrency } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { Calendar, Plus, MapPin, Sparkles, AlertCircle } from "lucide-react";

interface DayCardProps {
  trip: Trip;
  day: DayPlan;
  totalDays: number;
}

export function DayCard({ trip, day, totalDays }: DayCardProps) {
  const { currency } = useTrips();
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  // Parse friendly date: "Tue, Oct 13"
  const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const dailyActivitiesCost = day.activities.reduce((sum, a) => sum + a.cost, 0);

  return (
    <div id={`day-${day.dayNumber}`} className="relative pl-6 sm:pl-8 pb-8 group/day">
      {/* Vertical subtle timeline connector */}
      <div className="timeline-connector group-last/day:hidden" />

      {/* Timeline Day Pin */}
      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-[#181818] border-2 border-white text-white flex items-center justify-center text-[10px] font-bold shadow-xs z-10">
        {day.dayNumber}
      </div>

      <Card className="bg-white border-[#E7E2D8] p-4 sm:p-6 shadow-xs">
        {/* Day Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E7E2D8]">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#B86E00] bg-[#FEF7EC] px-2.5 py-1 rounded-lg border border-[#FCD89C]">
              Day {day.dayNumber}
            </span>
            <h4 className="text-base sm:text-lg font-bold font-editorial text-[#181818]">
              {day.cityName}{" "}
              <span className="text-xs font-normal text-[#6B655E]">
                (Day {day.cityDayNumber})
              </span>
            </h4>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#6B655E] flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#9E978E]" />
              {formattedDate}
            </span>

            <span className="font-bold text-[#181818] bg-[#FAF9F5] px-2.5 py-1 rounded-lg border border-[#E7E2D8]">
              Est. Daily: {formatCurrency(day.estimatedDailyBudget, currency)}
            </span>
          </div>
        </div>

        {/* Notes or Guidance */}
        {day.notes && (
          <p className="text-xs text-[#76546F] italic bg-[#F6F0F5]/60 px-3 py-1.5 rounded-lg border border-[#DBCBD8]/40 my-3">
            📍 {day.notes}
          </p>
        )}

        {/* Activities List */}
        <div className="space-y-3 my-4">
          {day.activities.length > 0 ? (
            day.activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                tripId={trip.id}
                dayNumber={day.dayNumber}
                totalDays={totalDays}
                activity={activity}
              />
            ))
          ) : (
            <div className="text-center py-6 px-4 border border-dashed border-[#E7E2D8] rounded-xl bg-[#FAF9F5]/70">
              <p className="text-xs text-[#9E978E] mb-2 font-medium">
                No activities scheduled for Day {day.dayNumber} yet.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddDrawerOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add First Activity
              </Button>
            </div>
          )}
        </div>

        {/* Day Footer Action */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-[#9E978E]">
            {day.activities.length} planned · {formatCurrency(dailyActivitiesCost, currency)} activities spend
          </span>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAddDrawerOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 text-[#F4A62A]" />}
            className="text-xs font-bold text-[#181818] hover:text-[#F4A62A]"
          >
            + Add Activity
          </Button>
        </div>
      </Card>

      {/* Drawer for adding activity */}
      <AddActivityDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        tripId={trip.id}
        dayNumber={day.dayNumber}
        cityName={day.cityName}
      />
    </div>
  );
}
