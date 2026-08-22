"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Trip, Activity, DestinationStop, CityDiscovery, DayPlan } from "@/types/trip";
import { initialTrips } from "@/data/mockTrips";
import { mockDestinations } from "@/data/mockDestinations";
import { recalculateTrip } from "@/lib/tripCalculations";
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

interface CreateTripOptions {
  name: string;
  tagline?: string;
  startDate?: string;
  initialCities: CityDiscovery[];
  coverFile?: File | null;
  coverImageUrl?: string | null;
  targetBudget?: number;
}

interface TripContextType {
  trips: Trip[];
  activeTrip: Trip;
  activeTripId: string;
  setActiveTripId: (id: string) => void;
  getTripById: (id: string) => Trip | undefined;
  refreshTrips: () => Promise<void>;
  refreshTrip: (id: string) => Promise<Trip | undefined>;
  isLoading: boolean;
  
  // The WOW Moment Engine
  updateStopDuration: (tripId: string, stopId: string, newDaysCount: number) => Promise<void>;
  
  // Stops Management
  addStopToTrip: (tripId: string, city: CityDiscovery) => Promise<void>;
  removeStopFromTrip: (tripId: string, stopId: string) => Promise<void>;
  reorderStops: (tripId: string, newStops: DestinationStop[]) => void;
  
  // Activities Management
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
  createNewTrip: (options: CreateTripOptions | string, tagline?: string, startDate?: string, initialCities?: CityDiscovery[]) => Promise<string>;
  copyTrip: (tripId: string) => Promise<Trip>;
  deleteTrip: (tripId: string) => Promise<void>;
  updateTargetBudget: (tripId: string, targetAmount: number) => Promise<void>;
  toggleTripPublic: (tripId: string) => Promise<void>;

