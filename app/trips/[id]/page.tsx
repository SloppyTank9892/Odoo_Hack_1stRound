"use client";

import React, { useState, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TripWorkspaceHeader } from "@/components/trip/TripWorkspaceHeader";
import { TimelineView } from "@/components/itinerary/TimelineView";
import { TripMap } from "@/components/trip/TripMap";
import { TripCalendar } from "@/components/trip/TripCalendar";
import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { useTrips } from "@/context/TripContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Compass, ArrowLeft } from "lucide-react";

export default function TripWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { getTripById, trips } = useTrips();
  const [activeTab, setActiveTab] = useState<"itinerary" | "calendar" | "budget" | "map">("itinerary");

  const tripId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const trip = getTripById(tripId) || trips[0];

  if (!trip) {
    return (
      <AppShell>
        <Card className="text-center py-16 px-6 max-w-md mx-auto my-12 bg-white">
          <Compass className="w-12 h-12 text-[#F4A62A] mx-auto mb-3" />
          <h2 className="text-xl font-bold font-editorial text-[#181818] mb-2">
            Trip Workspace Not Found
          </h2>
          <p className="text-xs text-[#6B655E] mb-6">
            The requested travel itinerary does not exist or has been removed.
          </p>
          <Button onClick={() => router.push("/trips")} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to All Trips
          </Button>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell noScroll fullWidth>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Contextual Trip Header & Tab Navigation */}
        <TripWorkspaceHeader
          trip={trip}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Views Container - Clean single-scrollbar workspace scrolling */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto pb-24 md:pb-12 animate-in fade-in duration-200">
          {activeTab === "itinerary" && <TimelineView trip={trip} />}
          {activeTab === "map" && <TripMap trip={trip} />}
          {activeTab === "calendar" && <TripCalendar trip={trip} />}
          {activeTab === "budget" && <BudgetOverview trip={trip} />}
        </div>
      </div>
    </AppShell>
  );
}
