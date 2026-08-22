"use client";

import React, { useState } from "react";
import { Trip, DestinationStop } from "@/types/trip";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import { MapPin, Navigation, Compass, Layers, Sparkles, Clock, ArrowRight } from "lucide-react";

interface TripMapProps {
  trip: Trip;
  onSwitchToItinerary?: (dayNumber?: number) => void;
}

export function TripMap({ trip, onSwitchToItinerary }: TripMapProps) {
  const { currency } = useTrips();
  const [selectedStop, setSelectedStop] = useState<DestinationStop>(trip.stops[0] || null);

  const selectedStopDay = trip.days.find(
    (d) => d.cityId === selectedStop?.id || d.cityName.toLowerCase() === selectedStop?.cityName?.toLowerCase()
  )?.dayNumber || 1;

  const minLat = Math.min(...trip.stops.map((s) => s.lat));
  const maxLat = Math.max(...trip.stops.map((s) => s.lat));
  const minLng = Math.min(...trip.stops.map((s) => s.lng));
  const maxLng = Math.max(...trip.stops.map((s) => s.lng));

  const latRange = Math.max(0.1, maxLat - minLat);
  const lngRange = Math.max(0.1, maxLng - minLng);

  const getSvgCoords = (stop: DestinationStop) => {
    const x = 100 + ((stop.lng - minLng) / lngRange) * 600;
    const y = 380 - ((stop.lat - minLat) / latRange) * 300;
    return { x: isNaN(x) ? 400 : x, y: isNaN(y) ? 225 : y };
  };

  const points = trip.stops.map(getSvgCoords);

  return (
    <div className="space-y-6">
      {/* Map Control & Route Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1C1B18] p-4 sm:p-5 rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-[#F4A62A]" />
            <h3 className="text-base font-bold text-[#181818] dark:text-[#F5F3EF] font-editorial">
              Geographic Route & Transit Coordinates
            </h3>
          </div>
          <p className="text-xs text-[#6B655E] dark:text-[#A8A196]">
            {trip.stops.length} connected destinations across {trip.days.length} days of exploration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="amber" size="sm">
            {trip.stops.length - 1} Transit Legs
          </Badge>
          <span className="text-xs text-[#76546F] dark:text-[#B88BAF] font-bold">
            Interactive Route Map
          </span>
        </div>
      </div>

      {/* SVG Canvas Map Visualizer */}
      <Card className="p-0 overflow-hidden bg-[#FAF9F5] dark:bg-[#181816] border-[#E7E2D8] dark:border-[#33302B] relative">
        {/* Subtle Map Grid Background */}
        <div className="relative w-full h-[380px] sm:h-[480px] bg-[#FAF9F5] dark:bg-[#181816] select-none transition-colors">
          <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
            <defs>
              {/* Map Route Line Gradient */}
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F4A62A" />
                <stop offset="50%" stopColor="#76546F" />
                <stop offset="100%" stopColor="#1B8755" />
              </linearGradient>

              {/* Grid pattern */}
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-[#E7E2D8] dark:text-[#282622]" strokeWidth="0.8" opacity="0.6" />
              </pattern>
            </defs>

            {/* Grid */}
            <rect width="800" height="450" fill="url(#gridPattern)" />

            {/* Connecting Route Lines */}
            {points.map((p, i) => {
              if (i === points.length - 1) return null;
              const nextP = points[i + 1];
              return (
                <g key={`route-${i}`}>
                  {/* Outer Glow */}
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={nextP.x}
                    y2={nextP.y}
                    stroke="#F4A62A"
                    strokeWidth="6"
                    strokeOpacity="0.25"
                    strokeLinecap="round"
                  />
                  {/* Core Route Line */}
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={nextP.x}
                    y2={nextP.y}
                    stroke="url(#routeGradient)"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                  />
                  {/* Transit Indicator Midpoint */}
                  <circle
                    cx={(p.x + nextP.x) / 2}
                    cy={(p.y + nextP.y) / 2}
                    r="9"
                    className="fill-white dark:fill-[#1C1B18] stroke-[#E7E2D8] dark:stroke-[#33302B]"
                    strokeWidth="2"
                  />
                  <text
                    x={(p.x + nextP.x) / 2}
                    y={(p.y + nextP.y) / 2 + 3}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="fill-[#76546F] dark:fill-[#B88BAF]"
                  >
                    →
                  </text>
                </g>
              );
            })}

            {/* City Stop Nodes */}
            {trip.stops.map((stop, i) => {
              const coords = points[i];
              const isSelected = selectedStop?.id === stop.id;

              return (
                <g
                  key={stop.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => setSelectedStop(stop)}
                >
                  {/* Pulse ring for selected */}
                  {isSelected && (
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="22"
                      fill="#F4A62A"
                      fillOpacity="0.2"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer ring */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isSelected ? 16 : 12}
                    fill={isSelected ? "#F4A62A" : "#181818"}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                  />

                  {/* Number inside pin */}
                  <text
                    x={coords.x}
                    y={coords.y + 4}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill={isSelected ? "#181818" : "#FFFFFF"}
                  >
                    {i + 1}
                  </text>

                  {/* City Label Badge in SVG (Staggered above/below to prevent overlap) */}
                  <g transform={`translate(${coords.x}, ${i % 2 === 0 ? coords.y - 26 : coords.y + 26})`}>
                    <rect
                      x="-46"
                      y="-11"
                      width="92"
                      height="22"
                      rx="8"
                      className="fill-white dark:fill-[#1C1B18] shadow-sm"
                      stroke={isSelected ? "#F4A62A" : "#E7E2D8"}
                      strokeWidth={isSelected ? "1.5" : "1"}
                    />
                    <text
                      x="0"
                      y="3"
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="fill-[#181818] dark:fill-[#F5F3EF]"
                    >
                      {stop.cityName} ({stop.daysCount}d)
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Floating Selected Stop Inspector Card */}
          {selectedStop && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 bg-white/95 dark:bg-[#1C1B18]/95 backdrop-blur-md rounded-2xl p-4 border border-[#E7E2D8] dark:border-[#33302B] shadow-lg animate-in slide-in-from-bottom-2 duration-200 z-10">
              <div className="flex items-start gap-3 mb-2">
                <img
                  src={selectedStop.image}
                  alt={selectedStop.cityName}
                  className="w-14 h-14 rounded-xl object-cover border border-[#E7E2D8] dark:border-[#33302B] shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-[#181818] dark:text-[#F5F3EF] truncate">
                      {selectedStop.cityName}
                    </h4>
                    <span className="text-[10px] bg-[#FEF7EC] dark:bg-[#2B2113] text-[#B86E00] dark:text-[#F4A62A] font-bold px-1.5 py-0.5 rounded">
                      {selectedStop.daysCount} Days
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B655E] dark:text-[#A8A196] truncate">
                    {selectedStop.stateOrCountry}
                  </p>
                  <p className="text-[10px] text-[#9E978E] dark:text-[#7A746B] mt-0.5">
                    Stay: {formatCurrency(selectedStop.accommodationPerNight, currency)}/night
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#6B655E] dark:text-[#A8A196] line-clamp-2 mb-3">
                {selectedStop.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#E7E2D8] dark:border-[#33302B]">
                <span className="text-[11px] text-[#76546F] dark:text-[#B88BAF] font-bold">
                  {selectedStop.highlights.slice(0, 2).join(", ")}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (onSwitchToItinerary) {
                      onSwitchToItinerary(selectedStopDay);
                    } else {
                      const el = document.getElementById(`day-${selectedStopDay}`);
                      el?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-xs font-bold text-[#F4A62A] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
                >
                  View in Itinerary <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
