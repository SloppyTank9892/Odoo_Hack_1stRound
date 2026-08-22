"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTrips } from "@/context/TripContext";
import { Check, Globe2, Coins, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const CURRENCY_OPTIONS = [
  { code: "INR", symbol: "₹", label: "Indian Rupee (INR ₹)" },
  { code: "USD", symbol: "$", label: "US Dollar (USD $)" },
  { code: "EUR", symbol: "€", label: "Euro (EUR €)" },
  { code: "GBP", symbol: "£", label: "British Pound (GBP £)" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen (JPY ¥)" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham (AED د.إ)" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar (SGD S$)" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar (AUD A$)" },
];

/**
 * PreferencesForm — Currency & global preference settings.
 * Syncs currency selection to TripContext which propagates to all budget displays.
 */
export function PreferencesForm() {
  const { currency, setCurrency } = useTrips();
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState(currency || "₹");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Optimistic local update
    setCurrency(selectedCurrency);

    // Simulate async persistence
    await new Promise((r) => setTimeout(r, 700));

    toast({
      title: "Preferences Saved",
      description: `Currency updated to ${
        CURRENCY_OPTIONS.find((o) => o.symbol === selectedCurrency)?.label || selectedCurrency
      }. All budget displays are now synchronized.`,
      variant: "success",
    });
    setIsSaving(false);
  };

  const hasChanges = selectedCurrency !== currency;

  return (
    <div className="bg-white dark:bg-[#1C1B18] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] p-5 sm:p-6 transition-colors">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#E7E2D8] dark:border-[#33302B]">
        <div className="w-8 h-8 rounded-xl bg-[#FEF7EC] dark:bg-[#2B2113] border border-[#FCD89C] dark:border-[#5E431E] flex items-center justify-center">
          <Coins className="w-4 h-4 text-[#F4A62A]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#181818] dark:text-[#F5F3EF]">Currency & Budget Display</h3>
          <p className="text-[11px] text-[#6B655E] dark:text-[#A8A196]">
            Choose your preferred currency for all budget visualizations
          </p>
        </div>
      </div>

      {/* Currency grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {CURRENCY_OPTIONS.map((opt) => {
          const isActive = selectedCurrency === opt.symbol;
          return (
            <motion.button
              key={opt.code}
              onClick={() => setSelectedCurrency(opt.symbol)}
              whileTap={{ scale: 0.96 }}
              className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? "bg-[#FEF7EC] dark:bg-[#2B2113] border-[#FCD89C] dark:border-[#5E431E] shadow-xs"
                  : "bg-[#FAF9F5] dark:bg-[#24221E] border-[#E7E2D8] dark:border-[#33302B] hover:border-[#D5CEBF] dark:hover:border-[#48443D]"
              }`}
            >
              <span className="block text-lg font-bold text-[#181818] dark:text-[#F5F3EF] leading-none mb-0.5">
                {opt.symbol}
              </span>
              <span className="block text-[10px] font-bold text-[#6B655E] dark:text-[#A8A196] uppercase tracking-wide">
                {opt.code}
              </span>
              {isActive && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#F4A62A] flex items-center justify-center"
                >
                  <Check className="w-2.5 h-2.5 text-[#181818] stroke-[3]" />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Live preview */}
      <div className="p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] flex items-center gap-2 mb-5 text-[11px] text-[#6B655E] dark:text-[#A8A196]">
        <Globe2 className="w-3.5 h-3.5 text-[#9E978E] dark:text-[#7A746B] shrink-0" />
        <span>
          Budget displays will show as:{" "}
          <strong className="text-[#181818] dark:text-[#F5F3EF]">
            {selectedCurrency}
            {(60000).toLocaleString("en-IN")}
          </strong>{" "}
          — changes apply instantly across all trips.
        </span>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            hasChanges && !isSaving
              ? "bg-[#F4A62A] text-[#181818] hover:bg-[#E09115] shadow-sm"
              : "bg-[#FAF9F5] dark:bg-[#24221E] text-[#9E978E] dark:text-[#7A746B] border border-[#E7E2D8] dark:border-[#33302B] cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
}
