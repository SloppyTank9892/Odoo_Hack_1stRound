"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MapPinned, Sparkles, BookOpen, Plus } from "lucide-react";
import { useTrips } from "@/context/TripContext";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  onOpenCreateTrip: () => void;
}

export function MobileBottomNav({ onOpenCreateTrip }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { activeTrip } = useTrips();

  const navItems = [
    { name: "Home", href: "/", icon: Compass },
    { name: "Trips", href: "/trips", icon: MapPinned },
    { name: "Explore", href: "/explore", icon: Sparkles },
    { name: "Story", href: activeTrip ? `/share/${activeTrip.id}` : "/trips", icon: BookOpen },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7E2D8] px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around relative">
        {/* Left 2 items */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-medium transition-colors",
                isActive ? "text-[#B86E00] font-bold" : "text-[#6B655E] hover:text-[#181818]"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-0.5", isActive ? "stroke-[2.5]" : "stroke-[1.8]")} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Center Plan CTA Button */}
        <button
          onClick={onOpenCreateTrip}
          aria-label="Plan New Trip"
          className="w-12 h-12 -mt-5 rounded-full bg-[#F4A62A] text-[#181818] flex items-center justify-center shadow-lg border-2 border-white active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Right 2 items */}
        {navItems.slice(2).map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-medium transition-colors",
                isActive ? "text-[#B86E00] font-bold" : "text-[#6B655E] hover:text-[#181818]"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-0.5", isActive ? "stroke-[2.5]" : "stroke-[1.8]")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
