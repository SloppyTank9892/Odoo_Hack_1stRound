"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Compass, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeroBannerProps {
  onPlanTrip: () => void;
}

export function HeroBanner({ onPlanTrip }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#181818] text-white p-6 sm:p-10 shadow-lg mb-8">
      {/* Subtle Warm Glow in the background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#F4A62A]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-[#76546F]/25 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs font-semibold text-[#F4A62A] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Warm Modern Explorer</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-editorial leading-tight text-white mb-3">
          Good morning. <br className="hidden sm:inline" />
          Where are you traveling next?
        </h1>

        <p className="text-sm sm:text-base text-[#D5CEBF] font-normal leading-relaxed mb-6 max-w-xl">
          Craft multi-city itineraries, synchronize dates & budgets in real time, and visualize your entire journey in one unified workspace.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            onClick={onPlanTrip}
            leftIcon={<Compass className="w-5 h-5 stroke-[2.2]" />}
            className="shadow-[0_4px_16px_rgba(244,166,42,0.4)]"
          >
            Plan a New Trip
          </Button>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <span>Explore Destinations</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
