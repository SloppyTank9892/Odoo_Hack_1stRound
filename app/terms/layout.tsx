import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "GlobeTrotter Terms of Service: Guidelines, intellectual property rights, and platform usage policies.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
