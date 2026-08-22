"use client";

import React from "react";
import Link from "next/link";
import { Search, Globe2, Sparkles, Plus, ChevronDown } from "lucide-react";
import { useTrips } from "@/context/TripContext";
import { Button } from "@/components/ui/Button";

interface TopBarProps {
  onOpenCreateTrip: () => void;
}

export function TopBar({ onOpenCreateTrip }: TopBarProps) {
  const { trips, activeTrip, setActiveTripId, currency, setCurrency, searchQuery, setSearchQuery } = useTrips();

  return (
    <header className="sticky top-0 z-20 bg-[#F7F6F2]/90 backdrop-blur-md border-b border-[#E7E2D8] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Mobile Brand / Desktop Title Area */}
      <div className="flex items-center gap-3 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#F4A62A] flex items-center justify-center text-[#181818]">
            <Globe2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-bold text-sm tracking-tight text-[#181818]">GlobeTrotter</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-[#9E978E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search destinations, stops, activities..."
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E7E2D8] rounded-xl text-[#181818] placeholder-[#9E978E] focus:outline-none focus:ring-2 focus:ring-[#F4A62A] focus:border-transparent transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E978E] hover:text-[#181818]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Trip Quick Selector */}
        <div className="relative hidden lg:block">
          <select
            value={activeTrip.id}
            onChange={(e) => setActiveTripId(e.target.value)}
            className="appearance-none bg-white border border-[#E7E2D8] text-xs font-semibold text-[#181818] py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4A62A] shadow-2xs cursor-pointer"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                📍 {t.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#9E978E] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Currency Switcher */}
        <div className="flex bg-white rounded-xl border border-[#E7E2D8] p-0.5 text-xs font-bold shadow-2xs">
          <button
            onClick={() => setCurrency("₹")}
            className={`px-2 py-1 rounded-lg transition-colors ${
              currency === "₹" ? "bg-[#FEF7EC] text-[#B86E00] font-bold" : "text-[#9E978E] hover:text-[#181818]"
            }`}
          >
            ₹ INR
          </button>
          <button
            onClick={() => setCurrency("$")}
            className={`px-2 py-1 rounded-lg transition-colors ${
              currency === "$" ? "bg-[#FEF7EC] text-[#B86E00] font-bold" : "text-[#9E978E] hover:text-[#181818]"
            }`}
          >
            $ USD
          </button>
        </div>

        {/* Plan Trip Button */}
        <div className="hidden sm:block">
          <Button
            size="sm"
            onClick={onOpenCreateTrip}
            leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          >
            Plan Trip
          </Button>
        </div>

        {/* Auth / Guest Link */}
        <Link
          href="/auth"
          className="text-xs font-semibold text-[#76546F] hover:text-[#181818] px-2.5 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-[#E7E2D8] transition-colors"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}
