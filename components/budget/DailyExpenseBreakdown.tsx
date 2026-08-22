"use client";

import React from "react";
import { Trip } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { Calendar, DollarSign, ArrowRight, Layers } from "lucide-react";

interface DailyExpenseBreakdownProps {
  trip: Trip;
}

export function DailyExpenseBreakdown({ trip }: DailyExpenseBreakdownProps) {
  const { currency } = useTrips();

  return (
    <Card className="p-6 bg-white border-[#E7E2D8]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-editorial text-[#181818]">
            Day-by-Day Financial Ledger
          </h3>
          <p className="text-xs text-[#6B655E]">
            Daily estimated accommodation, dining targets & scheduled activities
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E7E2D8] text-[10px] font-bold text-[#9E978E] uppercase tracking-wider">
              <th className="pb-3 pr-4">Day / Date</th>
              <th className="pb-3 pr-4">City Location</th>
              <th className="pb-3 pr-4">Activities</th>
              <th className="pb-3 pr-4">Stay & Dining</th>
              <th className="pb-3 text-right">Daily Estimated Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E2D8]/60">
            {trip.days.map((day) => {
              const stop = trip.stops.find((s) => s.id === day.cityId);
              const stayAndMeals = (stop?.accommodationPerNight || 0) + (stop?.dailyMealsEstimate || 0);
              const activitiesCost = day.activities.reduce((acc, a) => acc + a.cost, 0);

              const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <tr key={day.dayNumber} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-[#181818]">
                    Day {day.dayNumber}{" "}
                    <span className="font-normal text-[#6B655E] text-[11px] block">
                      {formattedDate}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 font-semibold text-[#76546F]">
                    {day.cityName}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="font-medium text-[#181818]">
                      {day.activities.length} items
                    </span>{" "}
                    <span className="text-[#9E978E]">
                      ({formatCurrency(activitiesCost, currency)})
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-[#6B655E]">
                    {formatCurrency(stayAndMeals, currency)}
                  </td>
                  <td className="py-3.5 text-right font-bold text-[#181818]">
                    {formatCurrency(day.estimatedDailyBudget, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
