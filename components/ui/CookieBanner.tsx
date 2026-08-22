"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("globetrotter_cookie_consent");
    if (!consent) {
      // Show banner after brief delay
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "globetrotter_cookie_consent",
      JSON.stringify({ essential: true, analytics: true, marketing: true, timestamp: Date.now() })
    );
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem(
      "globetrotter_cookie_consent",
      JSON.stringify({ essential: true, analytics: false, marketing: false, timestamp: Date.now() })
    );
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem(
      "globetrotter_cookie_consent",
      JSON.stringify({ ...preferences, timestamp: Date.now() })
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white/95 dark:bg-[#1C1B18]/95 backdrop-blur-md border border-[#E7E2D8] dark:border-[#33302B] rounded-2xl p-5 shadow-[0_12px_36px_rgba(24,24,24,0.12)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)] text-xs text-[#181818] dark:text-[#F5F3EF] transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FEF7EC] dark:bg-[#2B2113] border border-[#FCD89C] dark:border-[#5E431E] flex items-center justify-center text-[#B86E00] dark:text-[#F4A62A]">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#181818] dark:text-[#F5F3EF]">Privacy & Cookies</h4>
              <span className="text-[10px] text-[#76546F] dark:text-[#B88BAF] font-semibold uppercase tracking-wider">
                Transparent Workspace
              </span>
            </div>
          </div>
          <button
            onClick={handleAcceptEssential}
            aria-label="Dismiss cookie notice"
            className="text-[#9E978E] hover:text-[#181818] dark:hover:text-[#F5F3EF] p-1 rounded-lg hover:bg-[#FAF9F5] dark:hover:bg-[#282622] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {!isCustomizing ? (
          <>
            <p className="text-xs text-[#6B655E] dark:text-[#A8A196] leading-relaxed mb-4">
              We use essential cookies to remember your travel plans and optional analytics to enhance
              the interactive workspace. Read our{" "}
              <Link href="/privacy" className="text-[#F4A62A] font-semibold hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button size="sm" onClick={handleAcceptAll} className="flex-1 text-xs">
                Accept All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAcceptEssential}
                className="flex-1 text-xs"
              >
                Essential Only
              </Button>
              <button
                onClick={() => setIsCustomizing(true)}
                className="w-full text-center text-[11px] font-semibold text-[#76546F] dark:text-[#B88BAF] hover:text-[#181818] dark:hover:text-[#F5F3EF] pt-1 cursor-pointer"
              >
                Customize preferences
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B]">
              <div>
                <p className="font-bold text-xs text-[#181818] dark:text-[#F5F3EF]">Essential & Storage</p>
                <p className="text-[10px] text-[#9E978E] dark:text-[#7A746B]">Itinerary sync and session cookies</p>
              </div>
              <span className="text-[10px] font-bold text-[#1B8755] dark:text-[#34D399] bg-[#EDF7F2] dark:bg-[#132D20] px-2 py-0.5 rounded">
                Always Active
              </span>
            </div>

            <label className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#201F1B] border border-[#E7E2D8] dark:border-[#33302B] cursor-pointer">
              <div>
                <p className="font-bold text-xs text-[#181818] dark:text-[#F5F3EF]">Analytics & Insights</p>
                <p className="text-[10px] text-[#9E978E] dark:text-[#7A746B]">Helps improve itinerary features</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="accent-[#F4A62A] w-4 h-4 rounded cursor-pointer"
              />
            </label>

            <div className="flex items-center gap-2 pt-2">
              <Button size="sm" onClick={handleSaveCustom} className="flex-1 text-xs">
                Save Choices
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsCustomizing(false)}
                className="text-xs"
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
