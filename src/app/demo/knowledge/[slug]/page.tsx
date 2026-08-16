import type { Metadata } from "next";
import { ArticleScreen, knowledgeStaticParams } from "@/features/knowledge/knowledge-screens";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/structured-data";
import { CATEGORY_LABELS } from "@/lib/content/schema";
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
    ? {
        title: article.title,
        description: article.summary,
        alternates: { canonical: `/demo/knowledge/${slug}` },
        openGraph: {
          title: article.title,
          description: article.summary,
          url: `/demo/knowledge/${slug}`,
          type: "article",
        },
      }
    : { title: "Article not found" };
}

export default async function DemoArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(GUEST_VIEWER, slug);

  return (
    <>
      {article ? (
        <>
          <ArticleSchema
            title={article.title}
            description={article.summary}
            path={`/demo/knowledge/${slug}`}
            updatedAt={article.updatedAt}
            section={CATEGORY_LABELS[article.category]}
          />
          <BreadcrumbSchema
            trail={[
              { name: "learnIT", path: "/" },
              { name: "Demo", path: "/demo/dashboard" },
              { name: "Knowledge Base", path: "/demo/knowledge" },
              { name: article.title, path: `/demo/knowledge/${slug}` },
            ]}
          />
        </>
      ) : null}
      <ArticleScreen viewer={GUEST_VIEWER} slug={slug} basePath="/demo" />
    </>
  );
}
