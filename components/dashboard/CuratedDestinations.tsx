"use client";

import React, { useState } from "react";
import Link from "next/link";
import { curatedDestinations } from "@/data/curatedDestinations";
import { CityDiscovery } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTrips } from "@/context/TripContext";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/tripCalculations";
import { Sparkles, Plus, Check, ArrowRight, Heart } from "lucide-react";

export function CuratedDestinations() {
  const { activeTrip, addStopToTrip, currency } = useTrips();
  const { toast } = useToast();
  const [savedCityIds, setSavedCityIds] = useState<string[]>([]);

  const handleAddStop = (city: CityDiscovery) => {
    addStopToTrip(activeTrip.id, city);
    toast({
      title: `${city.name} added!`,
      description: `Added to ${activeTrip.name} stop itinerary.`,
      variant: "success",
    });
  };

  const toggleSave = (cityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedCityIds((prev) =>
      prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId]
    );
  };

  return (
    <div id="featured-destinations" className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F4A62A]" />
            <h3 className="text-lg sm:text-xl font-bold font-editorial text-[#181818]">
              Curated Destination Inspiration
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#6B655E]">
            Handpicked cultural hubs and natural wonders
          </p>
        </div>
        <Link
          href="/explore"
          className="text-xs sm:text-sm font-bold text-[#76546F] hover:text-[#181818] flex items-center gap-1 hover:underline"
        >
          Explore All Cities <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {curatedDestinations.slice(0, 4).map((city) => {
          const isAlreadyInTrip = activeTrip.stops.some((s) => s.id === city.id);
          const isSaved = savedCityIds.includes(city.id);

          return (
            <Card key={city.id} className="overflow-hidden p-0 flex flex-col justify-between" hover>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <Badge variant="amber" size="sm">
                    {city.costIndex} Cost
                  </Badge>
                  <span className="bg-black/50 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {city.popularity}% Popular
                  </span>
                </div>

                {/* Save Icon */}
                <button
                  onClick={(e) => toggleSave(city.id, e)}
                  aria-label="Save destination"
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isSaved ? "fill-[#C84B31] text-[#C84B31]" : "stroke-white"
                    }`}
                  />
                </button>

                {/* Bottom Title */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-bold text-lg font-editorial leading-none">{city.name}</h4>
                  <p className="text-xs text-[#D5CEBF] mt-0.5">{city.country}</p>
                </div>
              </div>

              <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-[#6B655E] line-clamp-2 mb-3">
                    {city.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {city.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-[#FAF9F5] text-[#6B655E] px-2 py-0.5 rounded-md border border-[#E7E2D8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E7E2D8] flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[10px] text-[#9E978E]">Daily Avg</span>
                    <span className="text-xs font-bold text-[#181818]">
                      {formatCurrency(city.avgDailyCost, currency)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant={isAlreadyInTrip ? "outline" : "primary"}
                    disabled={isAlreadyInTrip}
                    onClick={() => handleAddStop(city)}
                    leftIcon={isAlreadyInTrip ? <Check className="w-3.5 h-3.5 text-[#1B8755]" /> : <Plus className="w-3.5 h-3.5" />}
                  >
                    {isAlreadyInTrip ? "In Active Trip" : "Add to Trip"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
