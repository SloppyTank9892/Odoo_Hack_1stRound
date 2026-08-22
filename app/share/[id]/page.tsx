"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { PublicStoryView } from "@/components/share/PublicStoryView";
import { useTrips } from "@/context/TripContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Compass, ArrowLeft, Globe2 } from "lucide-react";

export default function SharedTripPage() {
  const params = useParams();
  const router = useRouter();
  const { getTripById, trips } = useTrips();

  const tripId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const trip = getTripById(tripId) || trips[0];

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex flex-col text-[#181818]">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E7E2D8] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F4A62A] flex items-center justify-center text-[#181818]">
              <Globe2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-[#181818]">GlobeTrotter</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="text-xs font-semibold text-[#6B655E] hover:text-[#181818] px-2.5 py-1.5 rounded-lg hover:bg-white transition-colors"
            >
              Explore Hub
            </Link>
            <Link
              href="/auth"
              className="text-xs font-bold text-[#181818] bg-[#FAF9F5] hover:bg-[#EFECE6] border border-[#E7E2D8] px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
            >
              Sign In / Login
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="text-center py-16 px-6 max-w-md mx-auto bg-white shadow-xs">
            <Compass className="w-12 h-12 text-[#F4A62A] mx-auto mb-3" />
            <h2 className="text-xl font-bold font-editorial text-[#181818] mb-2">
              Shared Story Not Found
            </h2>
            <p className="text-xs text-[#6B655E] mb-6">
              This public itinerary link may be private or no longer available.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={() => router.push("/")} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Explore GlobeTrotter
              </Button>
              <Button variant="outline" onClick={() => router.push("/trips")}>
                My Trips
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return <PublicStoryView trip={trip} />;
}
