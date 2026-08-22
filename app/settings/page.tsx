"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTrips } from "@/context/TripContext";
import { useToast } from "@/components/ui/Toast";
import { User, Sliders, Globe, Shield, Bell, Check, Save } from "lucide-react";

export default function SettingsPage() {
  const { currency, setCurrency } = useTrips();
  const { toast } = useToast();

  const [name, setName] = useState("Aarav Roy");
  const [email, setEmail] = useState("aarav.roy@globetrotter.travel");
  const [pacing, setPacing] = useState<"relaxed" | "balanced" | "fast">("balanced");
  const [homeCity, setHomeCity] = useState("New Delhi, India");

  const handleSave = () => {
    toast({
      title: "Preferences Saved!",
      description: "Your traveler profile settings have been updated.",
      variant: "success",
    });
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold font-editorial text-[#181818]">
              Traveler Profile & Preferences
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#6B655E]">
            Customize your default pacing, preferred currencies, and planning preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className="p-6 bg-white border-[#E7E2D8]">
          <div className="flex items-center gap-4 pb-6 border-b border-[#E7E2D8]">
            <div className="w-16 h-16 rounded-2xl bg-[#76546F] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              AR
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#181818]">{name}</h3>
              <p className="text-xs text-[#6B655E]">{email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-[#B86E00] bg-[#FEF7EC] px-2 py-0.5 rounded border border-[#FCD89C]">
                Pro Traveler Tier
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
                Home City / Origin
              </label>
              <input
                type="text"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              >
                <option value="₹">₹ INR (Indian Rupee)</option>
                <option value="$">$ USD (US Dollar)</option>
                <option value="€">€ EUR (Euro)</option>
                <option value="£">£ GBP (British Pound)</option>
                <option value="¥">¥ JPY (Japanese Yen)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Travel Pacing & Style */}
        <Card className="p-6 bg-white border-[#E7E2D8]">
          <h3 className="text-base font-bold font-editorial text-[#181818] mb-1">
            Travel Pacing Preference
          </h3>
          <p className="text-xs text-[#6B655E] mb-4">
            Determines how many activities are suggested per day when crafting new itineraries
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "relaxed" as const, label: "Relaxed & Slow", desc: "1-2 activities/day with open cafe hours" },
              { id: "balanced" as const, label: "Balanced Explorer", desc: "2-3 activities/day with cultural focus" },
              { id: "fast" as const, label: "Action-Packed", desc: "4+ activities/day maximizing monument visits" },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setPacing(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  pacing === item.id
                    ? "bg-[#FEF7EC] border-[#FCD89C] shadow-2xs"
                    : "bg-[#FAF9F5] border-[#E7E2D8] hover:border-[#D5CEBF]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-xs sm:text-sm text-[#181818]">{item.label}</h4>
                  {pacing === item.id && <Check className="w-4 h-4 text-[#B86E00]" />}
                </div>
                <p className="text-[11px] text-[#6B655E]">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Save CTA */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" leftIcon={<Save className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
