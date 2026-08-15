import "server-only";
import { AuthError, type HelpDeskUser, type IdentityProvider } from "../types";

/**
 * Mock identity provider.
 *
 * Exists so learnIT can be developed, demonstrated, and reviewed before
 * Adelphi IT registers the application with the approved identity provider.
 * It performs NO credential verification — a persona is chosen from a fixed
 * list. `src/lib/config/env.ts` refuses to boot a production deployment using
 * this provider unless it is explicitly the sanitised public demo.
 *
 * The personas below are fictional. Any resemblance to Adelphi staff is
 * unintentional; see docs/security.md.
 */

export interface Persona extends HelpDeskUser {
  /** Copy shown on the persona picker explaining what this view demonstrates. */
  blurb: string;
}

export const PERSONAS: readonly Persona[] = [
  {
    id: "demo-new-hire",
    name: "Jordan Reyes",
    role: "staff",
    title: "Help Desk Technician — Week 1",
    startedAt: "2026-08-10",
    blurb:
      "A brand-new student technician partway through onboarding. Best view of the training track and progress system.",
  },
  {
    id: "demo-experienced",
    name: "Priya Raman",
    role: "staff",
    title: "Senior Help Desk Technician",
    startedAt: "2024-09-03",
    blurb:
      "An experienced technician who has finished onboarding and uses learnIT as a live reference during calls.",
  },
  {
    id: "demo-admin",
    name: "Marcus Bell",
    role: "admin",
    title: "Help Desk Coordinator",
    startedAt: "2022-01-18",
    blurb:
      "Help Desk leadership. Adds the admin console: content management, review queue, and onboarding analytics.",
  },
] as const;

export function findPersona(id: string): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}

export const mockProvider: IdentityProvider = {
  id: "mock",
  displayName: "Demo sign-in",

  async beginSignIn({ returnTo }) {
    // The persona picker is a real page rather than an external redirect.
    return {
      redirectTo: `/signin?returnTo=${encodeURIComponent(returnTo)}`,
      transaction: { returnTo },
    };
  },

  async completeSignIn({ params }) {
    const persona = findPersona(params.get("persona") ?? "");
    if (!persona) {
      throw new AuthError("Unknown demo persona.", "invalid_credentials");
    }
    const { blurb: _blurb, ...user } = persona;
    return user satisfies HelpDeskUser;
  },

  signOutUrl() {
    return null;
  },
};
