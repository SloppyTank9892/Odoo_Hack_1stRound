"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextType {
  toast: (t: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "success", actionLabel, onAction }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, title, description, variant, actionLabel, onAction };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto p-4 rounded-2xl border shadow-lg flex items-start gap-3 bg-white dark:bg-[#1C1B18] text-[#181818] dark:text-[#F5F3EF] animate-in slide-in-from-bottom-5 duration-200 transition-colors",
              t.variant === "success" && "border-[#BDE3CF] dark:border-[#1E4B33] bg-[#FAFDFB] dark:bg-[#12241A]",
              t.variant === "error" && "border-[#F8CEC4] dark:border-[#4B1E1A] bg-[#FDFAF9] dark:bg-[#251211]",
              t.variant === "info" && "border-[#BDD8F2] dark:border-[#1E3B5C] bg-[#FAFCFE] dark:bg-[#0E2038]"
            )}
          >
            {t.variant === "success" && <CheckCircle2 className="w-5 h-5 text-[#1B8755] dark:text-[#34D399] shrink-0 mt-0.5" />}
            {t.variant === "error" && <AlertCircle className="w-5 h-5 text-[#C84B31] dark:text-[#F87171] shrink-0 mt-0.5" />}
            {t.variant === "info" && <Info className="w-5 h-5 text-[#2B6CB0] dark:text-[#60A5FA] shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[#181818] dark:text-[#F5F3EF]">{t.title}</h4>
              {t.description && <p className="text-xs text-[#6B655E] dark:text-[#A8A196] mt-0.5">{t.description}</p>}
              {t.actionLabel && t.onAction && (
                <button
                  onClick={() => {
                    t.onAction?.();
                    removeToast(t.id);
                  }}
                  className="mt-2 text-xs font-semibold text-[#F4A62A] hover:underline cursor-pointer"
                >
                  {t.actionLabel} →
                </button>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              aria-label="Close notification"
              className="text-[#9E978E] hover:text-[#181818] dark:hover:text-[#F5F3EF] p-1 -mr-1 -mt-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
