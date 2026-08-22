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
      className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 group bg-white dark:bg-[#1C1B18] ${
        activity.completed
          ? "border-[#E7E2D8] dark:border-[#33302B] bg-[#FAF9F5] dark:bg-[#181715] opacity-75"
          : "border-[#E7E2D8] dark:border-[#33302B] hover:border-[#D5CEBF] dark:hover:border-[#48443D] hover:shadow-2xs"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Status & Details */}
        <div className="flex items-start gap-3 min-w-0">
          {/* Checkbox toggle */}
          <button
            onClick={() => toggleActivityCompleted(tripId, dayNumber, activity.id)}
            className="mt-0.5 text-[#9E978E] hover:text-[#1B8755] dark:hover:text-[#34D399] transition-colors shrink-0 cursor-pointer"
          >
            {activity.completed ? (
              <CheckCircle2 className="w-5 h-5 text-[#1B8755] dark:text-[#34D399]" />
            ) : (
              <Circle className="w-5 h-5 text-[#D5CEBF] dark:text-[#48443D]" />
            )}
          </button>

          <div className="min-w-0">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#181818] dark:text-[#F5F3EF] bg-[#FAF9F5] dark:bg-[#24221E] px-2 py-0.5 rounded-md border border-[#E7E2D8] dark:border-[#33302B]">
                <Clock className="w-3 h-3 text-[#76546F] dark:text-[#B88BAF]" />
                {activity.timeSlot}
              </span>

              <Badge variant={getCategoryBadgeVariant(activity.category)} size="sm">
                {activity.category}
              </Badge>

              <span className="text-[11px] text-[#6B655E] dark:text-[#A8A196] font-medium">
                {activity.durationMinutes} mins
              </span>
            </div>

            {/* Title & Description */}
            <h5
              className={`font-bold text-sm text-[#181818] dark:text-[#F5F3EF] leading-tight ${
                activity.completed ? "line-through text-[#9E978E] dark:text-[#7A746B]" : ""
              }`}
            >
              {activity.name}
            </h5>

            <p className="text-xs text-[#6B655E] dark:text-[#A8A196] mt-1 line-clamp-2 leading-relaxed">
              {activity.description}
            </p>

            {/* Location */}
            {activity.location && (
              <div className="flex items-center gap-1 text-[11px] text-[#9E978E] dark:text-[#7A746B] mt-1.5">
                <MapPin className="w-3 h-3 shrink-0 text-[#F4A62A]" />
                <span className="truncate">{activity.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Cost & Context Actions */}
        <div className="flex flex-col items-end justify-between self-stretch shrink-0">
          <span className="font-extrabold text-xs sm:text-sm text-[#181818] dark:text-[#F5F3EF] bg-[#FEF7EC] dark:bg-[#2B2113] px-2 py-1 rounded-lg border border-[#FCD89C] dark:border-[#5E431E]">
            {activity.cost > 0 ? formatCurrency(activity.cost, currency) : "Free"}
          </span>

          <div className="flex items-center gap-1 mt-2">
            {/* Move to another day dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoveMenu(!showMoveMenu)}
                title="Move to another day"
                className="p-1.5 rounded-lg text-[#9E978E] hover:text-[#181818] dark:hover:text-[#F5F3EF] hover:bg-[#FAF9F5] dark:hover:bg-[#24221E] transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>

              {showMoveMenu && (
                <div className="absolute right-0 bottom-7 w-36 bg-white dark:bg-[#1C1B18] rounded-xl shadow-xl border border-[#E7E2D8] dark:border-[#33302B] py-1 z-20 max-h-48 overflow-y-auto">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[#9E978E] dark:text-[#7A746B] uppercase tracking-wider">
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
                      className="w-full text-left px-3 py-1.5 text-xs text-[#181818] dark:text-[#F5F3EF] hover:bg-[#FAF9F5] dark:hover:bg-[#24221E] disabled:opacity-40 disabled:bg-transparent cursor-pointer"
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
              className="p-1.5 rounded-lg text-[#9E978E] hover:text-[#C84B31] hover:bg-[#FDF1EE] dark:hover:bg-[#3A1713] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
