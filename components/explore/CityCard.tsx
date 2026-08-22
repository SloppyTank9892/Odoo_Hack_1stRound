"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CityDiscovery } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { Plus, Check, Bookmark, BookmarkCheck } from "lucide-react";

interface CityCardProps {
  city: CityDiscovery;
  onAddToTrip: (city: CityDiscovery) => void;
}

export function CityCard({ city, onAddToTrip }: CityCardProps) {
  const { activeTrip, currency } = useTrips();
  const isAlreadyInActiveTrip = activeTrip?.stops
    ? activeTrip.stops.some(
        (s) => s.id === city.id || s.cityName.toLowerCase() === city.name.toLowerCase()
      )
    : false;

  // Bookmark state — persisted in localStorage keyed by city id
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = JSON.parse(localStorage.getItem("gt_saved_destinations") || "[]");
      return saved.includes(city.id);
    } catch {
      return false;
    }
  });

  const handleBookmark = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsBookmarked((prev) => {
        const next = !prev;
        try {
          const saved: string[] = JSON.parse(
            localStorage.getItem("gt_saved_destinations") || "[]"
          );
          const updated = next
            ? [...new Set([...saved, city.id])]
            : saved.filter((id) => id !== city.id);
          localStorage.setItem("gt_saved_destinations", JSON.stringify(updated));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [city.id]
  );

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

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant="amber" size="sm">
            {city.costIndex} Cost
          </Badge>
          <span className="bg-black/50 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {city.popularity}% Rank
          </span>
        </div>

        {/* Bookmark button top-right */}
        <motion.button
          onClick={handleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Save destination"}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10 cursor-pointer"
          whileTap={{ scale: 0.85 }}
        >
          <AnimatePresence mode="wait">
            {isBookmarked ? (
              <motion.span
                key="filled"
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <BookmarkCheck className="w-4 h-4 fill-[#F4A62A] stroke-[#F4A62A]" />
              </motion.span>
            ) : (
              <motion.span
                key="outline"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Bookmark className="w-4 h-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h4 className="font-bold text-xl font-editorial leading-none">{city.name}</h4>
          <p className="text-xs text-[#D5CEBF] mt-0.5">
            {city.region}, {city.country}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 bg-white dark:bg-[#1C1B18] flex-1 flex flex-col justify-between transition-colors">
        <div>
          <p className="text-xs text-[#6B655E] dark:text-[#A8A196] line-clamp-2 mb-3">{city.description}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {city.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-[#FAF9F5] dark:bg-[#24221E] text-[#6B655E] dark:text-[#A8A196] px-2 py-0.5 rounded-md border border-[#E7E2D8] dark:border-[#33302B]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E7E2D8] dark:border-[#33302B] flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] text-[#9E978E] dark:text-[#7A746B]">Avg Daily</span>
            <span className="text-xs font-bold text-[#181818] dark:text-[#F5F3EF]">
              {formatCurrency(city.avgDailyCost, currency)}
            </span>
          </div>

          <Button
            size="sm"
            variant={isAlreadyInActiveTrip ? "outline" : "primary"}
            onClick={() => onAddToTrip(city)}
            leftIcon={
              isAlreadyInActiveTrip ? (
                <Check className="w-3.5 h-3.5 text-[#1B8755] dark:text-[#34D399]" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )
            }
          >
            {isAlreadyInActiveTrip ? "In Active Trip" : "Add to Trip"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
