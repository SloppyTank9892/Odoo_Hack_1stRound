"use client";

import React, { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { curatedActivities } from "@/data/curatedActivities";
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
  const availableActivities = curatedActivities.filter((act) => {
    const matchesCity = act.cityName.toLowerCase() === cityName.toLowerCase();
    const matchesSearch =
      act.name.toLowerCase().includes(search.toLowerCase()) ||
      act.description.toLowerCase().includes(search.toLowerCase()) ||
      act.category.toLowerCase().includes(search.toLowerCase());
    return (matchesCity || !cityName) && matchesSearch;
  });

  const handleAddFromCatalog = (act: (typeof curatedActivities)[0]) => {
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
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#9E978E] dark:text-[#7A746B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${cityName} experiences...`}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] placeholder-[#9E978E] dark:placeholder-[#7A746B] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          {/* Activity Cards List */}
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {availableActivities.length > 0 ? (
              availableActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 bg-white dark:bg-[#201F1B] rounded-xl border border-[#E7E2D8] dark:border-[#33302B] hover:border-[#D5CEBF] dark:hover:border-[#48443D] transition-all hover:shadow-2xs flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={act.image}
                      alt={act.name}
                      className="w-16 h-16 rounded-xl object-cover border border-[#E7E2D8] dark:border-[#33302B] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge variant="amber" size="sm">
                          {act.category}
                        </Badge>
                        <span className="text-[10px] text-[#6B655E] dark:text-[#A8A196] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {act.durationMinutes}m
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#181818] dark:text-[#F5F3EF] leading-tight group-hover:text-[#F4A62A] transition-colors">
                        {act.name}
                      </h4>
                      <p className="text-[11px] text-[#6B655E] dark:text-[#A8A196] line-clamp-2 mt-0.5">
                        {act.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E7E2D8] dark:border-[#33302B]">
                    <div>
                      <span className="text-[10px] text-[#9E978E] dark:text-[#7A746B] block">Price</span>
                      <span className="font-bold text-xs text-[#181818] dark:text-[#F5F3EF]">
                        {act.cost === 0 ? "Free" : formatCurrency(act.cost, currency)}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAddFromCatalog(act)}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Add to Day {dayNumber}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#9E978E] dark:text-[#7A746B] text-xs">
                No matching curated experiences found. Try creating a custom one!
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Custom Activity Creation Form */
        <form onSubmit={handleCreateCustom} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1">
              Activity Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Thali Tasting at Heritage Haveli"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              >
                <option value="culture" className="dark:bg-[#1C1B18]">Culture / Heritage</option>
                <option value="food" className="dark:bg-[#1C1B18]">Food & Dining</option>
                <option value="sightseeing" className="dark:bg-[#1C1B18]">Sightseeing</option>
                <option value="adventure" className="dark:bg-[#1C1B18]">Adventure</option>
                <option value="nature" className="dark:bg-[#1C1B18]">Nature / Outdoors</option>
                <option value="shopping" className="dark:bg-[#1C1B18]">Shopping</option>
                <option value="transport" className="dark:bg-[#1C1B18]">Transport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1">
                Time Slot
              </label>
              <input
                type="time"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1">
                Estimated Cost ({currency})
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1">
              Location / Area (Optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Old City Courtyard"
              className="w-full px-3.5 py-2 text-xs bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1">
              Notes or Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key reservation details, dress code, or tips..."
              className="w-full px-3.5 py-2 text-xs bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div className="pt-3 border-t border-[#E7E2D8] dark:border-[#33302B] flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Add Activity
            </Button>
          </div>
        </form>
      )}
    </Drawer>
  );
}
