import type { Metadata } from "next";
import { AppShell } from "@/components/app/app-shell";
import { ProgressProvider } from "@/lib/progress/store";

export const metadata: Metadata = {
  title: { default: "Demo", template: "%s · learnIT demo" },
};

/**
 * Public demo layout.
 *
 * Uses the same shell and the same feature screens as the authenticated
 * application — the only difference is the viewer. Because every content read
 * goes through the repository with that viewer, a guest here physically cannot
 * be served staff-only content, and there is no second codebase to keep in sync.
 *
 * A signed-in user visiting /demo is still treated as a guest, so the demo
 * always shows exactly what an anonymous visitor would see. Nothing in this
 * tree reads the session, which is what keeps it statically renderable.
 */
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <AppShell
        demo
        basePath="/demo"
        user={{ name: "Guest", role: "guest", title: "Demonstration mode" }}
      >
        {children}
      </AppShell>
    </ProgressProvider>
  );
}
