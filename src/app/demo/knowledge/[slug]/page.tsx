import type { Metadata } from "next";
import { ArticleScreen, knowledgeStaticParams } from "@/features/knowledge/knowledge-screens";
import { GUEST_VIEWER } from "@/lib/auth/types";
import { getArticle } from "@/lib/content/repository";

export const dynamicParams = false;

export function generateStaticParams() {
  return knowledgeStaticParams(GUEST_VIEWER);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(GUEST_VIEWER, slug);
  return article
    ? { title: article.title, description: article.summary }
    : { title: "Article not found" };
}

export default async function DemoArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleScreen viewer={GUEST_VIEWER} slug={slug} basePath="/demo" />;
}
