"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Globe2,
  Sparkles,
  Compass,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Calendar,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface LandingRevealIntroProps {
  onComplete?: () => void;
  isRevealed: boolean;
  onReplay: () => void;
  onSkip: () => void;
}

interface DestinationNode {
  id: string;
  name: string;
  subtitle: string;
  stopNumber: string;
  tag: string;
  xPercent: number;
  yPercent: number;
}

const DESTINATION_NODES: DestinationNode[] = [
  {
    id: "delhi",
    name: "Delhi",
    subtitle: "Heritage & Capital Gate",
    stopNumber: "01",
    tag: "Start Point",
    xPercent: 12,
    yPercent: 55,
  },
  {
    id: "agra",
    name: "Agra",
    subtitle: "Mughal Splendor & Taj",
    stopNumber: "02",
    tag: "Heritage",
    xPercent: 38,
    yPercent: 32,
  },
  {
    id: "jaipur",
    name: "Jaipur",
    subtitle: "The Royal Pink City",
    stopNumber: "03",
    tag: "Palaces",
    xPercent: 64,
    yPercent: 68,
  },
  {
    id: "udaipur",
    name: "Udaipur",
    subtitle: "City of Lakes & Sunsets",
    stopNumber: "04",
    tag: "Lakeside",
    xPercent: 88,
    yPercent: 40,
  },
];

