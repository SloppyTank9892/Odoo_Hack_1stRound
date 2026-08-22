"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Globe2, Plus, ChevronDown, LogOut, User } from "lucide-react";
import { useTrips } from "@/context/TripContext";
import { Button } from "@/components/ui/Button";
import { getAuthUser, signOut } from "@/app/actions/auth";
import { useToast } from "@/components/ui/Toast";

interface TopBarProps {
  onOpenCreateTrip?: () => void;
}

export function TopBar({ onOpenCreateTrip }: TopBarProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { trips, activeTrip, setActiveTripId, currency, setCurrency, searchQuery, setSearchQuery } = useTrips();
  const [currentUser, setCurrentUser] = useState<{ email?: string; name?: string; avatarUrl?: string } | null>(null);

  useEffect(() => {
    async function checkUser() {
      const res = await getAuthUser();
      if (res.success && res.data) {
        const p = res.data.profile;
        const name = p?.first_name
          ? `${p.first_name} ${p.last_name || ""}`.trim()
          : res.data.email?.split("@")[0] || "Traveler";
        setCurrentUser({
          email: res.data.email,
          name,
          avatarUrl: p?.avatar_url || undefined,
        });
      }
    }
    checkUser();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setCurrentUser(null);
    toast({
      title: "Signed Out",
      description: "You have been safely signed out.",
      variant: "info",
    });
    router.push("/auth");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 bg-[#F7F6F2]/90 backdrop-blur-md border-b border-[#E7E2D8] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Mobile Brand / Desktop Title Area */}
      <div className="flex items-center gap-3 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#F4A62A] flex items-center justify-center text-[#181818]">
            <Globe2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-bold text-sm tracking-tight text-[#181818]">GlobeTrotter</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-[#9E978E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search destinations, stops, activities..."
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E7E2D8] rounded-xl text-[#181818] placeholder-[#9E978E] focus:outline-none focus:ring-2 focus:ring-[#F4A62A] focus:border-transparent transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E978E] hover:text-[#181818] cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Trip Quick Selector */}
        {activeTrip && (
          <div className="relative hidden lg:block">
            <select
              value={activeTrip.id}
              onChange={(e) => setActiveTripId(e.target.value)}
              className="appearance-none bg-white border border-[#E7E2D8] text-xs font-semibold text-[#181818] py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4A62A] shadow-2xs cursor-pointer"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  📍 {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#9E978E] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Currency Switcher */}
        <div className="flex bg-white rounded-xl border border-[#E7E2D8] p-0.5 text-xs font-bold shadow-2xs">
          <button
            onClick={() => setCurrency("₹")}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${currency === "₹" ? "bg-[#FEF7EC] text-[#B86E00] font-bold" : "text-[#9E978E] hover:text-[#181818]"
              }`}
          >
            ₹ INR
          </button>
          <button
            onClick={() => setCurrency("$")}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${currency === "$" ? "bg-[#FEF7EC] text-[#B86E00] font-bold" : "text-[#9E978E] hover:text-[#181818]"
              }`}
          >
            $ USD
          </button>
        </div>

        {/* Plan Trip Button */}
        {onOpenCreateTrip && (
          <div className="hidden sm:block">
            <Button
              size="sm"
              onClick={onOpenCreateTrip}
              leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
            >
              Plan Trip
            </Button>
          </div>
        )}

        {/* Auth / Profile Link */}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-[#E7E2D8] text-xs font-bold text-[#181818] hover:bg-[#FAF9F5] transition-colors shadow-2xs"
            >
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name || "Avatar"}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#76546F] text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name?.charAt(0).toUpperCase() || "T"}
                </div>
              )}
              <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name || "Traveler"}</span>
            </Link>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-2 text-[#9E978E] hover:text-[#C84B31] hover:bg-white rounded-xl border border-transparent hover:border-[#E7E2D8] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="text-xs font-bold text-[#76546F] hover:text-[#181818] px-3 py-1.5 rounded-xl bg-white border border-[#E7E2D8] hover:bg-[#FAF9F5] transition-colors shadow-2xs"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
