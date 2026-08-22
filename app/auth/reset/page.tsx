"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Mail, ArrowLeft, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

// Assume this server action exists (per task constraints)
async function resetPasswordForEmail(email: string): Promise<{ success: boolean; error?: string }> {
  // Stub — wired to real server action in backend layer
  await new Promise((r) => setTimeout(r, 1200));
  if (!email.includes("@")) return { success: false, error: "Invalid email address." };
  return { success: true };
}

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const result = await resetPasswordForEmail(email.trim());

      if (!result.success) {
        toast({
          title: "Reset Failed",
          description: result.error || "Could not send reset link. Please try again.",
          variant: "error",
        });
        return;
      }

      setIsSent(true);
      toast({
        title: "Reset Link Sent!",
        description: "Check your inbox — a secure password reset link is on its way.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again in a moment.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-6">
      {/* Subtle decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#F4A62A]/8 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#76546F]/8 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Link href="/auth" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-[#F4A62A] flex items-center justify-center text-[#181818] group-hover:scale-105 transition-transform">
              <Globe2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-bold text-base text-[#181818] leading-none">GlobeTrotter</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E7E2D8] shadow-md p-8 sm:p-10">
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {/* Header */}
                <div className="mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-[#FEF7EC] border border-[#FCD89C] flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-[#F4A62A]" />
                  </div>
                  <h1 className="text-2xl font-bold font-editorial text-[#181818] text-center">
                    Forgot your password?
                  </h1>
                  <p className="text-xs text-[#6B655E] mt-2 text-center leading-relaxed">
                    No worries. Enter your email and we&apos;ll send a secure link to reset it instantly.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#9E978E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-sm text-[#181818] placeholder-[#9E978E] focus:outline-none focus:ring-2 focus:ring-[#F4A62A] transition-shadow"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading || !email.trim()}
                    className="w-full font-bold shadow-sm"
                    leftIcon={
                      isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )
                    }
                  >
                    {isLoading ? "Sending reset link..." : "Send Reset Link"}
                  </Button>
                </form>

                {/* Back link */}
                <div className="mt-6 text-center">
                  <Link
                    href="/auth"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B655E] hover:text-[#181818] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Sign In
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="text-center py-4"
              >
                {/* Success icon with pulse ring */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="absolute inset-0 rounded-full bg-[#DCFCE7] opacity-60"
                  />
                  <div className="relative w-full h-full rounded-full bg-[#F0FDF4] border-2 border-[#86EFAC] flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-[#1B8755]" />
                  </div>
                </div>

                <h2 className="text-xl font-bold font-editorial text-[#181818] mb-2">
                  Check your inbox!
                </h2>
                <p className="text-xs text-[#6B655E] leading-relaxed max-w-xs mx-auto mb-6">
                  A password reset link has been sent to{" "}
                  <span className="font-bold text-[#181818]">{email}</span>. It expires in 15 minutes.
                </p>

                <div className="p-3 rounded-xl bg-[#FEF7EC] border border-[#FCD89C] text-[11px] text-[#B86E00] font-medium mb-6 text-left flex gap-2 items-start">
                  <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>
                    If you don&apos;t see it, check your spam/junk folder. The email is sent from{" "}
                    <em>noreply@globetrotter.travel</em>
                  </span>
                </div>

                <Link href="/auth">
                  <Button variant="outline" size="sm" className="w-full" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                    Return to Sign In
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
