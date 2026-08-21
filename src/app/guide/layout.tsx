import type { Metadata } from "next";
import { GuideChrome } from "@/features/guide/guide-chrome";

export const metadata: Metadata = {
  title: { default: "Guide", template: "%s · learnIT guide" },
};

/**
 * The no-sign-in guide.
 *
 * This is the part of learnIT a new technician can reach with nothing but a
 * link: how a ticket is put together, what to collect on a call, which systems
 * exist, and a bookmark file to import.
 *
 * It is deliberately lighter than the application shell — no sidebar, no
 * command palette, no progress context. Someone reading this has learnIT open
 * as one of many tabs, so the page should cost as little as a document.
 */
export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-base">
      <GuideChrome />
      <main id="main">{children}</main>
    </div>
  );
}
