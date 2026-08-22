"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { ActiveTripCard } from "@/components/dashboard/ActiveTripCard";
import { UpcomingTripsGrid } from "@/components/dashboard/UpcomingTripsGrid";
import { CuratedDestinations } from "@/components/dashboard/CuratedDestinations";
import { BudgetHighlightWidget } from "@/components/dashboard/BudgetHighlightWidget";
import { CreateTripModal } from "@/components/trip/CreateTripModal";
import { useTrips } from "@/context/TripContext";
import { LandingRevealIntro } from "@/components/landing/LandingRevealIntro";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Compass } from "lucide-react";

export default function DashboardPage() {
  const { trips, activeTrip } = useTrips();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <>
      {/* Hybrid Flight Path + Editorial Curtain Landing Screen */}
      <LandingRevealIntro
        isRevealed={isRevealed}
        onComplete={() => setIsRevealed(true)}
        onSkip={() => setIsRevealed(true)}
        onReplay={() => setIsRevealed(false)}
      />

      {/* GlobeTrotter Workspace Dashboard (Mounted underneath and revealed naturally) */}
      <div
        className={`min-h-screen bg-[#F7F6F2] dark:bg-[#121210] text-[#181818] dark:text-[#F5F3EF] transition-all duration-700 ease-out ${
          isRevealed
            ? "opacity-100 translate-y-0"
            : "opacity-90 translate-y-2 pointer-events-none select-none"
        }`}
      >
        <AppShell>
          {/* Editorial Welcome & Inspiration Hero */}
          <HeroBanner onPlanTrip={() => setIsCreateModalOpen(true)} />

          {trips.length > 0 && activeTrip ? (
            <>
              {/* Financial & Engine Highlights */}
              <BudgetHighlightWidget />

              {/* Active Trip Spotlight */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A]" />
                  <h3 className="text-xl font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
                    Active Trip Workspace
                  </h3>
                </div>
                <ActiveTripCard trip={activeTrip} />
              </div>

              {/* Upcoming Trips */}
              {trips.length > 1 && (
                <UpcomingTripsGrid trips={trips} activeTripId={activeTrip.id} />
              )}
            </>
          ) : (
            <Card className="text-center py-12 px-6 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B] mb-10">
              <div className="w-14 h-14 rounded-2xl bg-[#FEF7EC] dark:bg-[#2B2113] text-[#F4A62A] border border-[#FCD89C] dark:border-[#5E431E] flex items-center justify-center mx-auto mb-4">
                <Compass className="w-7 h-7 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold font-editorial text-[#181818] dark:text-[#F5F3EF] mb-1">
                No journeys in your workspace yet
              </h3>
              <p className="text-xs sm:text-sm text-[#6B655E] dark:text-[#A8A196] mb-6 max-w-md mx-auto">
                Build your first custom multi-city itinerary, organize live budgets, and explore interactive route maps.
              </p>
              <Button
                size="lg"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
              >
                Create Your First Trip
              </Button>
            </Card>
          )}

          {/* Curated Destination Discovery */}
          <CuratedDestinations onOpenCreateTrip={() => setIsCreateModalOpen(true)} />

          {/* Create Trip Modal */}
          <CreateTripModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
        </AppShell>
      </div>
    </>
  );
}
