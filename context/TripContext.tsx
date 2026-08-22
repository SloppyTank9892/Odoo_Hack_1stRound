"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Trip, Activity, DestinationStop, CityDiscovery, DayPlan, ActivityDiscovery } from "@/types/trip";
import { curatedDestinations } from "@/data/curatedDestinations";
import { curatedActivities } from "@/data/curatedActivities";
import { recalculateTrip } from "@/lib/tripCalculations";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  fetchDestinationsDB,
  upsertDestinationDB,
  deleteDestinationDB,
  fetchActivitiesDB,
  upsertActivityDB,
  deleteActivityDB,
  seedAllToSupabase,
} from "@/lib/supabaseService";
import {
  getUserTrips,
  getTripById as fetchTripDetailsFromDb,
  createTrip as serverCreateTrip,
  addTripStop as serverAddTripStop,
  updateTripStop as serverUpdateTripStop,
  deleteTripStop as serverDeleteTripStop,
  addActivity as serverAddActivity,
  deleteActivity as serverDeleteActivity,
  toggleTripPublicStatus as serverTogglePublic,
  deleteTrip as serverDeleteTrip,
  updateTrip as serverUpdateTrip,
  TripWithDetails,
} from "@/app/actions/trips";

export interface CreateTripOptions {
  name: string;
  tagline?: string;
  startDate?: string;
  initialCities: CityDiscovery[];
  coverFile?: File | null;
  coverImageUrl?: string | null;
  targetBudget?: number;
}

interface TripContextType {
  // Trips
  trips: Trip[];
  activeTrip: Trip | null;
  activeTripId: string | null;
  setActiveTripId: (id: string) => void;
  getTripById: (id: string) => Trip | undefined;
  refreshTrips: () => Promise<void>;
  refreshTrip: (id: string) => Promise<Trip | undefined>;
  isLoading: boolean;
  error: string | null;

  // Destinations (Cities Catalog)
  destinations: CityDiscovery[];
  addDestination: (city: CityDiscovery) => Promise<void>;
  updateDestination: (id: string, updated: Partial<CityDiscovery>) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;

  // Activities Catalog
  activities: ActivityDiscovery[];
  addActivityCatalogItem: (activity: ActivityDiscovery) => Promise<void>;
  updateActivityCatalogItem: (id: string, updated: Partial<ActivityDiscovery>) => Promise<void>;
  deleteActivityCatalogItem: (id: string) => Promise<void>;

  // Database Sync & Reset
  isDbConnected: boolean;
  isSyncing: boolean;
  syncAllFromDatabase: () => Promise<void>;
  seedDatabaseToSupabase: () => Promise<{ success: boolean; message: string }>;
  resetCatalogToDefault: () => void;

  // The WOW Moment Engine
  updateStopDuration: (tripId: string, stopId: string, newDaysCount: number) => Promise<void>;

  // Stops Management inside Trips
  addStopToTrip: (tripId: string, city: CityDiscovery) => Promise<void>;
  removeStopFromTrip: (tripId: string, stopId: string) => Promise<void>;
  reorderStops: (tripId: string, newStops: DestinationStop[]) => void;

  // Activities Management inside Trips
  addActivityToDay: (
    tripId: string,
    dayNumber: number,
    activity: Omit<Activity, "id">,
    stopId?: string
  ) => Promise<void>;
  removeActivityFromDay: (tripId: string, dayNumber: number, activityId: string) => Promise<void>;
  moveActivityBetweenDays: (tripId: string, fromDay: number, toDay: number, activityId: string) => void;
  toggleActivityCompleted: (tripId: string, dayNumber: number, activityId: string) => void;

  // Trip Lifecycle
  createNewTrip: (
    options: CreateTripOptions | string,
    tagline?: string,
    startDate?: string,
    initialCities?: CityDiscovery[]
  ) => Promise<string>;
  copyTrip: (tripId: string) => Promise<Trip>;
  deleteTrip: (tripId: string) => Promise<void>;
  updateTargetBudget: (tripId: string, targetAmount: number) => Promise<void>;
  toggleTripPublic: (tripId: string) => Promise<void>;

