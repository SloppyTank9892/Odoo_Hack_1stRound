"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PublicStoryView } from "@/components/share/PublicStoryView";
import { useTrips } from "@/context/TripContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Compass, ArrowLeft, Globe2, Loader2 } from "lucide-react";
import { Trip } from "@/types/trip";

export default function SharedTripPage() {
  const params = useParams();
  const router = useRouter();
  const { getTripById, refreshTrip, trips, toggleTripPublic } = useTrips();

  const tripId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [liveTrip, setLiveTrip] = useState<Trip | undefined>(() => getTripById(tripId));
  const [isFetching, setIsFetching] = useState<boolean>(!liveTrip);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadPublicTrip() {
      // Fetch auth user to determine ownership
      try {
        const { getAuthUser } = await import("@/app/actions/auth");
        const authRes = await getAuthUser();
        if (authRes.success && authRes.data && mounted) {
          setCurrentUserId(authRes.data.id);
        }
      } catch (e) {
        console.warn("Auth check in shared trip page:", e);
      }

      const existing = getTripById(tripId);
      if (existing) {
        if (mounted) {
          setLiveTrip(existing);
          setIsFetching(false);
        }
        return;
      }

      if (tripId) {
        setIsFetching(true);
        const fetched = await refreshTrip(tripId);
        if (mounted) {
          setLiveTrip(fetched);
          setIsFetching(false);
        }
      }
    }
    loadPublicTrip();
    return () => {
      mounted = false;
    };
  }, [tripId, getTripById, refreshTrip]);

  const trip = liveTrip || getTripById(tripId);

  // Check if current user is owner of this trip
  const isOwner = Boolean(
    (currentUserId && trip?.id && trips.some((t) => t.id === trip.id)) ||
    (trip && (trip as any).user_id && currentUserId === (trip as any).user_id) ||
    (trip && trips.some((t) => t.id === trip.id))
  );

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#121210] flex flex-col items-center justify-center text-[#181818] dark:text-[#F5F3EF] transition-colors">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] shadow-sm flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#F4A62A] animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B655E] dark:text-[#A8A196]">
            Loading Public Story...
          </p>
        </div>
      </div>
    );
  }

  // If trip not found
  if (!trip) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#121210] flex flex-col text-[#181818] dark:text-[#F5F3EF] transition-colors">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-30 bg-white/95 dark:bg-[#181715]/95 backdrop-blur-md border-b border-[#E7E2D8] dark:border-[#33302B] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F4A62A] flex items-center justify-center text-[#181818]">
              <Globe2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-[#181818] dark:text-[#F5F3EF]">GlobeTrotter</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/share"
              className="text-xs font-semibold text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF] px-2.5 py-1.5 rounded-lg hover:bg-white dark:hover:bg-[#24221E] transition-colors"
            >
              Public Stories
            </Link>
            <Link
              href="/trips"
              className="text-xs font-bold text-[#181818] dark:text-[#F5F3EF] bg-[#FAF9F5] dark:bg-[#24221E] hover:bg-[#EFECE6] dark:hover:bg-[#2E2C29] border border-[#E7E2D8] dark:border-[#33302B] px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
            >
              My Workspace
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="text-center py-16 px-6 max-w-md mx-auto bg-white dark:bg-[#1C1B18] shadow-xs border-[#E7E2D8] dark:border-[#33302B]">
            <Compass className="w-12 h-12 text-[#F4A62A] mx-auto mb-3" />
            <h2 className="text-xl font-bold font-editorial text-[#181818] dark:text-[#F5F3EF] mb-2">
              Shared Story Not Found
            </h2>
            <p className="text-xs text-[#6B655E] dark:text-[#A8A196] mb-6">
              This itinerary link does not exist or may have been deleted.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={() => router.push("/share")} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Browse Public Stories
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

  // If trip is PRIVATE and viewer is NOT the owner
  if (!trip.isPublic && !isOwner) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#121210] flex flex-col text-[#181818] dark:text-[#F5F3EF] transition-colors">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-30 bg-white/95 dark:bg-[#181715]/95 backdrop-blur-md border-b border-[#E7E2D8] dark:border-[#33302B] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F4A62A] flex items-center justify-center text-[#181818]">
              <Globe2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-[#181818] dark:text-[#F5F3EF]">GlobeTrotter</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/share"
              className="text-xs font-semibold text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF] px-2.5 py-1.5 rounded-lg hover:bg-white dark:hover:bg-[#24221E] transition-colors"
            >
              Public Stories
            </Link>
            <Link
              href="/trips"
              className="text-xs font-bold text-[#181818] dark:text-[#F5F3EF] bg-[#FAF9F5] dark:bg-[#24221E] hover:bg-[#EFECE6] dark:hover:bg-[#2E2C29] border border-[#E7E2D8] dark:border-[#33302B] px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
            >
              My Workspace
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="text-center py-16 px-6 max-w-md mx-auto bg-white dark:bg-[#1C1B18] shadow-xs border-[#E7E2D8] dark:border-[#33302B]">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF7EC] dark:bg-[#2B2113] text-[#B86E00] dark:text-[#F4A62A] border border-[#FCD89C] dark:border-[#5E431E] flex items-center justify-center mx-auto mb-4 text-2xl">
              🔒
            </div>
            <h2 className="text-xl font-bold font-editorial text-[#181818] dark:text-[#F5F3EF] mb-2">
              This Journey is Private
            </h2>
            <p className="text-xs text-[#6B655E] dark:text-[#A8A196] mb-6 leading-relaxed">
              The creator has not published this trip to the public gallery yet. Ask them to enable "Make Public" in their workspace to view and copy this itinerary.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={() => router.push("/share")} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Explore Public Stories
              </Button>
              <Button variant="outline" onClick={() => router.push("/trips")}>
                Go to My Trips
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <PublicStoryView
      trip={trip}
      isOwner={isOwner}
      onTogglePublic={() => toggleTripPublic(trip.id)}
    />
  );
}
