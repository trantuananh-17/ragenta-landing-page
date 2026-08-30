import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Rendered per request so the sitemap/host URLs reflect the runtime SITE_URL.
export const dynamic = "force-dynamic";

const aiCrawlerUserAgents = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiCrawlerUserAgents.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
