"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { PublicStoryView } from "@/components/share/PublicStoryView";
import { useTrips } from "@/context/TripContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Compass, ArrowLeft } from "lucide-react";

export default function SharedTripPage() {
  const params = useParams();
  const router = useRouter();
  const { getTripById, trips } = useTrips();

  const tripId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const trip = getTripById(tripId) || trips[0];

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-4">
        <Card className="text-center py-16 px-6 max-w-md mx-auto bg-white">
          <Compass className="w-12 h-12 text-[#F4A62A] mx-auto mb-3" />
          <h2 className="text-xl font-bold font-editorial text-[#181818] mb-2">
            Shared Story Not Found
          </h2>
          <p className="text-xs text-[#6B655E] mb-6">
            This public itinerary link may be private or no longer available.
          </p>
          <Button onClick={() => router.push("/")} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Explore GlobeTrotter
          </Button>
        </Card>
      </div>
    );
  }

  return <PublicStoryView trip={trip} />;
}
