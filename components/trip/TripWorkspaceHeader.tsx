"use client";

import React from "react";
import Link from "next/link";
import { Trip } from "@/types/trip";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar,
  Layers,
  MapPin,
  CalendarDays,
  Sparkles,
  BookOpen,
  ArrowLeft,
  PieChart,
} from "lucide-react";
import {
  calculateTripTotalCost,
  calculateBudgetPercentage,
  formatCurrency,
} from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";

interface TripWorkspaceHeaderProps {
  trip: Trip;
  activeTab: "itinerary" | "map" | "calendar" | "budget";
  onTabChange: (tab: "itinerary" | "map" | "calendar" | "budget") => void;
}

export function TripWorkspaceHeader({
  trip,
  activeTab,
  onTabChange,
}: TripWorkspaceHeaderProps) {
  const { currency, lastRecalculatedField, toggleTripPublic } = useTrips();
  const totalCost = calculateTripTotalCost(trip);
  const budgetPercentage = calculateBudgetPercentage(trip);
  const totalDays = trip.days.length;

  const tabs: Array<{
    id: "itinerary" | "map" | "calendar" | "budget";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }> = [
    { id: "itinerary", label: "Itinerary Timeline", icon: Layers },
    { id: "map", label: "Route Map", icon: MapPin },
    { id: "calendar", label: "Calendar Sync", icon: CalendarDays },
    { id: "budget", label: "Financial Engine", icon: PieChart, badge: `${budgetPercentage}%` },
  ];

  return (
    <div className="bg-white dark:bg-[#181816] border-b border-[#E7E2D8] dark:border-[#33302B] px-4 sm:px-8 pt-4 sm:pt-5 pb-0 flex-shrink-0 z-10 shadow-2xs transition-colors">
      {/* Back breadcrumb & Public toggle */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <Link
          href="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>My Trips Collection</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleTripPublic(trip.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              trip.isPublic
                ? "bg-[#EDF7F2] dark:bg-[#132D20] text-[#1B8755] dark:text-[#34D399] border-[#B7E4C7] dark:border-[#1E4B33] hover:bg-[#D8F3DC]"
                : "bg-[#FAF9F5] dark:bg-[#201F1B] text-[#6B655E] dark:text-[#A8A196] border-[#E7E2D8] dark:border-[#33302B] hover:bg-[#EFECE6] dark:hover:bg-[#2A2824]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{trip.isPublic ? "Public (Live)" : "Make Public"}</span>
          </button>

          <Link
            href={`/share/${trip.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF7EC] dark:bg-[#2B2113] text-[#B86E00] dark:text-[#F4A62A] hover:bg-[#FCD89C]/50 dark:hover:bg-[#5E431E] rounded-xl text-xs font-bold border border-[#FCD89C] dark:border-[#5E431E] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{trip.isPublic ? "Public Story (Live)" : "Preview Story (Private)"}</span>
          </Link>
        </div>
      </div>

      {/* Main Trip Title & Highlights */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E7E2D8] dark:border-[#33302B]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Badge variant="amber" size="sm">
              {totalDays} Days Journey
            </Badge>
            <span className="text-xs text-[#6B655E] dark:text-[#A8A196] font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#9E978E] dark:text-[#7A746B]" />
              {trip.startDate} — {trip.endDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-editorial text-[#181818] dark:text-[#F5F3EF]">
            {trip.name}
          </h1>

          <p className="text-xs sm:text-sm text-[#6B655E] dark:text-[#A8A196] mt-0.5 line-clamp-1">
            {trip.tagline}
          </p>
        </div>

        {/* Dynamic Financial Highlight Pill */}
        <div className="flex items-center gap-3 bg-[#FAF9F5] dark:bg-[#24221E] p-3 rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] self-start lg:self-auto shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#9E978E] dark:text-[#7A746B] block">
              Estimated Spend
            </span>
            <span className="text-lg font-black text-[#181818] dark:text-[#F5F3EF]">
              {formatCurrency(totalCost, currency)}
            </span>
          </div>
          <div className="h-8 w-px bg-[#E7E2D8] dark:bg-[#33302B]" />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#9E978E] dark:text-[#7A746B] block">
              Cap Status
            </span>
            <span
              className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                budgetPercentage > 100
                  ? "bg-[#FDF1EE] dark:bg-[#3A1713] text-[#C84B31] dark:text-[#F87171]"
                  : "bg-[#EDF7F2] dark:bg-[#132D20] text-[#1B8755] dark:text-[#34D399]"
              }`}
            >
              {budgetPercentage}% limit
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pt-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "border-[#F4A62A] text-[#181818] dark:text-[#F5F3EF] bg-[#FAF9F5]/80 dark:bg-[#24221E]/80 rounded-t-xl"
                  : "border-transparent text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF] hover:bg-[#FAF9F5]/40 dark:hover:bg-[#24221E]/40"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#B86E00] dark:text-[#F4A62A]" : "text-[#9E978E] dark:text-[#7A746B]"}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    budgetPercentage > 100
                      ? "bg-[#C84B31] text-white"
                      : "bg-[#EFECE6] dark:bg-[#2E2C29] text-[#6B655E] dark:text-[#A8A196]"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
