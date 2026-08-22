import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorer Settings & Preferences",
  description: "Customize your currency, display preferences, account profile, and saved travel destinations.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
