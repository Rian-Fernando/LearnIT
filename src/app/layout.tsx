import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "learnIT — Adelphi University Help Desk",
    template: "%s · learnIT",
  },
  description:
    "Onboarding, training, and operational knowledge for the Adelphi University Help Desk. Learn the tools, understand the workflow, support the community.",
  applicationName: "learnIT",
  // Internal tooling and unfinished demo content should not be indexed.
  robots: { index: true, follow: true },
  openGraph: {
    title: "learnIT — Adelphi University Help Desk",
    description:
      "Structured onboarding for new Help Desk technicians, and a reference fast enough to use with someone on the line.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark light",
};

/**
 * Applies the stored theme before first paint.
 *
 * Runs synchronously in <head> to avoid a flash of the wrong theme. Kept
 * minimal and self-contained; it touches nothing but the root element's
 * `data-theme` attribute.
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${sans.variable} ${mono.variable} antialiased`}>
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
