import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  bordered?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  className,
  hover = false,
  bordered = true,
  padding = "md",
  children,
  ...props
}: CardProps) {
  const paddingStyles = {
    none: "p-0",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl",
        bordered && "border border-[#E7E2D8]",
        hover && "transition-all duration-300 hover:shadow-[0_8px_24px_-4px_rgba(24,24,24,0.07)] hover:border-[#D5CEBF] hover:-translate-y-0.5",
        !hover && "shadow-[0_1px_3px_0_rgba(24,24,24,0.03),0_4px_12px_-2px_rgba(24,24,24,0.04)]",
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