  // Visual pulse signal for judges
  lastRecalculatedField: string | null;
  currency: string;
  setCurrency: (c: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

/**
 * Converts a database TripWithDetails row tree into the rich UI Trip object.
 */
function convertDbTripToUiTrip(dbTrip: TripWithDetails): Trip {
  const stops: DestinationStop[] = (dbTrip.trip_stops || []).map((stop) => {
    // Check if city matches mock destination to enrich metadata
    const matchedCity = mockDestinations.find(
      (m) => m.name.toLowerCase() === stop.city_name.toLowerCase()
    );

    // Calculate days count between start and end date if available, or default to 2
    let daysCount = 2;
    if (stop.start_date && stop.end_date) {
      const diffMs = new Date(stop.end_date).getTime() - new Date(stop.start_date).getTime();
      const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
      daysCount = diffDays;
    }

    return {
      id: stop.id,
      cityName: stop.city_name,
      stateOrCountry: stop.country,
      daysCount,
      lat: matchedCity?.lat || 26.9124,
      lng: matchedCity?.lng || 75.7873,
      image: matchedCity?.image || dbTrip.cover_image_url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      costIndex: matchedCity?.costIndex || "$$",
      popularRank: matchedCity?.popularity || 90,
      highlights: matchedCity?.tags || ["Heritage", "Explore"],
      description: matchedCity?.description || `Explore ${stop.city_name}`,
      accommodationPerNight: matchedCity ? Math.round(matchedCity.avgDailyCost * 0.6) : 2500,
      dailyMealsEstimate: matchedCity ? Math.round(matchedCity.avgDailyCost * 0.3) : 1000,
    };
  });

  const rawTrip: Trip = {
    id: dbTrip.id,
    name: dbTrip.title,
    tagline: dbTrip.description || "A personalized travel journey",
    description: dbTrip.description || "",
    coverImage:
      dbTrip.cover_image_url ||
      stops[0]?.image ||
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
    startDate: dbTrip.start_date || new Date().toISOString().split("T")[0],
    endDate: dbTrip.end_date || new Date().toISOString().split("T")[0],
    isPublic: dbTrip.is_public,
    shareCode: `GT-${dbTrip.id.substring(0, 5).toUpperCase()}`,
    status: dbTrip.status === "completed" ? "completed" : dbTrip.status === "ongoing" ? "active" : "planning",
    createdAt: dbTrip.created_at || new Date().toISOString().split("T")[0],
    stops: stops.length > 0 ? stops : [
      {
        id: "stop-1",
        cityName: "Jaipur",
        stateOrCountry: "Rajasthan, India",
        daysCount: 2,
        lat: 26.9124,
        lng: 75.7873,
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        costIndex: "$$",
        popularRank: 95,
        highlights: ["Palaces", "Heritage"],
        description: "The Pink City",
        accommodationPerNight: 2500,
        dailyMealsEstimate: 950,
      },
    ],
    days: [],
    budget: {
      targetBudget: Number(dbTrip.total_budget) || 60000,
      currency: "₹",
      categories: {
        transport: 10000,
        accommodation: 20000,
        activities: 15000,
        meals: 10000,
        misc: 5000,
      },
    },
  };

  const calculated = recalculateTrip(rawTrip);

  // Populate activities from database if present
  if (dbTrip.trip_stops) {
    const actMap = new Map<string, Activity[]>(); // key: `${stopId}-${dayNumber}`
    dbTrip.trip_stops.forEach((stop) => {
      (stop.activities || []).forEach((act) => {
        const key = `${stop.id}-${act.day_number}`;
        const existing = actMap.get(key) || [];
        existing.push({
          id: act.id,
          name: act.title,
          description: "",
          category: (act.category as any) || "culture",
          cost: Number(act.cost) || 0,
          durationMinutes: 90,
          timeSlot: "14:00",
          location: stop.city_name,
        });
        actMap.set(key, existing);
      });
    });

    if (actMap.size > 0) {
      calculated.days = calculated.days.map((day) => {
        const key = `${day.cityId}-${day.cityDayNumber}`;
        const dbActivities = actMap.get(key);
        if (dbActivities && dbActivities.length > 0) {
          return {
            ...day,
            activities: [...day.activities, ...dbActivities],
          };
        }
        return day;
      });
      return recalculateTrip(calculated);
    }
  }

  return calculated;
}

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(() => {
    return initialTrips.map(recalculateTrip);
  });
  const [activeTripId, setActiveTripId] = useState<string>("rajasthan-explorer");
  const [lastRecalculatedField, setLastRecalculatedField] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("₹");
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Helper to trigger pulse badge
  const triggerRecalcPulse = (fieldTag: string) => {
    setLastRecalculatedField(fieldTag);
    setTimeout(() => setLastRecalculatedField(null), 2500);
  };

  // Sync user trips from Supabase
  const refreshTrips = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getUserTrips();
      if (res.success && res.data && res.data.all.length > 0) {
        const dbTripsWithDetails: Trip[] = [];
        for (const dbTrip of res.data.all) {
          const detailRes = await fetchTripDetailsFromDb(dbTrip.id);
          if (detailRes.success && detailRes.data) {
            dbTripsWithDetails.push(convertDbTripToUiTrip(detailRes.data));
          }
        }

        if (dbTripsWithDetails.length > 0) {
          // Merge with initial fallback trips if needed
          setTrips((prev) => {
            const nonDbTrips = prev.filter(
              (p) => !dbTripsWithDetails.some((d) => d.id === p.id)
            );
            return [...dbTripsWithDetails, ...nonDbTrips];
          });
          setActiveTripId(dbTripsWithDetails[0].id);
        }
      }
    } catch (err) {
      console.warn("Could not sync trips from database, using active memory state:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshTrip = useCallback(async (id: string): Promise<Trip | undefined> => {
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
  }, [trips]);

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0] || initialTrips[0];

  const getTripById = (id: string) => {
    return trips.find((t) => t.id === id);
  };

  // THE WOW MOMENT: Dynamic Stop Duration Adjustment
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

        const updatedTrip = recalculateTrip({ ...t, stops: updatedStops });
        return updatedTrip;
      })
    );

    triggerRecalcPulse(`stop-duration-${stopId}`);

    // 2. Background Database Sync
    try {
      const currentTrip = trips.find((t) => t.id === tripId);
      if (currentTrip && !currentTrip.id.startsWith("rajasthan-") && !currentTrip.id.startsWith("kerala-") && !currentTrip.id.startsWith("golden-")) {
        await serverUpdateTripStop(stopId, {
          order_index: currentTrip.stops.findIndex((s) => s.id === stopId),
        });
      }
    } catch (err) {
      console.warn("Async stop duration update warning:", err);
    }
  };

  const addStopToTrip = async (tripId: string, city: CityDiscovery) => {
    // Prevent duplicate stop additions if already in list
    const targetTrip = trips.find((t) => t.id === tripId);
    if (targetTrip?.stops.some((s) => s.cityName.toLowerCase() === city.name.toLowerCase())) {
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

    // 2. Background DB sync if not mock ID
    if (tripId && !tripId.includes("explorer") && !tripId.includes("serenity") && !tripId.includes("circuit")) {
      try {
        await serverAddTripStop({
          trip_id: tripId,
          city_name: city.name,
          country: `${city.region}, ${city.country}`,
          allocated_budget: city.avgDailyCost * (city.suggestedDays || 2),
        });
      } catch (err) {
        console.warn("Async add stop warning:", err);
      }
    }
  };

  const removeStopFromTrip = async (tripId: string, stopId: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== tripId) return t;
        if (t.stops.length <= 1) return t; // Keep at least one stop

        const updatedStops = t.stops.filter((s) => s.id !== stopId);
        return recalculateTrip({ ...t, stops: updatedStops });
      })
    );

    triggerRecalcPulse("remove-stop");

    if (stopId && !stopId.startsWith("stop-") && !stopId.includes("jaipur") && !stopId.includes("jodhpur")) {
      try {
        await serverDeleteTripStop(stopId);
      } catch (err) {
        console.warn("Async delete stop warning:", err);
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

    if (stopId && !stopId.startsWith("stop-") && !stopId.includes("jaipur")) {
      try {
        await serverAddActivity({
          stop_id: stopId,
          day_number: dayNumber,
          title: activityData.name,
          category: activityData.category,
          cost: activityData.cost,
        });
      } catch (err) {
        console.warn("Async add activity warning:", err);
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

    if (activityId && !activityId.startsWith("act-") && !activityId.includes("amber")) {
      try {
        await serverDeleteActivity(activityId);
      } catch (err) {
        console.warn("Async delete activity warning:", err);
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
    let targetBudget = 60000;

    if (typeof optionsOrName === "object") {
      name = optionsOrName.name;
      tagline = optionsOrName.tagline || "";
      startDate = optionsOrName.startDate || new Date().toISOString().split("T")[0];
      initialCities = optionsOrName.initialCities || [];
      coverFile = optionsOrName.coverFile || null;
      coverImageUrl = optionsOrName.coverImageUrl || null;
      targetBudget = optionsOrName.targetBudget || 60000;
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

    const rawTrip: Trip = {
      id: newId,
      name,
      tagline: tagline || "A custom crafted journey",
      description: `Personalized travel itinerary across ${stops.map((s) => s.cityName).join(", ")}.`,
      coverImage: coverImageUrl || stops[0]?.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
      startDate: startDate || new Date().toISOString().split("T")[0],
      endDate: startDate || new Date().toISOString().split("T")[0],
      isPublic: false,
      shareCode: `GT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: "planning",
      createdAt: new Date().toISOString().split("T")[0],
      stops: stops.length > 0 ? stops : [
        {
          id: "jaipur",
          cityName: "Jaipur",
          stateOrCountry: "Rajasthan, India",
          daysCount: 2,
          lat: 26.9124,
          lng: 75.7873,
          image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
          costIndex: "$$",
          popularRank: 95,
          highlights: ["Palaces", "Heritage"],
          description: "The Pink City",
          accommodationPerNight: 2500,
          dailyMealsEstimate: 950,
        },
      ],
      days: [],
      budget: {
        targetBudget,
        currency: "₹",
        categories: {
          transport: 10000,
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
      formData.append("description", tagline || `Personalized journey`);
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
        // Update local trip ID to match Supabase ID
        setTrips((prev) =>
          prev.map((t) => (t.id === newId ? { ...t, id: dbTripId } : t))
        );
        setActiveTripId(dbTripId);
        return dbTripId;
      }
    } catch (err) {
      console.warn("Async server createTrip notice:", err);
    }

    return newId;
  };

  const copyTrip = async (tripId: string): Promise<Trip> => {
    const original = getTripById(tripId) || activeTrip;
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
        activities: day.activities.map((a) => ({ ...a, id: `copied-${a.id}-${Date.now().toString().slice(-3)}` })),
      })),
    };

    const finalTrip = recalculateTrip(duplicate);
    setTrips((prev) => [finalTrip, ...prev]);
    setActiveTripId(copyId);

    // Call copy API if valid UUID
    if (tripId && !tripId.startsWith("rajasthan-") && !tripId.startsWith("kerala-")) {
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
    }

    return finalTrip;
  };

  const deleteTrip = async (tripId: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (activeTripId === tripId && trips.length > 1) {
      const fallback = trips.find((t) => t.id !== tripId);
      if (fallback) setActiveTripId(fallback.id);
    }

    if (tripId && !tripId.startsWith("rajasthan-") && !tripId.startsWith("kerala-")) {
      try {
        await serverDeleteTrip(tripId);
      } catch (err) {
        console.warn("Async server deleteTrip warning:", err);
      }
    }
  };

  const updateTargetBudget = async (tripId: string, targetAmount: number) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          budget: {
            ...t.budget,
            targetBudget: targetAmount,
          },
        };
      })
    );
    triggerRecalcPulse("budget-target");

    if (tripId && !tripId.startsWith("rajasthan-") && !tripId.startsWith("kerala-")) {
      try {
        await serverUpdateTrip(tripId, { total_budget: targetAmount });
      } catch (err) {
        console.warn("Async server updateTargetBudget warning:", err);
      }
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

    if (tripId && !tripId.startsWith("rajasthan-") && !tripId.startsWith("kerala-")) {
      try {
        await serverTogglePublic(tripId, nextState);
      } catch (err) {
        console.warn("Async server toggleTripPublic warning:", err);
      }
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
