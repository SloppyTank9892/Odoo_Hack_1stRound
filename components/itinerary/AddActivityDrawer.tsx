"use client";

import React, { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mockActivities } from "@/data/mockActivities";
import { ActivityCategory, Activity } from "@/types/trip";
import { useTrips } from "@/context/TripContext";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/tripCalculations";
import { Search, Plus, Sparkles, Clock, MapPin, Check } from "lucide-react";

interface AddActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  dayNumber: number;
  cityName: string;
  stopId?: string;
}

export function AddActivityDrawer({
  isOpen,
  onClose,
  tripId,
  dayNumber,
  cityName,
  stopId,
}: AddActivityDrawerProps) {
  const { addActivityToDay, currency } = useTrips();
  const { toast } = useToast();

  const [mode, setMode] = useState<"browse" | "custom">("browse");
  const [search, setSearch] = useState("");

  // Custom Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("culture");
  const [cost, setCost] = useState<number>(500);
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [timeSlot, setTimeSlot] = useState<string>("14:00");
  const [location, setLocation] = useState<string>("");

  // Filter activities matching city or global
  const availableActivities = mockActivities.filter((act) => {
    const matchesCity = act.cityName.toLowerCase() === cityName.toLowerCase();
    const matchesSearch =
      act.name.toLowerCase().includes(search.toLowerCase()) ||
      act.description.toLowerCase().includes(search.toLowerCase()) ||
      act.category.toLowerCase().includes(search.toLowerCase());
    return (matchesCity || !cityName) && matchesSearch;
  });

  const handleAddFromCatalog = (act: (typeof mockActivities)[0]) => {
    addActivityToDay(
      tripId,
      dayNumber,
      {
        name: act.name,
        description: act.description,
        category: act.category,
        cost: act.cost,
        durationMinutes: act.durationMinutes,
        timeSlot: act.bestTimeOfDay === "Morning" ? "09:30" : act.bestTimeOfDay === "Afternoon" ? "14:00" : "18:30",
        location: `${act.cityName}, Heritage Zone`,
        image: act.image,
        completed: false,
      },
      stopId
    );

    toast({
      title: "Activity Added!",
      description: `"${act.name}" scheduled for Day ${dayNumber} in ${cityName}.`,
      variant: "success",
    });

    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addActivityToDay(
      tripId,
      dayNumber,
      {
        name: name.trim(),
        description: description.trim() || `Custom activity in ${cityName}`,
        category,
        cost: Number(cost) || 0,
        durationMinutes: Number(durationMinutes) || 60,
        timeSlot: timeSlot || "12:00",
        location: location.trim() || cityName,
        completed: false,
        isCustom: true,
      },
      stopId
    );

    toast({
      title: "Custom Activity Added!",
      description: `"${name}" placed in Day ${dayNumber} timeline.`,
      variant: "success",
    });

    // Reset & close
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A]" />
          <span>Add Activity · Day {dayNumber}</span>
        </div>
      }
      subtitle={`Explore top-rated spots or create a custom plan for ${cityName}`}
      width="lg"
    >
      {/* Mode Tabs */}
      <div className="flex bg-[#FAF9F5] p-1 rounded-xl border border-[#E7E2D8] mb-4">
        <button
          onClick={() => setMode("browse")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            mode === "browse" ? "bg-white text-[#181818] shadow-2xs" : "text-[#6B655E] hover:text-[#181818]"
          }`}
        >
          Suggested for {cityName}
        </button>
        <button
          onClick={() => setMode("custom")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            mode === "custom" ? "bg-white text-[#181818] shadow-2xs" : "text-[#6B655E] hover:text-[#181818]"
          }`}
        >
          + Custom Activity
        </button>
      </div>

      {mode === "browse" ? (
        <div className="space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#9E978E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${cityName} experiences, dining, forts...`}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          {/* Activity Cards List */}
          <div className="space-y-3">
            {availableActivities.length > 0 ? (
              availableActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl border border-[#E7E2D8] hover:border-[#D5CEBF] bg-white transition-all hover:shadow-2xs flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#76546F] capitalize">
                        {act.category}
                      </span>
                      <span className="text-[10px] text-[#9E978E]">·</span>
                      <span className="text-[11px] text-[#6B655E] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#9E978E]" />
                        {act.durationMinutes}m ({act.bestTimeOfDay})
                      </span>
                    </div>

                    <h5 className="font-bold text-xs sm:text-sm text-[#181818] leading-tight">
                      {act.name}
                    </h5>

                    <p className="text-[11px] text-[#6B655E] mt-1 line-clamp-2">
                      {act.description}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs font-bold text-[#181818]">
                        {formatCurrency(act.cost, currency)}
                      </span>
                      <span className="text-[10px] text-[#1B8755] bg-[#EDF7F2] px-1.5 py-0.5 rounded font-medium">
                        ★ {act.rating} ({act.reviewCount})
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleAddFromCatalog(act)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    className="shrink-0 mt-1"
                  >
                    Add
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#9E978E] text-xs">
                <p>No catalog activities matching your search.</p>
                <button
                  onClick={() => setMode("custom")}
                  className="mt-2 text-[#F4A62A] font-bold underline"
                >
                  Create a custom one instead
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Custom Activity Form */
        <form onSubmit={handleCreateCustom} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1">
              Activity Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Thali Tasting at Heritage Haveli"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              >
                <option value="culture">Culture / Heritage</option>
                <option value="food">Food & Dining</option>
                <option value="sightseeing">Sightseeing</option>
                <option value="adventure">Adventure</option>
                <option value="nature">Nature / Outdoors</option>
                <option value="shopping">Shopping</option>
                <option value="transport">Transport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1">
                Time Slot
              </label>
              <input
                type="time"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1">
                Estimated Cost ({currency})
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1">
              Location / Area (Optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Old City Courtyard"
              className="w-full px-3.5 py-2 text-xs bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1">
              Notes or Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key reservation details, dress code, or tips..."
              className="w-full px-3.5 py-2 text-xs bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div className="pt-3 border-t border-[#E7E2D8] flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="submit" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Save to Day {dayNumber}
            </Button>
          </div>
        </form>
      )}
    </Drawer>
  );
}
