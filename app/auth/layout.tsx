import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In & Register",
  description: "Sign in to GlobeTrotter to synchronize your travel itineraries, save custom routes, and collaborate on trips.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
