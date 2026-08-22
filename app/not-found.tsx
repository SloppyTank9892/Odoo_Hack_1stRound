"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Globe2, Sparkles, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function NotFound() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F7F6F2] dark:bg-[#121210] text-[#181818] dark:text-[#F5F3EF] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden transition-colors select-none">
      {/* Background Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-15"
        style={{
          backgroundImage: `radial-gradient(#E7E2D8 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#F4A62A]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#76546F]/10 blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#F4A62A] flex items-center justify-center text-[#181818] shadow-xs group-hover:scale-105 transition-transform">
            <Globe2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-[#181818] dark:text-[#F5F3EF] block leading-none">
              GlobeTrotter
            </span>
            <span className="text-[11px] font-medium text-[#76546F] dark:text-[#B88BAF] tracking-wider uppercase block">
              Warm Explorer
            </span>
          </div>
        </Link>

        <ThemeToggle variant="icon" />
      </header>

      {/* Main Center Stage: Broken Globe & 404 Message */}
      <main className="relative z-10 max-w-xl mx-auto w-full my-auto text-center py-6 flex flex-col items-center justify-center">
        {/* Custom Broken Globe Vector Illustration */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mb-6">
          <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-md overflow-visible">
            <defs>
              <linearGradient id="globeGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F4A62A" />
                <stop offset="100%" stopColor="#B86E00" />
              </linearGradient>
              <linearGradient id="globeGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E09115" />
                <stop offset="100%" stopColor="#76546F" />
              </linearGradient>
              <filter id="crackGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#F4A62A" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Stand / Axis Base (Tilted slightly) */}
            <path
              d="M 120 195 L 120 220 M 85 220 L 155 220"
              stroke="currentColor"
              className="text-[#9E978E] dark:text-[#7A746B]"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Outer Meridian Arc Ring (Snapped at the top right) */}
            <path
              d="M 52 165 C 28 120, 36 65, 80 35 C 105 18, 135 18, 160 30"
              fill="none"
              stroke="currentColor"
              className="text-[#9E978E] dark:text-[#7A746B]"
              strokeWidth="3.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 68 180 C 100 205, 150 205, 185 175"
              fill="none"
              stroke="currentColor"
              className="text-[#9E978E] dark:text-[#7A746B]"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* --- LEFT FRACTURED GLOBE HALF --- */}
            <g transform="translate(-6, 2) rotate(-5 120 120)">
              <clipPath id="leftHalfClip">
                <path d="M 120 40 C 75 40, 40 75, 40 120 C 40 165, 75 200, 120 200 L 120 160 L 128 140 L 112 110 L 126 80 L 120 40 Z" />
              </clipPath>
              <circle cx="120" cy="120" r="75" fill="url(#globeGradLeft)" clipPath="url(#leftHalfClip)" />
              {/* Latitude & Longitude lines on left */}
              <g clipPath="url(#leftHalfClip)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none">
                <ellipse cx="120" cy="120" rx="40" ry="75" />
                <ellipse cx="120" cy="120" rx="75" ry="35" />
                <line x1="45" y1="120" x2="195" y2="120" />
              </g>
              {/* Continents Shape Silhouettes */}
              <path
                d="M 65 95 Q 85 85 95 105 T 75 140 Z M 80 155 Q 95 160 90 175 T 75 170 Z"
                fill="rgba(24, 24, 24, 0.25)"
                clipPath="url(#leftHalfClip)"
              />
            </g>

            {/* --- RIGHT FRACTURED GLOBE HALF (Shifted & Tilted away) --- */}
            <g transform="translate(10, -4) rotate(8 120 120)">
              <clipPath id="rightHalfClip">
                <path d="M 120 40 C 165 40, 200 75, 200 120 C 200 165, 165 200, 120 200 L 120 160 L 128 140 L 112 110 L 126 80 L 120 40 Z" />
              </clipPath>
              <circle cx="120" cy="120" r="75" fill="url(#globeGradRight)" clipPath="url(#rightHalfClip)" />
              {/* Latitude & Longitude lines on right */}
              <g clipPath="url(#rightHalfClip)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none">
                <ellipse cx="120" cy="120" rx="40" ry="75" />
                <ellipse cx="120" cy="120" rx="75" ry="35" />
                <line x1="45" y1="120" x2="195" y2="120" />
              </g>
              {/* Continents Shape Silhouettes */}
              <path
                d="M 140 85 Q 165 95 155 125 T 130 145 Z M 160 145 Q 175 155 170 170 T 150 165 Z"
                fill="rgba(24, 24, 24, 0.25)"
                clipPath="url(#rightHalfClip)"
              />
            </g>

            {/* --- THE FRACTURE / CRACK LIGHTNING --- */}
            <path
              d="M 115 42 L 124 78 L 110 112 L 128 138 L 114 165 L 124 200"
              fill="none"
              stroke="#FFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#crackGlow)"
            />

            {/* Floating Debris / Broken Shards */}
            <circle cx="108" cy="32" r="3.5" fill="#F4A62A" className="animate-pulse" />
            <circle cx="142" cy="28" r="2.5" fill="#F4A62A" />
            <path d="M 126 22 L 132 28 L 124 30 Z" fill="#E09115" />
            <circle cx="138" cy="210" r="3" fill="#F4A62A" />
            <circle cx="98" cy="208" r="2" fill="#76546F" />

            {/* Snapped Flight Route with "X" */}
            <path
              d="M 60 70 Q 90 40 115 55"
              fill="none"
              stroke="#C84B31"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            <path
              d="M 140 75 Q 165 60 185 85"
              fill="none"
              stroke="#C84B31"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            {/* Red "X" Break marker */}
            <g transform="translate(125, 62)">
              <line x1="-5" y1="-5" x2="5" y2="5" stroke="#C84B31" strokeWidth="3" strokeLinecap="round" />
              <line x1="5" y1="-5" x2="-5" y2="5" stroke="#C84B31" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Playful Band-Aid / Tape trying to hold the globe */}
            <g transform="translate(108, 140) rotate(-22)">
              <rect x="-16" y="-8" width="32" height="16" rx="4" fill="#FAF9F5" stroke="#D5CEBF" strokeWidth="1.5" />
              <circle cx="-6" cy="0" r="1" fill="#9E978E" />
              <circle cx="0" cy="0" r="1" fill="#9E978E" />
              <circle cx="6" cy="0" r="1" fill="#9E978E" />
            </g>
          </svg>

          {/* Bold 404 Badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#181818] dark:bg-[#F4A62A] text-white dark:text-[#181818] font-black text-sm px-3.5 py-1 rounded-full shadow-md tracking-wider">
            ERROR 404
          </div>
        </div>

        {/* Clear, bold headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold font-editorial text-[#181818] dark:text-[#F5F3EF] leading-tight mb-3">
          You Can&apos;t Plan a Trip Here
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#6B655E] dark:text-[#A8A196] font-medium max-w-md mx-auto mb-8">
          The globe cracked, the coordinates broke, or this destination hasn&apos;t been charted yet.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button
              size="md"
              leftIcon={<Home className="w-4 h-4 stroke-[2.2]" />}
              className="shadow-sm font-bold"
            >
              Back to Dashboard
            </Button>
          </Link>

          <Link href="/explore">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Compass className="w-4 h-4 text-[#F4A62A]" />}
            >
              Explore Valid Cities
            </Button>
          </Link>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between text-xs text-[#9E978E] dark:text-[#7A746B] border-t border-[#E7E2D8]/80 dark:border-[#33302B] pt-6">
        <span>GlobeTrotter Travel Planning Workspace</span>
        <Link href="/" className="hover:text-[#181818] dark:hover:text-[#F5F3EF] flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Return Home
        </Link>
      </footer>
    </div>
  );
}
