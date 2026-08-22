"use client";

import React, { useState } from "react";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { TopBar } from "@/components/navigation/TopBar";
import { CreateTripModal } from "@/components/trip/CreateTripModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F7F6F2]">
      {/* Persistent Desktop Sidebar */}
      <DesktopSidebar onOpenCreateTrip={() => setIsCreateModalOpen(true)} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopBar onOpenCreateTrip={() => setIsCreateModalOpen(true)} />
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav onOpenCreateTrip={() => setIsCreateModalOpen(true)} />

      {/* Global Quick Create Trip Modal */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
