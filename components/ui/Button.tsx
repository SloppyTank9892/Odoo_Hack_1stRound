"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "dark";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4A62A] focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none";

    const variantStyles = {
      primary:
        "bg-[#F4A62A] text-[#181818] hover:bg-[#E09115] shadow-[0_2px_8px_-2px_rgba(244,166,42,0.4)] hover:shadow-[0_4px_12px_-2px_rgba(244,166,42,0.5)] font-semibold border border-[#FCD89C]",
      secondary:
        "bg-[#F6F0F5] text-[#76546F] hover:bg-[#EFE6ED] border border-[#DBCBD8]",
      outline:
        "bg-white text-[#181818] hover:bg-[#FAF9F5] border border-[#E7E2D8] hover:border-[#D5CEBF] shadow-xs",
      ghost:
        "bg-transparent text-[#6B655E] hover:text-[#181818] hover:bg-[#EFECE6]/60",
      danger:
        "bg-[#FDF1EE] text-[#C84B31] hover:bg-[#FCE3DD] border border-[#F5C7BC]",
      dark:
        "bg-[#181818] text-white hover:bg-[#2C2C2C] shadow-sm",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-5 py-3.5 gap-2.5 rounded-2xl",
      icon: "p-2.5 rounded-xl aspect-square",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
