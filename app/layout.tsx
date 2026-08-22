import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { TripProvider } from "@/context/TripContext";
import { ToastProvider } from "@/components/ui/Toast";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { Suspense } from "react";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#F4A62A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://globetrotter-travel.vercel.app"),
  title: {
    default: "GlobeTrotter — Personalized Travel Planning & Interactive Itinerary Platform",
    template: "%s | GlobeTrotter",
  },
  description:
    "Craft multi-city itineraries, synchronize dates & budgets in real time, and visualize your entire journey in one unified travel workspace.",
  keywords: [
    "travel planning",
    "multi-city itinerary",
    "trip planner",
    "travel budget calculator",
    "interactive travel map",
    "Rajasthan itinerary",
    "curated destinations",
    "itinerary builder",
  ],
  authors: [{ name: "GlobeTrotter Team" }],
  creator: "GlobeTrotter",
  publisher: "GlobeTrotter Travel Platforms",
  applicationName: "GlobeTrotter",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/favicon.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "GlobeTrotter",
    title: "GlobeTrotter — Personalized Travel Planning & Interactive Itinerary Platform",
    description:
      "Plan multi-city journeys, discover curated destinations, optimize budgets, and share interactive travel stories.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "GlobeTrotter — Warm Modern Explorer Travel Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobeTrotter — Personalized Travel Planning & Interactive Itinerary Platform",
    description:
      "Plan multi-city journeys, discover curated destinations, optimize budgets, and share interactive travel stories.",
    creator: "@globetrotter",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('globetrotter_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark) || (saved === 'system' && prefersDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F7F6F2] dark:bg-[#121210] text-[#181818] dark:text-[#F5F3EF] selection:bg-[#FEF7EC] dark:selection:bg-[#2B2113] selection:text-[#E09115] dark:selection:text-[#F4A62A]">
        <Suspense fallback={null}>
          <AnalyticsProvider>
            <ThemeProvider>
              <TripProvider>
                <ToastProvider>
                  {children}
                  <CookieBanner />
                </ToastProvider>
              </TripProvider>
            </ThemeProvider>
          </AnalyticsProvider>
        </Suspense>
      </body>
    </html>
  );
}
