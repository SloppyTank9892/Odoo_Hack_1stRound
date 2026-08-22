"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Lock, Eye, Database, Globe2, Mail, MapPin } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export default function PrivacyPolicyPage() {
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
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#F4A62A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs font-semibold text-[#F4A62A] mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>Data Protection & Privacy</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-editorial text-white mb-2">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#D5CEBF] dark:text-[#A8A196]">
              Last updated: August 20, 2026 · Effective immediately for all GlobeTrotter explorers
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6 text-sm text-[#6B655E] dark:text-[#A8A196] leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white dark:bg-[#1C1B18] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] p-6 sm:p-8 shadow-2xs transition-colors">
            <div className="flex items-center gap-3 mb-3 text-[#181818] dark:text-[#F5F3EF]">
              <div className="w-8 h-8 rounded-xl bg-[#FEF7EC] dark:bg-[#2B2113] border border-[#FCD89C] dark:border-[#5E431E] flex items-center justify-center text-[#B86E00] dark:text-[#F4A62A]">
                <Database className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
                1. Information We Collect
              </h2>
            </div>
            <p className="mb-3">
              GlobeTrotter collects information necessary to build and synchronize your multi-city travel
              itineraries:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>Account Information:</strong> Name, email address, profile avatar, and display
                preferences when you register.
              </li>
              <li>
                <strong>Travel Itinerary Data:</strong> Custom trip names, selected stops, activity
                schedules, budget inputs, and expense estimates.
              </li>
              <li>
                <strong>Usage & Device Telemetry:</strong> Anonymized interaction metrics to ensure real-time
                itinerary calculators and maps function smoothly.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white dark:bg-[#1C1B18] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] p-6 sm:p-8 shadow-2xs transition-colors">
            <div className="flex items-center gap-3 mb-3 text-[#181818] dark:text-[#F5F3EF]">
              <div className="w-8 h-8 rounded-xl bg-[#FEF7EC] dark:bg-[#2B2113] border border-[#FCD89C] dark:border-[#5E431E] flex items-center justify-center text-[#B86E00] dark:text-[#F4A62A]">
                <Eye className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
                2. How We Use Your Data
              </h2>
            </div>
            <p className="mb-3">Your travel data is used exclusively to power the GlobeTrotter experience:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Generating and synchronizing day-by-day travel schedules and expense models.</li>
              <li>Providing personalized destination and activity recommendations based on your preferences.</li>
              <li>Enabling public read-only trip story sharing when you explicitly generate a share link.</li>
              <li>We never sell your personal data or travel itineraries to third-party advertisers.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white dark:bg-[#1C1B18] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] p-6 sm:p-8 shadow-2xs transition-colors">
            <div className="flex items-center gap-3 mb-3 text-[#181818] dark:text-[#F5F3EF]">
              <div className="w-8 h-8 rounded-xl bg-[#FEF7EC] dark:bg-[#2B2113] border border-[#FCD89C] dark:border-[#5E431E] flex items-center justify-center text-[#B86E00] dark:text-[#F4A62A]">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold font-editorial text-[#181818] dark:text-[#F5F3EF]">
                3. Data Security & Storage
              </h2>
            </div>
            <p className="text-xs sm:text-sm">
              All user itineraries and account records are encrypted in transit via TLS 1.3 and stored in
              secure PostgreSQL databases with Row-Level Security (RLS) policies. Only you have write
              access to modify your private itineraries.
            </p>
          </section>

          {/* Section 4: Contact */}
          <section className="bg-[#FAF9F5] dark:bg-[#24221E] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] p-6 sm:p-8 transition-colors">
            <h2 className="text-lg font-bold font-editorial text-[#181818] dark:text-[#F5F3EF] mb-2">
              4. Privacy Inquiries & Data Rights
            </h2>
            <p className="text-xs sm:text-sm mb-4">
              Under GDPR and applicable privacy regulations, you have the right to request export or deletion
              of all your stored itineraries and account information.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2 text-[#181818] dark:text-[#F5F3EF]">
                <Mail className="w-4 h-4 text-[#F4A62A]" />
                <span>privacy@globetrotter-travel.com</span>
              </div>
              <div className="flex items-center gap-2 text-[#181818] dark:text-[#F5F3EF]">
                <MapPin className="w-4 h-4 text-[#76546F] dark:text-[#B88BAF]" />
                <span>Suite 402, Connaught Place, New Delhi 110001</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
