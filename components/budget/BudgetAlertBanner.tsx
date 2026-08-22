"use client";

import React from "react";
import { Trip } from "@/types/trip";
import { formatCurrency, calculateTripTotalCost } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { AlertTriangle, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

interface BudgetAlertBannerProps {
  trip: Trip;
}

export function BudgetAlertBanner({ trip }: BudgetAlertBannerProps) {
  const { currency, updateTargetBudget } = useTrips();
  const totalCost = calculateTripTotalCost(trip);
  const target = trip.budget.targetBudget;
  const isOver = totalCost > target;
  const overAmount = totalCost - target;

  if (!isOver) {
    return (
      <div className="p-4 rounded-2xl bg-[#EDF7F2] border border-[#BDE3CF] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1B8755]/20 text-[#1B8755] flex items-center justify-center font-bold shrink-0">
            ✓
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1B8755]">
              Budget is On Target
            </h4>
            <p className="text-xs text-[#6B655E]">
              You have {formatCurrency(target - totalCost, currency)} remaining under your {formatCurrency(target, currency)} limit.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#1B8755] bg-white px-2.5 py-1 rounded-lg border border-[#BDE3CF] shrink-0">
          Positive Runway
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#FDF1EE] border border-[#F8CEC4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in shake duration-300">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-full bg-[#C84B31]/20 text-[#C84B31] flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-extrabold text-[#C84B31]">
              Over-Budget Alert: {formatCurrency(overAmount, currency)} Above Target
            </h4>
            <span className="text-[10px] bg-[#C84B31] text-white font-bold px-2 py-0.5 rounded-full">
              Attention Needed
            </span>
          </div>
          <p className="text-xs text-[#6B655E] mt-1 leading-relaxed">
            The total estimated expenses ({formatCurrency(totalCost, currency)}) exceed your current cap of {formatCurrency(target, currency)}. Review high-cost excursions or extend your target budget limit.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <button
          onClick={() => updateTargetBudget(trip.id, Math.ceil(totalCost / 5000) * 5000)}
          className="px-3.5 py-2 rounded-xl bg-[#C84B31] hover:bg-[#B03C24] text-white text-xs font-bold transition-colors shadow-xs"
        >
          Auto-Adjust Cap to {formatCurrency(Math.ceil(totalCost / 5000) * 5000, currency)}
        </button>
      </div>
    </div>
  );
}
