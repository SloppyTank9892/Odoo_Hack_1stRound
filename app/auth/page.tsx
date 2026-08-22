"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe2, Sparkles, AlertCircle, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { signIn, signUp, signInAsGuest } from "@/app/actions/auth";

function AuthFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { toast } = useToast();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password);
    if (mode === "signup") {
      formData.append("first_name", firstName.trim());
      formData.append("last_name", lastName.trim());
    }

    try {
      if (mode === "login") {
        const result = await signIn(formData);
        if (!result.success) {
          const errMsg = result.error || "Authentication failed. Please check your credentials.";
          setErrorMessage(errMsg);
          toast({
            title: "Sign In Failed",
            description: errMsg,
            variant: "error",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "Welcome Back!",
          description: "Entering your personalized travel workspace...",
          variant: "success",
        });
      } else {
        const result = await signUp(formData);
        if (!result.success) {
          const errMsg = result.error || "Could not complete account setup.";
          setErrorMessage(errMsg);
          toast({
            title: "Account Creation Failed",
            description: errMsg,
            variant: "error",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "Account Created!",
          description: "Welcome to GlobeTrotter! Launching your workspace...",
          variant: "success",
        });
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      toast({
        title: "Authentication Error",
        description: msg,
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  const handleGuestDemo = async () => {
    setIsGuestLoading(true);
    try {
      const result = await signInAsGuest();
      if (!result.success) {
        toast({
          title: "Guest Session Active",
          description: "Entering workspace in guest explorer mode.",
          variant: "info",
        });
      } else {
        toast({
          title: "Welcome Guest Explorer!",
          description: "Full access granted to all GlobeTrotter workspaces.",
          variant: "success",
        });
      }
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Entering workspace...";
      toast({
        title: "Welcome Guest Explorer!",
        description: msg,
        variant: "info",
      });
      router.push(redirectTo);
      router.refresh();
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F7F6F2] dark:bg-[#121210] transition-colors">
      {/* Left Visual Editorial Column */}
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
              “GlobeTrotter transformed our expedition planning. Changing stop durations and immediately seeing the budget and calendar re-align in real time was magic.”
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F4A62A] text-[#181818] font-bold flex items-center justify-center text-sm">
                EV
              </div>
              <div>
                <p className="text-xs font-bold text-white">Elena &amp; Marcus Vance</p>
                <p className="text-[11px] text-[#D5CEBF]">Explorer Members · 8 Trips Planned</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Auth Form Column */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white dark:bg-[#1C1B18] p-8 sm:p-10 rounded-3xl border border-[#E7E2D8] dark:border-[#33302B] shadow-md transition-colors">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 lg:hidden">
              <div className="w-8 h-8 rounded-xl bg-[#F4A62A] flex items-center justify-center text-[#181818]">
                <Globe2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-bold text-sm text-[#181818] dark:text-[#F5F3EF]">GlobeTrotter</span>
            </div>

            <h2 className="text-2xl font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
              {mode === "login" ? "Welcome Back, Explorer" : "Join GlobeTrotter"}
            </h2>
            <p className="text-xs text-[#6B655E] dark:text-[#A8A196] mt-1">
              {mode === "login"
                ? "Enter your credentials to access your travel workspace."
                : "Create an account to build, organize, and share custom journeys."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#FAF9F5] dark:bg-[#24221E] p-1 rounded-xl border border-[#E7E2D8] dark:border-[#33302B] mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                mode === "login"
                  ? "bg-white dark:bg-[#1C1B18] text-[#181818] dark:text-[#F5F3EF] shadow-2xs"
                  : "text-[#6B655E] dark:text-[#A8A196]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                mode === "signup"
                  ? "bg-white dark:bg-[#1C1B18] text-[#181818] dark:text-[#F5F3EF] shadow-2xs"
                  : "text-[#6B655E] dark:text-[#A8A196]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Inline Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FFF5F5] dark:bg-[#3A1713] border border-[#FED7D7] dark:border-[#5C231B] flex items-start gap-2.5 text-xs text-[#C53030] dark:text-[#F87171]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-xs sm:text-sm text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Morgan"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-xs sm:text-sm text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-xs sm:text-sm text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider">
                  Password
                </label>
                {mode === "login" && (
                  <Link
                    href="/auth/reset"
                    className="text-[10px] font-bold text-[#76546F] dark:text-[#B88BAF] hover:text-[#F4A62A] transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-xs sm:text-sm text-[#181818] dark:text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-[#9E978E] dark:text-[#7A746B]">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Minimum 6 characters required.</span>
              </div>
            </div>

            <Button
              size="lg"
              type="submit"
              disabled={isLoading || isGuestLoading}
              className="w-full font-bold shadow-sm mt-2"
              leftIcon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              {isLoading
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Sign In to Workspace"
                  : "Get Started Free"}
            </Button>
          </form>

          {/* 1-Click Guest Bypass */}
          <div className="pt-6 mt-6 border-t border-[#E7E2D8] dark:border-[#33302B] text-center">
            <button
              type="button"
              onClick={handleGuestDemo}
              disabled={isLoading || isGuestLoading}
              className="w-full py-2.5 px-4 bg-[#FEF7EC] dark:bg-[#2B2113] hover:bg-[#FCD89C]/50 dark:hover:bg-[#3D2C17] text-[#B86E00] dark:text-[#F4A62A] border border-[#FCD89C] dark:border-[#5E431E] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isGuestLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#B86E00] dark:text-[#F4A62A]" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isGuestLoading ? "Entering as Demo Guest..." : "Continue as Demo Guest Explorer"}</span>
            </button>

            <p className="text-[11px] text-[#9E978E] dark:text-[#7A746B] mt-3">
              Full workspace access with live dynamic calculations &amp; Supabase sync.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#121210] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#F4A62A] animate-spin" />
        </div>
      }
    >
      <AuthFormContent />
    </Suspense>
  );
}
