import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journey Confirmed · Thank You",
  description: "Your trip itinerary has been created and synchronized in your workspace.",
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
