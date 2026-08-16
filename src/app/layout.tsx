import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/config/env";
import "./globals.css";

/**
 * Fonts are self-hosted at build time by `next/font` — no runtime request to a
 * third party, which matters for an internal university system as much as it
 * does for performance.
 */
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/**
 * The one-sentence description of what this is.
 *
 * Written in plain, extractable language rather than marketing copy: answer
 * engines quote sentences that stand on their own, and "an onboarding and
 * knowledge platform for a university IT Help Desk" is a claim that survives
 * being lifted out of context. Reused across metadata, structured data, and
 * llms.txt so all three agree.
 */
const DESCRIPTION =
  "learnIT is an onboarding, training, and knowledge platform for a university IT Help Desk. New technicians get a structured curriculum; experienced technicians get a reference fast enough to search while a caller is on the phone.";

export const metadata: Metadata = {
  // Every relative URL in metadata — canonical, OG image, sitemap reference —
  // resolves against this, so it must be the domain actually served.
  metadataBase: new URL(siteUrl()),
  title: {
    default: "learnIT — Help Desk onboarding and knowledge platform",
    template: "%s · learnIT",
  },
  description: DESCRIPTION,
  applicationName: "learnIT",
  authors: [{ name: "Rian Fernando", url: "https://rianfernando.com" }],
  creator: "Rian Fernando",
  publisher: "Rian Fernando",
  keywords: [
    "help desk onboarding",
    "IT support training",
    "help desk knowledge base",
    "troubleshooting decision tree",
    "IT service desk documentation",
    "university IT support",
    "technician onboarding platform",
  ],
  category: "technology",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "learnIT",
    title: "learnIT — Help Desk onboarding and knowledge platform",
    description: DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "learnIT — Help Desk onboarding and knowledge platform",
    description: DESCRIPTION,
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b09" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8f4" },
  ],
  colorScheme: "dark light",
};

/**
 * Applies the stored theme before first paint.
 *
 * Runs synchronously, before the body renders, so there is no flash of the
 * wrong theme. It touches nothing but the root element's `data-theme`
 * attribute. Its SHA-256 hash is recorded in docs/security.md for deployments
 * that want a CSP without `unsafe-inline`.
 */
const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('learnit-theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) {}
})();
`;

/**
 * Both `suppressHydrationWarning` attributes are deliberate and narrow.
 *
 * `<html>` — the theme script above sets `data-theme` before React hydrates, so
 * the served markup and the DOM legitimately differ by one attribute.
 *
 * `<body>` — browser extensions (password managers, grammar checkers, reader
 * modes) routinely inject attributes onto the body element before hydration.
 * That is outside the application's control and must not surface as an error to
 * the user. The flag suppresses warnings for these two elements only; it does
 * not extend into the tree, so a genuine mismatch anywhere inside still reports.
 *
 * Note there is no hand-authored `<head>`: Next.js owns that element, and
 * rendering one alongside its metadata injection is itself a mismatch source.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${sans.variable} ${mono.variable} antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <a
          href="#main"
          className="sr-only rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-contrast focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
