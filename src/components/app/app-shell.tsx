"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { Monogram, Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { Role } from "@/lib/content/schema";
import type { Experience } from "@/lib/config/experience";
import { CommandPalette } from "./command-palette";
import { navigationFor } from "./navigation";

/**
 * Application shell.
 *
 * One shell serves both the authenticated application and the public demo. The
 * only difference is `basePath` (`""` vs `"/demo"`) and the viewer it is given —
 * which keeps the two experiences genuinely identical rather than two codebases
 * drifting apart.
 */

export interface ShellUser {
  name: string;
  role: Role;
  title?: string;
}

export function AppShell({
  user,
  basePath = "",
  demo = false,
  experience = "course",
  children,
}: {
  user: ShellUser;
  basePath?: string;
  demo?: boolean;
  /** Resolved on the server and passed in — the shell is a client component. */
  experience?: Experience;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const groups = navigationFor(user.role, experience);

  // Close the mobile drawer on navigation — leaving it open over the new page
  // is a classic mobile navigation bug.
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-surface-base">
      {demo ? <DemoBanner /> : null}

      <div className="flex">
        {/* ---------------------------------------------------------- rail */}
        <Sidebar
          groups={groups}
          basePath={basePath}
          pathname={pathname}
          user={user}
          className="hidden lg:flex"
        />

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
            />
            <Sidebar
              groups={groups}
              basePath={basePath}
              pathname={pathname}
              user={user}
              onClose={() => setMobileOpen(false)}
              className="animate-fade-in relative h-full w-[17rem] shadow-elev-lg"
            />
          </div>
        ) : null}

        {/* ---------------------------------------------------------- main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-subtle bg-surface-base/85 backdrop-blur-md">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="flex size-9 items-center justify-center rounded-lg border border-default text-secondary transition-colors hover:border-strong hover:text-primary lg:hidden"
              >
                <Menu className="size-4" aria-hidden />
              </button>

              <Link href={`${basePath}/dashboard`} className="lg:hidden">
                <Wordmark size="sm" />
                <span className="sr-only">learnIT dashboard</span>
              </Link>

              <div className="ml-auto flex items-center gap-2">
                <CommandPalette basePath={basePath} />
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main id="main" className="min-w-0 flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Sidebar({
  groups,
  basePath,
  pathname,
  user,
  className,
  onClose,
}: {
  groups: ReturnType<typeof navigationFor>;
  basePath: string;
  pathname: string;
  user: ShellUser;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <aside
      className={cn(
        "sticky top-0 h-screen w-[17rem] shrink-0 flex-col border-r border-subtle bg-surface-sunken",
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between px-5">
        <Link
          href={`${basePath}/dashboard`}
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <Wordmark size="md" />
          <span className="sr-only">learnIT dashboard</span>
        </Link>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex size-8 items-center justify-center rounded-lg text-tertiary transition-colors hover:text-primary"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 pb-4">
        {groups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="eyebrow px-3 pb-2">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const href = `${basePath}${item.href}`;
                const active =
                  pathname === href || pathname.startsWith(`${href}/`);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-surface-inset font-medium text-primary"
                          : "text-secondary hover:bg-surface-inset/60 hover:text-primary",
                      )}
                    >
                      {active ? (
                        <span
                          aria-hidden
                          className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent"
                        />
                      ) : null}
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          active ? "text-accent-text" : "text-tertiary",
                        )}
                        aria-hidden
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <AccountPanel user={user} />
    </aside>
  );
}

function AccountPanel({ user }: { user: ShellUser }) {
  return (
    <div className="border-t border-subtle p-3">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <Monogram className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-primary">{user.name}</p>
          <p className="truncate text-xs text-tertiary">
            {user.title ?? (user.role === "admin" ? "Administrator" : "Help Desk")}
          </p>
        </div>
      </div>

      {/* POST, so sign-out cannot be triggered by a cross-site GET. */}
      <form action="/api/auth/signout" method="post" className="mt-1">
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="w-full justify-start px-2"
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </Button>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("learnit-theme", next);
    } catch {
      // Private browsing with storage disabled — the toggle still works for
      // this session, it just will not persist.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="flex size-9 items-center justify-center rounded-lg border border-default text-secondary transition-colors hover:border-strong hover:text-primary"
    >
      {theme === "dark" ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </button>
  );
}

function DemoBanner() {
  return (
    <div className="border-b border-accent/20 bg-accent-soft">
      <div className="mx-auto flex max-w-[100rem] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 sm:px-6">
        <span className="rounded border border-accent/30 bg-accent/12 px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-accent-text">
          Demo
        </span>
        <p className="text-xs leading-5 text-secondary">
          You are viewing sanitised, fictional content. Internal Help Desk
          procedures are not included in this build.
        </p>
        <Link
          href="/signin"
          className="ml-auto text-xs font-medium text-accent-text underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
        >
          Sign in for the full platform
        </Link>
      </div>
    </div>
  );
}
