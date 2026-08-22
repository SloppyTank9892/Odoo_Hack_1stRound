"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useTrips } from "@/context/TripContext";
import { getPublicTrips, PublicTripItem } from "@/app/actions/trips";
import { getAuthUser } from "@/app/actions/auth";
import { formatCurrency } from "@/lib/tripCalculations";
import {
  BookOpen,
  Compass,
  Search,
  Sparkles,
  Calendar,
  MapPin,
  Copy,
  ArrowRight,
  User,
  Check,
  Loader2,
  Globe2,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function PublicStoriesPage() {
  const router = useRouter();
  const { copyTrip, currency } = useTrips();
  const { toast } = useToast();

  const [publicTrips, setPublicTrips] = useState<PublicTripItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copyingId, setCopyingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [authRes, tripsRes] = await Promise.all([
          getAuthUser(),
          getPublicTrips(),
        ]);

        if (authRes.success && authRes.data) {
          setCurrentUserId(authRes.data.id);
        }

        if (tripsRes.success && tripsRes.data) {
          setPublicTrips(tripsRes.data);
        }
      } catch (err) {
        console.warn("Could not load public stories:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredStories = publicTrips.filter((story) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const matchTitle = story.title.toLowerCase().includes(q);
    const matchDesc = (story.description || "").toLowerCase().includes(q);
    const matchCity = story.cities_preview.some((c) => c.toLowerCase().includes(q));
    const matchAuthor = story.author_name.toLowerCase().includes(q);
    return matchTitle || matchDesc || matchCity || matchAuthor;
  });

  const handleCopyStory = async (e: React.MouseEvent, story: PublicTripItem) => {
    e.preventDefault();
    e.stopPropagation();

    setCopyingId(story.id);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });

    try {
      const cloned = await copyTrip(story.id);
      toast({
        title: "Trip Copied to Workspace!",
        description: `"${story.title}" was duplicated into your personal trips collection.`,
        variant: "success",
        actionLabel: "Open Workspace",
        onAction: () => router.push(`/trips/${cloned.id}`),
      });

      setTimeout(() => {
        router.push(`/trips/${cloned.id}`);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to copy trip.";
      toast({
        title: "Copy Failed",
        description: msg,
        variant: "error",
      });
    } finally {
      setCopyingId(null);
    }
  };

  return (
    <AppShell>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#181818] dark:bg-[#1C1B18] text-white p-6 sm:p-10 mb-8 border border-[#2D2A26] dark:border-[#33302B] shadow-md">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#F4A62A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4A62A] animate-pulse" />
            <span className="text-xs uppercase font-bold text-[#F4A62A] tracking-wider">
              Community Gallery
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-editorial leading-tight mb-3">
            Public Travel Stories &amp; Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-[#D5CEBF] mb-6 leading-relaxed">
            Discover handcrafted journeys shared by travelers. Read immersive day-by-day stories, explore interactive routes, and clone any itinerary directly into your workspace.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg">
            <Search className="w-4 h-4 text-[#9E978E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination (e.g. Kyoto, Amalfi), title, or creator..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F4A62A] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#F4A62A] animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B655E] dark:text-[#A8A196]">
            Loading Community Stories...
          </p>
        </div>
      ) : filteredStories.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#76546F] dark:text-[#B88BAF]">
              Published Itineraries ({filteredStories.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => {
              const isOwner = currentUserId === story.user_id;
              const coverImg =
                story.cover_image_url ||
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";

              return (
                <Card
                  key={story.id}
                  className="overflow-hidden p-0 flex flex-col justify-between group hover:shadow-md transition-all duration-300 border-[#E7E2D8] dark:border-[#33302B]"
                  hover
                >
                  {/* Top Cover Image */}
                  <Link href={`/share/${story.id}`} className="block relative h-48 sm:h-52 overflow-hidden">
                    <img
                      src={coverImg}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <Badge variant="amber" size="sm">
                        {story.stops_count} {story.stops_count === 1 ? "Stop" : "Stops"}
                      </Badge>
                      {isOwner && (
                        <span className="bg-[#1B8755] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          Your Story
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-base sm:text-lg font-editorial leading-tight line-clamp-1">
                        {story.title}
                      </h3>
                      <p className="text-[11px] text-[#D5CEBF] line-clamp-1 mt-0.5">
                        {story.description || "A personalized travel itinerary"}
                      </p>
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-[#1C1B18] transition-colors">
                    {/* Route Breadcrumb */}
                    <div className="mb-4">
                      <span className="block text-[10px] uppercase font-bold text-[#9E978E] dark:text-[#7A746B] tracking-wider mb-1.5">
                        Route Destinations
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#181818] dark:text-[#F5F3EF]">
                        {story.cities_preview.length > 0 ? (
                          story.cities_preview.slice(0, 3).map((city, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FAF9F5] dark:bg-[#24221E] rounded-md border border-[#E7E2D8] dark:border-[#33302B] text-[11px]"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F4A62A]" />
                              {city}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#9E978E] dark:text-[#7A746B] text-[11px]">Custom Journey</span>
                        )}
                        {story.cities_preview.length > 3 && (
                          <span className="text-[10px] text-[#76546F] dark:text-[#B88BAF] font-bold">
                            +{story.cities_preview.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Creator Info & Action Bar */}
                    <div className="pt-3 border-t border-[#E7E2D8] dark:border-[#33302B] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {story.author_avatar ? (
                          <img
                            src={story.author_avatar}
                            alt={story.author_name}
                            className="w-6 h-6 rounded-full object-cover border border-[#E7E2D8] dark:border-[#33302B]"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#76546F] text-white flex items-center justify-center text-[10px] font-bold">
                            {story.author_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs text-[#6B655E] dark:text-[#A8A196] truncate font-medium">
                          {story.author_name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isOwner ? (
                          <Link href={`/trips/${story.id}`}>
                            <Button size="sm" variant="outline" className="text-xs h-8 border-[#E7E2D8] dark:border-[#33302B]">
                              Edit Trip
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            size="sm"
                            onClick={(e) => handleCopyStory(e, story)}
                            disabled={copyingId === story.id}
                            leftIcon={
                              copyingId === story.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )
                            }
                            className="text-xs h-8 shadow-2xs font-bold"
                          >
                            Copy Trip
                          </Button>
                        )}
                        <Link href={`/share/${story.id}`}>
                          <button
                            title="Read Public Story"
                            className="p-1.5 rounded-lg text-[#6B655E] dark:text-[#A8A196] hover:text-[#181818] dark:hover:text-[#F5F3EF] hover:bg-[#FAF9F5] dark:hover:bg-[#24221E] border border-transparent hover:border-[#E7E2D8] dark:hover:border-[#33302B] transition-colors cursor-pointer"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <Card className="text-center py-16 px-6 bg-white dark:bg-[#1C1B18] max-w-lg mx-auto border-[#E7E2D8] dark:border-[#33302B]">
          <div className="w-16 h-16 rounded-full bg-[#FEF7EC] dark:bg-[#2B2113] text-[#F4A62A] flex items-center justify-center mx-auto mb-4 border border-[#FCD89C] dark:border-[#5E431E]">
            <BookOpen className="w-8 h-8 stroke-[2]" />
          </div>
          <h3 className="text-xl font-bold font-editorial text-[#181818] dark:text-[#F5F3EF] mb-1">
            {searchQuery ? "No stories found" : "No public stories published yet"}
          </h3>
          <p className="text-xs sm:text-sm text-[#6B655E] dark:text-[#A8A196] mb-6 max-w-xs mx-auto">
            {searchQuery
              ? `No itineraries matched "${searchQuery}". Try a different keyword or destination.`
              : "Be the first to share your journey! Open your trip workspace and click 'Make Public' to publish your itinerary to the community."}
          </p>
          <Button onClick={() => router.push("/trips")} leftIcon={<Compass className="w-4 h-4" />}>
            Go to My Trips
          </Button>
        </Card>
      )}
    </AppShell>
  );
}
