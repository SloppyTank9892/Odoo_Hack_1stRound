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
    <Card className="p-6 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
            Day-by-Day Financial Ledger
          </h3>
          <p className="text-xs text-[#6B655E] dark:text-[#A8A196]">
            Daily estimated accommodation, dining targets & scheduled activities
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead>
            <tr className="border-b border-[#E7E2D8] dark:border-[#33302B] text-[10px] font-bold text-[#9E978E] dark:text-[#7A746B] uppercase tracking-wider">
              <th className="pb-3 pr-4">Day / Date</th>
              <th className="pb-3 pr-4">City Location</th>
              <th className="pb-3 pr-4">Activities</th>
              <th className="pb-3 pr-4">Stay & Dining</th>
              <th className="pb-3 text-right">Daily Estimated Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E2D8]/60 dark:divide-[#33302B]/60">
            {trip.days.map((day) => {
              const stop = trip.stops.find((s) => s.id === day.cityId);
              const stayAndMeals = (stop?.accommodationPerNight || 0) + (stop?.dailyMealsEstimate || 0);
              const activitiesCost = day.activities.reduce((acc, a) => acc + a.cost, 0);

              const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <tr key={day.dayNumber} className="hover:bg-[#FAF9F5] dark:hover:bg-[#24221E] transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-[#181818] dark:text-[#F5F3EF]">
                    Day {day.dayNumber}{" "}
                    <span className="font-normal text-[#6B655E] dark:text-[#A8A196] text-[11px] block">
                      {formattedDate}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 font-semibold text-[#76546F] dark:text-[#B88BAF]">
                    {day.cityName}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="font-medium text-[#181818] dark:text-[#F5F3EF]">
                      {day.activities.length} items
                    </span>{" "}
                    <span className="text-[#9E978E] dark:text-[#7A746B]">
                      ({formatCurrency(activitiesCost, currency)})
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-[#6B655E] dark:text-[#A8A196]">
                    {formatCurrency(stayAndMeals, currency)}
                  </td>
                  <td className="py-3.5 text-right font-bold text-[#181818] dark:text-[#F5F3EF]">
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
