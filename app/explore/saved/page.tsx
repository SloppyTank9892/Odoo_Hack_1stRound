"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CityCard } from "@/components/explore/CityCard";
import { AddToTripModal } from "@/components/explore/AddToTripModal";
import { curatedDestinations } from "@/data/curatedDestinations";
import { CityDiscovery } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Bookmark, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SavedDestinationsPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [modalItem, setModalItem] = useState<CityDiscovery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Read saved IDs from localStorage (syncs on mount and on storage events)
  useEffect(() => {
    const load = () => {
      try {
        const raw = JSON.parse(localStorage.getItem("gt_saved_destinations") || "[]");
        setSavedIds(Array.isArray(raw) ? raw : []);
      } catch {
        setSavedIds([]);
      }
    };
    load();
    window.addEventListener("storage", load);
    // Poll every 500 ms so toggling in another tab reflects here
    const interval = setInterval(load, 500);
    return () => {
      window.removeEventListener("storage", load);
      clearInterval(interval);
    };
  }, []);

  const savedCities = curatedDestinations.filter((c) => savedIds.includes(c.id));

  const handleOpenModal = (city: CityDiscovery) => {
    setModalItem(city);
    setIsModalOpen(true);
  };

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold font-editorial text-[#181818]">
            Saved Destinations
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#6B655E]">
          {savedCities.length > 0
            ? `${savedCities.length} destination${savedCities.length > 1 ? "s" : ""} bookmarked — ready to add to your next trip.`
            : "Bookmark any destination from the Explore page to collect it here."}
        </p>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {savedCities.length > 0 ? (
          <motion.div
            key="grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {savedCities.map((city) => (
              <motion.div
                key={city.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                }}
                exit={{ opacity: 0, scale: 0.92 }}
              >
                <CityCard city={city} onAddToTrip={handleOpenModal} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="text-center py-20 px-6 bg-white max-w-sm mx-auto mt-12">
              <Bookmark className="w-12 h-12 text-[#D5CEBF] mx-auto mb-4" />
              <h3 className="text-base font-bold text-[#181818] mb-1 font-editorial">
                No saved destinations yet
              </h3>
              <p className="text-xs text-[#6B655E] mb-4 leading-relaxed">
                Tap the bookmark icon on any city card in the{" "}
                <span className="font-bold text-[#181818]">Explore</span> page to save it here.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#76546F] font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>Discover destinations → Explore</span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add To Trip Modal */}
      {modalItem && (
        <AddToTripModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={modalItem}
          type="city"
        />
      )}
    </AppShell>
  );
}
