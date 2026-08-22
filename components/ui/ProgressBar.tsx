import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number; // current percentage 0 - 100+
  max?: number;
  variant?: "amber" | "emerald" | "terracotta" | "purple" | "auto";
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  variant = "auto",
  size = "md",
  className,
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min(150, Math.max(0, Math.round((value / max) * 100)));

  // Auto variant selects emerald under 85%, amber 85-100%, terracotta > 100%
  let resolvedVariant = variant;
  if (variant === "auto") {
    if (percentage > 100) resolvedVariant = "terracotta";
    else if (percentage >= 85) resolvedVariant = "amber";
    else resolvedVariant = "emerald";
  }

  const fillColors = {
    amber: "bg-[#F4A62A]",
    emerald: "bg-[#1B8755]",
    terracotta: "bg-[#C84B31]",
    purple: "bg-[#76546F]",
    auto: "bg-[#F4A62A]",
  };

  const trackHeights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full bg-[#EFECE6] rounded-full overflow-hidden", trackHeights[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            fillColors[resolvedVariant as keyof typeof fillColors]
          )}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mt-1 text-[#6B655E]">
          <span>{percentage}% utilized</span>
          {percentage > 100 && (
            <span className="text-[#C84B31] font-semibold">Exceeds target</span>
          )}
        </div>
      )}
    </div>
  );
}
