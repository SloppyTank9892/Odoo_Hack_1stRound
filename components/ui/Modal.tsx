"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}: ModalProps) {
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

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#181818]/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          "relative w-full bg-white dark:bg-[#1C1B18] text-[#181818] dark:text-[#F5F3EF] rounded-2xl sm:rounded-3xl border border-[#E7E2D8] dark:border-[#33302B] shadow-[0_20px_50px_rgba(24,24,24,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-10 animate-in zoom-in-95 duration-200 transition-colors",
          maxWidthStyles[maxWidth]
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-[#E7E2D8] dark:border-[#33302B] flex items-start justify-between gap-4">
            <div>
              {title && <h3 className="text-lg font-bold text-[#181818] dark:text-[#F5F3EF]">{title}</h3>}
              {description && <p className="text-xs sm:text-sm text-[#6B655E] dark:text-[#A8A196] mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-full text-[#9E978E] hover:text-[#181818] dark:hover:text-[#F5F3EF] hover:bg-[#FAF9F5] dark:hover:bg-[#282622] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
