"use client";

import React from "react";
import Link from "next/link";
import { Trip } from "@/types/trip";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, calculateTripTotalCost, calculateBudgetPercentage } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import {
  Calendar,
  MapPin,
  Clock,
  Layers,
  Share2,
  BookOpen,
  ArrowLeft,
  DollarSign,
  Sparkles,
  Map,
} from "lucide-react";

interface TripWorkspaceHeaderProps {
  trip: Trip;
  activeTab: "itinerary" | "calendar" | "budget" | "map";
  onTabChange: (tab: "itinerary" | "calendar" | "budget" | "map") => void;
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

  const tabs = [
    { id: "itinerary" as const, label: "Itinerary (Timeline)", icon: Layers },
    { id: "map" as const, label: "Route Map", icon: Map },
    { id: "calendar" as const, label: "Calendar Matrix", icon: Calendar },
    { id: "budget" as const, label: "Budget & Costs", icon: DollarSign, badge: `${budgetPercentage}%` },
  ];

  return (
    <div className="bg-white border-b border-[#E7E2D8] px-4 sm:px-8 pt-4 sm:pt-5 pb-0 flex-shrink-0 z-10 shadow-2xs">
      {/* Back breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <Link
          href="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B655E] hover:text-[#181818] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>My Trips Collection</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleTripPublic(trip.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              trip.isPublic
                ? "bg-[#EDF7F2] text-[#1B8755] border-[#B7E4C7] hover:bg-[#D8F3DC]"
                : "bg-[#FAF9F5] text-[#6B655E] border-[#E7E2D8] hover:bg-[#EFECE6]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{trip.isPublic ? "Public (Live)" : "Make Public"}</span>
          </button>

          <Link
            href={`/share/${trip.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF7EC] text-[#B86E00] hover:bg-[#FCD89C]/50 rounded-xl text-xs font-bold border border-[#FCD89C] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Public Travel Story</span>
          </Link>
        </div>
      </div>

      {/* Main Trip Title & Highlights */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E7E2D8]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Badge variant="amber" size="sm">
              {totalDays} Days Journey
            </Badge>
            <span className="text-xs text-[#6B655E] font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#9E978E]" />
              {trip.startDate} — {trip.endDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-editorial text-[#181818]">
            {trip.name}
          </h1>

          <p className="text-xs sm:text-sm text-[#6B655E] mt-0.5 line-clamp-1">
            {trip.tagline}
          </p>
        </div>

        {/* Dynamic Financial Highlight Pill */}
        <div className="flex items-center gap-3 bg-[#FAF9F5] p-3 rounded-2xl border border-[#E7E2D8] self-start lg:self-auto shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#9E978E] block">
              Estimated Spend
            </span>
            <span className="text-lg font-black text-[#181818]">
              {formatCurrency(totalCost, currency)}
            </span>
          </div>
          <div className="h-8 w-px bg-[#E7E2D8]" />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#9E978E] block">
              Cap Status
            </span>
            <span
              className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                budgetPercentage > 100
                  ? "bg-[#FDF1EE] text-[#C84B31]"
                  : "bg-[#EDF7F2] text-[#1B8755]"
              }`}
            >
              {budgetPercentage}% limit
            </span>
          </div>
        </div>
      </div>

      {/* Contextual Workspace Tab Bar */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pt-2 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "border-[#F4A62A] text-[#181818] bg-[#FAF9F5]/80 rounded-t-xl"
                  : "border-transparent text-[#6B655E] hover:text-[#181818] hover:bg-[#FAF9F5]/40"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#B86E00]" : "text-[#9E978E]"}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    budgetPercentage > 100
                      ? "bg-[#C84B31] text-white"
                      : "bg-[#EFECE6] text-[#6B655E]"
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
