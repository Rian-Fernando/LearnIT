"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/review", label: "Review queue" },
  { href: "/admin/backlog", label: "Backlog" },
  { href: "/admin/taxonomy", label: "Option lists" },
  { href: "/admin/links", label: "Important links" },
  { href: "/admin/notices", label: "Notices" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="border-b border-subtle">
      <ul className="flex gap-1 overflow-x-auto px-4 sm:px-6">
        {TABS.map((tab) => {
          const active =
            tab.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative block whitespace-nowrap px-3 py-3 text-sm transition-colors",
                  active
                    ? "font-medium text-primary"
                    : "text-secondary hover:text-primary",
                )}
              >
                {tab.label}
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent"
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
