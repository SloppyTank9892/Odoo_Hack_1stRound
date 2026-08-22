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
      culture: "bg-[#F6F0F5] text-[#76546F] border-[#DBCBD8]",
      food: "bg-[#FEF7EC] text-[#B86E00] border-[#FCD89C]",
      adventure: "bg-[#FEF0EB] text-[#C84B31] border-[#F9C4B5]",
      nature: "bg-[#ECFDF5] text-[#1B8755] border-[#86EFAC]",
      transport: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
    };
    return map[cat] || "bg-[#FAF9F5] text-[#6B655E] border-[#E7E2D8]";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3.5 rounded-xl border transition-all duration-200 bg-white select-none ${
        activity.completed
          ? "border-[#E7E2D8] bg-[#FAF9F5] opacity-75"
          : isDragOverlay
          ? "border-[#F4A62A] shadow-xl ring-2 ring-[#F4A62A]/30 rotate-1"
          : "border-[#E7E2D8] hover:border-[#D5CEBF] hover:shadow-xs"
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="mt-1 cursor-grab active:cursor-grabbing text-[#C5BEB4] hover:text-[#9E978E] transition-colors shrink-0 touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#181818] bg-[#FAF9F5] px-2 py-0.5 rounded-md border border-[#E7E2D8]">
                <Clock className="w-3 h-3 text-[#76546F]" />
                {activity.timeSlot}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(
                  activity.category
                )}`}
              >
                {activity.category}
              </span>
              <span className="text-[11px] text-[#6B655E]">{activity.durationMinutes} mins</span>
            </div>

            <h5
              className={`font-bold text-sm text-[#181818] leading-tight ${
                activity.completed ? "line-through text-[#9E978E]" : ""
              }`}
            >
              {activity.name}
            </h5>

            {activity.location && (
              <div className="flex items-center gap-1 text-[11px] text-[#9E978E] mt-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{activity.location}</span>
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex flex-col items-end justify-between self-stretch shrink-0">
            <span className="font-extrabold text-xs text-[#181818] bg-[#FEF7EC] px-2 py-1 rounded-lg border border-[#FCD89C]">
              {activity.cost > 0 ? formatCurrency(activity.cost, currency) : "Free"}
            </span>

            <div className="flex items-center gap-1 mt-2">
              {/* Toggle complete */}
              <button
                onClick={() => toggleActivityCompleted(tripId, dayNumber, activity.id)}
                className="p-1.5 rounded-lg text-[#9E978E] hover:text-[#1B8755] hover:bg-[#ECFDF5] transition-colors"
              >
                {activity.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1B8755]" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-[#D5CEBF]" />
                )}
              </button>

              {/* Move to day */}
              <div className="relative">
                <button
                  onClick={() => setShowMoveMenu(!showMoveMenu)}
                  className="p-1.5 rounded-lg text-[#9E978E] hover:text-[#181818] hover:bg-[#FAF9F5] transition-colors"
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
                      className="absolute right-0 bottom-7 w-36 bg-white rounded-xl shadow-xl border border-[#E7E2D8] py-1 z-30"
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
                          className="w-full text-left px-3 py-1.5 text-xs text-[#181818] hover:bg-[#FAF9F5] disabled:opacity-40"
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
                className="p-1.5 rounded-lg text-[#9E978E] hover:text-[#C84B31] hover:bg-[#FDF1EE] transition-colors"
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
      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-[#181818] border-2 border-white text-white flex items-center justify-center text-[10px] font-bold shadow-xs z-10">
        {day.dayNumber}
      </div>

      <motion.div
        animate={
          isDropTarget
            ? { borderColor: "#F4A62A", boxShadow: "0 0 0 3px rgba(244,166,42,0.2)" }
            : { borderColor: "#E7E2D8", boxShadow: "none" }
        }
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl border p-4 sm:p-6 shadow-xs"
      >
        {/* Day Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E7E2D8]">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#B86E00] bg-[#FEF7EC] px-2.5 py-1 rounded-lg border border-[#FCD89C]">
              Day {day.dayNumber}
            </span>
            <h4 className="text-base sm:text-lg font-bold font-editorial text-[#181818]">
              {day.cityName}{" "}
              <span className="text-xs font-normal text-[#6B655E]">(Day {day.cityDayNumber})</span>
            </h4>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#6B655E] flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#9E978E]" />
              {formattedDate}
            </span>
            <span className="font-bold text-[#181818] bg-[#FAF9F5] px-2.5 py-1 rounded-lg border border-[#E7E2D8]">
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
              <div className="mt-3 px-3 py-2 rounded-xl bg-[#FEF7EC] border border-dashed border-[#F4A62A] text-[11px] text-[#B86E00] font-semibold flex items-center gap-1.5">
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
              <div className="text-center py-6 px-4 border border-dashed border-[#E7E2D8] rounded-xl bg-[#FAF9F5]/70">
                <p className="text-xs text-[#9E978E] mb-2 font-medium">
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
          <span className="text-[11px] text-[#9E978E]">
            {day.activities.length} planned · {formatCurrency(dailyActivitiesCost, currency)}{" "}
            activities spend
          </span>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAddDrawerOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 text-[#F4A62A]" />}
            className="text-xs font-bold text-[#181818] hover:text-[#F4A62A]"
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
    // Determine which day the over item belongs to
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
            <h3 className="text-base font-bold text-[#181818] font-editorial">
              Multi-City Stop Allocations &amp; Duration Engine
            </h3>
          </div>
          <span className="text-xs text-[#76546F] font-semibold">
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
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#E7E2D8] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCityFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCityFilter === "all"
                ? "bg-[#181818] text-white"
                : "bg-white text-[#6B655E] hover:text-[#181818] border border-[#E7E2D8]"
            }`}
          >
            All Days ({trip.days.length})
          </button>
          {trip.stops.map((stop) => (
            <button
              key={stop.id}
              onClick={() => setSelectedCityFilter(stop.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCityFilter === stop.id
                  ? "bg-[#FEF7EC] text-[#B86E00] border border-[#FCD89C]"
                  : "bg-white text-[#6B655E] hover:text-[#181818] border border-[#E7E2D8]"
              }`}
            >
              <span>{stop.cityName}</span>
              <span className="text-[10px] opacity-75">({stop.daysCount}d)</span>
            </button>
          ))}
        </div>
        <span className="text-xs text-[#9E978E] hidden sm:inline">
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

          {/* Drag overlay — ghost of the dragged card */}
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
