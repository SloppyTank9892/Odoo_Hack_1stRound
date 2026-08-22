"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trip } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency, calculateTripTotalCost, calculateBudgetPercentage } from "@/lib/tripCalculations";
import { Calendar, MapPin, ArrowRight, Layers, DollarSign } from "lucide-react";

interface ActiveTripCardProps {
  trip: Trip;
}

export function ActiveTripCard({ trip }: ActiveTripCardProps) {
  const totalCost = calculateTripTotalCost(trip);
  const budgetPercentage = calculateBudgetPercentage(trip);
  const totalDays = trip.days.length;
  const avgDaily = totalDays > 0 ? Math.round(totalCost / totalDays) : 0;

  return (
    <Card className="overflow-hidden p-0 border-[#E7E2D8] mb-8 group" hover>
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Visual Banner */}
        <div className="lg:col-span-5 relative h-56 lg:h-auto min-h-[220px]">
          <img
            src={trip.coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/60" />

          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="amber" size="sm">
              Current Spotlight
            </Badge>
            <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
              {totalDays} Days · {trip.stops.length} Cities
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden">
            <h2 className="text-xl font-bold font-editorial">{trip.name}</h2>
            <p className="text-xs text-white/80 line-clamp-1">{trip.tagline}</p>
          </div>
        </div>

        {/* Right Info & Metrics Panel */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="hidden lg:flex items-center justify-between gap-4 mb-2">
              <span className="text-[11px] font-bold text-[#76546F] uppercase tracking-wider">
                Multi-City Itinerary
              </span>
              <span className="text-xs text-[#6B655E] flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#9E978E]" />
                {trip.startDate} — {trip.endDate}
              </span>
            </div>

            <h2 className="hidden lg:block text-2xl font-bold font-editorial text-[#181818] mb-1">
              {trip.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B655E] mb-4 line-clamp-2">
              {trip.description}
            </p>

            {/* Route Breadcrumb */}
            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E2D8] mb-5">
              <span className="block text-[10px] font-bold text-[#9E978E] uppercase tracking-wider mb-1">
                Route Map
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[#181818]">
                {trip.stops.map((stop, idx) => (
                  <React.Fragment key={stop.id}>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-md border border-[#E7E2D8]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F4A62A]" />
                      {stop.cityName}
                      <span className="text-[10px] font-normal text-[#6B655E]">({stop.daysCount}d)</span>
                    </span>
                    {idx < trip.stops.length - 1 && (
                      <span className="text-[#9E978E] text-xs">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Financial Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="block text-[11px] text-[#9E978E] font-medium">Estimated Budget</span>
                <span className="text-base sm:text-lg font-extrabold text-[#181818]">
                  {formatCurrency(totalCost, trip.budget.currency)}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-[#9E978E] font-medium">Daily Average</span>
                <span className="text-base sm:text-lg font-extrabold text-[#76546F]">
                  {formatCurrency(avgDaily, trip.budget.currency)}
                  <span className="text-[11px] font-normal text-[#9E978E]">/day</span>
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[11px] text-[#9E978E] font-medium">Budget Status</span>
                <span className="text-sm font-bold text-[#1B8755]">
                  {budgetPercentage}% of {formatCurrency(trip.budget.targetBudget, trip.budget.currency)}
                </span>
              </div>
            </div>

            <ProgressBar value={budgetPercentage} size="sm" className="mb-4" />
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#E7E2D8] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#6B655E]">
              <Layers className="w-4 h-4 text-[#76546F]" />
              <span>
                {trip.days.reduce((acc, d) => acc + d.activities.length, 0)} planned activities
              </span>
            </div>

            <Link
              href={`/trips/${trip.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#181818] hover:bg-[#F4A62A] text-white hover:text-[#181818] rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs group/btn"
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
