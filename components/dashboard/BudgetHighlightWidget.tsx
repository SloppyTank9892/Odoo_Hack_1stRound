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
      <Card className="bg-[#FEF7EC] border-[#FCD89C] p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#B86E00] uppercase tracking-wider">
            Total Managed Budget
          </span>
          <div className="w-8 h-8 rounded-full bg-[#F4A62A]/20 flex items-center justify-center text-[#B86E00]">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-[#181818]">
          {formatCurrency(totalBudgetAcrossTrips, currency)}
        </div>
        <p className="text-[11px] text-[#6B655E] mt-1">
          Across {trips.length} active itineraries
        </p>
      </Card>

      <Card className="bg-[#F6F0F5] border-[#DBCBD8] p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#76546F] uppercase tracking-wider">
            Planned Travel Days
          </span>
          <div className="w-8 h-8 rounded-full bg-[#76546F]/20 flex items-center justify-center text-[#76546F]">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-[#181818]">
          {totalDaysAcrossTrips} Days
        </div>
        <p className="text-[11px] text-[#6B655E] mt-1">
          {totalStops} unique cities & regions
        </p>
      </Card>

      <Card className="bg-[#EDF7F2] border-[#BDE3CF] p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#1B8755] uppercase tracking-wider">
            Dynamic Sync Engine
          </span>
          <div className="w-8 h-8 rounded-full bg-[#1B8755]/20 flex items-center justify-center text-[#1B8755]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-[#1B8755]">
          100% Live
        </div>
        <p className="text-[11px] text-[#6B655E] mt-1">
          Timeline, budget & calendar connected
        </p>
      </Card>
    </div>
  );
}
