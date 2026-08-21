import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config/env";

/**
 * robots.txt
 *
 * Two audiences, and they want opposite things from this file.
 *
 * **Search crawlers** need the public surface open and the private surface
 * clearly closed.
 *
 * **AI answer engines** (ChatGPT, Perplexity, Google AI Overviews, Claude) are
 * named explicitly rather than left to the wildcard. Several of them —
 * Google-Extended and Applebot-Extended in particular — are opt-out controls
 * that do nothing unless the agent is addressed by name, so the only way to
 * positively signal "yes, you may read and cite this" is to list them.
 *
 * What stays closed for everyone: API routes, the authenticated application,
 * the admin console, and sign-in. Those either require a session or are
 * machinery, and indexing them produces nothing but soft-404s and redirect
 * chains.
 */

/** Agents permitted to read and cite the public content. */
const AI_AGENTS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Claude-SearchBot",
  "Claude-User",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google / Apple AI training and grounding controls
  "Google-Extended",
  "Applebot-Extended",
  // Others
  "CCBot",
  "Amazonbot",
  "Bytespider",
  "cohere-ai",
  "Meta-ExternalAgent",
  "DuckAssistBot",
  "MistralAI-User",
];

/**
 * Paths no crawler should index. The authenticated application redirects
 * anonymous requests to sign-in, so crawling it yields redirect chains rather
 * than content.
 */
const DISALLOW = [
  "/api/",
  "/admin",
  "/signin",
  "/dashboard",
  "/knowledge",
  "/training",
  "/troubleshoot",
  "/responses",
  "/practice",
  "/progress",
  "/checklists",
  "/tickets",
  "/reference",
];

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
