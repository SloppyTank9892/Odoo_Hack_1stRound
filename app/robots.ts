import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://globetrotter-travel.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/explore", "/trips", "/share/", "/privacy", "/terms", "/thank-you"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
