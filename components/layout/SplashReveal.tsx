"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2 } from "lucide-react";

interface SplashRevealProps {
  children: React.ReactNode;
}

type Phase = "curtain" | "text" | "lift" | "done";

/**
 * SplashReveal — "Editorial Curtain" first-load animation.
 *
 * Flow:
 *   1. Warm-ivory curtain fills the screen.
 *   2. "GlobeTrotter" in serif slides up from below centre.
 *   3. Text fades / shrinks while curtain begins to rise.
 *   4. The curtain slides upward like a stage reveal.
 *   5. Component unmounts, showing the real dashboard.
 *
 * Plays only once per browser session (sessionStorage gate).
 */
export function SplashReveal({ children }: SplashRevealProps) {
  const SESSION_KEY = "gt_splash_played";

  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window === "undefined") return "done";
    return sessionStorage.getItem(SESSION_KEY) ? "done" : "curtain";
  });

  useEffect(() => {
    if (phase === "done") return;

    sessionStorage.setItem(SESSION_KEY, "1");

    let timer: ReturnType<typeof setTimeout>;

    if (phase === "curtain") {
      timer = setTimeout(() => setPhase("text"), 400);
    } else if (phase === "text") {
      timer = setTimeout(() => setPhase("lift"), 1400);
    } else if (phase === "lift") {
      timer = setTimeout(() => setPhase("done"), 900);
    }

    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "done") {
    return <>{children}</>;
  }

  const showContent = phase === "text" || phase === "lift";

  return (
    <>
      {/* Main app, hidden behind the curtain — avoids layout flash */}
      <div className="opacity-0 pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* The Curtain */}
      <motion.div
        key="splash-curtain"
        className="fixed inset-0 z-[9999] bg-[#F7F6F2] flex flex-col items-center justify-center overflow-hidden"
        animate={phase === "lift" ? { y: "-100%" } : { y: "0%" }}
        transition={
          phase === "lift"
            ? { duration: 0.85, ease: [0.76, 0, 0.24, 1] }
            : { duration: 0 }
        }
      >
        {/* Noise grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Globe icon */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-14 h-14 rounded-3xl bg-[#F4A62A] flex items-center justify-center text-[#181818] mb-6 shadow-lg"
            >
              <Globe2 className="w-8 h-8 stroke-[2]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand headline */}
        <div className="overflow-hidden">
          <AnimatePresence>
            {showContent && (
              <motion.h1
                key="headline"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-20%", opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-7xl font-bold font-editorial text-[#181818] tracking-tight leading-none text-center"
              >
                GlobeTrotter
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Sub-tagline (only during text phase) */}
        <AnimatePresence>
          {phase === "text" && (
            <motion.p
              key="tagline"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
              className="text-sm text-[#9E978E] font-medium tracking-widest uppercase mt-4 text-center"
            >
              Warm Modern Explorer
            </motion.p>
          )}
        </AnimatePresence>

        {/* Amber progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-[#F4A62A]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.2, ease: "linear" }}
        />
      </motion.div>
    </>
  );
}
