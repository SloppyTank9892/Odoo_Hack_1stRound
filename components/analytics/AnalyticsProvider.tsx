"use client";

import React, { createContext, useContext, useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  trackTripAction: (action: string, tripId?: string, extra?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {},
  trackTripAction: () => {},
});

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Page view tracking
  useEffect(() => {
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    // Log pageview event for development and production telemetry
    if (typeof window !== "undefined") {
      try {
        const consent = localStorage.getItem("globetrotter_cookie_consent");
        const parsed = consent ? JSON.parse(consent) : null;
        if (!parsed || parsed.analytics !== false) {
          // Send to analytics endpoint or console
          if (process.env.NODE_ENV === "development") {
            console.debug(`[Analytics] Pageview: ${url}`);
          }
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }
  }, [pathname, searchParams]);

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      try {
        const consent = localStorage.getItem("globetrotter_cookie_consent");
        const parsed = consent ? JSON.parse(consent) : null;
        if (!parsed || parsed.analytics !== false) {
          if (process.env.NODE_ENV === "development") {
            console.debug(`[Analytics] Event: ${eventName}`, properties);
          }
          // Support for window.gtag or custom web vitals
          if (typeof (window as any).gtag === "function") {
            (window as any).gtag("event", eventName, properties);
          }
        }
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  const trackTripAction = useCallback(
    (action: string, tripId?: string, extra?: Record<string, any>) => {
      trackEvent(`trip_${action}`, {
        tripId,
        timestamp: new Date().toISOString(),
        ...extra,
      });
    },
    [trackEvent]
  );

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackTripAction }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
