"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe2, Sparkles, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("aarav.roy@globetrotter.travel");
  const [password, setPassword] = useState("••••••••••••");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: mode === "login" ? "Welcome back, Aarav!" : "Account Created!",
      description: "Entering your personalized travel workspace...",
      variant: "success",
    });
    router.push("/");
  };

  const handleGuestDemo = () => {
    toast({
      title: "Welcome Guest Explorer!",
      description: "Full access granted to all GlobeTrotter workspaces.",
      variant: "info",
    });
    router.push("/");
  };

  return (
    <div className="min-h-screen flex bg-[#F7F6F2]">
      {/* Left Visual Editorial Column (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#181818] p-12 flex-col justify-between text-white">
        <img
          src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80"
          alt="Rajasthan Palace"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Brand */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4A62A] flex items-center justify-center text-[#181818]">
              <Globe2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-lg text-white block leading-none">GlobeTrotter</span>
              <span className="text-xs text-[#F4A62A] font-semibold tracking-wider uppercase">Warm Explorer</span>
            </div>
          </Link>
        </div>

        {/* Editorial Quote */}
        <div className="relative z-10 max-w-lg">
          <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-base font-editorial italic text-white/95 leading-relaxed mb-4">
              “GlobeTrotter transformed our 12-day North India expedition. Changing stop durations and immediately seeing the budget and calendar re-align was magic.”
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F4A62A] text-[#181818] font-bold flex items-center justify-center text-sm">
                AR
              </div>
              <div>
                <p className="text-xs font-bold text-white">Aarav & Priya Roy</p>
                <p className="text-[11px] text-[#D5CEBF]">Explorer Members · 8 Trips Planned</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Auth Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E2D8] shadow-md">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 lg:hidden">
              <div className="w-8 h-8 rounded-xl bg-[#F4A62A] flex items-center justify-center text-[#181818]">
                <Globe2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-bold text-sm text-[#181818]">GlobeTrotter</span>
            </div>

            <h2 className="text-2xl font-bold font-editorial text-[#181818]">
              {mode === "login" ? "Welcome Back, Explorer" : "Join GlobeTrotter"}
            </h2>
            <p className="text-xs text-[#6B655E] mt-1">
              {mode === "login"
                ? "Enter your credentials to access your travel workspace."
                : "Create an account to build, organize, and share custom journeys."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#FAF9F5] p-1 rounded-xl border border-[#E7E2D8] mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                mode === "login" ? "bg-white text-[#181818] shadow-2xs" : "text-[#6B655E]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                mode === "signup" ? "bg-white text-[#181818] shadow-2xs" : "text-[#6B655E]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <Button size="lg" type="submit" className="w-full font-bold shadow-sm mt-2">
              {mode === "login" ? "Sign In to Workspace" : "Get Started Free"}
            </Button>
          </form>

          {/* 1-Click Guest Bypass */}
          <div className="pt-6 mt-6 border-t border-[#E7E2D8] text-center">
            <button
              onClick={handleGuestDemo}
              className="w-full py-2.5 px-4 bg-[#FEF7EC] hover:bg-[#FCD89C]/50 text-[#B86E00] border border-[#FCD89C] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Continue as Demo Guest Explorer</span>
            </button>

            <p className="text-[11px] text-[#9E978E] mt-3">
              Frontend prototype with live local state & mock datasets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