export function LandingRevealIntro({
  onComplete,
  isRevealed,
  onReplay,
  onSkip,
}: LandingRevealIntroProps) {
  const [animStage, setAnimStage] = useState<number>(0);
  const [isCurtainLifted, setIsCurtainLifted] = useState<boolean>(isRevealed);

  // Synchronize internal state when `isRevealed` prop changes
  useEffect(() => {
    if (isRevealed) {
      setIsCurtainLifted(true);
      setAnimStage(6);
    } else {
      setIsCurtainLifted(false);
      setAnimStage(0);
    }
  }, [isRevealed]);

  // Handle sequential animation timer
  useEffect(() => {
    if (isCurtainLifted) return;

    const timers: NodeJS.Timeout[] = [];

    // Stage 1: Delhi
    timers.push(
      setTimeout(() => {
        setAnimStage(1);
      }, 400)
    );

    // Stage 2: Agra
    timers.push(
      setTimeout(() => {
        setAnimStage(2);
      }, 850)
    );

    // Stage 3: Jaipur
    timers.push(
      setTimeout(() => {
        setAnimStage(3);
      }, 1300)
    );

    // Stage 4: Udaipur
    timers.push(
      setTimeout(() => {
        setAnimStage(4);
      }, 1750)
    );

    // Stage 5: Ready to unveil
    timers.push(
      setTimeout(() => {
        setAnimStage(5);
      }, 2200)
    );

    // Stage 6: Lift curtain
    timers.push(
      setTimeout(() => {
        setAnimStage(6);
        setIsCurtainLifted(true);
        if (onComplete) onComplete();
      }, 2600)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [isCurtainLifted, onComplete]);

  // Handle keyboard skip (Escape / Space / Enter)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isCurtainLifted) return;
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onSkip();
      }
    },
    [isCurtainLifted, onSkip]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const getStrokeDashoffset = () => {
    const totalLength = 760;
    switch (animStage) {
      case 0:
        return totalLength;
      case 1:
        return totalLength * 0.9;
      case 2:
        return totalLength * 0.62;
      case 3:
        return totalLength * 0.32;
      case 4:
      case 5:
      case 6:
        return 0;
      default:
        return totalLength;
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. EDITORIAL CURTAIN LAYER (Slides upward smoothly when revealed) */}
      {/* ========================================================================= */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col justify-between bg-[#F7F6F2] dark:bg-[#121210] overflow-hidden select-none transition-colors",
          "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isCurtainLifted
            ? "-translate-y-full pointer-events-none shadow-[0_24px_50px_rgba(24,24,24,0.3)]"
            : "translate-y-0 pointer-events-auto"
        )}
        style={{ willChange: "transform" }}
        aria-hidden={isCurtainLifted}
      >
        {/* Subtle Warm Journal Texture Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
          style={{
            backgroundImage: `radial-gradient(#E7E2D8 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient Warm Explorer Glow Accents */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#F4A62A]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[#76546F]/15 dark:bg-[#9D7395]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-[#F4A62A]/10 blur-3xl pointer-events-none" />

        {/* --- Top Navigation / Skip Bar --- */}
        <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
          {/* Logo */}
          <div
            className={cn(
              "flex items-center gap-3 transition-all duration-500 ease-out",
              animStage >= 1 ? "scale-95 opacity-90" : "scale-100 opacity-100"
            )}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#F4A62A] flex items-center justify-center text-[#181818] shadow-sm border border-[#FCD89C] dark:border-[#5E431E]">
              <Globe2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#181818] dark:text-[#F5F3EF] leading-none block">
                GlobeTrotter
              </span>
              <span className="text-[11px] font-medium text-[#76546F] dark:text-[#B88BAF] tracking-wider uppercase block">
                Warm Explorer
              </span>
            </div>
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle variant="icon" />

            <button
              onClick={onSkip}
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#1E1E1E]/90 hover:bg-white dark:hover:bg-[#282622] text-xs font-semibold text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF] border border-[#E7E2D8] dark:border-[#33302B] hover:border-[#D5CEBF] dark:hover:border-[#48443D] shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span>Skip to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F4A62A] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </header>

        {/* --- Main Center Editorial Stage --- */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 max-w-5xl mx-auto w-full my-auto text-center">
          {/* Tagline Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF7EC] dark:bg-[#2B2113] border border-[#FCD89C] dark:border-[#5E431E] text-xs font-semibold text-[#B86E00] dark:text-[#F4A62A] mb-5 shadow-2xs transition-all duration-500",
              animStage >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4A62A]" />
            <span>Curated Multi-City Travel Platform</span>
          </div>

          {/* Large Serif Headline */}
          <h1
            className={cn(
              "text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-editorial text-[#181818] dark:text-[#F5F3EF] leading-[1.15] mb-3 max-w-3xl mx-auto transition-all duration-500",
              animStage >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
          >
            Where are you traveling next?
          </h1>

          {/* Supporting Text */}
          <p
            className={cn(
              "text-sm sm:text-base md:text-lg text-[#6B655E] dark:text-[#A8A196] font-medium max-w-xl mx-auto mb-8 sm:mb-12 transition-all duration-500 delay-75",
              animStage >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            Plan the journey. Experience the story.
          </p>

          {/* --- FLIGHT PATH & DESTINATION NODES CONTAINER --- */}
          <div className="w-full max-w-4xl bg-white/90 dark:bg-[#1C1B18]/95 backdrop-blur-md rounded-3xl border border-[#E7E2D8] dark:border-[#33302B] p-5 sm:p-8 shadow-[0_4px_24px_rgba(24,24,24,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative transition-colors">
            {/* Header Mini Label inside the Path Card */}
            <div className="flex items-center justify-between border-b border-[#E7E2D8]/80 dark:border-[#33302B] pb-3 mb-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F4A62A] animate-pulse" />
                <span className="font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider text-[11px]">
                  Featured Itinerary Route · Rajasthan Circuit
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#76546F] dark:text-[#B88BAF] font-semibold">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#9E978E] dark:text-[#7A746B]" /> 8 Days
                </span>
                <span className="inline-flex items-center gap-1">
                  <Wallet className="w-3 h-3 text-[#9E978E] dark:text-[#7A746B]" /> ₹47,200 Est.
                </span>
              </div>
            </div>

            {/* SVG Flight Path Stage */}
            <div className="relative w-full h-36 sm:h-44">
              {/* Responsive SVG Route Line */}
              <svg
                viewBox="0 0 800 160"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Amber Gradient for Flight Path */}
                  <linearGradient id="flightAmberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F4A62A" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#F4A62A" stopOpacity="1" />
                    <stop offset="100%" stopColor="#E09115" stopOpacity="1" />
                  </linearGradient>
                  {/* Subtle Route Glow Filter */}
                  <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#F4A62A" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* Base Faint Track (Dashed Background Line) */}
                <path
                  d="M 96 88 C 180 32, 220 40, 304 51 C 388 62, 430 115, 512 108 C 594 101, 625 54, 704 64"
                  fill="none"
                  stroke="currentColor"
                  className="text-[#E7E2D8] dark:text-[#33302B]"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />

                {/* Animated Amber Flight Path Line */}
                <path
                  d="M 96 88 C 180 32, 220 40, 304 51 C 388 62, 430 115, 512 108 C 594 101, 625 54, 704 64"
                  fill="none"
                  stroke="url(#flightAmberGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="760"
                  strokeDashoffset={getStrokeDashoffset()}
                  filter="url(#amberGlow)"
                  className="transition-[stroke-dashoffset] duration-450 ease-out"
                />
              </svg>

              {/* 4 Interactive Sequential Destination Nodes */}
              {DESTINATION_NODES.map((node, index) => {
                const isActive = animStage >= index + 1;
                const isCurrentHead = animStage === index + 1;

                return (
                  <div
                    key={node.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group pointer-events-auto"
                    style={{
                      left: `${node.xPercent}%`,
                      top: `${node.yPercent}%`,
                    }}
                  >
                    {/* Node Dot / Pin */}
                    <div className="relative flex items-center justify-center">
                      {/* Pulsing Ripple when newly reached */}
                      {isCurrentHead && (
                        <span className="absolute -inset-2 rounded-full bg-[#F4A62A]/30 animate-ping" />
                      )}

                      {/* Outer Ring */}
                      <div
                        className={cn(
                          "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-400 border-2 shadow-xs",
                          isActive
                            ? "bg-white dark:bg-[#1E1E1E] border-[#F4A62A] scale-100"
                            : "bg-[#FAF9F5] dark:bg-[#201F1B] border-[#D5CEBF] dark:border-[#48443D] scale-90 opacity-60"
                        )}
                      >
                        {/* Inner Core */}
                        <div
                          className={cn(
                            "w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-300",
                            isActive ? "bg-[#F4A62A] shadow-xs" : "bg-[#D5CEBF] dark:bg-[#48443D]"
                          )}
                        />
                      </div>
                    </div>

                    {/* Node Text & Tag (Staggered Fade-in) */}
                    <div
                      className={cn(
                        "mt-2 text-center transition-all duration-400 whitespace-nowrap",
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2 pointer-events-none"
                      )}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-[10px] font-bold text-[#F4A62A]">
                          {node.stopNumber}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#181818] dark:text-[#F5F3EF] font-editorial">
                          {node.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#76546F] dark:text-[#B88BAF] font-medium hidden sm:block">
                        {node.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status / Completion Indicator */}
            <div className="mt-4 pt-3 border-t border-[#E7E2D8] dark:border-[#33302B] flex items-center justify-between text-xs text-[#6B655E] dark:text-[#A8A196]">
              <div className="flex items-center gap-2">
                <Compass
                  className={cn(
                    "w-4 h-4 text-[#F4A62A] transition-transform duration-500",
                    animStage >= 4 ? "rotate-45" : "animate-spin"
                  )}
                />
                <span className="font-medium">
                  {animStage < 4
                    ? `Mapping journey stop ${Math.max(1, animStage)} of 4...`
                    : "Journey route synchronized · Unveiling workspace"}
                </span>
              </div>

              {animStage >= 4 && (
                <div className="flex items-center gap-1.5 text-[#1B8755] dark:text-[#34D399] font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ready</span>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* --- Footer Status / Hint --- */}
        <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between text-xs text-[#9E978E] dark:text-[#7A746B] border-t border-[#E7E2D8]/60 dark:border-[#33302B]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B8755] dark:bg-[#34D399]" />
            <span>Interactive Travel Planning Workspace</span>
          </div>
          <div className="text-[11px] font-medium">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1E1E1E] border border-[#E7E2D8] dark:border-[#33302B] text-[#181818] dark:text-[#F5F3EF] font-mono text-[10px]">Esc</kbd> or click anywhere to reveal
          </div>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* 2. REPLAY INTRO FLOATING TRIGGER (Accessible, positioned without collisions) */}
      {/* ========================================================================= */}
      {isCurtainLifted && (
        <button
          onClick={onReplay}
          title="Replay Flight Path Intro"
          className="fixed bottom-20 md:bottom-6 left-6 md:left-72 z-30 flex items-center gap-2 bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-md hover:bg-[#FEF7EC] dark:hover:bg-[#2B2113] text-[#181818] dark:text-[#F5F3EF] border border-[#E7E2D8] dark:border-[#33302B] hover:border-[#FCD89C] dark:hover:border-[#5E431E] px-3.5 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 group active:scale-95 cursor-pointer text-xs font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#F4A62A] group-hover:-rotate-90 transition-transform duration-300" />
          <span className="text-[#6B655E] dark:text-[#A8A196] group-hover:text-[#181818] dark:group-hover:text-[#F5F3EF]">Replay Intro</span>
        </button>
      )}
    </>
  );
}
