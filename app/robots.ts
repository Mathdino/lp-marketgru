import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Meta-ExternalAgent",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/painel", "/private/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt"],
        disallow,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: ["/", "/llms.txt"],
        disallow,
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
