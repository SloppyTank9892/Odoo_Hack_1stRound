"use client";

import React from "react";
import { Trip } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency, calculateTripTotalCost } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { Hotel, Utensils, Compass, Plane, Sparkles, PieChart } from "lucide-react";

interface CategoryBreakdownProps {
  trip: Trip;
}

export function CategoryBreakdown({ trip }: CategoryBreakdownProps) {
  const { currency } = useTrips();
  const totalCost = calculateTripTotalCost(trip);
  const cats = trip.budget.categories;

  const categories = [
    {
      name: "Accommodation",
      key: "accommodation" as const,
      amount: cats.accommodation,
      icon: Hotel,
      color: "bg-[#76546F]",
      textColor: "text-[#76546F]",
      description: "Hotels, heritage havelis & boutique stays",
    },
    {
      name: "Meals & Dining",
      key: "meals" as const,
      amount: cats.meals,
      icon: Utensils,
      color: "bg-[#F4A62A]",
      textColor: "text-[#B86E00]",
      description: "Breakfasts, street food walks & fine dining",
    },
    {
      name: "Activities & Tours",
      key: "activities" as const,
      amount: cats.activities,
      icon: Compass,
      color: "bg-[#1B8755]",
      textColor: "text-[#1B8755]",
      description: "Monuments, guided palace tours & experiences",
    },
    {
      name: "Transport & Transit",
      key: "transport" as const,
      amount: cats.transport,
      icon: Plane,
      color: "bg-[#2B6CB0]",
      textColor: "text-[#2B6CB0]",
      description: "Trains, scenic private drives & intra-city cabs",
    },
    {
      name: "Miscellaneous & Contingency",
      key: "misc" as const,
      amount: cats.misc,
      icon: Sparkles,
      color: "bg-[#6B655E]",
      textColor: "text-[#6B655E]",
      description: "Bazaar shopping, tips & emergency buffer",
    },
  ];

  return (
    <Card className="p-6 bg-white border-[#E7E2D8]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-editorial text-[#181818]">
            Expense Allocation by Category
          </h3>
          <p className="text-xs text-[#6B655E]">
            Dynamic breakdown automatically recalculated based on scheduled itinerary items
          </p>
        </div>
        <span className="text-xs font-bold text-[#76546F] bg-[#F6F0F5] px-2.5 py-1 rounded-lg border border-[#DBCBD8]">
          5 Categories
        </span>
      </div>

      <div className="space-y-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const percentage = totalCost > 0 ? Math.round((cat.amount / totalCost) * 100) : 0;

          return (
            <div key={cat.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-lg ${cat.color}/10 ${cat.textColor} flex items-center justify-center`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#181818]">{cat.name}</span>
                    <span className="text-[10px] text-[#9E978E] ml-2 hidden sm:inline">
                      {cat.description}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#181818]">
                    {formatCurrency(cat.amount, currency)}
                  </span>
                  <span className="text-[11px] text-[#9E978E] ml-2">({percentage}%)</span>
                </div>
              </div>

              {/* Individual Category Bar */}
              <div className="w-full bg-[#EFECE6] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${cat.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
