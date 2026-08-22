import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Analytics & Platform Insights",
  description: "Platform usage analytics, popular destinations, activity trends, and system telemetry.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
