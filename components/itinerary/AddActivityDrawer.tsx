"use client";

import React, { useState } from "react";
import { ActivityCategory, ActivityDiscovery } from "@/types/trip";
import { curatedActivities } from "@/data/curatedActivities";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTrips } from "@/context/TripContext";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/tripCalculations";
import {
  Plus,
  Search,
  Clock,
  MapPin,
  Sparkles,
  Compass,
  Utensils,
  Camera,
  ShoppingBag,
  Trees,
} from "lucide-react";

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
  const { addActivityToDay, currency, activities } = useTrips();
  const displayActivities = activities?.length > 0 ? activities : curatedActivities;
  const { toast } = useToast();

  const [mode, setMode] = useState<"browse" | "custom">("browse");
  const [search, setSearch] = useState<string>("");

  // Custom Activity Form State
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<ActivityCategory>("culture");
  const [cost, setCost] = useState<number>(500);
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [timeSlot, setTimeSlot] = useState<string>("14:00");
  const [location, setLocation] = useState<string>("");

  // Filter activities matching city or global
  const availableActivities = (activities || curatedActivities).filter((act) => {
    const matchesCity = act.cityName.toLowerCase() === cityName.toLowerCase();
    const matchesSearch =
      act.name.toLowerCase().includes(search.toLowerCase()) ||
      act.description.toLowerCase().includes(search.toLowerCase()) ||
      act.category.toLowerCase().includes(search.toLowerCase());
    return (matchesCity || !cityName) && matchesSearch;
  });

  const handleAddFromCatalog = (act: ActivityDiscovery) => {
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
      title: "Custom Activity Created!",
      description: `"${name}" added to Day ${dayNumber}.`,
      variant: "success",
    });

    // Reset Form
    setName("");
    setDescription("");
    setLocation("");
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A]" />
          <span>Add Activity to Day {dayNumber}</span>
        </div>
      }
      subtitle={`Curating experiences in ${cityName}`}
      width="md"
    >
      {/* Mode Switcher Tabs */}
      <div className="flex bg-[#FAF9F5] dark:bg-[#24221E] p-1 rounded-xl border border-[#E7E2D8] dark:border-[#33302B] mb-5">
        <button
          onClick={() => setMode("browse")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === "browse"
              ? "bg-white dark:bg-[#1C1B18] text-[#181818] dark:text-[#F5F3EF] shadow-2xs"
              : "text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF]"
          }`}
        >
          Curated Experiences
        </button>
        <button
          onClick={() => setMode("custom")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === "custom"
              ? "bg-white dark:bg-[#1C1B18] text-[#181818] dark:text-[#F5F3EF] shadow-2xs"
              : "text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF]"
          }`}
        >
          Custom Activity
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
              placeholder={`Search experiences in ${cityName}...`}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          {/* Activity Cards List */}
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {availableActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-white dark:bg-[#1C1B18] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] hover:border-[#F4A62A] dark:hover:border-[#F4A62A] transition-all flex gap-3 group"
              >
                {act.image && (
                  <img
                    src={act.image}
                    alt={act.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-[#181818] dark:text-[#F5F3EF] line-clamp-1">
                        {act.name}
                      </h4>
                      <Badge variant="amber" size="sm">
                        {formatCurrency(act.cost, currency)}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#6B655E] dark:text-[#A8A196] line-clamp-2 mt-0.5">
                      {act.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E7E2D8]/50 dark:border-[#33302B]/50">
                    <span className="text-[10px] text-[#9E978E] dark:text-[#7A746B] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {act.durationMinutes} min · {act.bestTimeOfDay}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleAddFromCatalog(act)}
                      className="py-1 px-2.5 text-[11px]"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {availableActivities.length === 0 && (
              <div className="text-center py-10">
                <Sparkles className="w-8 h-8 text-[#9E978E] dark:text-[#7A746B] mx-auto mb-2" />
                <p className="text-xs text-[#6B655E] dark:text-[#A8A196]">
                  No curated experiences match this search in {cityName}.
                </p>
                <button
                  onClick={() => setMode("custom")}
                  className="mt-2 text-xs font-bold text-[#76546F] dark:text-[#B88BAF] hover:underline"
                >
                  Create custom activity instead →
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Custom Activity Form */
        <form onSubmit={handleCreateCustom} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] mb-1">
              Activity Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunrise Yoga at Nahargarh"
              className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              >
                <option value="culture">Culture &amp; Heritage</option>
                <option value="food">Food &amp; Dining</option>
                <option value="sightseeing">Sightseeing</option>
                <option value="adventure">Adventure &amp; Sports</option>
                <option value="nature">Nature &amp; Outdoors</option>
                <option value="shopping">Shopping &amp; Markets</option>
                <option value="transport">Transit &amp; Travel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] mb-1">
                Estimated Cost ({currency})
              </label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                step="15"
                min="15"
                max="720"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] mb-1">
              Location / Venue
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={`e.g. City Palace Complex, ${cityName}`}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] mb-1">
              Notes or Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this activity special? Booking codes, tips..."
              className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" size="md" className="w-full">
              Add Activity to Itinerary
            </Button>
          </div>
        </form>
      )}
    </Drawer>
  );
}
