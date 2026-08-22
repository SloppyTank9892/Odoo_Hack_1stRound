"use client";

import React from "react";

interface SplashRevealProps {
  children: React.ReactNode;
}

/**
 * SplashReveal — Passthrough wrapper without curtain delays.
 */
export function SplashReveal({ children }: SplashRevealProps) {
  return <>{children}</>;
}
