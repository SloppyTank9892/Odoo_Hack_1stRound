"use client";

import React, { useState } from "react";
import { Trip, DayPlan } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { Calendar as CalendarIcon, Clock, MapPin, Layers, ChevronLeft, ChevronRight } from "lucide-react";

interface TripCalendarProps {
  trip: Trip;
}

export function TripCalendar({ trip }: TripCalendarProps) {
  const { currency } = useTrips();
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  const activeSelectedDay = trip.days.find((d) => d.dayNumber === selectedDayNumber) || trip.days[0];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1C1B18] p-4 sm:p-5 rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-4 h-4 text-[#F4A62A]" />
            <h3 className="text-base font-bold text-[#181818] dark:text-[#F5F3EF] font-editorial">
              Chronological Trip Calendar & Date Matrix
            </h3>
          </div>
          <p className="text-xs text-[#6B655E] dark:text-[#A8A196]">
            {trip.startDate} to {trip.endDate} ({trip.days.length} Total Days)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" size="sm">
            {trip.days.reduce((acc, d) => acc + d.activities.length, 0)} Scheduled Events
          </Badge>
        </div>
      </div>

      {/* Mobile Horizontal Date Strip (< md) */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {trip.days.map((day) => {
            const isSelected = day.dayNumber === selectedDayNumber;
            const dateObj = new Date(day.date);
            const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "short" });
            const dayOfMonth = dateObj.getDate();

            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayNumber(day.dayNumber)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[70px] border transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#181818] dark:bg-[#F4A62A] text-white dark:text-[#181818] border-[#181818] dark:border-[#F4A62A] shadow-sm scale-105"
                    : "bg-white dark:bg-[#1C1B18] text-[#6B655E] dark:text-[#A8A196] border-[#E7E2D8] dark:border-[#33302B]"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider">{dayOfWeek}</span>
                <span className="text-lg font-black">{dayOfMonth}</span>
                <span
                  className={`text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded ${
                    isSelected ? "bg-[#F4A62A] dark:bg-[#181818] text-[#181818] dark:text-[#F4A62A]" : "bg-[#FAF9F5] dark:bg-[#24221E] text-[#76546F] dark:text-[#B88BAF]"
                  }`}
                >
                  Day {day.dayNumber}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Day Mobile View */}
        {activeSelectedDay && (
          <Card className="mt-4 p-4 border-[#E7E2D8] dark:border-[#33302B] bg-white dark:bg-[#1C1B18]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D8] dark:border-[#33302B]">
              <div>
                <span className="text-[10px] font-bold text-[#B86E00] dark:text-[#F4A62A] uppercase">
                  Day {activeSelectedDay.dayNumber} of {trip.days.length}
                </span>
                <h4 className="font-bold text-base text-[#181818] dark:text-[#F5F3EF]">
                  {activeSelectedDay.cityName}
                </h4>
              </div>
              <span className="text-xs font-bold text-[#181818] dark:text-[#F5F3EF] bg-[#FAF9F5] dark:bg-[#24221E] px-2.5 py-1 rounded-lg border border-[#E7E2D8] dark:border-[#33302B]">
                {formatCurrency(activeSelectedDay.estimatedDailyBudget, currency)}
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {activeSelectedDay.activities.map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] text-xs flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold text-[#76546F] dark:text-[#B88BAF] block">
                      {act.timeSlot} · {act.category}
                    </span>
                    <span className="font-bold text-[#181818] dark:text-[#F5F3EF] truncate block">{act.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#181818] dark:text-[#F5F3EF] shrink-0">
                    {formatCurrency(act.cost, currency)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Desktop Calendar Matrix (>= md) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trip.days.map((day) => {
          const dateObj = new Date(day.date);
          const formattedDate = dateObj.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          return (
            <Card
              key={day.dayNumber}
              className="p-4 bg-white dark:bg-[#1C1B18] border-[#E7E2D8] dark:border-[#33302B] flex flex-col justify-between hover:border-[#D5CEBF] dark:hover:border-[#48443D] hover:shadow-xs transition-all"
            >
              <div>
                {/* Date and City Tag */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-[#E7E2D8] dark:border-[#33302B]">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#B86E00] dark:text-[#F4A62A] bg-[#FEF7EC] dark:bg-[#2B2113] px-1.5 py-0.5 rounded border border-[#FCD89C] dark:border-[#5E431E]">
                      Day {day.dayNumber}
                    </span>
                    <h4 className="font-bold text-sm text-[#181818] dark:text-[#F5F3EF] mt-1">
                      {day.cityName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#6B655E] dark:text-[#A8A196] block">
                      {formattedDate}
                    </span>
                    <span className="text-[10px] text-[#9E978E] dark:text-[#7A746B]">
                      {day.activities.length} activities
                    </span>
                  </div>
                </div>

                {/* Micro activities list */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {day.activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-2 rounded-lg bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] text-[11px] flex items-center justify-between gap-2"
                    >
                      <span className="truncate font-medium text-[#181818] dark:text-[#F5F3EF]">
                        <strong className="text-[#76546F] dark:text-[#B88BAF]">{act.timeSlot}</strong> {act.name}
                      </span>
                      <span className="font-bold text-[#181818] dark:text-[#F5F3EF] shrink-0 text-[10px]">
                        {formatCurrency(act.cost, currency)}
                      </span>
                    </div>
                  ))}
                  {day.activities.length === 0 && (
                    <p className="text-[11px] text-[#9E978E] dark:text-[#7A746B] italic py-2 text-center">
                      Free exploration day
                    </p>
                  )}
                </div>
              </div>

              {/* Day Daily Spend Footer */}
              <div className="pt-3 mt-3 border-t border-[#E7E2D8] dark:border-[#33302B] flex items-center justify-between text-xs">
                <span className="text-[#6B655E] dark:text-[#A8A196] text-[11px]">Daily Target</span>
                <span className="font-bold text-[#181818] dark:text-[#F5F3EF]">
                  {formatCurrency(day.estimatedDailyBudget, currency)}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
