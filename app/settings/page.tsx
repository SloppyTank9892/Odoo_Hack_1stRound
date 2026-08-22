"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTrips } from "@/context/TripContext";
import { useToast } from "@/components/ui/Toast";
import { Check, Save, Upload, Loader2, User } from "lucide-react";
import { updateProfile, getAuthUser } from "@/app/actions/auth";
import { uploadMedia } from "@/app/actions/storage";
import { PreferencesForm } from "@/components/settings/PreferencesForm";

export default function SettingsPage() {
  const { currency, setCurrency } = useTrips();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [pacing, setPacing] = useState<"relaxed" | "balanced" | "fast">("balanced");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      const res = await getAuthUser();
      if (res.success && res.data) {
        if (res.data.email) setEmail(res.data.email);
        if (res.data.profile) {
          const p = res.data.profile;
          if (p.first_name) setFirstName(p.first_name);
          if (p.last_name) setLastName(p.last_name);
          if (p.phone_number) setPhoneNumber(p.phone_number);
          if (p.city) setCity(p.city);
          if (p.country) setCountry(p.country);
          if (p.bio) setBio(p.bio);
          if (p.avatar_url) setAvatarUrl(p.avatar_url);
        }
      }
      setIsLoaded(true);
    }
    loadUserData();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const uploadRes = await uploadMedia(file, "avatars");
      if (uploadRes.success && uploadRes.data?.url) {
        setAvatarUrl(uploadRes.data.url);
        toast({
          title: "Avatar Uploaded!",
          description: "New profile photo uploaded successfully.",
          variant: "success",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: uploadRes.error || "Could not upload avatar image.",
          variant: "error",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error.";
      toast({
        title: "Upload Error",
        description: msg,
        variant: "error",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("first_name", firstName.trim());
    formData.append("last_name", lastName.trim());
    formData.append("phone_number", phoneNumber.trim());
    formData.append("city", city.trim());
    formData.append("country", country.trim());
    formData.append("bio", bio.trim());
    if (avatarUrl) formData.append("avatar_url", avatarUrl);

    try {
      const res = await updateProfile(formData);
      if (res.success) {
        toast({
          title: "Preferences Saved!",
          description: "Your traveler profile settings have been updated and synchronized.",
          variant: "success",
        });
      } else {
        toast({
          title: "Update Failed",
          description: res.error || "Could not save profile preferences.",
          variant: "error",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save error.";
      toast({
        title: "Preferences Error",
        description: msg,
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = firstName || lastName ? `${firstName} ${lastName}`.trim() : email ? email.split("@")[0] : "Traveler";
  const displayInitial = firstName ? firstName.charAt(0).toUpperCase() : email ? email.charAt(0).toUpperCase() : "T";

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold font-editorial text-[#181818]">
              Traveler Profile & Preferences
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#6B655E]">
            Customize your default pacing, preferred currencies, and planning preferences
          </p>
        </div>

        {/* Currency & Preferences Card */}
        <PreferencesForm />

        {/* Profile Card */}
        <Card className="p-6 bg-white border-[#E7E2D8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2D8]">
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#E7E2D8] shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#76546F] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                    {displayInitial}
                  </div>
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#181818]">
                  {displayName}
                </h3>
                <p className="text-xs text-[#6B655E]">{email || "No email linked"}</p>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-[#B86E00] bg-[#FEF7EC] px-2 py-0.5 rounded border border-[#FCD89C]">
                  Explorer Tier
                </span>
              </div>
            </div>

            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#EFECE6] border border-[#E7E2D8] text-xs font-bold text-[#181818] transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{avatarUrl ? "Change Photo" : "Upload Avatar"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Morgan"
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +1 555 123 4567"
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                readOnly
                value={email}
                placeholder="Sign in to view email"
                className="w-full px-3.5 py-2.5 bg-[#F0EFEA] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#6B655E] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
                City of Origin
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. London"
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. United Kingdom"
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
                Bio & Travel Persona
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your travel style, preferred cuisines, and dream destinations..."
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181818] uppercase tracking-wider mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E2D8] rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#F4A62A]"
              >
                <option value="₹">₹ INR (Indian Rupee)</option>
                <option value="$">$ USD (US Dollar)</option>
                <option value="€">€ EUR (Euro)</option>
                <option value="£">£ GBP (British Pound)</option>
                <option value="¥">¥ JPY (Japanese Yen)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Travel Pacing & Style */}
        <Card className="p-6 bg-white border-[#E7E2D8]">
          <h3 className="text-base font-bold font-editorial text-[#181818] mb-1">
            Travel Pacing Preference
          </h3>
          <p className="text-xs text-[#6B655E] mb-4">
            Determines how many activities are suggested per day when crafting new itineraries
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "relaxed" as const, label: "Relaxed & Slow", desc: "1-2 activities/day with open cafe hours" },
              { id: "balanced" as const, label: "Balanced Explorer", desc: "2-3 activities/day with cultural focus" },
              { id: "fast" as const, label: "Action-Packed", desc: "4+ activities/day maximizing monument visits" },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setPacing(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  pacing === item.id
                    ? "bg-[#FEF7EC] border-[#FCD89C] shadow-2xs"
                    : "bg-[#FAF9F5] border-[#E7E2D8] hover:border-[#D5CEBF]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-xs sm:text-sm text-[#181818]">{item.label}</h4>
                  {pacing === item.id && <Check className="w-4 h-4 text-[#B86E00]" />}
                </div>
                <p className="text-[11px] text-[#6B655E]">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Save CTA */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            leftIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {isSaving ? "Saving Preferences..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
