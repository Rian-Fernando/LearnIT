import type { Metadata } from "next";
import { ArticleScreen } from "@/features/knowledge/knowledge-screens";
import { requireStaff } from "@/lib/auth";
import { getArticle } from "@/lib/content/repository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const viewer = await requireStaff();
  const article = await getArticle(viewer, slug);
  return article
    ? { title: article.title, description: article.summary }
    : { title: "Article not found" };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const viewer = await requireStaff({ returnTo: `/knowledge/${slug}` });
  return <ArticleScreen viewer={viewer} slug={slug} />;
}
