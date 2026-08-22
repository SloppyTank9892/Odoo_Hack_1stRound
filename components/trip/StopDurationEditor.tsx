"use client";

import React, { useState } from "react";
import { DestinationStop, Trip } from "@/types/trip";
import { useTrips } from "@/context/TripContext";
import { formatCurrency } from "@/lib/tripCalculations";
import { Minus, Plus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface StopDurationEditorProps {
  trip: Trip;
  stop: DestinationStop;
  isJaipurDemo?: boolean;
}

export function StopDurationEditor({ trip, stop }: StopDurationEditorProps) {
  const { updateStopDuration, lastRecalculatedField, currency } = useTrips();
  const isRecalculated = lastRecalculatedField === `stop-duration-${stop.id}`;

  // Track which stops are "cascading" (all stops after the changed one)
  const stopIndex = trip.stops.findIndex((s) => s.id === stop.id);
  const isDownstream =
    lastRecalculatedField?.startsWith("stop-duration-") &&
    lastRecalculatedField !== `stop-duration-${stop.id}` &&
    (() => {
      const changedId = lastRecalculatedField?.replace("stop-duration-", "");
      const changedIdx = trip.stops.findIndex((s) => s.id === changedId);
      return changedIdx !== -1 && stopIndex > changedIdx;
    })();

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
          ? "bg-[#FEF7EC] dark:bg-[#2B2113] border-[#F4A62A] shadow-md ring-2 ring-[#F4A62A]/40"
          : isDownstream
          ? "bg-[#FFFDF7] dark:bg-[#221C14] border-[#F4A62A] shadow-xs"
          : "bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={stop.image}
            alt={stop.cityName}
            className="w-12 h-12 rounded-xl object-cover border border-[#E7E2D8] dark:border-[#33302B] shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-sm text-[#181818] dark:text-[#F5F3EF] truncate">{stop.cityName}</h4>
              {stop.id === "jaipur" && (
                <span className="text-[10px] bg-[#F6F0F5] dark:bg-[#2A1D28] text-[#76546F] dark:text-[#B88BAF] font-bold px-2 py-0.5 rounded-full border border-[#DBCBD8] dark:border-[#4D3349]">
                  Demo Focus
                </span>
              )}
              {/* Cascade indicator badge */}
              <AnimatePresence>
                {isDownstream && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="text-[9px] bg-[#FEF7EC] dark:bg-[#2B2113] text-[#B86E00] dark:text-[#F4A62A] font-black px-1.5 py-0.5 rounded-full border border-[#FCD89C] dark:border-[#5E431E]"
                  >
                    ↺ shifted
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <p className="text-[11px] text-[#6B655E] dark:text-[#A8A196] truncate">
              {formatCurrency(stop.accommodationPerNight, currency)}/night ·{" "}
              {formatCurrency(stop.dailyMealsEstimate, currency)}/day meals
            </p>

            {/* Cascaded date display */}
            {stop.startDate && stop.endDate && (
              <p className="text-[10px] text-[#76546F] dark:text-[#B88BAF] font-semibold mt-0.5">
                {new Date(stop.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                →{" "}
                {new Date(stop.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        {/* Counter controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl p-1">
            <button
              onClick={handleDecrease}
              disabled={stop.daysCount <= 1}
              aria-label="Decrease days"
              className="w-7 h-7 rounded-lg bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] text-[#181818] dark:text-[#F5F3EF] flex items-center justify-center hover:bg-[#FAF9F5] dark:hover:bg-[#282622] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="w-10 text-center font-bold text-xs sm:text-sm text-[#181818] dark:text-[#F5F3EF]">
              {stop.daysCount}d
            </span>

            <button
              onClick={handleIncrease}
              disabled={stop.daysCount >= 14}
              aria-label="Increase days"
              className="w-7 h-7 rounded-lg bg-[#F4A62A] text-[#181818] flex items-center justify-center hover:bg-[#E09115] disabled:opacity-30 disabled:pointer-events-none font-bold transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Demo callout for Jaipur */}
      {stop.id === "jaipur" && (
        <div className="mt-2.5 pt-2 border-t border-[#E7E2D8] dark:border-[#33302B] flex items-start gap-1.5 text-[11px] text-[#76546F] dark:text-[#B88BAF]">
          <Sparkles className="w-3.5 h-3.5 text-[#F4A62A] shrink-0 mt-0.5" />
          <span>
            {stop.daysCount === 2 ? (
              <span>
                <strong>Try changing to 3 days</strong>: Watch dates, timeline, Udaipur schedule,
                and budget synchronize instantly.
              </span>
            ) : (
              <span className="text-[#1B8755] dark:text-[#34D399] font-semibold">
                ✨ WOW synced: Total duration expanded, Udaipur shifted, and budget updated!
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
