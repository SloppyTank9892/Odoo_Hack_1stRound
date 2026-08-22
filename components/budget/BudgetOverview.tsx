"use client";

import React, { useState } from "react";
import { Trip } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CategoryBreakdown } from "@/components/budget/CategoryBreakdown";
import { DailyExpenseBreakdown } from "@/components/budget/DailyExpenseBreakdown";
import { BudgetAlertBanner } from "@/components/budget/BudgetAlertBanner";
import { formatCurrency, calculateTripTotalCost, calculateBudgetPercentage } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { Wallet, TrendingUp, Calendar, Edit3, Check } from "lucide-react";

interface BudgetOverviewProps {
  trip: Trip;
}

export function BudgetOverview({ trip }: BudgetOverviewProps) {
  const { currency, updateTargetBudget } = useTrips();
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [customTarget, setCustomTarget] = useState(trip.budget.targetBudget);

  const totalCost = calculateTripTotalCost(trip);
  const budgetPercentage = calculateBudgetPercentage(trip);
  const remaining = trip.budget.targetBudget - totalCost;
  const avgDaily = trip.days.length > 0 ? Math.round(totalCost / trip.days.length) : 0;

  const handleSaveTarget = () => {
    updateTargetBudget(trip.id, Number(customTarget));
    setIsEditingTarget(false);
  };

  return (
    <div className="space-y-6">
      {/* Alert Warning if Over Budget */}
      <BudgetAlertBanner trip={trip} />

      {/* Top Stat Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Estimated Cost */}
        <Card className="p-5 bg-white border-[#E7E2D8]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E978E] block mb-1">
            Total Estimated Cost
          </span>
          <div className="text-2xl font-black text-[#181818]">
            {formatCurrency(totalCost, currency)}
          </div>
          <p className="text-[11px] text-[#6B655E] mt-1">
            {budgetPercentage}% of target budget
          </p>
        </Card>

        {/* Target Budget Cap with quick edit */}
        <Card className="p-5 bg-white border-[#E7E2D8]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E978E]">
              Target Spending Cap
            </span>
            <button
              onClick={() => setIsEditingTarget(!isEditingTarget)}
              className="text-[#76546F] hover:text-[#181818] text-xs font-semibold"
            >
              {isEditingTarget ? "Cancel" : <Edit3 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isEditingTarget ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                value={customTarget}
                onChange={(e) => setCustomTarget(Number(e.target.value))}
                className="w-full px-2 py-1 text-sm border rounded-lg"
              />
              <button
                onClick={handleSaveTarget}
                className="p-1.5 rounded-lg bg-[#F4A62A] text-[#181818]"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-2xl font-black text-[#76546F]">
              {formatCurrency(trip.budget.targetBudget, currency)}
            </div>
          )}
          <p className="text-[11px] text-[#6B655E] mt-1">User planned limit</p>
        </Card>

        {/* Remaining Budget / Overrun */}
        <Card
          className={`p-5 border ${
            remaining >= 0 ? "bg-[#EDF7F2] border-[#BDE3CF]" : "bg-[#FDF1EE] border-[#F8CEC4]"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-[#6B655E]">
            {remaining >= 0 ? "Remaining Runway" : "Budget Overrun"}
          </span>
          <div
            className={`text-2xl font-black ${
              remaining >= 0 ? "text-[#1B8755]" : "text-[#C84B31]"
            }`}
          >
            {formatCurrency(Math.abs(remaining), currency)}
          </div>
          <p className="text-[11px] text-[#6B655E] mt-1">
            {remaining >= 0 ? "Available for discretionary spend" : "Exceeds desired threshold"}
          </p>
        </Card>

        {/* Average Daily Spend */}
        <Card className="p-5 bg-white border-[#E7E2D8]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E978E] block mb-1">
            Average Daily Cost
          </span>
          <div className="text-2xl font-black text-[#181818]">
            {formatCurrency(avgDaily, currency)}
            <span className="text-xs font-normal text-[#9E978E]">/day</span>
          </div>
          <p className="text-[11px] text-[#6B655E] mt-1">
            Calculated across {trip.days.length} total days
          </p>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="p-5 bg-white border-[#E7E2D8]">
        <div className="flex items-center justify-between text-xs font-bold text-[#181818] mb-2">
          <span>Overall Budget Utilization</span>
          <span>{budgetPercentage}%</span>
        </div>
        <ProgressBar value={budgetPercentage} size="md" />
      </Card>

      {/* Categories & Ledger Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <CategoryBreakdown trip={trip} />
        </div>
        <div className="lg:col-span-6">
          <DailyExpenseBreakdown trip={trip} />
        </div>
      </div>
    </div>
  );
}
