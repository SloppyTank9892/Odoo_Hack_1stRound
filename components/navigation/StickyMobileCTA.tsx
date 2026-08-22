"use client";

import React, { useState, useEffect } from "react";
import { Plus, Compass, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

interface StickyMobileCTAProps {
  onOpenCreateTrip: () => void;
}

export function StickyMobileCTA({ onOpenCreateTrip }: StickyMobileCTAProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA when scrolled past the initial hero banner (approx 120px)
      if (window.scrollY > 120) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Do not display on full interactive trip view if already embedded
  if (pathname.startsWith("/share/")) return null;

  return (
    <aside
      aria-label="Quick mobile action"
      className={`fixed bottom-20 left-4 right-4 z-30 md:hidden transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-[#181818]/95 backdrop-blur-md text-white border border-[#333333] rounded-2xl p-2.5 px-4 shadow-[0_12px_28px_rgba(24,24,24,0.3)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#F4A62A] flex items-center justify-center text-[#181818] shrink-0">
            <Compass className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">Ready to explore?</p>
            <p className="text-[10px] text-[#D5CEBF] truncate">Build your multi-city plan</p>
          </div>
        </div>

        <button
          onClick={onOpenCreateTrip}
          className="inline-flex items-center gap-1.5 bg-[#F4A62A] hover:bg-[#E09115] text-[#181818] font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs shrink-0 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Plan Trip</span>
        </button>
      </div>
    </aside>
  );
}
