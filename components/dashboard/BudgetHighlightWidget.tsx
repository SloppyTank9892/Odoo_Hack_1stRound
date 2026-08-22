"use client";

import React from "react";
import { useTrips } from "@/context/TripContext";
import { Card } from "@/components/ui/Card";
import { formatCurrency, calculateTripTotalCost } from "@/lib/tripCalculations";
import { Wallet, CalendarDays, MapPin, CheckCircle2, TrendingUp } from "lucide-react";

export function BudgetHighlightWidget() {
  const { trips, activeTrip, currency } = useTrips();

  const totalBudgetAcrossTrips = trips.reduce(
    (acc, t) => acc + calculateTripTotalCost(t),
    0
  );
  const totalDaysAcrossTrips = trips.reduce((acc, t) => acc + t.days.length, 0);
  const totalStops = trips.reduce((acc, t) => acc + t.stops.length, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      {/* 1. Total Managed Budget Card */}
      <Card className="bg-[#FEF7EC] dark:bg-[#201A10] border-[#FCD89C] dark:border-[#4A3314] p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#B86E00] dark:text-[#F4A62A] uppercase tracking-wider">
            Total Managed Budget
          </span>
          <div className="w-8 h-8 rounded-full bg-[#F4A62A]/20 dark:bg-[#F4A62A]/30 flex items-center justify-center text-[#B86E00] dark:text-[#F4A62A]">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-[#181818] dark:text-[#F5F3EF]">
          {formatCurrency(totalBudgetAcrossTrips, currency)}
        </div>
        <p className="text-[11px] text-[#6B655E] dark:text-[#A8A196] mt-1">
          Across {trips.length} active itineraries
        </p>
      </Card>

      {/* 2. Planned Travel Days Card */}
      <Card className="bg-[#F6F0F5] dark:bg-[#221721] border-[#DBCBD8] dark:border-[#452D42] p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#76546F] dark:text-[#B88BAF] uppercase tracking-wider">
            Planned Travel Days
          </span>
          <div className="w-8 h-8 rounded-full bg-[#76546F]/20 dark:bg-[#76546F]/30 flex items-center justify-center text-[#76546F] dark:text-[#B88BAF]">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-[#181818] dark:text-[#F5F3EF]">
          {totalDaysAcrossTrips} Days
        </div>
        <p className="text-[11px] text-[#6B655E] dark:text-[#A8A196] mt-1">
          {totalStops} unique cities & regions
        </p>
      </Card>

      {/* 3. Dynamic Sync Engine Card */}
      <Card className="bg-[#EDF7F2] dark:bg-[#102318] border-[#BDE3CF] dark:border-[#1E4B33] p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#1B8755] dark:text-[#34D399] uppercase tracking-wider">
            Dynamic Sync Engine
          </span>
          <div className="w-8 h-8 rounded-full bg-[#1B8755]/20 dark:bg-[#1B8755]/30 flex items-center justify-center text-[#1B8755] dark:text-[#34D399]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-[#1B8755] dark:text-[#34D399]">
          100% Live
        </div>
        <p className="text-[11px] text-[#6B655E] dark:text-[#A8A196] mt-1">
          Timeline, budget & calendar connected
        </p>
      </Card>
    </div>
  );
}
