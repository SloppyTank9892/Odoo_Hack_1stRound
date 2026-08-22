export type ActivityCategory =
  | "culture"
  | "food"
  | "adventure"
  | "nature"
  | "sightseeing"
  | "shopping"
  | "transport"
  | "stay";

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: ActivityCategory;
  cost: number; // in primary currency (INR)
  durationMinutes: number;
  timeSlot: string; // e.g. "09:00", "14:30"
  location: string;
  image?: string;
  completed?: boolean;
  isCustom?: boolean;
}

export interface DayPlan {
  dayNumber: number; // 1-indexed overall trip day (Day 1, Day 2...)
  cityDayNumber: number; // Day within this stop (e.g. Day 1 of Jaipur)
  cityId: string;
  cityName: string;
  date: string; // ISO format "2026-10-15"
  activities: Activity[];
  estimatedDailyBudget: number;
  notes?: string;
}

export interface DestinationStop {
  id: string;
  cityName: string;
  stateOrCountry: string;
  daysCount: number; // E.g., Jaipur: 2 days (can be changed to 3)
  lat: number;
  lng: number;
  image: string;
  costIndex: "$" | "$$" | "$$$" | "$$$$";
  popularRank: number;
  highlights: string[];
  description: string;
  accommodationPerNight: number;
  dailyMealsEstimate: number;
}

export interface BudgetBreakdown {
  targetBudget: number; // User's spending limit
  currency: string; // "₹", "$", "€"
  categories: {
    transport: number;
    accommodation: number;
    activities: number;
    meals: number;
    misc: number;
  };
}

export interface Trip {
  id: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  startDate: string; // ISO date
  endDate: string; // Recalculated dynamically
  stops: DestinationStop[];
  days: DayPlan[];
  budget: BudgetBreakdown;
  isPublic: boolean;
  shareCode: string;
  status: "planning" | "active" | "completed";
  createdAt: string;
}

export interface CityDiscovery {
  id: string;
  name: string;
  country: string;
  region: string;
  image: string;
  costIndex: "$" | "$$" | "$$$" | "$$$$";
  popularity: number; // 0 - 100
  tags: string[];
  description: string;
  avgDailyCost: number;
  suggestedDays: number;
  lat: number;
  lng: number;
}

export interface ActivityDiscovery {
  id: string;
  cityName: string;
  name: string;
  description: string;
  category: ActivityCategory;
  cost: number;
  durationMinutes: number;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  bestTimeOfDay: "Morning" | "Afternoon" | "Evening" | "Night";
}

export interface TravelerProfile {
  name: string;
  email: string;
  avatar: string;
  currency: "INR" | "USD" | "EUR" | "GBP" | "JPY";
  pacing: "relaxed" | "balanced" | "fast-paced";
  homeCity: string;
  savedDestinations: string[];
}
