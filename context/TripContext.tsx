"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Trip, Activity, DestinationStop, CityDiscovery } from "@/types/trip";
import { initialTrips } from "@/data/mockTrips";
import { recalculateTrip } from "@/lib/tripCalculations";

interface TripContextType {
  trips: Trip[];
  activeTrip: Trip;
  activeTripId: string;
  setActiveTripId: (id: string) => void;
  getTripById: (id: string) => Trip | undefined;
  
  // The WOW Moment Engine
  updateStopDuration: (tripId: string, stopId: string, newDaysCount: number) => void;
  
  // Stops Management
  addStopToTrip: (tripId: string, city: CityDiscovery) => void;
  removeStopFromTrip: (tripId: string, stopId: string) => void;
  reorderStops: (tripId: string, newStops: DestinationStop[]) => void;
  
  // Activities Management
  addActivityToDay: (tripId: string, dayNumber: number, activity: Omit<Activity, "id">) => void;
  removeActivityFromDay: (tripId: string, dayNumber: number, activityId: string) => void;
  moveActivityBetweenDays: (tripId: string, fromDay: number, toDay: number, activityId: string) => void;
  toggleActivityCompleted: (tripId: string, dayNumber: number, activityId: string) => void;

  // Trip Lifecycle
  createNewTrip: (name: string, tagline: string, startDate: string, initialCities: CityDiscovery[]) => string;
  copyTrip: (tripId: string) => Trip;
  deleteTrip: (tripId: string) => void;
  updateTargetBudget: (tripId: string, targetAmount: number) => void;
  toggleTripPublic: (tripId: string) => void;

  // Visual pulse signal for judges
  lastRecalculatedField: string | null;
  currency: string;
  setCurrency: (c: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(() => {
    return initialTrips.map(recalculateTrip);
  });
  const [activeTripId, setActiveTripId] = useState<string>("rajasthan-explorer");
  const [lastRecalculatedField, setLastRecalculatedField] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("₹");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0] || initialTrips[0];

  const getTripById = (id: string) => {
    return trips.find((t) => t.id === id);
  };

  // Helper to trigger pulse badge
  const triggerRecalcPulse = (fieldTag: string) => {
    setLastRecalculatedField(fieldTag);
    setTimeout(() => setLastRecalculatedField(null), 2500);
  };

  // THE WOW MOMENT: Dynamic Stop Duration Adjustment
  const updateStopDuration = (tripId: string, stopId: string, newDaysCount: number) => {
    if (newDaysCount < 1 || newDaysCount > 14) return;

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
  };

  const addStopToTrip = (tripId: string, city: CityDiscovery) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== tripId) return t;
        
        // Prevent duplicate stop additions if already in list
        const alreadyExists = t.stops.some((s) => s.id === city.id);
        if (alreadyExists) return t;

        const newStop: DestinationStop = {
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
        };

        return recalculateTrip({
          ...t,
          stops: [...t.stops, newStop],
        });
      })
    );

    triggerRecalcPulse("add-stop");
  };

  const removeStopFromTrip = (tripId: string, stopId: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== tripId) return t;
        if (t.stops.length <= 1) return t; // Keep at least one stop

        const updatedStops = t.stops.filter((s) => s.id !== stopId);
        return recalculateTrip({ ...t, stops: updatedStops });
      })
    );

    triggerRecalcPulse("remove-stop");
  };

  const reorderStops = (tripId: string, newStops: DestinationStop[]) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== tripId) return t;
        return recalculateTrip({ ...t, stops: newStops });
      })
    );
  };

  const addActivityToDay = (tripId: string, dayNumber: number, activityData: Omit<Activity, "id">) => {
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
  };

  const removeActivityFromDay = (tripId: string, dayNumber: number, activityId: string) => {
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

  const createNewTrip = (
    name: string,
    tagline: string,
    startDate: string,
    initialCities: CityDiscovery[]
  ): string => {
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
      coverImage: stops[0]?.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
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
        targetBudget: 60000,
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
    return newId;
  };

  const copyTrip = (tripId: string): Trip => {
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
    return finalTrip;
  };

  const deleteTrip = (tripId: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (activeTripId === tripId && trips.length > 1) {
      const fallback = trips.find((t) => t.id !== tripId);
      if (fallback) setActiveTripId(fallback.id);
    }
  };

  const updateTargetBudget = (tripId: string, targetAmount: number) => {
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
  };

  const toggleTripPublic = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          isPublic: !t.isPublic,
        };
      })
    );
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        activeTripId,
        setActiveTripId,
        getTripById,
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
