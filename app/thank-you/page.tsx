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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF7EC] dark:bg-[#2B2113] border border-[#FCD89C] dark:border-[#5E431E] text-xs font-semibold text-[#B86E00] dark:text-[#F4A62A] mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F4A62A]" />
          <span>Itinerary Successfully Synchronized</span>
        </div>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-[#EDF7F2] dark:bg-[#132D20] border border-[#A3D9BE] dark:border-[#1E4B33] text-[#1B8755] dark:text-[#34D399] flex items-center justify-center mx-auto mb-6 shadow-xs">
          <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#181818] dark:text-[#F5F3EF] mb-3">
          Your Journey Is Ready!
        </h1>

        <p className="text-sm sm:text-base text-[#6B655E] dark:text-[#A8A196] max-w-lg mx-auto mb-8">
          Thank you for planning with GlobeTrotter. Your multi-city itinerary, daily schedules, and
          budget benchmarks are fully compiled and live.
        </p>

        {/* Trip Card Spotlight */}
        {targetTrip ? (
          <div className="bg-white dark:bg-[#1C1B18] rounded-3xl border border-[#E7E2D8] dark:border-[#33302B] p-6 sm:p-8 text-left mb-8 shadow-xs max-w-xl mx-auto transition-colors">
            <div className="flex items-center justify-between border-b border-[#E7E2D8] dark:border-[#33302B] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#76546F] dark:text-[#B88BAF] uppercase tracking-wider block">
                  Active Itinerary
                </span>
                <h2 className="text-xl font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
                  {targetTrip.name}
                </h2>
              </div>
              <span className="text-xs font-bold text-[#1B8755] dark:text-[#34D399] bg-[#EDF7F2] dark:bg-[#132D20] px-2.5 py-1 rounded-full border border-[#A3D9BE]/50 dark:border-[#1E4B33]/50">
                Live &amp; Synced
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-[#6B655E] dark:text-[#A8A196] mb-6">
              <div className="flex items-center gap-2">
                <MapPinned className="w-4 h-4 text-[#F4A62A]" />
                <span>
                  <strong className="text-[#181818] dark:text-[#F5F3EF]">Route:</strong> {targetTrip.stops.map((s) => s.cityName).join(" → ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#76546F] dark:text-[#B88BAF]" />
                <span>
                  <strong className="text-[#181818] dark:text-[#F5F3EF]">Duration:</strong> {targetTrip.days.length} Days ({targetTrip.startDate} to{" "}
                  {targetTrip.endDate})
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#E7E2D8]/60 dark:border-[#33302B]/60 text-xs">
                <span className="text-[#9E978E] dark:text-[#7A746B]">Estimated Investment</span>
                <span className="font-bold text-sm text-[#181818] dark:text-[#F5F3EF]">
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
                  leftIcon={<Share2 className="w-4 h-4 text-[#76546F] dark:text-[#B88BAF]" />}
                >
                  View Public Story
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1C1B18] rounded-3xl border border-[#E7E2D8] dark:border-[#33302B] p-6 sm:p-8 mb-8 max-w-xl mx-auto">
            <p className="text-sm text-[#6B655E] dark:text-[#A8A196] mb-4">No active trip selected yet. Explore destinations or create a new trip to get started!</p>
            <Link href="/explore">
              <Button size="md" className="w-full text-xs" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Curated Cities
              </Button>
            </Link>
          </div>
        )}

        {/* Secondary Navigation */}
        <div className="flex items-center justify-center gap-4 text-xs font-semibold">
          <Link href="/" className="text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF] flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> Return to Dashboard
          </Link>
          <span className="text-[#D5CEBF] dark:text-[#5E5950]">·</span>
          <Link href="/explore" className="text-[#76546F] dark:text-[#B88BAF] hover:text-[#181818] dark:hover:text-[#F5F3EF] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F4A62A]" /> Explore More Cities
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
