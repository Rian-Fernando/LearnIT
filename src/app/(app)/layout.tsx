import { AppShell } from "@/components/app/app-shell";
import { requireStaff } from "@/lib/auth";
import { ProgressProvider } from "@/lib/progress/store";

/**
 * Authenticated application layout.
 *
 * `requireStaff()` runs before anything renders, on the server, for every route
 * in this group. This is the authorization boundary — the middleware in front
 * of it is a convenience, and the navigation is only cosmetic.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireStaff();

  return (
    <ProgressProvider>
      <AppShell
        user={{
          name: viewer.user.name,
          role: viewer.role,
          ...(viewer.user.title ? { title: viewer.user.title } : {}),
        }}
      >
        {children}
      </AppShell>
    </ProgressProvider>
  );
}
