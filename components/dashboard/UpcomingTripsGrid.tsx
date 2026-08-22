"use client";

import React from "react";
import Link from "next/link";
import { Trip } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, calculateTripTotalCost } from "@/lib/tripCalculations";
import { Calendar, ArrowRight, ArrowUpRight } from "lucide-react";

interface UpcomingTripsGridProps {
  trips: Trip[];
  activeTripId: string;
}

export function UpcomingTripsGrid({ trips, activeTripId }: UpcomingTripsGridProps) {
  // Show trips other than the first one (or first 3 secondary trips)
  const secondaryTrips = trips.filter((t) => t.id !== activeTripId).slice(0, 3);

  if (secondaryTrips.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
            Upcoming & Saved Journeys
          </h3>
          <p className="text-xs sm:text-sm text-[#6B655E] dark:text-[#A8A196]">
            Pick up planning where you left off
          </p>
        </div>
        <Link
          href="/trips"
          className="text-xs sm:text-sm font-bold text-[#76546F] dark:text-[#B88BAF] hover:text-[#181818] dark:hover:text-[#F5F3EF] flex items-center gap-1 hover:underline"
        >
          View All Trips ({trips.length}) <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {secondaryTrips.map((trip) => {
          const totalCost = calculateTripTotalCost(trip);

          return (
            <Link key={trip.id} href={`/trips/${trip.id}`} className="group">
              <Card className="h-full flex flex-col justify-between overflow-hidden p-0" hover>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={trip.coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="neutral" size="sm">
                      {trip.stops.length} Cities
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-bold text-base font-editorial leading-tight line-clamp-1">
                      {trip.name}
                    </h4>
                    <p className="text-xs text-[#D5CEBF] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> {trip.startDate}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-[#1C1B18] transition-colors">
                  {/* Route Summary */}
                  <div className="mb-3">
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-[#9E978E] dark:text-[#7A746B] mb-1">
                      Route
                    </span>
                    <p className="text-xs font-semibold text-[#181818] dark:text-[#F5F3EF] line-clamp-1">
                      {trip.stops.map((s) => s.cityName).join(" → ")}
                    </p>
                  </div>

                  {/* Footer Stats */}
                  <div className="pt-3 border-t border-[#E7E2D8] dark:border-[#33302B] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#9E978E] dark:text-[#7A746B] block">Est. Cost</span>
                      <span className="font-bold text-[#181818] dark:text-[#F5F3EF]">
                        {formatCurrency(totalCost, trip.budget.currency)}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#76546F] dark:text-[#B88BAF] group-hover:text-[#B86E00] dark:group-hover:text-[#F4A62A] flex items-center gap-1">
                      Open Plan <ArrowUpRight className="w-3.5 h-3.5" />
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
