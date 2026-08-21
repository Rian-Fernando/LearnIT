import type { MetadataRoute } from "next";
import { GUEST_VIEWER } from "@/lib/auth/types";
import { siteUrl } from "@/lib/config/env";
import {
  listArticles,
  listChecklists,
  listFlows,
  listModules,
  listScenarios,
  listSystems,
} from "@/lib/content/repository";

/**
 * sitemap.xml
 *
 * Built from the content repository with the guest viewer, so it lists exactly
 * what an anonymous visitor can reach — the same filter the pages themselves
 * apply. An internal procedure cannot appear here even by accident, because the
 * repository never returns it for this viewer.
 *
 * `lastModified` uses each record's real review date rather than the build
 * time, so a crawler can tell which procedures actually changed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const [articles, modules, flows, scenarios, systems, checklists] =
    await Promise.all([
      listArticles(GUEST_VIEWER),
      listModules(GUEST_VIEWER),
      listFlows(GUEST_VIEWER),
      listScenarios(GUEST_VIEWER),
      listSystems(GUEST_VIEWER),
      listChecklists(GUEST_VIEWER),
    ]);

  const asDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/guide`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/guide/ticket-basics`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/guide/systems`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/guide/bookmarks`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/demo/dashboard`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/demo/knowledge`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/demo/training`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/demo/troubleshoot`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/demo/responses`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/demo/practice`, changeFrequency: "weekly", priority: 0.7 },
  ];

  return [
    ...staticRoutes,
    ...systems.map((system) => ({
      url: `${base}/guide/systems/${system.slug}`,
      lastModified: asDate(system.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...checklists.map((checklist) => ({
      url: `${base}/guide/checklists/${checklist.slug}`,
      lastModified: asDate(checklist.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: `${base}/demo/knowledge/${article.slug}`,
      lastModified: asDate(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...modules.map((entry) => ({
      url: `${base}/demo/training/${entry.slug}`,
      lastModified: asDate(entry.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...flows.map((flow) => ({
      url: `${base}/demo/troubleshoot/${flow.slug}`,
      lastModified: asDate(flow.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...scenarios.map((scenario) => ({
      url: `${base}/demo/practice/${scenario.slug}`,
      lastModified: asDate(scenario.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
