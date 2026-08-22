"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trip } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency, calculateTripTotalCost, calculateBudgetPercentage } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { useToast } from "@/components/ui/Toast";
import {
  Calendar,
  Share2,
  Copy,
  Trash2,
  MoreVertical,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";

interface TripGridCardProps {
  trip: Trip;
}

export function TripGridCard({ trip }: TripGridCardProps) {
  const { copyTrip, deleteTrip, setActiveTripId } = useTrips();
  const { toast } = useToast();
  const [showMenu, setShowMenu] = useState(false);

  const totalCost = calculateTripTotalCost(trip);
  const budgetPercentage = calculateBudgetPercentage(trip);
  const totalDays = trip.days.length;

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    const newTrip = await copyTrip(trip.id);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    toast({
      title: "Trip Duplicated!",
      description: `${newTrip.name} has been added to your trips collection.`,
      variant: "success",
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    deleteTrip(trip.id);
    toast({
      title: "Trip Removed",
      description: `${trip.name} was removed from your collection.`,
      variant: "info",
    });
  };

  return (
    <Card className="overflow-hidden p-0 flex flex-col justify-between group relative" hover>
      {/* Cover Image Banner */}
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <img
          src={trip.coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant="amber" size="sm">
            {totalDays} Days
          </Badge>
          <span className="bg-black/50 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {trip.stops.length} Cities
          </span>
        </div>

        {/* Action Menu Trigger */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Context Menu Dropdown */}
          {showMenu && (
            <div
              className="absolute right-0 top-8 w-44 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xl border border-[#E7E2D8] dark:border-[#33302B] py-1.5 z-30 animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleDuplicate}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-[#181818] dark:text-[#F5F3EF] hover:bg-[#FAF9F5] dark:hover:bg-[#24221E] flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#76546F] dark:text-[#B88BAF]" />
                <span>Duplicate Trip</span>
              </button>
              <Link
                href={`/share/${trip.id}`}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-[#181818] dark:text-[#F5F3EF] hover:bg-[#FAF9F5] dark:hover:bg-[#24221E] flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-[#2B6CB0] dark:text-[#60A5FA]" />
                <span>{trip.isPublic ? "View Public Story" : "Preview Story (Private)"}</span>
              </Link>
              <div className="my-1 border-t border-[#E7E2D8] dark:border-[#33302B]" />
              <button
                onClick={handleDelete}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-[#C84B31] dark:text-[#F87171] hover:bg-[#FDF1EE] dark:hover:bg-[#3A1713] flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Trip</span>
              </button>
            </div>
          )}
        </div>

        {/* Title & Dates in Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-bold text-lg font-editorial leading-tight line-clamp-1">
            {trip.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-[#D5CEBF] mt-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {trip.startDate} — {trip.endDate}
            </span>
          </div>
        </div>
      </div>

      {/* Body Information */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#1C1B18] flex-1 flex flex-col justify-between transition-colors">
        <div>
          {/* Route Pills */}
          <div className="mb-4">
            <span className="block text-[10px] font-bold text-[#9E978E] dark:text-[#7A746B] uppercase tracking-wider mb-1.5">
              Destinations & Stops
            </span>
            <div className="flex flex-wrap gap-1.5">
              {trip.stops.map((stop) => (
                <span
                  key={stop.id}
                  className="text-xs font-semibold bg-[#FAF9F5] dark:bg-[#24221E] text-[#181818] dark:text-[#F5F3EF] px-2.5 py-1 rounded-lg border border-[#E7E2D8] dark:border-[#33302B] flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4A62A]" />
                  {stop.cityName}
                  <span className="text-[10px] text-[#6B655E] dark:text-[#A8A196]">({stop.daysCount}d)</span>
                </span>
              ))}
            </div>
          </div>

          {/* Budget Overview */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#6B655E] dark:text-[#A8A196]">Estimated Budget</span>
              <span className="font-bold text-[#181818] dark:text-[#F5F3EF]">
                {formatCurrency(totalCost, trip.budget.currency)}{" "}
                <span className="text-[#9E978E] dark:text-[#7A746B] font-normal">
                  / {formatCurrency(trip.budget.targetBudget, trip.budget.currency)}
                </span>
              </span>
            </div>
            <ProgressBar value={budgetPercentage} size="sm" />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-[#E7E2D8] dark:border-[#33302B] flex items-center justify-between gap-3">
          <Link
            href={`/share/${trip.id}`}
            className="text-xs font-semibold text-[#76546F] dark:text-[#B88BAF] hover:text-[#181818] dark:hover:text-[#F5F3EF] flex items-center gap-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Story</span>
          </Link>

          <Link
            href={`/trips/${trip.id}`}
            onClick={() => setActiveTripId(trip.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#181818] dark:bg-[#F4A62A] hover:bg-[#F4A62A] dark:hover:bg-[#E09115] text-white dark:text-[#181818] rounded-xl text-xs font-bold transition-colors"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
