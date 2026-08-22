import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "amber" | "purple" | "emerald" | "terracotta" | "cobalt" | "neutral" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full select-none";

  const variantStyles = {
    amber: "bg-[#FEF7EC] text-[#B86E00] border border-[#FCD89C]",
    purple: "bg-[#F6F0F5] text-[#76546F] border border-[#DBCBD8]",
    emerald: "bg-[#EDF7F2] text-[#1B8755] border border-[#BDE3CF]",
    terracotta: "bg-[#FDF1EE] text-[#C84B31] border border-[#F8CEC4]",
    cobalt: "bg-[#EEF5FC] text-[#2B6CB0] border border-[#BDD8F2]",
    neutral: "bg-[#EFECE6] text-[#554F48] border border-[#DDD7CB]",
    outline: "bg-transparent text-[#6B655E] border border-[#E7E2D8]",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </span>
  );
}
