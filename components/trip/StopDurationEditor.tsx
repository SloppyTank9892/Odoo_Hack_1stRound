"use client";

import React, { useState } from "react";
import { DestinationStop, Trip } from "@/types/trip";
import { useTrips } from "@/context/TripContext";
import { formatCurrency } from "@/lib/tripCalculations";
import { Minus, Plus, Sparkles, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface StopDurationEditorProps {
  trip: Trip;
  stop: DestinationStop;
  isJaipurDemo?: boolean;
}

export function StopDurationEditor({ trip, stop, isJaipurDemo }: StopDurationEditorProps) {
  const { updateStopDuration, lastRecalculatedField, currency } = useTrips();
  const isRecalculated = lastRecalculatedField === `stop-duration-${stop.id}`;

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stop.daysCount > 1) {
      updateStopDuration(trip.id, stop.id, stop.daysCount - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stop.daysCount < 14) {
      updateStopDuration(trip.id, stop.id, stop.daysCount + 1);
      if (stop.id === "jaipur" && stop.daysCount === 2) {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div
      className={`p-3 sm:p-4 rounded-2xl border transition-all duration-300 ${
        isRecalculated
          ? "bg-[#FEF7EC] border-[#F4A62A] shadow-md ring-2 ring-[#F4A62A]/40"
          : "bg-white border-[#E7E2D8]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={stop.image}
            alt={stop.cityName}
            className="w-12 h-12 rounded-xl object-cover border border-[#E7E2D8] shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-sm text-[#181818] truncate">{stop.cityName}</h4>
              {stop.id === "jaipur" && (
                <span className="text-[10px] bg-[#F6F0F5] text-[#76546F] font-bold px-2 py-0.5 rounded-full border border-[#DBCBD8]">
                  Demo Focus
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#6B655E] truncate">
              {formatCurrency(stop.accommodationPerNight, currency)}/night stay · {formatCurrency(stop.dailyMealsEstimate, currency)}/day meals
            </p>
          </div>
        </div>

        {/* Counter controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl p-1">
            <button
              onClick={handleDecrease}
              disabled={stop.daysCount <= 1}
              aria-label="Decrease days"
              className="w-7 h-7 rounded-lg bg-white border border-[#E7E2D8] text-[#181818] flex items-center justify-center hover:bg-[#FAF9F5] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-bold text-xs sm:text-sm text-[#181818]">
              {stop.daysCount}d
            </span>
            <button
              onClick={handleIncrease}
              disabled={stop.daysCount >= 14}
              aria-label="Increase days"
              className="w-7 h-7 rounded-lg bg-[#F4A62A] text-[#181818] flex items-center justify-center hover:bg-[#E09115] disabled:opacity-30 disabled:pointer-events-none font-bold transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Demo callout badge for Jaipur */}
      {stop.id === "jaipur" && (
        <div className="mt-2.5 pt-2 border-t border-[#E7E2D8] flex items-start gap-1.5 text-[11px] text-[#76546F]">
          <Sparkles className="w-3.5 h-3.5 text-[#F4A62A] shrink-0 mt-0.5" />
          <span>
            {stop.daysCount === 2 ? (
              <span>
                <strong>Try changing to 3 days</strong>: Watch dates, timeline, Udaipur schedule, and budget synchronize instantly.
              </span>
            ) : (
              <span className="text-[#1B8755] font-semibold">
                ✨ WOW synced: Total duration expanded, Udaipur shifted, and budget updated!
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
