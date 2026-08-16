import { siteUrl } from "@/lib/config/env";

/**
 * JSON-LD structured data.
 *
 * Two consumers: Google (rich results) and AI answer engines, which use
 * structured data to decide what a page *is* before deciding whether to cite
 * it. The FAQ block in particular tends to be quoted close to verbatim, so the
 * answers are written as complete, standalone sentences.
 *
 * Serialised with a JSON-escape guard on `<` so a stray character in content
 * can never close the script tag early. The payloads here are authored, not
 * user input, but the guard costs nothing and removes the failure mode.
 */

const AUTHOR = {
  "@type": "Person",
  name: "Rian Fernando",
  url: "https://rianfernando.com",
} as const;

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Identifies the product itself. */
export function ApplicationSchema() {
  const base = siteUrl();

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "@id": `${base}/#application`,
        name: "learnIT",
        alternateName: "learnIT Help Desk Platform",
        url: base,
        description:
          "learnIT is an onboarding, training, and knowledge platform for a university IT Help Desk. It gives new technicians a structured curriculum and gives experienced technicians a reference fast enough to search while a caller is on the phone.",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Knowledge Management",
        operatingSystem: "Any modern web browser",
        browserRequirements: "Requires JavaScript for the interactive experience.",
        author: AUTHOR,
        creator: AUTHOR,
        publisher: AUTHOR,
        inLanguage: "en",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        featureList: [
          "Searchable Help Desk knowledge base with review dates on every procedure",
          "Guided troubleshooting decision trees",
          "Structured onboarding modules with knowledge checks",
          "Copy-ready quick responses with fill-in placeholders",
          "Realistic practice scenarios with per-decision feedback",
          "Onboarding progress tracking",
          "Admin console with content health analytics and a documentation review queue",
        ],
        screenshot: `${base}/opengraph-image`,
        softwareHelp: `${base}/about`,
        codeRepository: "https://github.com/Rian-Fernando/LearnIT",
        isPartOf: {
          "@type": "WebSite",
          name: "Rian Fernando",
          url: "https://rianfernando.com",
        },
      }}
    />
  );
}

/**
 * Questions people actually ask about this project, answered in full sentences.
 *
 * Kept to six. A long FAQ dilutes which answers get surfaced, and each of these
 * corresponds to something a reader genuinely needs to know before they can
 * evaluate the project.
 */
export function FaqSchema() {
  const base = siteUrl();

  const faqs: { question: string; answer: string }[] = [
    {
      question: "What is learnIT?",
      answer:
        "learnIT is an onboarding, training, and knowledge platform built for a university IT Help Desk. New technicians use it as a structured curriculum for their first weeks on the job, experienced technicians use it as a fast reference while assisting a caller, and Help Desk leadership uses it to keep documented procedures current without needing a developer.",
    },
    {
      question: "Who is learnIT for?",
      answer:
        "learnIT is built for three groups: new Help Desk employees learning the role, experienced Help Desk technicians who need to find a procedure in seconds during a support call, and Help Desk administrators who maintain the documentation, training modules, and troubleshooting workflows.",
    },
    {
      question: "Is learnIT free to use, and do I need an account?",
      answer:
        "The public demo is free and requires no account. It contains a sanitised, entirely fictional version of the platform so anyone can explore how it works. The full application, which holds internal Help Desk procedures, requires an authenticated staff account.",
    },
    {
      question: "How does learnIT keep Help Desk documentation from going out of date?",
      answer:
        "Every record displays when it was last reviewed and by whom. Any technician can flag a page as outdated in one click, which creates a review item for Help Desk leadership. The admin console surfaces procedures that have not been reviewed in over four months and highlights any page flagged by more than one person, since independent reports about the same page are the strongest signal that something has drifted.",
    },
    {
      question: "How does authentication and access control work in learnIT?",
      answer:
        "learnIT has no password field and no user table. Authentication is delegated to an external identity provider over OpenID Connect, currently Google and Microsoft Entra ID, and a user's role is derived from directory group membership or a configured allowlist rather than asserted by the browser. Visibility filtering happens inside the content repository rather than in individual pages, so a page that fails to check permissions still cannot serve internal documentation.",
    },
    {
      question: "What technology is learnIT built with?",
      answer:
        "learnIT is built with Next.js using the App Router, React, and TypeScript in strict mode, styled with Tailwind CSS v4. The landing page uses Three.js and React Three Fiber for a scroll-driven narrative. Content is typed data validated by Zod at build time, search runs client-side with MiniSearch, and sessions and OpenID Connect tokens are handled with jose. It is deployed on Vercel.",
    },
  ];

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${base}/#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }}
    />
  );
}

/** Breadcrumb trail, used on interior pages. */
export function BreadcrumbSchema({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  const base = siteUrl();

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${base}${crumb.path}`,
        })),
      }}
    />
  );
}

/** Marks a knowledge base article as a technical article. */
export function ArticleSchema({
  title,
  description,
  path,
  updatedAt,
  section,
}: {
  title: string;
  description: string;
  path: string;
  updatedAt: string;
  section: string;
}) {
  const base = siteUrl();

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: title,
        description,
        url: `${base}${path}`,
        dateModified: updatedAt,
        articleSection: section,
        author: AUTHOR,
        publisher: AUTHOR,
        inLanguage: "en",
        isAccessibleForFree: true,
        isPartOf: { "@type": "WebApplication", "@id": `${base}/#application` },
      }}
    />
  );
}
