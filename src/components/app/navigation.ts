import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  MessageSquareQuote,
  Route,
  ShieldCheck,
  Terminal,
  TrendingUp,
} from "lucide-react";
import type { Role } from "@/lib/content/schema";

/**
 * Application navigation.
 *
 * Grouped by what a technician is *doing*, not by content type: the two things
 * reached mid-call (Knowledge Base, Troubleshoot) sit together and near the
 * top, while learning material sits below. `requires` is presentational only —
 * hiding a link is never what protects a route.
 */

export interface NavItem {
  href: string;
  label: string;
  icon: typeof BookOpen;
  description: string;
  requires?: Role;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        description: "Where you left off, and what changed",
      },
      {
        href: "/progress",
        label: "My progress",
        icon: TrendingUp,
        description: "Onboarding completion and knowledge checks",
      },
    ],
  },
  {
    label: "On the desk",
    items: [
      {
        href: "/knowledge",
        label: "Knowledge Base",
        icon: BookOpen,
        description: "Every procedure, searchable",
      },
      {
        href: "/troubleshoot",
        label: "Troubleshoot",
        icon: Route,
        description: "Guided decision trees",
      },
      {
        href: "/responses",
        label: "Quick Responses",
        icon: MessageSquareQuote,
        description: "Copy-ready messages",
      },
    ],
  },
  {
    label: "Learn",
    items: [
      {
        href: "/training",
        label: "Training",
        icon: GraduationCap,
        description: "Structured onboarding modules",
      },
      {
        href: "/practice",
        label: "Practice",
        icon: Terminal,
        description: "Realistic tickets with feedback",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        href: "/admin",
        label: "Admin console",
        icon: ShieldCheck,
        description: "Content, review queue, and analytics",
        requires: "admin",
      },
    ],
  },
];

/** Groups visible to a role, with empty groups removed. */
export function navigationFor(role: Role, allowed: string[] | null = null): NavGroup[] {
  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (item.requires === "admin" && role !== "admin") return false;
      if (allowed && !allowed.includes(item.href)) return false;
      return true;
    }),
  })).filter((group) => group.items.length > 0);
}
