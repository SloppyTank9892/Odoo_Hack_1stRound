import React from "react";
import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Skeleton */}
      <div className="bg-[#181818] rounded-3xl p-8 sm:p-10 space-y-4">
        <Skeleton className="h-6 w-40 bg-white/20 rounded-full" />
        <Skeleton className="h-10 w-3/4 max-w-lg bg-white/20 rounded-xl" />
        <Skeleton className="h-5 w-1/2 max-w-md bg-white/10 rounded-lg" />
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-12 w-36 bg-[#F4A62A]/40 rounded-xl" />
          <Skeleton className="h-12 w-36 bg-white/10 rounded-xl" />
        </div>
      </div>

      {/* Highlights Bar Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E7E2D8] p-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-28" />
          </div>
        ))}
      </div>

      {/* Grid Skeletons */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
