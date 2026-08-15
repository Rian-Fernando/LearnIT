import {
  LandingClosing,
  LandingFooter,
  LandingHeader,
  LandingHero,
} from "@/components/landing/landing-chrome";
import { LandingExperience } from "@/components/landing/landing-experience";

/**
 * Public homepage.
 *
 * Server-rendered end to end. The only client JavaScript is the narrative
 * experience, which decides for itself whether this visitor should get the
 * cinematic version — see `landing-experience.tsx`.
 */
export default function HomePage() {
  return (
    <>
      <LandingHeader />
      <main id="main">
        <LandingHero />
        <LandingExperience />
        <LandingClosing />
      </main>
      <LandingFooter />
    </>
  );
}
