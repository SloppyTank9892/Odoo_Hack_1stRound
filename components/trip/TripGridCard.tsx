"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trip } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency, calculateTripTotalCost, calculateBudgetPercentage } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { useToast } from "@/components/ui/Toast";
import {
  Calendar,
  MapPin,
  Share2,
  Copy,
  Trash2,
  MoreVertical,
  ArrowRight,
  Sparkles,
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

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    const newTrip = copyTrip(trip.id);
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
          src={trip.coverImage}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Context Menu Dropdown */}
          {showMenu && (
            <div
              className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-[#E7E2D8] py-1.5 z-30 animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleDuplicate}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-[#181818] hover:bg-[#FAF9F5] flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5 text-[#76546F]" />
                <span>Duplicate Trip</span>
              </button>
              <Link
                href={`/share/${trip.id}`}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-[#181818] hover:bg-[#FAF9F5] flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-[#2B6CB0]" />
                <span>Public Story</span>
              </Link>
              <div className="my-1 border-t border-[#E7E2D8]" />
              <button
                onClick={handleDelete}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-[#C84B31] hover:bg-[#FDF1EE] flex items-center gap-2"
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
      <div className="p-4 sm:p-5 bg-white flex-1 flex flex-col justify-between">
        <div>
          {/* Route Pills */}
          <div className="mb-4">
            <span className="block text-[10px] font-bold text-[#9E978E] uppercase tracking-wider mb-1.5">
              Destinations & Stops
            </span>
            <div className="flex flex-wrap gap-1.5">
              {trip.stops.map((stop) => (
                <span
                  key={stop.id}
                  className="text-xs font-semibold bg-[#FAF9F5] text-[#181818] px-2.5 py-1 rounded-lg border border-[#E7E2D8] flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4A62A]" />
                  {stop.cityName}
                  <span className="text-[10px] text-[#6B655E]">({stop.daysCount}d)</span>
                </span>
              ))}
            </div>
          </div>

          {/* Budget Overview */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#6B655E]">Estimated Budget</span>
              <span className="font-bold text-[#181818]">
                {formatCurrency(totalCost, trip.budget.currency)}{" "}
                <span className="text-[#9E978E] font-normal">
                  / {formatCurrency(trip.budget.targetBudget, trip.budget.currency)}
                </span>
              </span>
            </div>
            <ProgressBar value={budgetPercentage} size="sm" />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-[#E7E2D8] flex items-center justify-between gap-3">
          <Link
            href={`/share/${trip.id}`}
            className="text-xs font-semibold text-[#76546F] hover:text-[#181818] flex items-center gap-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Story</span>
          </Link>

          <Link
            href={`/trips/${trip.id}`}
            onClick={() => setActiveTripId(trip.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#181818] hover:bg-[#F4A62A] text-white hover:text-[#181818] rounded-xl text-xs font-bold transition-colors"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
