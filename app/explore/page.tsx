"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CityCard } from "@/components/explore/CityCard";
import { ActivityCard } from "@/components/explore/ActivityCard";
import { AddToTripModal } from "@/components/explore/AddToTripModal";
import { curatedDestinations } from "@/data/curatedDestinations";
import { curatedActivities } from "@/data/curatedActivities";
import { CityDiscovery, ActivityDiscovery } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Sparkles, Search, Compass, MapPin, Layers } from "lucide-react";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"cities" | "activities">("cities");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // Modal State
  const [modalItem, setModalItem] = useState<CityDiscovery | ActivityDiscovery | null>(null);
  const [modalType, setModalType] = useState<"city" | "activity">("city");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cityTags = ["all", "Heritage", "Architecture", "Palaces", "Lakes", "Romance", "Food", "Metropolis"];
  const activityTags = ["all", "culture", "food", "sightseeing", "adventure", "nature", "shopping"];

  const filteredCities = curatedDestinations.filter((city) => {
    const matchesTag = selectedTag === "all" || city.tags.includes(selectedTag);
    const matchesSearch =
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase()) ||
      city.description.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const filteredActivities = curatedActivities.filter((act) => {
    const matchesTag = selectedTag === "all" || act.category.toLowerCase() === selectedTag.toLowerCase();
    const matchesSearch =
      act.name.toLowerCase().includes(search.toLowerCase()) ||
      act.cityName.toLowerCase().includes(search.toLowerCase()) ||
      act.description.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleOpenCityModal = (city: CityDiscovery) => {
    setModalItem(city);
    setModalType("city");
    setIsModalOpen(true);
  };

  const handleOpenActivityModal = (act: ActivityDiscovery) => {
    setModalItem(act);
    setModalType("activity");
    setIsModalOpen(true);
  };

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold font-editorial text-[#181818] dark:text-[#F5F3EF]">
            Global Discovery Hub
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#6B655E] dark:text-[#A8A196]">
          Explore iconic destinations, curated cultural tours, and local gastronomic adventures
        </p>
      </div>

      {/* Search & Main Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Main Tab Pill */}
        <div className="flex bg-white dark:bg-[#1C1B18] p-1 rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] shadow-2xs">
          <button
            onClick={() => {
              setActiveTab("cities");
              setSelectedTag("all");
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "cities"
                ? "bg-[#181818] dark:bg-[#F4A62A] text-white dark:text-[#181818] shadow-xs"
                : "text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF]"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Destinations ({curatedDestinations.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("activities");
              setSelectedTag("all");
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "activities"
                ? "bg-[#181818] dark:bg-[#F4A62A] text-white dark:text-[#181818] shadow-xs"
                : "text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Activities &amp; Tours ({curatedActivities.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9E978E] dark:text-[#7A746B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "cities"
                ? "Search by city name, country, or vibe..."
                : "Search by activity, fortress, food tour..."
            }
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-xs sm:text-sm text-[#181818] dark:text-[#F5F3EF] placeholder-[#9E978E] dark:placeholder-[#7A746B] focus:outline-none focus:ring-2 focus:ring-[#F4A62A] shadow-2xs"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {(activeTab === "cities" ? cityTags : activityTags).map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${
              selectedTag === tag
                ? "bg-[#FEF7EC] dark:bg-[#2B2113] text-[#B86E00] dark:text-[#F4A62A] border border-[#FCD89C] dark:border-[#5E431E] shadow-2xs"
                : "bg-white dark:bg-[#1C1B18] text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF] border border-[#E7E2D8] dark:border-[#33302B] hover:bg-[#FAF9F5] dark:hover:bg-[#24221E]"
            }`}
          >
            {tag === "all" ? "All Categories" : tag}
          </button>
        ))}
      </div>

      {/* Grid Showcase */}
      {activeTab === "cities" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCities.map((city) => (
            <CityCard key={city.id} city={city} onAddToTrip={handleOpenCityModal} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredActivities.map((act) => (
            <ActivityCard key={act.id} activity={act} onAddToTrip={handleOpenActivityModal} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === "cities" && filteredCities.length === 0) ||
        (activeTab === "activities" && filteredActivities.length === 0)) && (
        <Card className="text-center py-16 px-6 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B] max-w-md mx-auto my-8">
          <Compass className="w-12 h-12 text-[#9E978E] dark:text-[#7A746B] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#181818] dark:text-[#F5F3EF] mb-1 font-editorial">
            No matches found
          </h3>
          <p className="text-xs text-[#6B655E] dark:text-[#A8A196]">
            Try searching for a different keyword or resetting your category filter.
          </p>
        </Card>
      )}

      {/* Add To Trip Modal */}
      <AddToTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={modalItem}
        type={modalType}
      />
    </AppShell>
  );
}
