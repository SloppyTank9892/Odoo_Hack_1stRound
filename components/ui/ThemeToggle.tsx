"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, Theme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "icon" | "segmented" | "cards";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("w-8 h-8 rounded-xl bg-white/50 border border-[#E7E2D8] dark:border-[#33302B] animate-pulse", className)} />
    );
  }

  // 1. Icon Toggle Variant (for TopBar & Header)
  if (variant === "icon") {
    return (
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
        title={`Switch to ${resolvedTheme === "light" ? "Dark (Midnight Explorer)" : "Light (Warm Ivory)"} mode`}
        className={cn(
          "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer select-none",
          "bg-white dark:bg-[#1E1E1E] border border-[#E7E2D8] dark:border-[#33302B] shadow-2xs hover:shadow-xs",
          "text-[#6B655E] hover:text-[#181818] dark:text-[#A8A196] dark:hover:text-[#F5F3EF]",
          "hover:border-[#D5CEBF] dark:hover:border-[#48443D] active:scale-95",
          className
        )}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="w-4 h-4 text-[#F4A62A] transition-transform duration-300 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-[#76546F] transition-transform duration-300 rotate-0 hover:-rotate-12" />
        )}
      </button>
    );
  }

  // 2. Segmented Pill Variant (for Headers or compact options)
  if (variant === "segmented") {
    return (
      <div
        className={cn(
          "inline-flex bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E7E2D8] dark:border-[#33302B] p-0.5 shadow-2xs text-xs",
          className
        )}
      >
        <button
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-semibold cursor-pointer",
            theme === "light"
              ? "bg-[#FEF7EC] dark:bg-[#2B2113] text-[#B86E00] dark:text-[#F4A62A] shadow-2xs"
              : "text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF]"
          )}
        >
          <Sun className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Light</span>
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-semibold cursor-pointer",
            theme === "dark"
              ? "bg-[#FEF7EC] dark:bg-[#2B2113] text-[#B86E00] dark:text-[#F4A62A] shadow-2xs"
              : "text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF]"
          )}
        >
          <Moon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dark</span>
        </button>

        <button
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-semibold cursor-pointer",
            theme === "system"
              ? "bg-[#FEF7EC] dark:bg-[#2B2113] text-[#B86E00] dark:text-[#F4A62A] shadow-2xs"
              : "text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF]"
          )}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">System</span>
        </button>
      </div>
    );
  }

  // 3. Visual Cards Variant (for Settings Page)
  const themeOptions: { id: Theme; label: string; desc: string; icon: typeof Sun }[] = [
    {
      id: "light",
      label: "Warm Ivory (Light)",
      desc: "Editorial journal style with soft ivory surfaces and warm charcoal accents",
      icon: Sun,
    },
    {
      id: "dark",
      label: "Midnight Explorer (Dark)",
      desc: "Warm obsidian and starlit campfire tones with glowing Sunset Amber highlights",
      icon: Moon,
    },
    {
      id: "system",
      label: "System Automatic",
      desc: "Synchronizes dynamically with your OS light/dark schedule",
      icon: Monitor,
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-3.5", className)}>
      {themeOptions.map((opt) => {
        const isSelected = theme === opt.id;
        const Icon = opt.icon;

        return (
          <div
            key={opt.id}
            onClick={() => setTheme(opt.id)}
            className={cn(
              "p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between select-none",
              isSelected
                ? "bg-[#FEF7EC] dark:bg-[#2B2113] border-[#FCD89C] dark:border-[#5E431E] shadow-2xs ring-1 ring-[#F4A62A]/40"
                : "bg-white dark:bg-[#1E1E1E] border-[#E7E2D8] dark:border-[#33302B] hover:border-[#D5CEBF] dark:hover:border-[#48443D]"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center",
                    isSelected
                      ? "bg-[#F4A62A] text-[#181818]"
                      : "bg-[#FAF9F5] dark:bg-[#282622] text-[#6B655E] dark:text-[#A8A196]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-[#181818] dark:text-[#F5F3EF]">
                  {opt.label}
                </h4>
              </div>
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center text-[10px]",
                  isSelected
                    ? "border-[#F4A62A] bg-[#F4A62A] text-[#181818] font-bold"
                    : "border-[#D5CEBF] dark:border-[#48443D] bg-transparent"
                )}
              >
                {isSelected && "✓"}
              </div>
            </div>
            <p className="text-[11px] text-[#6B655E] dark:text-[#A8A196] leading-relaxed">
              {opt.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
