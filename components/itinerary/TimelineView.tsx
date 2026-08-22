"use client";

import React, { useState, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { Trip, Activity, DayPlan } from "@/types/trip";
import { StopDurationEditor } from "@/components/trip/StopDurationEditor";
import { AddActivityDrawer } from "@/components/itinerary/AddActivityDrawer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/tripCalculations";
import { useTrips } from "@/context/TripContext";
import {
  Sparkles,
  Calendar,
  Plus,
  GripVertical,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Trash2,
  ArrowRightLeft,
} from "lucide-react";

// ─── Draggable Activity Item ─────────────────────────────────────────────────

interface SortableActivityProps {
  activity: Activity;
  tripId: string;
  dayNumber: number;
  totalDays: number;
  isDragOverlay?: boolean;
}

function SortableActivityItem({
  activity,
  tripId,
  dayNumber,
  totalDays,
  isDragOverlay = false,
}: SortableActivityProps) {
  const { removeActivityFromDay, moveActivityBetweenDays, toggleActivityCompleted, currency } =
    useTrips();
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${dayNumber}::${activity.id}`,
    data: { type: "activity", activity, dayNumber },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isDragOverlay ? 0.35 : 1,
  };

  const getCategoryColor = (cat: Activity["category"]) => {
    const map: Record<string, string> = {
      culture: "bg-[#F6F0F5] dark:bg-[#2A1D28] text-[#76546F] dark:text-[#B88BAF] border-[#DBCBD8] dark:border-[#4D3349]",
      food: "bg-[#FEF7EC] dark:bg-[#2B2113] text-[#B86E00] dark:text-[#F4A62A] border-[#FCD89C] dark:border-[#5E431E]",
      adventure: "bg-[#FEF0EB] dark:bg-[#3A1713] text-[#C84B31] dark:text-[#F87171] border-[#F9C4B5] dark:border-[#5C231B]",
      nature: "bg-[#ECFDF5] dark:bg-[#132D20] text-[#1B8755] dark:text-[#34D399] border-[#86EFAC] dark:border-[#1E4B33]",
      transport: "bg-[#EFF6FF] dark:bg-[#142847] text-[#2563EB] dark:text-[#60A5FA] border-[#BFDBFE] dark:border-[#1E3A5F]",
    };
    return map[cat] || "bg-[#FAF9F5] dark:bg-[#24221E] text-[#6B655E] dark:text-[#A8A196] border-[#E7E2D8] dark:border-[#33302B]";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3.5 rounded-xl border transition-all duration-200 bg-white dark:bg-[#201F1B] select-none ${
        activity.completed
          ? "border-[#E7E2D8] dark:border-[#33302B] bg-[#FAF9F5] dark:bg-[#181816] opacity-75"
          : isDragOverlay
            ? "border-[#F4A62A] shadow-xl ring-2 ring-[#F4A62A]/30 rotate-1"
            : "border-[#E7E2D8] dark:border-[#33302B] hover:border-[#D5CEBF] dark:hover:border-[#48443D] hover:shadow-xs"
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="mt-1 cursor-grab active:cursor-grabbing text-[#C5BEB4] dark:text-[#5E5950] hover:text-[#9E978E] dark:hover:text-[#A8A196] transition-colors shrink-0 touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#181818] dark:text-[#F5F3EF] bg-[#FAF9F5] dark:bg-[#282622] px-2 py-0.5 rounded-md border border-[#E7E2D8] dark:border-[#33302B]">
                <Clock className="w-3 h-3 text-[#76546F] dark:text-[#B88BAF]" />
                {activity.timeSlot}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(
                  activity.category
                )}`}
              >
                {activity.category}
              </span>
              <span className="text-[11px] text-[#6B655E] dark:text-[#A8A196]">{activity.durationMinutes} mins</span>
            </div>

            <h5
              className={`font-bold text-sm text-[#181818] dark:text-[#F5F3EF] leading-tight ${
                activity.completed ? "line-through text-[#9E978E] dark:text-[#7A746B]" : ""
              }`}
            >
              {activity.name}
            </h5>

            {activity.location && (
              <div className="flex items-center gap-1 text-[11px] text-[#9E978E] dark:text-[#7A746B] mt-1">
                <MapPin className="w-3 h-3 shrink-0 text-[#F4A62A]" />
                <span className="truncate">{activity.location}</span>
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex flex-col items-end justify-between self-stretch shrink-0">
            <span className="font-extrabold text-xs text-[#181818] dark:text-[#F5F3EF] bg-[#FEF7EC] dark:bg-[#2B2113] px-2 py-1 rounded-lg border border-[#FCD89C] dark:border-[#5E431E]">
              {activity.cost > 0 ? formatCurrency(activity.cost, currency) : "Free"}
            </span>

            <div className="flex items-center gap-1 mt-2">
              {/* Toggle complete */}
              <button
                onClick={() => toggleActivityCompleted(tripId, dayNumber, activity.id)}
                className="p-1.5 rounded-lg text-[#9E978E] hover:text-[#1B8755] dark:hover:text-[#34D399] hover:bg-[#ECFDF5] dark:hover:bg-[#132D20] transition-colors cursor-pointer"
              >
                {activity.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1B8755] dark:text-[#34D399]" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-[#D5CEBF] dark:text-[#5E5950]" />
                )}
              </button>

              {/* Move to day */}
              <div className="relative">
                <button
                  onClick={() => setShowMoveMenu(!showMoveMenu)}
                  className="p-1.5 rounded-lg text-[#9E978E] hover:text-[#181818] dark:hover:text-[#F5F3EF] hover:bg-[#FAF9F5] dark:hover:bg-[#282622] transition-colors cursor-pointer"
                  title="Move to another day"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {showMoveMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 bottom-7 w-36 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xl border border-[#E7E2D8] dark:border-[#33302B] py-1 z-30"
                    >
                      <div className="px-2.5 py-1 text-[10px] font-bold text-[#9E978E] uppercase tracking-wider">
                        Move to Day:
                      </div>
                      {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                        <button
                          key={d}
                          disabled={d === dayNumber}
                          onClick={() => {
                            moveActivityBetweenDays(tripId, dayNumber, d, activity.id);
                            setShowMoveMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#181818] dark:text-[#F5F3EF] hover:bg-[#FAF9F5] dark:hover:bg-[#282622] disabled:opacity-40"
                        >
                          Day {d} {d === dayNumber ? "(Current)" : ""}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeActivityFromDay(tripId, dayNumber, activity.id)}
                className="p-1.5 rounded-lg text-[#9E978E] hover:text-[#C84B31] dark:hover:text-[#F87171] hover:bg-[#FDF1EE] dark:hover:bg-[#3A1713] transition-colors cursor-pointer"
                title="Delete activity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Droppable DayCard ────────────────────────────────────────────────────────

interface DraggableDayCardProps {
  trip: Trip;
  day: DayPlan;
  totalDays: number;
  isDropTarget: boolean;
}

function DraggableDayCard({ trip, day, totalDays, isDropTarget }: DraggableDayCardProps) {
  const { currency } = useTrips();
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const dailyActivitiesCost = day.activities.reduce((sum, a) => sum + a.cost, 0);
  const sortableIds = day.activities.map((a) => `${day.dayNumber}::${a.id}`);

  return (
    <div
      id={`day-${day.dayNumber}`}
      className="relative pl-6 sm:pl-8 pb-8 group/day"
    >
      {/* Timeline connector */}
      <div className="timeline-connector group-last/day:hidden" />

      {/* Day pin */}
      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-[#181818] dark:bg-[#F4A62A] border-2 border-white dark:border-[#1C1B18] text-white dark:text-[#181818] flex items-center justify-center text-[10px] font-bold shadow-xs z-10">
        {day.dayNumber}
      </div>

      <motion.div
        animate={
          isDropTarget
            ? { borderColor: "#F4A62A", boxShadow: "0 0 0 3px rgba(244,166,42,0.2)" }
            : { borderColor: "var(--border-warm)", boxShadow: "none" }
        }
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-[#1C1B18] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] p-4 sm:p-6 shadow-xs transition-colors"
      >
        {/* Day Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E7E2D8] dark:border-[#33302B]">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#B86E00] dark:text-[#F4A62A] bg-[#FEF7EC] dark:bg-[#2B2113] px-2.5 py-1 rounded-lg border border-[#FCD89C] dark:border-[#5E431E]">
              Day {day.dayNumber}
            </span>
            <h4 className="text-base sm:text-lg font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
              {day.cityName}{" "}
              <span className="text-xs font-normal text-[#6B655E] dark:text-[#A8A196]">(Day {day.cityDayNumber})</span>
            </h4>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#6B655E] dark:text-[#A8A196] flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#9E978E] dark:text-[#7A746B]" />
              {formattedDate}
            </span>
            <span className="font-bold text-[#181818] dark:text-[#F5F3EF] bg-[#FAF9F5] dark:bg-[#24221E] px-2.5 py-1 rounded-lg border border-[#E7E2D8] dark:border-[#33302B]">
              Est. Daily: {formatCurrency(day.estimatedDailyBudget, currency)}
            </span>
          </div>
        </div>

        {/* Drop indicator hint */}
        <AnimatePresence>
          {isDropTarget && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 px-3 py-2 rounded-xl bg-[#FEF7EC] dark:bg-[#2B2113] border border-dashed border-[#F4A62A] text-[11px] text-[#B86E00] dark:text-[#F4A62A] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Drop activity here to move it to Day {day.dayNumber}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activities */}
        <div className="space-y-2.5 my-4 min-h-[48px]">
          <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
            {day.activities.length > 0 ? (
              day.activities.map((activity) => (
                <SortableActivityItem
                  key={activity.id}
                  activity={activity}
                  tripId={trip.id}
                  dayNumber={day.dayNumber}
                  totalDays={totalDays}
                />
              ))
            ) : (
              <div className="text-center py-6 px-4 border border-dashed border-[#E7E2D8] dark:border-[#33302B] rounded-xl bg-[#FAF9F5]/70 dark:bg-[#201F1B]/70">
                <p className="text-xs text-[#9E978E] dark:text-[#7A746B] mb-2 font-medium">
                  No activities scheduled for Day {day.dayNumber} yet.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddDrawerOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add First Activity
                </Button>
              </div>
            )}
          </SortableContext>
        </div>

        {/* Day Footer */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-[#9E978E] dark:text-[#7A746B]">
            {day.activities.length} planned · {formatCurrency(dailyActivitiesCost, currency)}{" "}
            activities spend
          </span>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAddDrawerOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 text-[#F4A62A]" />}
            className="text-xs font-bold text-[#181818] dark:text-[#F5F3EF] hover:text-[#F4A62A] dark:hover:text-[#F4A62A]"
          >
            + Add Activity
          </Button>
        </div>
      </motion.div>

      <AddActivityDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        tripId={trip.id}
        dayNumber={day.dayNumber}
        cityName={day.cityName}
        stopId={day.cityId}
      />
    </div>
  );
}

// ─── Main TimelineView ────────────────────────────────────────────────────────

interface TimelineViewProps {
  trip: Trip;
}

export function TimelineView({ trip }: TimelineViewProps) {
  const { moveActivityBetweenDays } = useTrips();
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("all");
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(null);
  const [dropTargetDay, setDropTargetDay] = useState<number | null>(null);
  const dragActivityRef = useRef<{ activity: Activity; fromDay: number } | null>(null);

  const filteredDays = trip.days.filter((day) =>
    selectedCityFilter === "all" ? true : day.cityId === selectedCityFilter
  );

  // Find the dragged activity for the overlay
  const draggedActivity = activeDragId
    ? (() => {
      const [dayStr, ...rest] = String(activeDragId).split("::");
      const actId = rest.join("::");
      const day = trip.days.find((d) => d.dayNumber === Number(dayStr));
      return day?.activities.find((a) => a.id === actId) || null;
    })()
    : null;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id);
    const [dayStr, ...rest] = String(event.active.id).split("::");
    const actId = rest.join("::");
    const fromDay = Number(dayStr);
    const day = trip.days.find((d) => d.dayNumber === fromDay);
    const activity = day?.activities.find((a) => a.id === actId);
    if (activity) {
      dragActivityRef.current = { activity, fromDay };
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setDropTargetDay(null);
      return;
    }
    const overId = String(over.id);
    if (overId.startsWith("day-droppable-")) {
      setDropTargetDay(Number(overId.replace("day-droppable-", "")));
    } else if (overId.includes("::")) {
      setDropTargetDay(Number(overId.split("::")[0]));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    setDropTargetDay(null);

    if (!over || !dragActivityRef.current) {
      dragActivityRef.current = null;
      return;
    }

    const { fromDay, activity } = dragActivityRef.current;
    const overId = String(over.id);

    let toDay = fromDay;
    if (overId.startsWith("day-droppable-")) {
      toDay = Number(overId.replace("day-droppable-", ""));
    } else if (overId.includes("::")) {
      toDay = Number(overId.split("::")[0]);
    }

    if (toDay !== fromDay) {
      moveActivityBetweenDays(trip.id, fromDay, toDay, activity.id);
    }

    dragActivityRef.current = null;
  };

  return (
    <div className="space-y-8">
      {/* Stop Duration Managers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F4A62A]" />
            <h3 className="text-base font-bold text-[#181818] dark:text-[#F5F3EF] font-editorial">
              Multi-City Stop Allocations &amp; Duration Engine
            </h3>
          </div>
          <span className="text-xs text-[#76546F] dark:text-[#B88BAF] font-semibold">
            {trip.stops.length} Stops · {trip.days.length} Total Days
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {trip.stops.map((stop) => (
            <StopDurationEditor
              key={stop.id}
              trip={trip}
              stop={stop}
              isJaipurDemo={stop.id === "jaipur"}
            />
          ))}
        </div>
      </div>

      {/* Day Filter Chips */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#E7E2D8] dark:border-[#33302B] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCityFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCityFilter === "all"
                ? "bg-[#181818] dark:bg-[#F4A62A] text-white dark:text-[#181818]"
                : "bg-white dark:bg-[#1C1B18] text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF] border border-[#E7E2D8] dark:border-[#33302B]"
            }`}
          >
            All Days ({trip.days.length})
          </button>
          {trip.stops.map((stop) => (
            <button
              key={stop.id}
              onClick={() => setSelectedCityFilter(stop.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                selectedCityFilter === stop.id
                  ? "bg-[#FEF7EC] dark:bg-[#2B2113] text-[#B86E00] dark:text-[#F4A62A] border border-[#FCD89C] dark:border-[#5E431E]"
                  : "bg-white dark:bg-[#1C1B18] text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF] border border-[#E7E2D8] dark:border-[#33302B]"
              }`}
            >
              <span>{stop.cityName}</span>
              <span className="text-[10px] opacity-75">({stop.daysCount}d)</span>
            </button>
          ))}
        </div>
        <span className="text-xs text-[#9E978E] dark:text-[#7A746B] hidden sm:inline">
          Showing {filteredDays.length} of {trip.days.length} days
        </span>
      </div>

      {/* DnD Context wrapping the timeline */}
      <div className="pt-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {filteredDays.map((day) => (
            <DraggableDayCard
              key={`${day.cityId}-${day.dayNumber}`}
              trip={trip}
              day={day}
              totalDays={trip.days.length}
              isDropTarget={dropTargetDay === day.dayNumber && activeDragId !== null}
            />
          ))}

          {/* Drag overlay */}
          <DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
            {draggedActivity && dragActivityRef.current ? (
              <div className="w-full max-w-sm">
                <SortableActivityItem
                  activity={draggedActivity}
                  tripId={trip.id}
                  dayNumber={dragActivityRef.current.fromDay}
                  totalDays={trip.days.length}
                  isDragOverlay
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
