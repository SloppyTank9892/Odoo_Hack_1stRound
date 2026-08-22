"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useTrips } from "@/context/TripContext";
import { useToast } from "@/components/ui/Toast";
import { CityDiscovery } from "@/types/trip";
import { curatedDestinations } from "@/data/curatedDestinations";
import {
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
} from "lucide-react";

const CURRENCY_OPTIONS = [
  { symbol: "₹", label: "INR (₹)" },
  { symbol: "$", label: "USD ($)" },
  { symbol: "€", label: "EUR (€)" },
  { symbol: "£", label: "GBP (£)" },
];

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTripModal({ isOpen, onClose }: CreateTripModalProps) {
  const router = useRouter();
  const { createNewTrip, currency, setCurrency, destinations } = useTrips();
  const displayDestinations = destinations?.length > 0 ? destinations : curatedDestinations;
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [tripName, setTripName] = useState("");
  const [tagline, setTagline] = useState("");
  const [startDate, setStartDate] = useState("2026-10-15");
  const [targetBudget, setTargetBudget] = useState(50000);
  const [selectedCurrency, setSelectedCurrency] = useState(currency || "₹");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCities, setSelectedCities] = useState<CityDiscovery[]>([]);

  const toggleCity = (city: CityDiscovery) => {
    if (selectedCities.some((c) => c.id === city.id)) {
      setSelectedCities((prev) => prev.filter((c) => c.id !== city.id));
    } else {
      setSelectedCities((prev) => [...prev, city]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async () => {
    if (!tripName.trim()) return;

    // Apply currency to global context
    setCurrency(selectedCurrency);

    // Fallback to first destination if user selected none
    const citiesToUse = selectedCities.length > 0 ? selectedCities : [displayDestinations[0]];

    setIsSubmitting(true);
    try {
      const newId = await createNewTrip({
        name: tripName.trim(),
        tagline: tagline.trim() || `Exploring ${citiesToUse.map((c) => c.name).join(", ")}`,
        startDate,
        initialCities: citiesToUse,
        coverFile,
        targetBudget,
      });

      toast({
        title: "Trip Created!",
        description: `${tripName} is ready in your Trip Workspace.`,
        variant: "success",
      });

      onClose();
      // Reset state
      setTripName("");
      setTagline("");
      setCoverFile(null);
      setCoverPreview(null);
      setSelectedCities([]);
      setStep(1);

      router.push(`/trips/${newId}`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Could not create trip in Supabase database. Please try again.";
      toast({
        title: "Creation Error",
        description: errorMsg,
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A]" />
          <span>{step === 1 ? "Craft New Itinerary" : "Select Route Corridor"}</span>
        </div>
      }
      description={
        step === 1
          ? "Configure your journey title, start date, budget, and custom banner"
          : "Pick the curated stops you wish to link into your multi-city timeline"
      }
      maxWidth="lg"
    >
      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1.5">
              Trip Title *
            </label>
            <input
              type="text"
              required
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="e.g. Royal Rajasthan Grand Circuit"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1.5">
              Tagline / Trip Focus
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. 10 Days across forts, heritage palaces & culinary bazaars"
              className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#9E978E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1.5">
                Target Budget
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-20 px-2 py-2 text-xs bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] font-bold focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
                >
                  {CURRENCY_OPTIONS.map((opt) => (
                    <option key={opt.symbol} value={opt.symbol}>
                      {opt.symbol}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#9E978E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-[#1C1B18] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-[#181818] dark:text-[#F5F3EF] font-bold focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1.5">
              Custom Cover Banner (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 border-2 border-dashed border-[#E7E2D8] dark:border-[#33302B] rounded-xl p-3 text-center cursor-pointer hover:border-[#F4A62A] transition-colors bg-[#FAF9F5]/50 dark:bg-[#24221E]/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <ImageIcon className="w-5 h-5 text-[#9E978E] mx-auto mb-1" />
                <span className="text-xs text-[#6B655E] dark:text-[#A8A196] font-medium block">
                  {coverFile ? coverFile.name : "Click to upload banner photo"}
                </span>
                <span className="text-[10px] text-[#9E978E]">JPG, PNG, WebP up to 5MB</span>
              </label>

              {coverPreview && (
                <div className="w-20 h-16 rounded-xl overflow-hidden border border-[#E7E2D8] dark:border-[#33302B] relative shrink-0">
                  <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <Button
              type="button"
              disabled={!tripName.trim()}
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next: Select Route Stops
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider">
              Select Initial Stops ({selectedCities.length} selected)
            </span>
            <span className="text-xs text-[#76546F] dark:text-[#B88BAF] font-semibold truncate max-w-[200px]">
              {selectedCities.length > 0
                ? `Route: ${selectedCities.map((c) => c.name).join(" → ")}`
                : "Select 1 or more stops"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {displayDestinations.map((city) => {
              const isSelected = selectedCities.some((c) => c.id === city.id);
              return (
                <div
                  key={city.id}
                  onClick={() => toggleCity(city)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-[#FEF7EC] dark:bg-[#2B2113] border-[#FCD89C] dark:border-[#5E431E] shadow-2xs"
                      : "bg-[#FAF9F5] dark:bg-[#24221E] border-[#E7E2D8] dark:border-[#33302B] hover:border-[#D5CEBF] dark:hover:border-[#48443D]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-[#181818] dark:text-[#F5F3EF] truncate">{city.name}</p>
                    <p className="text-[11px] text-[#6B655E] dark:text-[#A8A196] truncate">{city.country}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                      isSelected
                        ? "bg-[#F4A62A] text-[#181818] font-bold"
                        : "border border-[#DDD7CB] dark:border-[#48443D] bg-white dark:bg-[#1C1B18] text-transparent"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-[#E7E2D8] dark:border-[#33302B]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleCreate}
              leftIcon={<Sparkles className="w-4 h-4 text-[#F4A62A]" />}
            >
              {isSubmitting ? "Generating Itinerary..." : "Launch Trip Workspace"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
