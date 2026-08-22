"use client";

import React from "react";
import Link from "next/link";
import { Globe2, MapPin, Mail, Phone, Clock, Shield, Sparkles, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[#E7E2D8] dark:border-[#33302B] bg-white dark:bg-[#181816] text-[#181818] dark:text-[#F5F3EF] pt-12 pb-16 sm:pb-12 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#E7E2D8]/80 dark:border-[#33302B]">
          {/* Col 1 & 2: Brand & Physical Address */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-9 h-9 rounded-2xl bg-[#F4A62A] flex items-center justify-center text-[#181818] shadow-xs group-hover:scale-105 transition-transform">
                <Globe2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-[#181818] dark:text-[#F5F3EF] block leading-none">
                  GlobeTrotter
                </span>
                <span className="text-[11px] font-medium text-[#76546F] dark:text-[#B88BAF] tracking-wider uppercase block">
                  Warm Explorer Workspace
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#6B655E] dark:text-[#A8A196] leading-relaxed max-w-sm">
              Personalized multi-city travel planning, real-time date and budget synchronization, and
              interactive itinerary design.
            </p>

            {/* Real Physical Address */}
            <div className="bg-[#FAF9F5] dark:bg-[#201F1B] border border-[#E7E2D8] dark:border-[#33302B] rounded-2xl p-4 space-y-2 text-[11px] text-[#6B655E] dark:text-[#A8A196] max-w-sm">
              <div className="flex items-start gap-2 text-[#181818] dark:text-[#F5F3EF] font-semibold">
                <MapPin className="w-4 h-4 text-[#F4A62A] shrink-0 mt-0.5" />
                <span>GlobeTrotter Technologies Pvt. Ltd.</span>
              </div>
              <p className="pl-6 text-[#6B655E] dark:text-[#A8A196]">
                4th Floor, Regus Statesman House, Barakhamba Road, Connaught Place, New Delhi, Delhi 110001, India
              </p>
              <div className="pl-6 pt-1 space-y-1 text-[#6B655E] dark:text-[#A8A196]">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#76546F] dark:text-[#B88BAF]" />
                  <span>support@globetrotter-travel.com</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#76546F] dark:text-[#B88BAF]" />
                  <span>+91 (011) 4982-3400 / +1 (415) 890-3200</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#9E978E] dark:text-[#7A746B]" />
                  <span>Mon – Sat: 09:00 – 20:00 IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Exploration */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#181818] dark:text-[#F5F3EF] font-editorial">
              Planning Workspaces
            </h4>
            <ul className="space-y-2 text-[#6B655E] dark:text-[#A8A196]">
              <li>
                <Link href="/" className="hover:text-[#F4A62A] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trips" className="hover:text-[#F4A62A] transition-colors">
                  My Trips
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-[#F4A62A] transition-colors">
                  Explore Destinations
                </Link>
              </li>
              <li>
                <Link href="/thank-you" className="hover:text-[#F4A62A] transition-colors">
                  Journey Confirmation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Tools */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#181818] dark:text-[#F5F3EF] font-editorial">
              Platform & Features
            </h4>
            <ul className="space-y-2 text-[#6B655E] dark:text-[#A8A196]">
              <li>
                <Link href="/settings" className="hover:text-[#F4A62A] transition-colors">
                  Preferences & Currency
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#F4A62A] transition-colors">
                  Admin Analytics
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-[#F4A62A] transition-colors">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Privacy */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#181818] dark:text-[#F5F3EF] font-editorial">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-[#6B655E] dark:text-[#A8A196]">
              <li>
                <Link href="/privacy" className="hover:text-[#F4A62A] transition-colors flex items-center gap-1">
                  <span>Privacy Policy</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#F4A62A] transition-colors flex items-center gap-1">
                  <span>Terms of Service</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EDF7F2] dark:bg-[#132D20] text-[#1B8755] dark:text-[#34D399] font-bold text-[10px]">
                  <Shield className="w-3 h-3" /> SSL 256-Bit Encrypted
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#9E978E] dark:text-[#7A746B]">
          <p>© {new Date().getFullYear()} GlobeTrotter Travel Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#181818] dark:hover:text-[#F5F3EF]">
              Privacy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-[#181818] dark:hover:text-[#F5F3EF]">
              Terms
            </Link>
            <span>·</span>
            <Link href="/explore" className="hover:text-[#181818] dark:hover:text-[#F5F3EF]">
              Atlas
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
