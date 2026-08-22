"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Trip } from "@/types/trip";
import { useToast } from "@/components/ui/Toast";
import { Copy, Check, Share2, MessageCircle, Send, QrCode } from "lucide-react";

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

export function SocialShareModal({ isOpen, onClose, trip }: SocialShareModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share/${trip.id}`
    : `https://globetrotter.travel/share/${trip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "Public travel story link is in your clipboard.",
      variant: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Check out my customized travel itinerary for "${trip.name}" on GlobeTrotter: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(`Planning my next journey: ${trip.name} with @GlobeTrotter! Check out the live itinerary:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#F4A62A]" />
          <span>Share Travel Story</span>
        </div>
      }
      description="Anyone with this link can view this read-only editorial itinerary."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Copy Link Field */}
        <div>
          <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-1.5">
            Public Web Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full px-3.5 py-2.5 bg-[#FAF9F5] dark:bg-[#24221E] border border-[#E7E2D8] dark:border-[#33302B] rounded-xl text-xs font-mono text-[#181818] dark:text-[#F5F3EF] focus:outline-none"
            />
            <Button
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-[#1B8755] dark:text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div>
          <label className="block text-xs font-bold text-[#181818] dark:text-[#F5F3EF] uppercase tracking-wider mb-2">
            Direct Social Sharing
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-[#BDE3CF] dark:border-[#1E4B33] bg-[#EDF7F2] dark:bg-[#132D20] hover:bg-[#DDF0E6] text-xs font-bold text-[#1B8755] dark:text-[#34D399] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleTwitter}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-[#BDD8F2] dark:border-[#1E3A5F] bg-[#EEF5FC] dark:bg-[#142847] hover:bg-[#DEECF9] text-xs font-bold text-[#2B6CB0] dark:text-[#60A5FA] transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>X / Twitter</span>
            </button>
          </div>
        </div>

        {/* QR Code Demo Box */}
        <div className="p-4 bg-[#FAF9F5] dark:bg-[#24221E] rounded-2xl border border-[#E7E2D8] dark:border-[#33302B] flex items-center gap-4">
          <div className="w-14 h-14 bg-white dark:bg-[#1C1B18] rounded-xl border border-[#E7E2D8] dark:border-[#33302B] flex items-center justify-center text-[#181818] dark:text-[#F5F3EF] shrink-0 shadow-2xs">
            <QrCode className="w-9 h-9" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#181818] dark:text-[#F5F3EF]">Mobile Pass QR</h5>
            <p className="text-[11px] text-[#6B655E] dark:text-[#A8A196]">
              Share Code: <code className="font-bold text-[#76546F] dark:text-[#B88BAF]">{trip.shareCode}</code>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
