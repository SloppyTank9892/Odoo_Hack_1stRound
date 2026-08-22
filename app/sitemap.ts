import { MetadataRoute } from "next";
import { curatedDestinations } from "@/data/curatedDestinations";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://globetrotter-travel.vercel.app";
  const currentDate = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/explore`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/trips`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/share`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/auth`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/thank-you`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Explore curated destination paths
  const destinationRoutes: MetadataRoute.Sitemap = curatedDestinations.map((dest) => ({
    url: `${siteUrl}/explore?city=${encodeURIComponent(dest.name)}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...destinationRoutes];
}
