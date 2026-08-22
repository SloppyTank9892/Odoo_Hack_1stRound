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
import { Plus, Check, ArrowRight, Heart } from "lucide-react";

interface CuratedDestinationsProps {
  onOpenCreateTrip?: () => void;
}

export function CuratedDestinations({ onOpenCreateTrip }: CuratedDestinationsProps = {}) {
  const { activeTrip, addStopToTrip, currency, destinations } = useTrips();
  const displayDestinations = destinations?.length > 0 ? destinations : curatedDestinations;
  const { toast } = useToast();
  const [savedCityIds, setSavedCityIds] = useState<string[]>([]);

  const handleAddStop = (city: CityDiscovery) => {
    if (activeTrip) {
      addStopToTrip(activeTrip.id, city);
      toast({
        title: `${city.name} added!`,
        description: `Added to ${activeTrip.name} stop itinerary.`,
        variant: "success",
      });
    } else if (onOpenCreateTrip) {
      onOpenCreateTrip();
    }
  };

  const toggleSave = (cityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedCityIds((prev) =>
      prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId]
    );
  };

  return (
    <div id="featured-destinations" className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F4A62A]" />
            <h3 className="text-lg sm:text-xl font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
              Curated Destination Inspiration
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#6B655E] dark:text-[#A8A196]">
            Handpicked cultural hubs and natural wonders
          </p>
        </div>
        <Link
          href="/explore"
          className="text-xs sm:text-sm font-bold text-[#76546F] dark:text-[#B88BAF] hover:text-[#181818] dark:hover:text-[#F5F3EF] flex items-center gap-1 hover:underline"
        >
          Explore All Cities <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayDestinations.slice(0, 4).map((city) => {
          const isAlreadyInTrip = activeTrip
            ? activeTrip.stops.some(
                (s) => s.id === city.id || s.cityName.toLowerCase() === city.name.toLowerCase()
              )
            : false;
          const isSaved = savedCityIds.includes(city.id);

          return (
            <Card key={city.id} className="overflow-hidden isolate p-0 flex flex-col justify-between h-full rounded-2xl group" hover>
              <div className="relative h-48 overflow-hidden isolate rounded-t-2xl">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform rounded-t-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none rounded-t-2xl" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                  <Badge variant="amber" size="sm">
                    {city.costIndex} Cost
                  </Badge>
                  <Badge variant="purple" size="sm">
                    {city.tags?.[0] || "Explore"}
                  </Badge>
                </div>

                {/* Save Heart Button */}
                <button
                  onClick={(e) => toggleSave(city.id, e)}
                  aria-label="Save destination"
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors cursor-pointer z-10"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isSaved ? "fill-[#C84B31] text-[#C84B31]" : "stroke-white"
                    }`}
                  />
                </button>

                {/* Bottom Title */}
                <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                  <h4 className="font-extrabold text-lg leading-tight font-editorial">{city.name}</h4>
                  <p className="text-xs text-[#FAF9F5]/90">{city.region}, {city.country}</p>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-[#1C1B18] transition-colors rounded-b-2xl">
                <p className="text-xs text-[#6B655E] dark:text-[#A8A196] line-clamp-2 mb-3 leading-relaxed">
                  {city.description}
                </p>

                <div className="pt-3 border-t border-[#E7E2D8] dark:border-[#33302B] flex items-center justify-between transition-colors">
                  <div>
                    <span className="text-[10px] text-[#9E978E] dark:text-[#7A746B] block">Daily Avg</span>
                    <span className="text-xs font-black text-[#181818] dark:text-[#F5F3EF]">
                      {formatCurrency(city.avgDailyCost, currency)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant={isAlreadyInTrip ? "outline" : "primary"}
                    disabled={isAlreadyInTrip}
                    onClick={() => handleAddStop(city)}
                    leftIcon={
                      isAlreadyInTrip ? (
                        <Check className="w-3.5 h-3.5 text-[#1B8755] dark:text-[#34D399]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )
                    }
                    className="text-xs py-1.5 px-3"
                  >
                    {isAlreadyInTrip ? "Added" : "Add Stop"}
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
