"use client";

import React from "react";
import { CityDiscovery } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { Plus, Check, MapPin, Sparkles } from "lucide-react";

interface CityCardProps {
  city: CityDiscovery;
  onAddToTrip: (city: CityDiscovery) => void;
}

export function CityCard({ city, onAddToTrip }: CityCardProps) {
  const { activeTrip, currency } = useTrips();
  const isAlreadyInActiveTrip = activeTrip.stops.some((s) => s.id === city.id);

  return (
    <Card className="overflow-hidden p-0 flex flex-col justify-between group" hover>
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant="amber" size="sm">
            {city.costIndex} Cost
          </Badge>
          <span className="bg-black/50 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {city.popularity}% Rank
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h4 className="font-bold text-xl font-editorial leading-none">{city.name}</h4>
          <p className="text-xs text-[#D5CEBF] mt-0.5">
            {city.region}, {city.country}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 bg-white flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-[#6B655E] line-clamp-2 mb-3">
            {city.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {city.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-[#FAF9F5] text-[#6B655E] px-2 py-0.5 rounded-md border border-[#E7E2D8]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E7E2D8] flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] text-[#9E978E]">Avg Daily</span>
            <span className="text-xs font-bold text-[#181818]">
              {formatCurrency(city.avgDailyCost, currency)}
            </span>
          </div>

          <Button
            size="sm"
            variant={isAlreadyInActiveTrip ? "outline" : "primary"}
            onClick={() => onAddToTrip(city)}
            leftIcon={isAlreadyInActiveTrip ? <Check className="w-3.5 h-3.5 text-[#1B8755]" /> : <Plus className="w-3.5 h-3.5" />}
          >
            {isAlreadyInActiveTrip ? "In Active Trip" : "Add to Trip"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
