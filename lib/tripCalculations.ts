import { Trip, DayPlan, DestinationStop, Activity } from "@/types/trip";

function addDaysToDate(startDateStr: string, daysToAdd: number): string {
  const date = new Date(startDateStr);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
}

export function recalculateTrip(trip: Trip): Trip {
  let currentDayNumber = 1;
  const newDays: DayPlan[] = [];
  const existingActivitiesByCityAndDayIndex = new Map<string, Activity[]>();

  // Index existing activities
  trip.days.forEach((d) => {
    const key = `${d.cityId}-${d.cityDayNumber}`;
    existingActivitiesByCityAndDayIndex.set(key, d.activities);
  });

  // Recalculate days based on current stops
  trip.stops.forEach((stop) => {
    for (let cityDay = 1; cityDay <= stop.daysCount; cityDay++) {
      const dateStr = addDaysToDate(trip.startDate, currentDayNumber - 1);
      const key = `${stop.id}-${cityDay}`;
      const existingActivities = existingActivitiesByCityAndDayIndex.get(key) || [];

      // Calculate daily activity cost
      const activityCostSum = existingActivities.reduce((sum, act) => sum + act.cost, 0);
      const dailyEstimate = stop.accommodationPerNight + stop.dailyMealsEstimate + activityCostSum;

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
  });

  const totalDays = newDays.length;
  const calculatedEndDate = addDaysToDate(trip.startDate, Math.max(0, totalDays - 1));

  // Recalculate dynamic budget categories
  let totalAccommodation = 0;
  let totalMeals = 0;
  let totalActivities = 0;
  let totalTransport = 2500 * Math.max(1, trip.stops.length); // baseline inter-city transport

  trip.stops.forEach((stop) => {
    totalAccommodation += stop.daysCount * stop.accommodationPerNight;
    totalMeals += stop.daysCount * stop.dailyMealsEstimate;
  });

  newDays.forEach((day) => {
    day.activities.forEach((act) => {
      if (act.category === "transport") {
        totalTransport += act.cost;
      } else if (act.category === "food") {
        totalMeals += act.cost;
      } else {
        totalActivities += act.cost;
      }
    });
  });

  const totalMisc = Math.round((totalAccommodation + totalMeals + totalActivities + totalTransport) * 0.04);

  return {
    ...trip,
    endDate: calculatedEndDate,
    days: newDays,
    budget: {
      ...trip.budget,
      categories: {
        transport: totalTransport,
        accommodation: totalAccommodation,
        activities: totalActivities,
        meals: totalMeals,
        misc: totalMisc,
      },
    },
  };
}

export function formatCurrency(amount: number, currency: string = "₹"): string {
  if (currency === "₹") {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  return `${currency}${amount.toLocaleString("en-US")}`;
}

export function calculateTripTotalCost(trip: Trip): number {
  const cats = trip.budget.categories;
  return cats.transport + cats.accommodation + cats.activities + cats.meals + cats.misc;
}

export function calculateBudgetPercentage(trip: Trip): number {
  const total = calculateTripTotalCost(trip);
  if (!trip.budget.targetBudget || trip.budget.targetBudget <= 0) return 100;
  return Math.min(150, Math.round((total / trip.budget.targetBudget) * 100));
}

export function isOverBudget(trip: Trip): boolean {
  return calculateTripTotalCost(trip) > trip.budget.targetBudget;
}
