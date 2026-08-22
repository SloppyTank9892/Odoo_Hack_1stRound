"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, CheckCircle2, AlertCircle, HelpCircle, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export default function TermsOfServicePage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto py-4 sm:py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#76546F] dark:text-[#B88BAF] hover:text-[#181818] dark:hover:text-[#F5F3EF] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Hero Header */}
        <div className="bg-[#181818] dark:bg-[#1C1B18] text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-md relative overflow-hidden border border-transparent dark:border-[#33302B]">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#76546F]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs font-semibold text-[#F4A62A] mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Platform Terms & Guidelines</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-editorial text-white mb-2">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-[#D5CEBF] dark:text-[#A8A196]">
              Last updated: August 20, 2026 · Governing all usage of GlobeTrotter planning workspaces
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6 text-sm text-[#6B655E] dark:text-[#A8A196] leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white dark:bg-[#1C1B18] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] p-6 sm:p-8 shadow-2xs transition-colors">
            <div className="flex items-center gap-3 mb-3 text-[#181818] dark:text-[#F5F3EF]">
              <div className="w-8 h-8 rounded-xl bg-[#FEF7EC] dark:bg-[#2B2113] border border-[#FCD89C] dark:border-[#5E431E] flex items-center justify-center text-[#B86E00] dark:text-[#F4A62A]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
                1. Acceptance of Terms
              </h2>
            </div>
            <p className="text-xs sm:text-sm">
              By accessing or using GlobeTrotter, creating travel itineraries, or sharing journey plans, you
              agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any
              part of these terms, please do not use our workspace.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white dark:bg-[#1C1B18] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] p-6 sm:p-8 shadow-2xs transition-colors">
            <div className="flex items-center gap-3 mb-3 text-[#181818] dark:text-[#F5F3EF]">
              <div className="w-8 h-8 rounded-xl bg-[#FEF7EC] dark:bg-[#2B2113] border border-[#FCD89C] dark:border-[#5E431E] flex items-center justify-center text-[#B86E00] dark:text-[#F4A62A]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
                2. Scope of Service & Planning Tooling
              </h2>
            </div>
            <p className="text-xs sm:text-sm mb-3">
              GlobeTrotter is a travel planning and interactive itinerary workspace designed to simplify
              multi-city travel organization, schedule modeling, and budget estimates:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>Planning vs. Booking:</strong> GlobeTrotter does not directly issue airline tickets,
                hotel reservations, or event vouchers. Estimated prices are provided as planning benchmarks.
              </li>
              <li>
                <strong>Price Accuracy:</strong> Estimated costs, activity fees, and transit rates are
                calculated using curated regional benchmarks and user inputs, subject to seasonal market fluctuation.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white dark:bg-[#1C1B18] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] p-6 sm:p-8 shadow-2xs transition-colors">
            <div className="flex items-center gap-3 mb-3 text-[#181818] dark:text-[#F5F3EF]">
              <div className="w-8 h-8 rounded-xl bg-[#FEF7EC] dark:bg-[#2B2113] border border-[#FCD89C] dark:border-[#5E431E] flex items-center justify-center text-[#B86E00] dark:text-[#F4A62A]">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
                3. User Accounts & Shared Itineraries
              </h2>
            </div>
            <p className="text-xs sm:text-sm mb-3">
              When creating public shared itineraries, you grant GlobeTrotter the right to display your
              curated stop names, notes, and activity lists in read-only format for fellow travelers.
            </p>
            <p className="text-xs sm:text-sm">
              You agree not to upload abusive, defamatory, or copyright-infringing content to your trip
              descriptions or custom activity notes.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-[#FAF9F5] dark:bg-[#24221E] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] p-6 sm:p-8 transition-colors">
            <h2 className="text-lg font-bold font-editorial text-[#181818] dark:text-[#F5F3EF] mb-2">
              4. Contact & Legal Support
            </h2>
            <p className="text-xs sm:text-sm mb-4">
              For questions regarding our platform terms, copyright inquiries, or commercial partnerships:
            </p>
            <p className="text-xs font-semibold text-[#181818] dark:text-[#F5F3EF]">
              GlobeTrotter Travel Technologies Pvt. Ltd. · legal@globetrotter-travel.com
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
