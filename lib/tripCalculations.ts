import { Trip, DayPlan, DestinationStop, Activity, BudgetSummary } from "@/types/trip";

/**
 * Pure helper to add days to an ISO date string (YYYY-MM-DD).
 */
export function addDaysToDate(startDateStr: string, daysToAdd: number): string {
  if (!startDateStr) {
    startDateStr = new Date().toISOString().split("T")[0];
  }
  const date = new Date(startDateStr);
  if (isNaN(date.getTime())) {
    return new Date().toISOString().split("T")[0];
  }
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
}

/**
 * Recalculates start and end dates sequentially for a series of stops.
 */
export function recalculateTripDates(
  tripStartDate: string,
  stops: Array<{ id: string; daysCount: number; [key: string]: any }>
): {
  tripEndDate: string;
  updatedStops: Array<{ id: string; daysCount: number; startDate: string; endDate: string; [key: string]: any }>;
} {
  let currentOffset = 0;
  const updatedStops = stops.map((stop) => {
    const days = Math.max(1, stop.daysCount || 1);
    const stopStart = addDaysToDate(tripStartDate, currentOffset);
    const stopEnd = addDaysToDate(tripStartDate, currentOffset + days - 1);
    currentOffset += days;
    return {
      ...stop,
      daysCount: days,
      startDate: stopStart,
      endDate: stopEnd,
    };
  });

  const totalDays = Math.max(1, currentOffset);
  const tripEndDate = addDaysToDate(tripStartDate, totalDays - 1);

  return {
    tripEndDate,
    updatedStops,
  };
}

/**
 * Dynamic financial rollup computing budget health, category distribution,
 * overruns, and daily burn rates.
 */
export function calculateTripBudgetSummary(trip: Trip): BudgetSummary {
  const targetBudget = Number(trip.budget?.targetBudget) || 0;
  const totalDays = Math.max(1, trip.days?.length || 1);

  // 1. Rollup fixed accommodation and meals from stops
  let totalAccommodation = 0;
  let totalMeals = 0;
  let totalActivities = 0;
  // Baseline inter-city transport: ₹2500 per stop
  let totalTransport = 2500 * Math.max(1, trip.stops?.length || 1);

  if (trip.stops && trip.stops.length > 0) {
    trip.stops.forEach((stop) => {
      const days = Math.max(1, stop.daysCount || 1);
      totalAccommodation += days * (stop.accommodationPerNight || 0);
      totalMeals += days * (stop.dailyMealsEstimate || 0);
    });
  }

  // 2. Rollup scheduled activity costs
  if (trip.days && trip.days.length > 0) {
    trip.days.forEach((day) => {
      (day.activities || []).forEach((act) => {
        const cost = Number(act.cost) || 0;
        if (act.category === "transport") {
          totalTransport += cost;
        } else if (act.category === "food") {
          totalMeals += cost;
        } else if (act.category === "stay") {
          totalAccommodation += cost;
        } else {
          totalActivities += cost;
        }
      });
    });
  }

  // 3. Contingency buffer (4% of subtotal)
  const subtotal = totalAccommodation + totalMeals + totalActivities + totalTransport;
  const totalMisc = Math.round(subtotal * 0.04);
  const totalEstimatedCost = subtotal + totalMisc;

  // 4. Threshold and overage calculations
  const remainingBudget = targetBudget - totalEstimatedCost;
  const isExceeded = targetBudget > 0 && totalEstimatedCost > targetBudget;
  const exceededAmount = isExceeded ? totalEstimatedCost - targetBudget : 0;
  const budgetPercentage = targetBudget > 0
    ? Math.round((totalEstimatedCost / targetBudget) * 100)
    : 100;
  const avgDailyCost = Math.round(totalEstimatedCost / totalDays);

  const categoryBreakdown = [
    {
      category: "accommodation",
      label: "Accommodation & Stays",
      amount: totalAccommodation,
      percentage: totalEstimatedCost > 0 ? Math.round((totalAccommodation / totalEstimatedCost) * 100) : 0,
    },
    {
      category: "meals",
      label: "Meals & Dining",
      amount: totalMeals,
      percentage: totalEstimatedCost > 0 ? Math.round((totalMeals / totalEstimatedCost) * 100) : 0,
    },
    {
      category: "activities",
      label: "Tours & Experiences",
      amount: totalActivities,
      percentage: totalEstimatedCost > 0 ? Math.round((totalActivities / totalEstimatedCost) * 100) : 0,
    },
    {
      category: "transport",
      label: "Transport & Transit",
      amount: totalTransport,
      percentage: totalEstimatedCost > 0 ? Math.round((totalTransport / totalEstimatedCost) * 100) : 0,
    },
    {
      category: "misc",
      label: "Contingency & Misc",
      amount: totalMisc,
      percentage: totalEstimatedCost > 0 ? Math.round((totalMisc / totalEstimatedCost) * 100) : 0,
    },
  ];

  return {
    targetBudget,
    totalEstimatedCost,
    remainingBudget,
    budgetPercentage,
    isOverBudget: isExceeded,
    exceededAmount,
    avgDailyCost,
    categories: {
      transport: totalTransport,
      accommodation: totalAccommodation,
      activities: totalActivities,
      meals: totalMeals,
      misc: totalMisc,
    },
    categoryBreakdown,
  };
}

