"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "md" | "lg" | "xl";
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "md",
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyles = {
    md: "md:max-w-md",
    lg: "md:max-w-lg",
    xl: "md:max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#181818]/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-0 pointer-events-none flex justify-end items-end md:items-stretch">
        {/* Drawer container: Bottom sheet on mobile, right side panel on desktop */}
        <div
          className={cn(
            "pointer-events-auto w-full bg-white shadow-2xl transition-all duration-300 flex flex-col",
            // Mobile bottom sheet styles
            "max-h-[90vh] rounded-t-3xl border-t border-[#E7E2D8] animate-in slide-in-from-bottom duration-300",
            // Desktop right drawer styles
            "md:max-h-full md:rounded-t-none md:rounded-l-3xl md:border-l md:border-t-0 md:animate-in md:slide-in-from-right",
            widthStyles[width]
          )}
        >
          {/* Mobile grab handle */}
          <div className="md:hidden pt-3 pb-1 flex justify-center">
            <div className="w-10 h-1.5 bg-[#E7E2D8] rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E7E2D8] flex items-center justify-between shrink-0">
            <div>
              {title && <h3 className="text-lg font-bold text-[#181818]">{title}</h3>}
              {subtitle && <p className="text-xs text-[#6B655E] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#9E978E] hover:text-[#181818] hover:bg-[#FAF9F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

          {/* Optional Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-[#E7E2D8] bg-[#FAF9F5] shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
