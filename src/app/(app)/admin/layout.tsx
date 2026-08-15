import type { Metadata } from "next";
import { AdminNav } from "@/features/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · learnIT admin" },
  robots: { index: false, follow: false },
};

/**
 * Admin section.
 *
 * `requireAdmin()` guards every route beneath this layout. Server Actions
 * invoked from these screens re-check the role independently — a layout guard
 * protects rendering, not endpoints.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin({ returnTo: "/admin" });

  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
}
