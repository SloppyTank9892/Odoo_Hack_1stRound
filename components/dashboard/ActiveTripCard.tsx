"use client";

import React from "react";
import Link from "next/link";
import { Trip } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency, calculateTripTotalCost, calculateBudgetPercentage } from "@/lib/tripCalculations";
import { Calendar, ArrowRight, Layers } from "lucide-react";

interface ActiveTripCardProps {
  trip: Trip;
}

export function ActiveTripCard({ trip }: ActiveTripCardProps) {
  const totalCost = calculateTripTotalCost(trip);
  const budgetPercentage = calculateBudgetPercentage(trip);
  const totalDays = trip.days.length;
  const avgDaily = totalDays > 0 ? Math.round(totalCost / totalDays) : 0;

  return (
    <div className="rounded-3xl border border-[#E7E2D8] dark:border-[#33302B] bg-white dark:bg-[#1C1B18] overflow-hidden isolate shadow-xs hover:shadow-md dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 mb-8 group">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[340px]">
        {/* Left Visual Banner with Curved Isolated Container */}
        <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[260px] overflow-hidden isolate rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
          <img
            src={trip.coverImage}
            alt={`${trip.name} cover`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform rounded-[inherit]"
          />
          {/* Smooth, Cinematic Full-Coverage Vignette Tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 lg:bg-gradient-to-r lg:from-black/40 lg:via-black/20 lg:to-black/60 pointer-events-none rounded-[inherit]" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            <Badge variant="amber" size="sm" className="shadow-xs">
              Current Spotlight
            </Badge>
            <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs">
              {totalDays} Days · {trip.stops.length} Cities
            </span>
          </div>

          {/* Mobile Overlay Title */}
          <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden z-10">
            <h2 className="text-xl font-bold font-editorial leading-tight">{trip.name}</h2>
            <p className="text-xs text-[#D5CEBF] line-clamp-1 mt-0.5">{trip.tagline}</p>
          </div>
        </div>

        {/* Right Info & Metrics Panel */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#1C1B18] text-[#181818] dark:text-[#F5F3EF] transition-colors">
          <div>
            {/* Top Subtitle & Dates */}
            <div className="hidden lg:flex items-center justify-between gap-4 mb-2">
              <span className="text-[11px] font-bold text-[#76546F] dark:text-[#B88BAF] uppercase tracking-wider">
                Multi-City Itinerary
              </span>
              <span className="text-xs text-[#6B655E] dark:text-[#A8A196] flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#9E978E] dark:text-[#7A746B]" />
                {trip.startDate} — {trip.endDate}
              </span>
            </div>

            {/* Desktop Headline */}
            <h2 className="hidden lg:block text-2xl sm:text-3xl font-bold font-editorial text-[#181818] dark:text-[#F5F3EF] mb-1.5 leading-tight">
              {trip.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B655E] dark:text-[#A8A196] mb-5 line-clamp-2 leading-relaxed">
              {trip.description}
            </p>

            {/* Route Breadcrumbs */}
            <div className="p-3 bg-[#FAF9F5] dark:bg-[#24221E] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] mb-5">
              <span className="block text-[10px] font-bold text-[#9E978E] dark:text-[#7A746B] uppercase tracking-wider mb-1.5">
                Route Map
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[#181818] dark:text-[#F5F3EF]">
                {trip.stops.map((stop, idx) => (
                  <React.Fragment key={stop.id}>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-[#1C1B18] rounded-lg border border-[#E7E2D8] dark:border-[#33302B] shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F4A62A]" />
                      <span>{stop.cityName}</span>
                      <span className="text-[10px] font-normal text-[#6B655E] dark:text-[#A8A196]">
                        ({stop.daysCount}d)
                      </span>
                    </span>
                    {idx < trip.stops.length - 1 && (
                      <span className="text-[#9E978E] dark:text-[#7A746B] text-xs px-0.5">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Financial Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-3">
              <div>
                <span className="block text-[11px] text-[#9E978E] dark:text-[#7A746B] font-medium">
                  Estimated Budget
                </span>
                <span className="text-base sm:text-xl font-extrabold text-[#181818] dark:text-[#F5F3EF]">
                  {formatCurrency(totalCost, trip.budget.currency)}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-[#9E978E] dark:text-[#7A746B] font-medium">
                  Daily Average
                </span>
                <span className="text-base sm:text-xl font-extrabold text-[#76546F] dark:text-[#B88BAF]">
                  {formatCurrency(avgDaily, trip.budget.currency)}
                  <span className="text-[11px] font-normal text-[#9E978E] dark:text-[#7A746B]">/day</span>
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[11px] text-[#9E978E] dark:text-[#7A746B] font-medium">
                  Budget Status
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#1B8755] dark:text-[#34D399]">
                  {budgetPercentage}% of {formatCurrency(trip.budget.targetBudget, trip.budget.currency)}
                </span>
              </div>
            </div>

            <ProgressBar value={budgetPercentage} size="sm" className="mb-4" />
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#E7E2D8] dark:border-[#33302B] flex items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-2 text-xs text-[#6B655E] dark:text-[#A8A196]">
              <Layers className="w-4 h-4 text-[#76546F] dark:text-[#B88BAF]" />
              <span>
                {trip.days.reduce((acc, d) => acc + d.activities.length, 0)} scheduled activities
              </span>
            </div>

            <Link
              href={`/trips/${trip.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#181818] dark:bg-[#F4A62A] hover:bg-[#F4A62A] dark:hover:bg-[#E09115] text-white dark:text-[#181818] rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs group/btn cursor-pointer"
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
