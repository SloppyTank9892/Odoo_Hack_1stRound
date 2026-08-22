"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trip } from "@/types/trip";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SocialShareModal } from "@/components/share/SocialShareModal";
import { formatCurrency, calculateTripTotalCost } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { useToast } from "@/components/ui/Toast";
import {
  Copy,
  Share2,
  Calendar,
  MapPin,
  Clock,
  Globe2,
  Sparkles,
  ArrowRight,
  Check,
  Edit3,
  Lock,
  Eye,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";

interface PublicStoryViewProps {
  trip: Trip;
  isOwner?: boolean;
  onTogglePublic?: () => void;
}

export function PublicStoryView({ trip, isOwner = false, onTogglePublic }: PublicStoryViewProps) {
  const router = useRouter();
  const { copyTrip, currency, setCurrency } = useTrips();
  const { toast } = useToast();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const totalCost = calculateTripTotalCost(trip);
  const totalDays = trip.days.length;

  const handleCopyTrip = async () => {
    setIsCopying(true);
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });

    try {
      const newTrip = await copyTrip(trip.id);
      setIsCopied(true);

      toast({
        title: "Trip Added to Your Collection!",
        description: `"${trip.name}" has been duplicated into your personal workspace.`,
        variant: "success",
        actionLabel: "Open My Trip",
        onAction: () => router.push(`/trips/${newTrip.id}`),
      });

      setTimeout(() => {
        router.push(`/trips/${newTrip.id}`);
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to copy trip.";
      toast({
        title: "Copy Failed",
        description: msg,
        variant: "error",
      });
    } finally {
      setIsCopying(false);
    }
  };

  const handleToggle = () => {
    if (onTogglePublic) {
      onTogglePublic();
      toast({
        title: trip.isPublic ? "Trip Made Private" : "Trip Published Publicly!",
        description: trip.isPublic
          ? "This trip is now private and hidden from the community gallery."
          : "Your travel story is now public in the community gallery!",
        variant: "success",
      });
    }
  };

  const defaultImg =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#181818]">
      {/* Private Owner Preview Banner */}
      {!trip.isPublic && isOwner && (
        <div className="bg-[#FEF7EC] border-b border-[#FCD89C] px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#8F5500]">
            <span className="p-1 rounded-md bg-[#F4A62A]/20">🔒</span>
            <span>
              <strong>Private Journey Preview:</strong> Only you can view this page. Click <strong>Publish Story</strong> to make it visible in the Community Gallery so other travelers can discover and copy it.
            </span>
          </div>
          <button
            onClick={handleToggle}
            className="px-4 py-1.5 rounded-xl bg-[#F4A62A] hover:bg-[#E09115] text-[#181818] font-bold shadow-xs whitespace-nowrap transition-colors"
          >
            Publish Story Now
          </button>
        </div>
      )}

      {/* Top Editorial Navbar */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E7E2D8] px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand & Explorer Links */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#F4A62A] flex items-center justify-center text-[#181818] shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Globe2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-[#181818]">
                GlobeTrotter
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold bg-[#FEF7EC] text-[#B86E00] px-2 py-0.5 rounded-full border border-[#FCD89C]">
                {isOwner ? (trip.isPublic ? "Your Public Story" : "Your Private Preview") : "Public Story"}
              </span>
            </div>
          </Link>

          {/* Quick Navigation Links */}
          <div className="hidden md:flex items-center gap-1 pl-3 border-l border-[#E7E2D8] text-xs font-semibold text-[#6B655E]">
            <Link
              href="/share"
              className="px-2.5 py-1.5 rounded-lg hover:text-[#181818] hover:bg-[#FAF9F5] transition-colors"
            >
              All Public Stories
            </Link>
            <Link
              href="/trips"
              className="px-2.5 py-1.5 rounded-lg hover:text-[#181818] hover:bg-[#FAF9F5] transition-colors"
            >
              My Workspace
            </Link>
          </div>
        </div>

        {/* Right Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Toggle */}
          <div className="hidden sm:flex bg-[#FAF9F5] rounded-xl border border-[#E7E2D8] p-0.5 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setCurrency("₹")}
              className={`px-2 py-1 rounded-lg transition-colors ${
                currency === "₹" ? "bg-[#FEF7EC] text-[#B86E00] font-bold" : "text-[#9E978E] hover:text-[#181818]"
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency("$")}
              className={`px-2 py-1 rounded-lg transition-colors ${
                currency === "$" ? "bg-[#FEF7EC] text-[#B86E00] font-bold" : "text-[#9E978E] hover:text-[#181818]"
              }`}
            >
              $ USD
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareModalOpen(true)}
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            className="hidden xs:inline-flex"
          >
            Share
          </Button>

          {isOwner ? (
            <Link href={`/trips/${trip.id}`}>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                className="font-bold border-[#E7E2D8]"
              >
                Edit in Workspace
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              onClick={handleCopyTrip}
              disabled={isCopying}
              leftIcon={
                isCopying ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isCopied ? (
                  <Check className="w-3.5 h-3.5 text-[#181818]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )
              }
              className="shadow-sm font-bold"
            >
              {isCopied ? "Added to My Trips!" : "Copy Trip"}
            </Button>
          )}

          {/* User Sign In / Profile Link */}
          <Link
            href="/auth"
            className="text-xs font-bold text-[#181818] bg-[#FAF9F5] hover:bg-[#EFECE6] border border-[#E7E2D8] px-3 py-1.5 rounded-xl transition-colors shrink-0 shadow-2xs"
          >
            Sign In / Login
          </Link>
        </div>
      </nav>

      {/* Hero Destination Banner */}
      <div className="relative h-[420px] sm:h-[520px] w-full overflow-hidden">
        <img
          src={trip.coverImage || defaultImg}
          alt={trip.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImg;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/50 to-transparent" />

        {/* Hero Story Typography */}
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto p-6 sm:p-12 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="amber" size="sm">
              {trip.isPublic ? "Public Travel Story" : "Private Journey"}
            </Badge>
            <span className="text-xs text-[#D5CEBF] font-semibold">
              Share Code: {trip.shareCode}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight uppercase leading-tight mb-2">
            {trip.name}
          </h1>

          <p className="text-sm sm:text-lg text-[#FAF9F5] font-light max-w-2xl leading-relaxed mb-6">
            {trip.description || trip.tagline}
          </p>

          {/* Quick Stats Bar in Hero */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-4 border-t border-white/20 text-xs sm:text-sm">
            <div>
              <span className="text-[11px] text-[#D5CEBF] uppercase block font-semibold">Route</span>
              <span className="font-bold text-white">
                {trip.stops.map((s) => s.cityName).join(" → ")}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#D5CEBF] uppercase block font-semibold">Duration</span>
              <span className="font-bold text-white">
                {totalDays} Days · {trip.stops.length} Cities
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#D5CEBF] uppercase block font-semibold">Est. Budget</span>
              <span className="font-bold text-[#F4A62A]">
                {formatCurrency(totalCost, trip.budget.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editorial Story Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        {/* Sticky Action Banner */}
        <div className="p-5 bg-white rounded-2xl border border-[#E7E2D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <h3 className="font-bold text-base text-[#181818]">
              {isOwner ? "Manage Your Itinerary" : "Inspired by this itinerary?"}
            </h3>
            <p className="text-xs text-[#6B655E]">
              {isOwner
                ? "This trip is in your personal collection. Open the workspace to edit stops, adjust days, or log expenses."
                : "Copy this exact trip into your workspace to customize dates, modify stops, and track budgets."}
            </p>
          </div>
          {isOwner ? (
            <Link href={`/trips/${trip.id}`}>
              <Button size="md" leftIcon={<Edit3 className="w-4 h-4" />} className="shrink-0 font-bold">
                Open Trip Workspace
              </Button>
            </Link>
          ) : (
            <Button
              size="md"
              onClick={handleCopyTrip}
              disabled={isCopying}
              leftIcon={<Copy className="w-4 h-4" />}
              className="shrink-0 font-bold"
            >
              Copy &amp; Personalize
            </Button>
          )}
        </div>

        {/* Route Highlights Section */}
        <div className="mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B86E00] block mb-2">
            The Journey Map
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-[#181818] mb-6">
            Destinations &amp; Heritage Citadels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {trip.stops.map((stop, idx) => (
              <div
                key={stop.id}
                className="p-5 rounded-2xl bg-white border border-[#E7E2D8] shadow-2xs flex items-start gap-4"
              >
                <img
                  src={stop.image || defaultImg}
                  alt={stop.cityName}
                  className="w-16 h-16 rounded-xl object-cover border border-[#E7E2D8] shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultImg;
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#181818] text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-base text-[#181818]">{stop.cityName}</h4>
                    <span className="text-xs font-semibold text-[#76546F]">
                      ({stop.daysCount} Days)
                    </span>
                  </div>
                  <p className="text-xs text-[#6B655E] mt-1 line-clamp-2">
                    {stop.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day-by-Day Editorial Chapter Flow */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B86E00] block mb-2">
            Chronological Itinerary
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-[#181818] mb-8">
            Day-by-Day Travel Story
          </h2>

          <div className="space-y-8">
            {trip.days.map((day) => (
              <div
                key={day.dayNumber}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E7E2D8] shadow-xs"
              >
                {/* Chapter Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E2D8] mb-6 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase text-[#B86E00] bg-[#FEF7EC] px-3 py-1 rounded-xl border border-[#FCD89C]">
                      Day {day.dayNumber}
                    </span>
                    <h3 className="text-xl font-bold font-editorial text-[#181818]">
                      {day.cityName} · Chapter {day.cityDayNumber}
                    </h3>
                  </div>

                  <span className="text-xs font-semibold text-[#6B655E] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#9E978E]" />
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Day Notes */}
                {day.notes && (
                  <p className="text-xs sm:text-sm text-[#76546F] italic mb-6">
                    {day.notes}
                  </p>
                )}

                {/* Scheduled Activities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {day.activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E7E2D8] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#76546F] mb-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {act.timeSlot}
                          </span>
                          <span className="capitalize">{act.category}</span>
                        </div>
                        <h5 className="font-bold text-sm text-[#181818] mb-1">
                          {act.name}
                        </h5>
                        <p className="text-xs text-[#6B655E] line-clamp-2">
                          {act.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#E7E2D8] flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#9E978E]">{act.durationMinutes} mins</span>
                        <span className="font-bold text-[#181818]">
                          {act.cost > 0 ? formatCurrency(act.cost, currency) : "Free"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-16 text-center py-12 px-6 rounded-3xl bg-[#181818] text-white">
          <h3 className="text-2xl font-bold font-editorial mb-2">
            {isOwner ? "Ready to customize your journey?" : `Ready to plan your version of ${trip.name}?`}
          </h3>
          <p className="text-xs sm:text-sm text-[#D5CEBF] max-w-md mx-auto mb-6">
            {isOwner
              ? "All changes in your workspace update live and can be shared anytime with your travel companions."
              : `Import all ${totalDays} days and ${trip.stops.length} stops directly into your personal workspace with one click.`}
          </p>
          {isOwner ? (
            <Link href={`/trips/${trip.id}`}>
              <Button size="lg" leftIcon={<Edit3 className="w-5 h-5" />}>
                Go to Trip Workspace
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              onClick={handleCopyTrip}
              disabled={isCopying}
              leftIcon={<Copy className="w-5 h-5" />}
            >
              Copy This Trip Now
            </Button>
          )}
        </div>
      </main>

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        trip={trip}
      />
    </div>
  );
}
