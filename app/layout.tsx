import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { TripProvider } from "@/context/TripContext";
import { ToastProvider } from "@/components/ui/Toast";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://globetrotter-travel.vercel.app"),
  title: "GlobeTrotter — Warm Modern Explorer",
  description: "A personalized, interactive travel planning workspace. Plan the journey, see the journey, share the journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F7F6F2] text-[#181818] selection:bg-[#FEF7EC] selection:text-[#E09115]">
        <TripProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </TripProvider>
      </body>
    </html>
  );
}
