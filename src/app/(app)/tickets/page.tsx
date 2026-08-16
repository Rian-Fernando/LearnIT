import type { Metadata } from "next";
import { TicketIndexScreen } from "@/features/reference/reference-screens";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = { title: "Reference tickets" };

export default async function TicketsPage() {
  const viewer = await requireStaff({ returnTo: "/tickets" });
  return <TicketIndexScreen viewer={viewer} />;
}
