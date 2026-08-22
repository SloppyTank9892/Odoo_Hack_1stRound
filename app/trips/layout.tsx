import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Trips & Itineraries",
  description:
    "Manage, customize, and view your upcoming, active, and past multi-city travel plans in one unified workspace.",
  openGraph: {
    title: "My Trips & Itineraries | GlobeTrotter",
    description: "Manage your multi-city travel plans, stops, and budgets in GlobeTrotter.",
  },
};

export default function TripsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
