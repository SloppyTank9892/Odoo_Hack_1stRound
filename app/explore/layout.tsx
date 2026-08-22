import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Destinations & Top Activities",
  description:
    "Discover handpicked destinations, local cultural landmarks, and activities with cost estimates, popularity ratings, and suggested durations.",
  openGraph: {
    title: "Explore Destinations & Top Activities | GlobeTrotter",
    description:
      "Discover handpicked destinations, local cultural landmarks, and activities with cost estimates and suggested durations.",
  },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
