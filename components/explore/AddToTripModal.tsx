"use client";

import React, { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CityDiscovery, ActivityDiscovery } from "@/types/trip";
import { useTrips } from "@/context/TripContext";
import { useToast } from "@/components/ui/Toast";
import { Plus, Check, MapPin, Calendar, Compass, Sparkles } from "lucide-react";

interface AddToTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CityDiscovery | ActivityDiscovery | null;
  type: "city" | "activity";
  tripId?: string;
}

export function AddToTripModal({
  isOpen,
  onClose,
  item,
  type,
  tripId,
}: AddToTripModalProps) {
  const params = useParams();
  const pathname = usePathname();
  const { trips, activeTrip, addStopToTrip, addActivityToDay } = useTrips();
  const { toast } = useToast();

  const urlTripId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const isInsideTripWorkspace = Boolean(tripId || (pathname?.startsWith("/trips/") && urlTripId));
  const currentContextTripId = tripId || (isInsideTripWorkspace ? urlTripId : null);

  const [selectedTripId, setSelectedTripId] = useState<string>(
    currentContextTripId || activeTrip?.id || trips[0]?.id || ""
  );
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  // Sync selected trip when modal opens or activeTrip / context changes
  useEffect(() => {
    if (isOpen) {
      const initialTripId = currentContextTripId || activeTrip?.id || trips[0]?.id || "";
      setSelectedTripId(initialTripId);
      setSelectedDayNumber(1);
    }
  }, [isOpen, currentContextTripId, activeTrip?.id, trips]);

  if (!item) return null;

  const targetTrip =
    trips.find((t) => t.id === selectedTripId) ||
    (currentContextTripId ? trips.find((t) => t.id === currentContextTripId) : null) ||
    activeTrip ||
    trips[0];

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
      const targetDay = targetTrip.days.find((d) => d.dayNumber === selectedDayNumber);
      addActivityToDay(
        targetTrip.id,
        selectedDayNumber,
        {
          name: act.name,
          description: act.description,
          category: act.category,
          cost: act.cost,
          durationMinutes: act.durationMinutes,
          timeSlot: act.bestTimeOfDay === "Morning" ? "09:30" : act.bestTimeOfDay === "Afternoon" ? "14:00" : "18:30",
          location: `${act.cityName}, Exploration Zone`,
          image: act.image,
          completed: false,
        },
        targetDay?.cityId
      );
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
            className="w-12 h-12 rounded-lg object-cover border border-[#E7E2D8] shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-xs sm:text-sm text-[#181818] truncate">{item.name}</h4>
            <p className="text-[11px] text-[#6B655E] truncate">
              {"country" in item ? `${item.region}, ${item.country}` : `${item.cityName} · ${item.category}`}
            </p>
          </div>
        </div>

        {/* Target Trip Selection */}
        {isInsideTripWorkspace && targetTrip ? (
          /* Contextual Trip Badge (When already inside a workspace, skip dropdown entirely) */
          <div className="p-3 bg-[#FEF7EC] rounded-xl border border-[#FCD89C] flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B86E00] block">
                Destination Trip (Current Workspace)
              </span>
              <h5 className="font-bold text-xs sm:text-sm text-[#181818] truncate">
                📍 {targetTrip.name}
              </h5>
            </div>
            <span className="text-[11px] font-semibold text-[#76546F] shrink-0">
              {targetTrip.days.length} Days · {targetTrip.stops.length} Cities
            </span>
          </div>
        ) : (
          /* Trip Selector: Defaulted to Active Trip */
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider">
                Select Destination Trip
              </label>
              {activeTrip && selectedTripId === activeTrip.id && (
                <span className="text-[10px] font-bold text-[#B86E00] bg-[#FEF7EC] px-1.5 py-0.5 rounded border border-[#FCD89C]">
                  Default: Active Trip
                </span>
              )}
            </div>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm font-semibold text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  📍 {t.name} ({t.days.length} Days · {t.stops.length} Cities){t.id === activeTrip?.id ? " — (Active)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

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
