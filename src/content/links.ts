import type { ImportantLink } from "@/lib/content/schema";

/**
 * Centrally-managed links.
 *
 * Articles reference these by `key` via a `link` block rather than embedding a
 * URL, so when a system moves, one record changes instead of forty articles.
 *
 * The `href` values below are placeholders (`#`) on purpose: real Adelphi
 * endpoints are not committed to this repository. In the internal deployment an
 * administrator fills these in from Admin → Important Links.
 */
export const links: ImportantLink[] = [
  {
    key: "help-desk-portal",
    label: "Help Desk Ticketing Portal",
    description:
      "Where tickets are created, assigned, updated, and closed. Your primary system of record for every interaction.",
    href: "#",
    category: "ticketing",
    visibility: "public",
    pinned: true,
    updatedAt: "2026-08-01",
  },
  {
    key: "remote-support-console",
    label: "Remote Support Console",
    description:
      "The technician console for remote assistance sessions. Sign in at the start of every shift.",
    href: "#",
    category: "remote-support",
    visibility: "public",
    pinned: true,
    updatedAt: "2026-08-01",
  },
  {
    key: "it-support-meeting-room",
    label: "IT Support Meeting Room",
    description:
      "Standing video meeting room used for screen sharing when remote support tooling is unavailable.",
    href: "#",
    category: "remote-support",
    visibility: "public",
    pinned: true,
    updatedAt: "2026-07-22",
  },
  {
    key: "account-self-service",
    label: "Account Self-Service",
    description:
      "Password reset and account recovery portal. Send users here before doing anything manual.",
    href: "#",
    category: "accounts",
    visibility: "public",
    pinned: true,
    updatedAt: "2026-08-04",
  },
  {
    key: "vpn-client-download",
    label: "VPN Client Download",
    description: "Approved VPN client installers and configuration profiles.",
    href: "#",
    category: "vpn",
    visibility: "public",
    pinned: false,
    updatedAt: "2026-07-15",
  },
  {
    key: "print-management-portal",
    label: "Print Management Portal",
    description:
      "Queue status, release stations, and print quota lookups for supported printers.",
    href: "#",
    category: "printing",
    visibility: "public",
    pinned: false,
    updatedAt: "2026-07-30",
  },
  {
    key: "event-scheduling-system",
    label: "Event & Room Scheduling System",
    description:
      "Room reservations and event technology requests. Consult before dispatching to a classroom.",
    href: "#",
    category: "software",
    visibility: "public",
    pinned: false,
    updatedAt: "2026-06-28",
  },
  {
    key: "service-status",
    label: "IT Service Status",
    description:
      "Current outages and planned maintenance. Check here first when reports cluster.",
    href: "#",
    category: "general",
    visibility: "public",
    pinned: true,
    updatedAt: "2026-08-11",
  },
  {
    key: "escalation-directory",
    label: "Escalation Directory",
    description:
      "Which team owns which system, with current on-call coverage and hand-off expectations.",
    href: "#",
    category: "general",
    visibility: "staff",
    pinned: false,
    updatedAt: "2026-08-08",
  },
];