  // UI Signals & Filters
  lastRecalculatedField: string | null;
  currency: string;
  setCurrency: (c: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const LOCAL_STORAGE_DESTS_KEY = "globetrotter_destinations_catalog_v2";
const LOCAL_STORAGE_ACTS_KEY = "globetrotter_activities_catalog_v2";

/**
 * Converts a database TripWithDetails row tree into the rich UI Trip object.
 */
export function convertDbTripToUiTrip(dbTrip: TripWithDetails): Trip {
  const stops: DestinationStop[] = (dbTrip.trip_stops || []).map((stop) => {
    const matchedCity = curatedDestinations.find(
      (m) => m.name.toLowerCase() === stop.city_name.toLowerCase()
    );

    let daysCount = 2;
    if (stop.start_date && stop.end_date) {
      const diffMs = new Date(stop.end_date).getTime() - new Date(stop.start_date).getTime();
      const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
      daysCount = diffDays;
    }

    return {
      id: stop.id,
      cityName: stop.city_name,
      stateOrCountry: stop.country || "India",
      daysCount,
      lat: matchedCity?.lat || 26.9124,
      lng: matchedCity?.lng || 75.7873,
      image:
        matchedCity?.image ||
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      costIndex: matchedCity?.costIndex || "$$",
      popularRank: matchedCity?.popularity || 90,
      highlights: matchedCity?.tags || ["Heritage", "Culture"],
      description: matchedCity?.description || `Explore the heritage and cultural beauty of ${stop.city_name}.`,
      accommodationPerNight: Math.round((stop.allocated_budget || 8000) / Math.max(1, daysCount) * 0.6),
      dailyMealsEstimate: Math.round((stop.allocated_budget || 8000) / Math.max(1, daysCount) * 0.3),
    };
  });

  const allActivitiesByStopAndDay: Record<string, Activity[]> = {};
  (dbTrip.trip_stops || []).forEach((stop) => {
    ((stop.activities || (stop as any).trip_activities) || []).forEach((act: any) => {
      const key = `${stop.id}-${act.day_number}`;
      if (!allActivitiesByStopAndDay[key]) {
        allActivitiesByStopAndDay[key] = [];
      }
      allActivitiesByStopAndDay[key].push({
        id: act.id,
        name: act.title,
        description: `Experience ${act.title} in ${stop.city_name}.`,
        category: (act.category as Activity["category"]) || "culture",
        cost: Number(act.cost) || 0,
        durationMinutes: 120,
        timeSlot: "10:00",
        location: `${stop.city_name}, Exploration Zone`,
        completed: act.status === "completed",
        isCustom: true,
      });
    });
  });

  let currentGlobalDay = 1;
  const startMoment = dbTrip.start_date ? new Date(dbTrip.start_date) : new Date();
  const days: DayPlan[] = [];

  stops.forEach((stop) => {
    for (let cityDay = 1; cityDay <= stop.daysCount; cityDay++) {
      const dayDate = new Date(startMoment);
      dayDate.setDate(dayDate.getDate() + (currentGlobalDay - 1));
      const dateStr = dayDate.toISOString().split("T")[0];

      const key = `${stop.id}-${cityDay}`;
      const dbActivities = allActivitiesByStopAndDay[key] || [];

      days.push({
        dayNumber: currentGlobalDay,
        cityId: stop.id,
        cityName: stop.cityName,
        cityDayNumber: cityDay,
        date: dateStr,
        estimatedDailyBudget: (stop.accommodationPerNight || 3000) + (stop.dailyMealsEstimate || 1500),
        activities: dbActivities,
        notes: `Day ${cityDay} in ${stop.cityName}`,
      });

      currentGlobalDay++;
    }
  });

  const rawTrip: Trip = {
    id: dbTrip.id,
    name: dbTrip.title,
    tagline: dbTrip.description || "A personalized journey",
    description: dbTrip.description || "",
    coverImage:
      dbTrip.cover_image_url ||
      stops[0]?.image ||
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
    startDate: dbTrip.start_date || new Date().toISOString().split("T")[0],
    endDate: dbTrip.end_date || new Date().toISOString().split("T")[0],
    isPublic: dbTrip.is_public || false,
    shareCode: (dbTrip as any).share_code || `GT-${dbTrip.id.substring(0, 5).toUpperCase()}`,
    status: dbTrip.status as "planning" | "active" | "completed",
    createdAt: dbTrip.created_at ? dbTrip.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
    stops,
    days,
    budget: {
      targetBudget: Number(dbTrip.total_budget) || 50000,
      currency: "₹",
      categories: {
        transport: 5000,
        accommodation: Math.round((Number(dbTrip.total_budget) || 50000) * 0.4),
        activities: Math.round((Number(dbTrip.total_budget) || 50000) * 0.3),
        meals: Math.round((Number(dbTrip.total_budget) || 50000) * 0.2),
        misc: Math.round((Number(dbTrip.total_budget) || 50000) * 0.1),
      },
    },
  };

  return recalculateTrip(rawTrip);
}

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Destinations & Activities Catalog
  const [destinations, setDestinations] = useState<CityDiscovery[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_DESTS_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Local storage dests read failed", e);
      }
    }
    return curatedDestinations;
  });

  const [activities, setActivities] = useState<ActivityDiscovery[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_ACTS_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Local storage acts read failed", e);
      }
    }
    return curatedActivities;
  });

  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Currency & Search state
  const [currency, setCurrencyState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("globetrotter_currency") || "₹";
    }
    return "₹";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [lastRecalculatedField, setLastRecalculatedField] = useState<string | null>(null);

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    if (typeof window !== "undefined") {
      localStorage.setItem("globetrotter_currency", c);
    }
  };

  // Sync Destinations & Activities to LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_DESTS_KEY, JSON.stringify(destinations));
        localStorage.setItem(LOCAL_STORAGE_ACTS_KEY, JSON.stringify(activities));
      } catch (e) {
        console.error("LocalStorage write failed", e);
      }
    }
  }, [destinations, activities]);

  // Check DB connection & sync remote catalog
  const syncAllFromDatabase = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setIsDbConnected(false);
      return;
    }

    setIsSyncing(true);
    try {
      const dbDests = await fetchDestinationsDB();
      if (dbDests && dbDests.length > 0) {
        setDestinations(dbDests);
        setIsDbConnected(true);
      }

      const dbActs = await fetchActivitiesDB();
      if (dbActs && dbActs.length > 0) {
        setActivities(dbActs);
        setIsDbConnected(true);
      }
    } catch (e) {
      console.warn("Supabase initial sync error:", e);
      setIsDbConnected(false);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    syncAllFromDatabase();
  }, [syncAllFromDatabase]);

  const seedDatabaseToSupabase = async () => {
    setIsSyncing(true);
    const res = await seedAllToSupabase();
    if (res.success) {
      await syncAllFromDatabase();
    }
    setIsSyncing(false);
    return res;
  };

  // Helper to trigger pulse badge
  const triggerRecalcPulse = (fieldTag: string) => {
    setLastRecalculatedField(fieldTag);
    setTimeout(() => setLastRecalculatedField(null), 2500);
  };

  // Sync user trips from Supabase
  const refreshTrips = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getUserTrips();
      if (res.success && res.data) {
        if (res.data.all.length === 0) {
          setTrips([]);
          setActiveTripId(null);
          return;
        }

        const detailPromises = res.data.all.map((dbTrip) => fetchTripDetailsFromDb(dbTrip.id));
        const detailResults = await Promise.all(detailPromises);
        const dbTripsWithDetails: Trip[] = [];

        detailResults.forEach((detailRes) => {
          if (detailRes.success && detailRes.data) {
            dbTripsWithDetails.push(convertDbTripToUiTrip(detailRes.data));
          }
        });

        if (dbTripsWithDetails.length > 0) {
          setTrips(dbTripsWithDetails);
          setActiveTripId((prev) =>
            prev && dbTripsWithDetails.some((t) => t.id === prev) ? prev : dbTripsWithDetails[0].id
          );
        } else {
          setTrips([]);
          setActiveTripId(null);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not sync trips from database";
      console.warn("Sync error:", msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshTrip = useCallback(
    async (id: string): Promise<Trip | undefined> => {
      try {
        const res = await fetchTripDetailsFromDb(id);
        if (res.success && res.data) {
          const converted = convertDbTripToUiTrip(res.data);
          setTrips((prev) => prev.map((t) => (t.id === id ? converted : t)));
          return converted;
        }
      } catch (err) {
        console.warn(`Could not refresh trip ${id}:`, err);
      }
      return trips.find((t) => t.id === id);
    },
    [trips]
  );

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  const activeTrip =
    trips.find((t) => t.id === activeTripId) || trips[0] || null;

  const getTripById = (id: string) => {
    return trips.find((t) => t.id === id);
  };

  // ============================================================================
  // DESTINATIONS (CITIES) CRUD
  // ============================================================================

  const addDestination = async (city: CityDiscovery) => {
    setDestinations((prev) => {
      const exists = prev.some((d) => d.id === city.id || d.name.toLowerCase() === city.name.toLowerCase());
      if (exists) {
        return prev.map((d) => (d.id === city.id || d.name.toLowerCase() === city.name.toLowerCase() ? city : d));
      }
      return [city, ...prev];
    });

    if (isSupabaseConfigured()) {
      await upsertDestinationDB(city);
    }
  };

  const updateDestination = async (id: string, updated: Partial<CityDiscovery>) => {
    let finalItem: CityDiscovery | undefined;

    setDestinations((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          finalItem = { ...d, ...updated };
          return finalItem;
        }
        return d;
      })
    );

    if (finalItem && isSupabaseConfigured()) {
      await upsertDestinationDB(finalItem);
    }
  };

  const deleteDestination = async (id: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));

    if (isSupabaseConfigured()) {
      await deleteDestinationDB(id);
    }
  };

  // ============================================================================
  // ACTIVITIES CATALOG CRUD
  // ============================================================================

  const addActivityCatalogItem = async (activity: ActivityDiscovery) => {
    setActivities((prev) => {
      const exists = prev.some((a) => a.id === activity.id);
      if (exists) {
        return prev.map((a) => (a.id === activity.id ? activity : a));
      }
      return [activity, ...prev];
    });

    if (isSupabaseConfigured()) {
      await upsertActivityDB(activity);
    }
  };

  const updateActivityCatalogItem = async (id: string, updated: Partial<ActivityDiscovery>) => {
    let finalItem: ActivityDiscovery | undefined;

    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          finalItem = { ...a, ...updated };
          return finalItem;
        }
        return a;
      })
    );

    if (finalItem && isSupabaseConfigured()) {
      await upsertActivityDB(finalItem);
    }
  };

  const deleteActivityCatalogItem = async (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));

    if (isSupabaseConfigured()) {
      await deleteActivityDB(id);
    }
  };

  const resetCatalogToDefault = () => {
    setDestinations(curatedDestinations);
    setActivities(curatedActivities);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(LOCAL_STORAGE_DESTS_KEY);
        localStorage.removeItem(LOCAL_STORAGE_ACTS_KEY);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // WOW MOMENT: Dynamic Stop Duration Adjustment
  const updateStopDuration = async (tripId: string, stopId: string, newDaysCount: number) => {
    if (newDaysCount < 1 || newDaysCount > 14) return;

    // 1. Optimistic Local Update
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== tripId) return t;
        const updatedStops = t.stops.map((stop) => {
          if (stop.id === stopId) {
            return { ...stop, daysCount: newDaysCount };
          }
          return stop;
        });

        return recalculateTrip({ ...t, stops: updatedStops });
      })
    );

    triggerRecalcPulse(`stop-duration-${stopId}`);

    // 2. Background Database Sync
    try {
      const currentTrip = trips.find((t) => t.id === tripId);
      if (currentTrip) {
        await serverUpdateTripStop(stopId, {
          order_index: currentTrip.stops.findIndex((s) => s.id === stopId),
        });
      }
    } catch (err) {
      console.warn("Async stop duration update notice:", err);
    }
  };

  const addStopToTrip = async (tripId: string, city: CityDiscovery) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (targetTrip?.stops.some((s) => s.id === city.id || s.cityName.toLowerCase() === city.name.toLowerCase())) {
      return;
    }

    const newStopId = `stop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newStop: DestinationStop = {
      id: newStopId,
      cityName: city.name,
      stateOrCountry: `${city.region}, ${city.country}`,
      daysCount: city.suggestedDays || 2,
      lat: city.lat,
      lng: city.lng,
      image: city.image,
      costIndex: city.costIndex,
      popularRank: city.popularity,
      highlights: city.tags,
      description: city.description,
      accommodationPerNight: Math.round(city.avgDailyCost * 0.6),
      dailyMealsEstimate: Math.round(city.avgDailyCost * 0.3),
    };

    // 1. Optimistic UI update
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== tripId) return t;
        return recalculateTrip({
          ...t,
          stops: [...t.stops, newStop],
        });
      })
    );

    triggerRecalcPulse("add-stop");

    // 2. Background DB sync
    if (tripId && !tripId.startsWith("demo-")) {
      try {
        await serverAddTripStop({
          trip_id: tripId,
          city_name: city.name,
          country: `${city.region}, ${city.country}`,
          allocated_budget: city.avgDailyCost * (city.suggestedDays || 2),
        });
      } catch (err) {
        console.warn("Async add stop notice:", err);
      }
    }
  };

  const removeStopFromTrip = async (tripId: string, stopId: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== tripId) return t;
        if (t.stops.length <= 1) return t;

        const updatedStops = t.stops.filter((s) => s.id !== stopId);
        return recalculateTrip({ ...t, stops: updatedStops });
      })
    );

    triggerRecalcPulse("remove-stop");

    if (stopId && !stopId.startsWith("stop-")) {
      try {
        await serverDeleteTripStop(stopId);
      } catch (err) {
        console.warn("Async delete stop notice:", err);
      }
    }
  };

  const reorderStops = (tripId: string, newStops: DestinationStop[]) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== tripId) return t;
        return recalculateTrip({ ...t, stops: newStops });
      })
    );
  };

  const addActivityToDay = async (
    tripId: string,
    dayNumber: number,
    activityData: Omit<Activity, "id">,
    stopId?: string
  ) => {
    const newId = `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newActivity: Activity = {
      ...activityData,
      id: newId,
    };

    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== tripId) return t;

        const updatedDays = t.days.map((day) => {
          if (day.dayNumber === dayNumber) {
            return {
              ...day,
              activities: [...day.activities, newActivity],
            };
          }
          return day;
        });

        return recalculateTrip({ ...t, days: updatedDays });
      })
    );

    triggerRecalcPulse("add-activity");

    if (stopId && !stopId.startsWith("stop-")) {
      try {
        await serverAddActivity({
          stop_id: stopId,
          day_number: dayNumber,
          title: activityData.name,
          category: activityData.category,
          cost: activityData.cost,
        });
      } catch (err) {
        console.warn("Async add activity notice:", err);
      }
    }
  };

  const removeActivityFromDay = async (tripId: string, dayNumber: number, activityId: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== tripId) return t;

        const updatedDays = t.days.map((day) => {
          if (day.dayNumber === dayNumber) {
            return {
              ...day,
              activities: day.activities.filter((a) => a.id !== activityId),
            };
          }
          return day;
        });

        return recalculateTrip({ ...t, days: updatedDays });
      })
    );

    triggerRecalcPulse("remove-activity");

    if (activityId && !activityId.startsWith("act-")) {
      try {
        await serverDeleteActivity(activityId);
      } catch (err) {
        console.warn("Async delete activity notice:", err);
      }
    }
  };

  const moveActivityBetweenDays = (
    tripId: string,
    fromDay: number,
    toDay: number,
    activityId: string
  ) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== tripId) return t;

        let movingActivity: Activity | undefined;

        const updatedDays = t.days.map((day) => {
          if (day.dayNumber === fromDay) {
            movingActivity = day.activities.find((a) => a.id === activityId);
            return {
              ...day,
              activities: day.activities.filter((a) => a.id !== activityId),
            };
          }
          return day;
        });

        if (!movingActivity) return t;

        const finalDays = updatedDays.map((day) => {
          if (day.dayNumber === toDay) {
            return {
              ...day,
              activities: [...day.activities, movingActivity!],
            };
          }
          return day;
        });

        return recalculateTrip({ ...t, days: finalDays });
      })
    );

    triggerRecalcPulse("move-activity");
  };

  const toggleActivityCompleted = (tripId: string, dayNumber: number, activityId: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== tripId) return t;
        const updatedDays = t.days.map((day) => {
          if (day.dayNumber === dayNumber) {
            return {
              ...day,
              activities: day.activities.map((a) =>
                a.id === activityId ? { ...a, completed: !a.completed } : a
              ),
            };
          }
          return day;
        });
        return { ...t, days: updatedDays };
      })
    );
  };

  const createNewTrip = async (
    optionsOrName: CreateTripOptions | string,
    rawTagline?: string,
    rawStartDate?: string,
    rawInitialCities?: CityDiscovery[]
  ): Promise<string> => {
    let name = "";
    let tagline = "";
    let startDate = "2026-10-15";
    let initialCities: CityDiscovery[] = [];
    let coverFile: File | null = null;
    let coverImageUrl: string | null = null;
    let targetBudget = 50000;

    if (typeof optionsOrName === "object") {
      name = optionsOrName.name;
      tagline = optionsOrName.tagline || "";
      startDate = optionsOrName.startDate || new Date().toISOString().split("T")[0];
      initialCities = optionsOrName.initialCities || [];
      coverFile = optionsOrName.coverFile || null;
      coverImageUrl = optionsOrName.coverImageUrl || null;
      targetBudget = optionsOrName.targetBudget || 50000;
    } else {
      name = optionsOrName;
      tagline = rawTagline || "";
      startDate = rawStartDate || new Date().toISOString().split("T")[0];
      initialCities = rawInitialCities || [];
    }

    const newId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);

    const stops: DestinationStop[] = initialCities.map((city) => ({
      id: city.id,
      cityName: city.name,
      stateOrCountry: `${city.region}, ${city.country}`,
      daysCount: city.suggestedDays || 2,
      lat: city.lat,
      lng: city.lng,
      image: city.image,
      costIndex: city.costIndex,
      popularRank: city.popularity,
      highlights: city.tags,
      description: city.description,
      accommodationPerNight: Math.round(city.avgDailyCost * 0.6),
      dailyMealsEstimate: Math.round(city.avgDailyCost * 0.3),
    }));

    const optimisticCover =
      coverImageUrl ||
      (coverFile ? URL.createObjectURL(coverFile) : null) ||
      stops[0]?.image ||
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80";

    const rawTrip: Trip = {
      id: newId,
      name,
      tagline: tagline || "A custom crafted journey",
      description: `Personalized travel itinerary across ${stops.map((s) => s.cityName).join(", ")}.`,
      coverImage: optimisticCover,
      startDate: startDate || new Date().toISOString().split("T")[0],
      endDate: startDate || new Date().toISOString().split("T")[0],
      isPublic: false,
      shareCode: `GT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: "planning",
      createdAt: new Date().toISOString().split("T")[0],
      stops: stops,
      days: [],
      budget: {
        targetBudget,
        currency: "₹",
        categories: {
          transport: 5000,
          accommodation: 20000,
          activities: 15000,
          meals: 10000,
          misc: 5000,
        },
      },
    };

    const recalculated = recalculateTrip(rawTrip);
    setTrips((prev) => [recalculated, ...prev]);
    setActiveTripId(newId);

    // Synchronize to backend if authenticated
    try {
      const formData = new FormData();
      formData.append("title", name);
      formData.append("description", tagline || "Personalized journey");
      formData.append("start_date", startDate);
      formData.append("total_budget", String(targetBudget));
      if (coverFile) {
        formData.append("cover_file", coverFile);
      } else if (coverImageUrl || stops[0]?.image) {
        formData.append("cover_image_url", coverImageUrl || stops[0]?.image);
      }
      formData.append(
        "initial_stops",
        JSON.stringify(
          stops.map((s) => ({
            cityName: s.cityName,
            country: s.stateOrCountry,
            allocatedBudget: s.accommodationPerNight * s.daysCount,
          }))
        )
      );

      const serverRes = await serverCreateTrip(formData);
      if (serverRes.success && serverRes.data?.tripId) {
        const dbTripId = serverRes.data.tripId;
        const finalCover = serverRes.data.coverImageUrl;
        setTrips((prev) =>
          prev.map((t) =>
            t.id === newId
              ? { ...t, id: dbTripId, coverImage: finalCover || t.coverImage }
              : t
          )
        );
        setActiveTripId(dbTripId);
        return dbTripId;
      } else if (!serverRes.success) {
        setTrips((prev) => prev.filter((t) => t.id !== newId));
        throw new Error(serverRes.error || "Failed to save trip to Supabase database.");
      }
    } catch (err: unknown) {
      setTrips((prev) => prev.filter((t) => t.id !== newId));
      throw err;
    }

    return newId;
  };

  const copyTrip = async (tripId: string): Promise<Trip> => {
    let original = getTripById(tripId);
    if (!original) {
      try {
        const fetched = await fetchTripDetailsFromDb(tripId);
        if (fetched.success && fetched.data) {
          original = convertDbTripToUiTrip(fetched.data);
        }
      } catch (e) {
        console.warn("Could not fetch remote trip to copy:", e);
      }
    }
    if (!original) {
      original = activeTrip || undefined;
    }
    if (!original) {
      throw new Error("No trip found to copy");
    }
    const copyId = `${original.id}-copy-${Date.now().toString().slice(-4)}`;

    const duplicate: Trip = {
      ...original,
      id: copyId,
      name: `${original.name} (My Copy)`,
      isPublic: false,
      shareCode: `COPY-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      createdAt: new Date().toISOString().split("T")[0],
      days: original.days.map((day) => ({
        ...day,
        activities: day.activities.map((a) => ({
          ...a,
          id: `copied-${a.id}-${Date.now().toString().slice(-3)}`,
        })),
      })),
    };

    const finalTrip = recalculateTrip(duplicate);
    setTrips((prev) => [finalTrip, ...prev]);
    setActiveTripId(copyId);

    // Call copy API if valid UUID
    try {
      const res = await fetch(`/api/trips/${tripId}/copy`, { method: "POST" });
      if (res.ok) {
        const body = await res.json();
        if (body.success && body.data?.newTripId) {
          setTrips((prev) =>
            prev.map((t) => (t.id === copyId ? { ...t, id: body.data.newTripId } : t))
          );
          setActiveTripId(body.data.newTripId);
        }
      }
    } catch (err) {
      console.warn("Could not copy trip via API:", err);
    }

    return finalTrip;
  };

  const deleteTrip = async (tripId: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (activeTripId === tripId && trips.length > 1) {
      const fallback = trips.find((t) => t.id !== tripId);
      if (fallback) setActiveTripId(fallback.id);
    } else if (activeTripId === tripId) {
      setActiveTripId(null);
    }

    try {
      await serverDeleteTrip(tripId);
    } catch (err) {
      console.warn("Async server deleteTrip notice:", err);
    }
  };

  const updateTargetBudget = async (tripId: string, targetAmount: number) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const updated = {
          ...t,
          budget: {
            ...t.budget,
            targetBudget: targetAmount,
          },
        };
        return updated;
      })
    );
    triggerRecalcPulse("budget-target");

    try {
      await serverUpdateTrip(tripId, { total_budget: targetAmount });
    } catch (err) {
      console.warn("Async server updateTargetBudget notice:", err);
    }
  };

  const toggleTripPublic = async (tripId: string) => {
    let nextState = false;
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        nextState = !t.isPublic;
        return {
          ...t,
          isPublic: nextState,
        };
      })
    );

    try {
      await serverTogglePublic(tripId, nextState);
    } catch (err) {
      console.warn("Async server toggleTripPublic notice:", err);
    }
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        activeTripId,
        setActiveTripId,
        getTripById,
        refreshTrips,
        refreshTrip,
        isLoading,
        error,
        destinations,
        addDestination,
        updateDestination,
        deleteDestination,
        activities,
        addActivityCatalogItem,
        updateActivityCatalogItem,
        deleteActivityCatalogItem,
        isDbConnected,
        isSyncing,
        syncAllFromDatabase,
        seedDatabaseToSupabase,
        resetCatalogToDefault,
        updateStopDuration,
        addStopToTrip,
        removeStopFromTrip,
        reorderStops,
        addActivityToDay,
        removeActivityFromDay,
        moveActivityBetweenDays,
        toggleActivityCompleted,
        createNewTrip,
        copyTrip,
        deleteTrip,
        updateTargetBudget,
        toggleTripPublic,
        lastRecalculatedField,
        currency,
        setCurrency,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrips must be used within a TripProvider");
  }
  return context;
}
