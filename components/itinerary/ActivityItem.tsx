"use client";

import React, { useState } from "react";
import { Activity } from "@/types/trip";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import {
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Trash2,
  ArrowRightLeft,
  ChevronDown,
} from "lucide-react";

interface ActivityItemProps {
  tripId: string;
  dayNumber: number;
  totalDays: number;
  activity: Activity;
}

export function ActivityItem({ tripId, dayNumber, totalDays, activity }: ActivityItemProps) {
  const { removeActivityFromDay, moveActivityBetweenDays, toggleActivityCompleted, currency } = useTrips();
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const getCategoryBadgeVariant = (cat: Activity["category"]) => {
    switch (cat) {
      case "culture":
        return "purple";
      case "food":
        return "amber";
      case "adventure":
        return "terracotta";
      case "nature":
        return "emerald";
      case "transport":
        return "cobalt";
      default:
        return "neutral";
    }
  };

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 group bg-white ${
        activity.completed
          ? "border-[#E7E2D8] bg-[#FAF9F5] opacity-75"
          : "border-[#E7E2D8] hover:border-[#D5CEBF] hover:shadow-2xs"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Status & Details */}
        <div className="flex items-start gap-3 min-w-0">
          {/* Checkbox toggle */}
          <button
            onClick={() => toggleActivityCompleted(tripId, dayNumber, activity.id)}
            className="mt-0.5 text-[#9E978E] hover:text-[#1B8755] transition-colors shrink-0"
          >
            {activity.completed ? (
              <CheckCircle2 className="w-5 h-5 text-[#1B8755]" />
            ) : (
              <Circle className="w-5 h-5 text-[#D5CEBF]" />
            )}
          </button>

          <div className="min-w-0">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#181818] bg-[#FAF9F5] px-2 py-0.5 rounded-md border border-[#E7E2D8]">
                <Clock className="w-3 h-3 text-[#76546F]" />
                {activity.timeSlot}
              </span>

              <Badge variant={getCategoryBadgeVariant(activity.category)} size="sm">
                {activity.category}
              </Badge>

              <span className="text-[11px] text-[#6B655E] font-medium">
                {activity.durationMinutes} mins
              </span>
            </div>

            {/* Title & Description */}
            <h5
              className={`font-bold text-sm text-[#181818] leading-tight ${
                activity.completed ? "line-through text-[#9E978E]" : ""
              }`}
            >
              {activity.name}
            </h5>

            <p className="text-xs text-[#6B655E] mt-1 line-clamp-2 leading-relaxed">
              {activity.description}
            </p>

            {/* Location */}
            {activity.location && (
              <div className="flex items-center gap-1 text-[11px] text-[#9E978E] mt-1.5">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{activity.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Cost & Context Actions */}
        <div className="flex flex-col items-end justify-between self-stretch shrink-0">
          <span className="font-extrabold text-xs sm:text-sm text-[#181818] bg-[#FEF7EC] px-2 py-1 rounded-lg border border-[#FCD89C]">
            {activity.cost > 0 ? formatCurrency(activity.cost, currency) : "Free"}
          </span>

          <div className="flex items-center gap-1 mt-2">
            {/* Move to another day dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoveMenu(!showMoveMenu)}
                title="Move to another day"
                className="p-1.5 rounded-lg text-[#9E978E] hover:text-[#181818] hover:bg-[#FAF9F5] transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>

              {showMoveMenu && (
                <div className="absolute right-0 bottom-7 w-36 bg-white rounded-xl shadow-xl border border-[#E7E2D8] py-1 z-20 max-h-48 overflow-y-auto">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[#9E978E] uppercase tracking-wider">
                    Move to Day:
                  </div>
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                    <button
                      key={d}
                      disabled={d === dayNumber}
                      onClick={() => {
                        moveActivityBetweenDays(tripId, dayNumber, d, activity.id);
                        setShowMoveMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#181818] hover:bg-[#FAF9F5] disabled:opacity-40 disabled:bg-transparent"
                    >
                      Day {d} {d === dayNumber ? "(Current)" : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Delete activity */}
            <button
              onClick={() => removeActivityFromDay(tripId, dayNumber, activity.id)}
              title="Delete activity"
              className="p-1.5 rounded-lg text-[#9E978E] hover:text-[#C84B31] hover:bg-[#FDF1EE] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
