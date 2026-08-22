"use client";

import React, { useState } from "react";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { TopBar } from "@/components/navigation/TopBar";
import { CreateTripModal } from "@/components/trip/CreateTripModal";

interface AppShellProps {
  children: React.ReactNode;
  noScroll?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function AppShell({
  children,
  noScroll = false,
  fullWidth = false,
  className = "",
}: AppShellProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="h-screen h-[100dvh] flex bg-[#F7F6F2] overflow-hidden">
      {/* Persistent Desktop Sidebar */}
      <DesktopSidebar onOpenCreateTrip={() => setIsCreateModalOpen(true)} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <div className="flex-shrink-0 z-20">
          <TopBar onOpenCreateTrip={() => setIsCreateModalOpen(true)} />
        </div>

        {noScroll ? (
          <div className={`flex-1 flex flex-col min-h-0 overflow-hidden relative ${className}`}>
            {children}
          </div>
        ) : (
          <main
            className={`flex-1 overflow-y-auto min-h-0 px-4 sm:px-8 py-6 sm:py-8 pb-24 md:pb-8 w-full ${fullWidth ? "" : "max-w-7xl mx-auto"
              } ${className}`}
          >
            {children}
          </main>
        )}
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