/**
 * Recalculates full trip state: dates, itinerary days, activity slots, and budget rollups.
 */
export function recalculateTrip(trip: Trip): Trip {
  const startDate = trip.startDate || new Date().toISOString().split("T")[0];
  
  // Date cascade for stops
  const { tripEndDate, updatedStops } = recalculateTripDates(
    startDate,
    trip.stops || []
  );

  let currentDayNumber = 1;
  const newDays: DayPlan[] = [];
  const activitiesByStop = new Map<string, Map<number, Activity[]>>();

  // Index existing activities
  (trip.days || []).forEach((d) => {
    if (!activitiesByStop.has(d.cityId)) {
      activitiesByStop.set(d.cityId, new Map());
    }
    activitiesByStop.get(d.cityId)!.set(d.cityDayNumber, d.activities || []);
  });

  // Re-index days sequentially across stops
  const finalStops: DestinationStop[] = updatedStops.map((stop) => {
    const daysCount = Math.max(1, stop.daysCount || 1);
    const stopActivitiesMap = activitiesByStop.get(stop.id);

    // Collect any orphaned activities from days > daysCount (e.g. when stop days are reduced)
    const orphanedActivities: Activity[] = [];
    if (stopActivitiesMap) {
      stopActivitiesMap.forEach((acts, dayIdx) => {
        if (dayIdx > daysCount) {
          orphanedActivities.push(...acts);
        }
      });
    }

    for (let cityDay = 1; cityDay <= daysCount; cityDay++) {
      const dateStr = addDaysToDate(startDate, currentDayNumber - 1);
      const dayActs = stopActivitiesMap?.get(cityDay) || [];
      const existingActivities =
        cityDay === daysCount && orphanedActivities.length > 0
          ? [...dayActs, ...orphanedActivities]
          : dayActs;

      // Calculate daily activity cost sum
      const activityCostSum = existingActivities.reduce((sum, act) => sum + (Number(act.cost) || 0), 0);
      const dailyEstimate = (stop.accommodationPerNight || 0) + (stop.dailyMealsEstimate || 0) + activityCostSum;

      newDays.push({
        dayNumber: currentDayNumber,
        cityDayNumber: cityDay,
        cityId: stop.id,
        cityName: stop.cityName,
        date: dateStr,
        activities: existingActivities,
        estimatedDailyBudget: dailyEstimate,
        notes: cityDay === 1 ? `Arrive in ${stop.cityName} & explore` : `Full day exploring ${stop.cityName}`,
      });

      currentDayNumber++;
    }

    return {
      id: stop.id,
      cityName: stop.cityName,
      stateOrCountry: stop.stateOrCountry || "India",
      daysCount,
      lat: stop.lat || 26.9124,
      lng: stop.lng || 75.7873,
      image: stop.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      costIndex: stop.costIndex || "$$",
      popularRank: stop.popularRank || 90,
      highlights: stop.highlights || ["Heritage", "Culture"],
      description: stop.description || `Explore ${stop.cityName}`,
      accommodationPerNight: stop.accommodationPerNight || 2500,
      dailyMealsEstimate: stop.dailyMealsEstimate || 1000,
      startDate: stop.startDate,
      endDate: stop.endDate,
    };
  });

  // Calculate budget summary
  const budgetSummary = calculateTripBudgetSummary({
    ...trip,
    startDate,
    endDate: tripEndDate,
    stops: finalStops,
    days: newDays,
  });

  return {
    ...trip,
    startDate,
    endDate: tripEndDate,
    stops: finalStops,
    days: newDays,
    budget: {
      targetBudget: Number(trip.budget?.targetBudget) || 50000,
      currency: trip.budget?.currency || "₹",
      categories: budgetSummary.categories,
    },
  };
}

export function formatCurrency(amount: number, currency: string = "₹"): string {
  const safeAmount = Math.round(Number(amount) || 0);
  if (currency === "₹") {
    return `₹${safeAmount.toLocaleString("en-IN")}`;
  }
  return `${currency}${safeAmount.toLocaleString("en-US")}`;
}

export function calculateTripTotalCost(trip: Trip): number {
  if (!trip) return 0;
  if (trip.budget?.categories) {
    const cats = trip.budget.categories;
    return (
      (cats.transport || 0) +
      (cats.accommodation || 0) +
      (cats.activities || 0) +
      (cats.meals || 0) +
      (cats.misc || 0)
    );
  }
  return calculateTripBudgetSummary(trip).totalEstimatedCost;
}

export function calculateBudgetPercentage(trip: Trip): number {
  if (!trip) return 0;
  const total = calculateTripTotalCost(trip);
  const target = Number(trip.budget?.targetBudget) || 0;
  if (target <= 0) return 100;
  return Math.round((total / target) * 100);
}

export function isOverBudget(trip: Trip): boolean {
  if (!trip) return false;
  const target = Number(trip.budget?.targetBudget) || 0;
  if (target <= 0) return false;
  return calculateTripTotalCost(trip) > target;
}
