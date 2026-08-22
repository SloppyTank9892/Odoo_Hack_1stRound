"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CityDiscovery, ActivityDiscovery } from "@/types/trip";
import { useTrips } from "@/context/TripContext";
import { useToast } from "@/components/ui/Toast";
import { Plus, Check, MapPin, Calendar, Compass } from "lucide-react";

interface AddToTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CityDiscovery | ActivityDiscovery | null;
  type: "city" | "activity";
}

export function AddToTripModal({
  isOpen,
  onClose,
  item,
  type,
}: AddToTripModalProps) {
  const { trips, activeTrip, addStopToTrip, addActivityToDay } = useTrips();
  const { toast } = useToast();

  const [selectedTripId, setSelectedTripId] = useState(activeTrip?.id || trips[0]?.id || "");
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);

  if (!item) return null;

  const targetTrip = trips.find((t) => t.id === selectedTripId) || activeTrip;

  const handleConfirm = () => {
    if (!targetTrip) return;

    if (type === "city") {
      const city = item as CityDiscovery;
      addStopToTrip(targetTrip.id, city);
      toast({
        title: "City Added to Trip!",
        description: `${city.name} is now a stop in ${targetTrip.name}.`,
        variant: "success",
      });
    } else {
      const act = item as ActivityDiscovery;
      addActivityToDay(targetTrip.id, selectedDayNumber, {
        name: act.name,
        description: act.description,
        category: act.category,
        cost: act.cost,
        durationMinutes: act.durationMinutes,
        timeSlot: act.bestTimeOfDay === "Morning" ? "09:30" : act.bestTimeOfDay === "Afternoon" ? "14:00" : "18:30",
        location: `${act.cityName}, Exploration Zone`,
        image: act.image,
        completed: false,
      });
      toast({
        title: "Activity Scheduled!",
        description: `${act.name} was added to Day ${selectedDayNumber} of ${targetTrip.name}.`,
        variant: "success",
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A]" />
          <span>Add to Trip Itinerary</span>
        </div>
      }
      description={
        type === "city"
          ? `Add ${item.name} as a new destination stop`
          : `Schedule "${item.name}" into your itinerary`
      }
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Selected Item Preview */}
        <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E7E2D8] flex items-center gap-3">
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded-lg object-cover border shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-xs sm:text-sm text-[#181818] truncate">{item.name}</h4>
            <p className="text-[11px] text-[#6B655E] truncate">
              {"country" in item ? `${item.region}, ${item.country}` : `${item.cityName} · ${item.category}`}
            </p>
          </div>
        </div>

        {/* Target Trip Selection */}
        <div>
          <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
            Select Destination Trip
          </label>
          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm font-semibold text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                📍 {t.name} ({t.days.length} Days · {t.stops.length} Cities)
              </option>
            ))}
          </select>
        </div>

        {/* If activity: Day Selection */}
        {type === "activity" && targetTrip && (
          <div>
            <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
              Assign to Day
            </label>
            <select
              value={selectedDayNumber}
              onChange={(e) => setSelectedDayNumber(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            >
              {targetTrip.days.map((d) => (
                <option key={d.dayNumber} value={d.dayNumber}>
                  Day {d.dayNumber} — {d.cityName} ({d.date})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-[#E7E2D8] flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirm} leftIcon={<Plus className="w-4 h-4" />}>
            Confirm & Sync
          </Button>
        </div>
      </div>
    </Modal>
  );
}
