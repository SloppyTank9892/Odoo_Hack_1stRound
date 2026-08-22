"use client";

import React from "react";
import Link from "next/link";
import { Trip } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, calculateTripTotalCost } from "@/lib/tripCalculations";
import { Calendar, ArrowRight, MapPin, Sparkles } from "lucide-react";

interface UpcomingTripsGridProps {
  trips: Trip[];
  activeTripId: string;
}

export function UpcomingTripsGrid({ trips, activeTripId }: UpcomingTripsGridProps) {
  const otherTrips = trips.filter((t) => t.id !== activeTripId);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold font-editorial text-[#181818]">
            Upcoming & Saved Journeys
          </h3>
          <p className="text-xs sm:text-sm text-[#6B655E]">
            Pick up planning where you left off
          </p>
        </div>
        <Link
          href="/trips"
          className="text-xs sm:text-sm font-bold text-[#76546F] hover:text-[#181818] flex items-center gap-1 hover:underline"
        >
          View All Trips ({trips.length}) <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {otherTrips.map((trip) => {
          const totalCost = calculateTripTotalCost(trip);
          const totalDays = trip.days.length;

          return (
            <Link key={trip.id} href={`/trips/${trip.id}`} className="group block">
              <Card className="h-full flex flex-col justify-between overflow-hidden p-0" hover>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={trip.coverImage}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="purple" size="sm">
                      {trip.stops.length} Cities · {totalDays} Days
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-bold text-base font-editorial leading-tight">
                      {trip.name}
                    </h4>
                    <p className="text-[11px] text-[#D5CEBF] truncate">{trip.tagline}</p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                  {/* Route Summary */}
                  <div className="mb-3">
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-[#9E978E] mb-1">
                      Route
                    </span>
                    <p className="text-xs font-semibold text-[#181818] line-clamp-1">
                      {trip.stops.map((s) => s.cityName).join(" → ")}
                    </p>
                  </div>

                  {/* Footer Stats */}
                  <div className="pt-3 border-t border-[#E7E2D8] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#9E978E] block">Est. Cost</span>
                      <span className="font-bold text-[#181818]">
                        {formatCurrency(totalCost, trip.budget.currency)}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F4A62A] group-hover:translate-x-1 transition-transform">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
