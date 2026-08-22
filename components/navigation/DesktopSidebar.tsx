"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  MapPinned,
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  BarChart3,
  Globe2,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useTrips } from "@/context/TripContext";
import { formatCurrency, calculateTripTotalCost } from "@/lib/tripCalculations";
import { cn } from "@/lib/utils";

interface DesktopSidebarProps {
  onOpenCreateTrip: () => void;
}

export function DesktopSidebar({ onOpenCreateTrip }: DesktopSidebarProps) {
  const pathname = usePathname();
  const { trips, activeTrip } = useTrips();

  const navItems = [
    { name: "Dashboard", href: "/", icon: Compass },
    { name: "My Trips", href: "/trips", icon: MapPinned, badge: trips.length },
    { name: "Explore", href: "/explore", icon: Sparkles },
    { name: "Public Story", href: `/share/${activeTrip.id}`, icon: BookOpen },
    { name: "Settings", href: "/settings", icon: SlidersHorizontal },
    { name: "Admin Analytics", href: "/admin", icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E7E2D8] min-h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-6 pb-4 border-b border-[#E7E2D8]/60 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#F4A62A] flex items-center justify-center text-[#181818] shadow-sm group-hover:scale-105 transition-transform duration-200">
            <Globe2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-[#181818] leading-none">
              GlobeTrotter
            </h1>
            <span className="text-[11px] font-medium text-[#76546F] tracking-wider uppercase">
              Warm Explorer
            </span>
          </div>
        </Link>
      </div>

      {/* Plan New Trip CTA */}
      <div className="px-4 pt-4">
        <button
          onClick={onOpenCreateTrip}
          className="w-full flex items-center justify-center gap-2 bg-[#F4A62A] hover:bg-[#E09115] text-[#181818] font-semibold text-sm py-2.5 px-4 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 active:scale-[0.98] border border-[#FCD89C]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#9E978E]">
          Workspace
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-[#FEF7EC] text-[#B86E00] font-semibold shadow-2xs border border-[#FCD89C]/50"
                  : "text-[#6B655E] hover:text-[#181818] hover:bg-[#FAF9F5]"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-[#B86E00]" : "text-[#9E978E] group-hover:text-[#181818]"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={cn(
                    "text-[11px] px-2 py-0.5 rounded-full font-bold",
                    isActive ? "bg-[#F4A62A] text-[#181818]" : "bg-[#EFECE6] text-[#6B655E]"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Active Trip Mini-Widget */}
      {activeTrip && (
        <div className="p-4 mx-3 mb-3 bg-[#FAF9F5] rounded-2xl border border-[#E7E2D8] text-xs">
          <div className="flex items-center justify-between text-[#9E978E] text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <span>Active Journey</span>
            <span className="text-[#1B8755] bg-[#EDF7F2] px-1.5 py-0.5 rounded">Live Sync</span>
          </div>
          <Link
            href={`/trips/${activeTrip.id}`}
            className="block font-bold text-[#181818] hover:text-[#F4A62A] transition-colors truncate"
          >
            {activeTrip.name}
          </Link>
          <div className="text-[11px] text-[#6B655E] truncate mt-0.5">
            {activeTrip.stops.map((s) => s.cityName).join(" → ")}
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#E7E2D8] flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#181818]">
              {formatCurrency(calculateTripTotalCost(activeTrip), activeTrip.budget.currency)}
            </span>
            <Link
              href={`/trips/${activeTrip.id}`}
              className="text-[#76546F] font-semibold hover:underline flex items-center gap-1"
            >
              Open <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* User Profile Mini Footer */}
      <div className="p-4 border-t border-[#E7E2D8]/80 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#76546F] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
            AR
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#181818] truncate">Aarav Roy</p>
            <p className="text-[11px] text-[#9E978E] truncate">Pro Explorer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
