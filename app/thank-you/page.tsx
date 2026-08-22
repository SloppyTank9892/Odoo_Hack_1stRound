"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { CheckCircle2, Sparkles, MapPinned, Calendar, ArrowRight, Share2, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTrips } from "@/context/TripContext";
import { formatCurrency, calculateTripTotalCost } from "@/lib/tripCalculations";
import { AppShell } from "@/components/layout/AppShell";

export default function ThankYouPage() {
  const { activeTrip, currency } = useTrips();

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F4A62A", "#76546F", "#1B8755", "#E09115", "#FAF9F5"],
      });
    } catch (e) {
      // Ignore on server/restricted env
    }
  }, []);

  const targetTrip = activeTrip || null;
  const totalCost = targetTrip ? calculateTripTotalCost(targetTrip) : 0;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-6 sm:py-12 px-4 text-center">
        {/* Celebration Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF7EC] border border-[#FCD89C] text-xs font-semibold text-[#B86E00] mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F4A62A]" />
          <span>Itinerary Successfully Synchronized</span>
        </div>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-[#EDF7F2] border border-[#A3D9BE] text-[#1B8755] flex items-center justify-center mx-auto mb-6 shadow-xs">
          <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#181818] mb-3">
          Your Journey Is Ready!
        </h1>

        <p className="text-sm sm:text-base text-[#6B655E] max-w-lg mx-auto mb-8">
          Thank you for planning with GlobeTrotter. Your multi-city itinerary, daily schedules, and
          budget benchmarks are fully compiled and live.
        </p>

        {/* Trip Card Spotlight */}
        {targetTrip ? (
          <div className="bg-white rounded-3xl border border-[#E7E2D8] p-6 sm:p-8 text-left mb-8 shadow-xs max-w-xl mx-auto transition-colors">
            <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#76546F] uppercase tracking-wider block">
                  Active Itinerary
                </span>
                <h2 className="text-xl font-bold font-editorial text-[#181818]">
                  {targetTrip.name}
                </h2>
              </div>
              <span className="text-xs font-bold text-[#1B8755] bg-[#EDF7F2] px-2.5 py-1 rounded-full border border-[#A3D9BE]/50">
                Live & Synced
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-[#6B655E] mb-6">
              <div className="flex items-center gap-2">
                <MapPinned className="w-4 h-4 text-[#F4A62A]" />
                <span>
                  <strong className="text-[#181818]">Route:</strong> {targetTrip.stops.map((s) => s.cityName).join(" → ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#76546F]" />
                <span>
                  <strong className="text-[#181818]">Duration:</strong> {targetTrip.days.length} Days ({targetTrip.startDate} to{" "}
                  {targetTrip.endDate})
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#E7E2D8]/60 text-xs">
                <span className="text-[#9E978E]">Estimated Investment</span>
                <span className="font-bold text-sm text-[#181818]">
                  {formatCurrency(totalCost, currency)}
                </span>
              </div>
            </div>

            {/* Direct Actions */}
            <div className="flex flex-wrap gap-2.5">
              <Link href={`/trips/${targetTrip.id}`} className="flex-1">
                <Button size="md" className="w-full text-xs" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Open Workspace
                </Button>
              </Link>
              <Link href={`/share/${targetTrip.id}`} className="flex-1">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-xs"
                  leftIcon={<Share2 className="w-4 h-4 text-[#76546F]" />}
                >
                  View Public Story
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E7E2D8] p-6 sm:p-8 mb-8 max-w-xl mx-auto">
            <p className="text-sm text-[#6B655E] mb-4">No active trip selected yet. Explore destinations or create a new trip to get started!</p>
            <Link href="/explore">
              <Button size="md" className="w-full text-xs" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Curated Cities
              </Button>
            </Link>
          </div>
        )}

        {/* Secondary Navigation */}
        <div className="flex items-center justify-center gap-4 text-xs font-semibold">
          <Link href="/" className="text-[#6B655E] hover:text-[#181818] flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> Return to Dashboard
          </Link>
          <span className="text-[#D5CEBF]">·</span>
          <Link href="/explore" className="text-[#76546F] hover:text-[#181818] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F4A62A]" /> Explore More Cities
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
