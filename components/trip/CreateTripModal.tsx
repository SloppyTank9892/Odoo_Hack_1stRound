"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { mockDestinations } from "@/data/mockDestinations";
import { CityDiscovery } from "@/types/trip";
import { useTrips } from "@/context/TripContext";
import { useToast } from "@/components/ui/Toast";
import { Sparkles, Calendar, MapPin, Check } from "lucide-react";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTripModal({ isOpen, onClose }: CreateTripModalProps) {
  const router = useRouter();
  const { createNewTrip } = useTrips();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [tripName, setTripName] = useState("");
  const [tagline, setTagline] = useState("");
  const [startDate, setStartDate] = useState("2026-10-15");
  const [selectedCities, setSelectedCities] = useState<CityDiscovery[]>([
    mockDestinations[0], // Jaipur
    mockDestinations[1], // Udaipur
  ]);

  const toggleCity = (city: CityDiscovery) => {
    if (selectedCities.some((c) => c.id === city.id)) {
      if (selectedCities.length > 1) {
        setSelectedCities((prev) => prev.filter((c) => c.id !== city.id));
      }
    } else {
      setSelectedCities((prev) => [...prev, city]);
    }
  };

  const handleCreate = () => {
    if (!tripName.trim()) return;

    const newId = createNewTrip(
      tripName.trim(),
      tagline.trim() || `Exploring ${selectedCities.map((c) => c.name).join(", ")}`,
      startDate,
      selectedCities
    );

    toast({
      title: "Trip Created!",
      description: `${tripName} is ready in your Trip Workspace.`,
      variant: "success",
    });

    onClose();
    // Reset state
    setTripName("");
    setTagline("");
    setStep(1);

    router.push(`/trips/${newId}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A]" />
          <span>Plan Your Next Journey</span>
        </div>
      }
      description="Craft a personalized multi-city travel workspace in seconds."
      maxWidth="lg"
    >
      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
              Trip Title
            </label>
            <input
              type="text"
              required
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="e.g. Royal Rajasthan Grand Heritage"
              className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-sm font-semibold text-[#181818] placeholder-[#9E978E] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
              Travel Vibe / Tagline (Optional)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Palaces, desert skies, and royal dining"
              className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-sm text-[#181818] placeholder-[#9E978E] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
              Departure Start Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#9E978E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#E7E2D8]">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={!tripName.trim()}
              onClick={() => setStep(2)}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Choose Destinations
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#181818] uppercase tracking-wider">
              Select Initial Stops ({selectedCities.length} selected)
            </span>
            <span className="text-xs text-[#76546F] font-semibold">
              Route: {selectedCities.map((c) => c.name).join(" → ")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {mockDestinations.map((city) => {
              const isSelected = selectedCities.some((c) => c.id === city.id);
              return (
                <div
                  key={city.id}
                  onClick={() => toggleCity(city)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-[#FEF7EC] border-[#FCD89C] shadow-2xs"
                      : "bg-[#FAF9F5] border-[#E7E2D8] hover:border-[#D5CEBF]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-[#181818] truncate">{city.name}</p>
                    <p className="text-[11px] text-[#6B655E] truncate">{city.country}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                      isSelected
                        ? "bg-[#F4A62A] text-[#181818] font-bold"
                        : "border border-[#DDD7CB] bg-white text-transparent"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-[#E7E2D8]">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleCreate} rightIcon={<MapPin className="w-4 h-4" />}>
                Launch Workspace
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
