"use client";

import React from "react";
import { ActivityDiscovery } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { Plus, Clock, MapPin, Star } from "lucide-react";

interface ActivityCardProps {
  activity: ActivityDiscovery;
  onAddToTrip: (activity: ActivityDiscovery) => void;
}

export function ActivityCard({ activity, onAddToTrip }: ActivityCardProps) {
  const { currency } = useTrips();

  return (
    <Card className="overflow-hidden p-0 flex flex-col justify-between group" hover>
      <div className="relative h-44 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant="purple" size="sm">
            {activity.category}
          </Badge>
          <span className="bg-black/50 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-[#F4A62A] text-[#F4A62A]" />
            {activity.rating}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h4 className="font-bold text-base font-editorial leading-tight">
            {activity.name}
          </h4>
          <p className="text-xs text-[#D5CEBF] mt-0.5">
            {activity.cityName} · {activity.bestTimeOfDay}
          </p>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-[#1C1B18] flex-1 flex flex-col justify-between transition-colors">
        <div>
          <p className="text-xs text-[#6B655E] dark:text-[#A8A196] line-clamp-2 mb-3">
            {activity.description}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-[#6B655E] dark:text-[#A8A196] mb-3">
            <Clock className="w-3.5 h-3.5 text-[#9E978E] dark:text-[#7A746B]" />
            <span>{activity.durationMinutes} mins duration</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E7E2D8] dark:border-[#33302B] flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] text-[#9E978E] dark:text-[#7A746B]">Est. Cost</span>
            <span className="text-xs font-bold text-[#181818] dark:text-[#F5F3EF]">
              {activity.cost > 0 ? formatCurrency(activity.cost, currency) : "Free"}
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => onAddToTrip(activity)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add to Day
          </Button>
        </div>
      </div>
    </Card>
  );
}
