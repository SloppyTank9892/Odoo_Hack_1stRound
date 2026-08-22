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

export default function DashboardPage() {
  const { trips, activeTrip } = useTrips();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <AppShell>
      {/* Editorial Welcome & Inspiration Hero */}
      <HeroBanner onPlanTrip={() => setIsCreateModalOpen(true)} />

      {/* Financial & Engine Highlights */}
      <BudgetHighlightWidget />

      {/* Active Trip Spotlight */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A]" />
          <h3 className="text-xl font-bold font-editorial text-[#181818]">
            Active Trip Workspace
          </h3>
        </div>
        <ActiveTripCard trip={activeTrip} />
      </div>

      {/* Upcoming Trips */}
      <UpcomingTripsGrid trips={trips} activeTripId={activeTrip.id} />

      {/* Curated Destination Discovery */}
      <CuratedDestinations />

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </AppShell>
  );
}
