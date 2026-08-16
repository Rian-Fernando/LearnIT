import type { Metadata } from "next";
import {
  LandingClosing,
  LandingFooter,
  LandingHeader,
  LandingHero,
} from "@/components/landing/landing-chrome";
import { LandingExperience } from "@/components/landing/landing-experience";
import { LandingFaq } from "@/components/landing/landing-faq";
import { ApplicationSchema, FaqSchema } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  // The homepage owns the bare product name; interior pages use the template.
  title: "learnIT — Help Desk onboarding and knowledge platform",
  description:
    "learnIT is an onboarding, training, and knowledge platform for a university IT Help Desk. Structured training for new technicians, searchable procedures and guided troubleshooting for experienced ones. Explore the free public demo — no account needed.",
  alternates: { canonical: "/" },
};

/**
 * Public homepage.
 *
 * Server-rendered end to end. The only client JavaScript is the narrative
 * experience, which decides for itself whether this visitor should get the
 * cinematic version — see `landing-experience.tsx`.
 *
 * Document outline: one `<h1>` in the hero, then `<h2>` per narrative act, the
 * FAQ, and the closing call to action. Every word of the story is real DOM
 * above the canvas, so the page reads completely with JavaScript disabled.
 */
export default function HomePage() {
  return (
    <>
      <ApplicationSchema />
      <FaqSchema />
      <LandingHeader />
      <main id="main">
        <LandingHero />
        <LandingExperience />
        <LandingFaq />
        <LandingClosing />
      </main>
      <LandingFooter />
    </>
  );
}
