import type { Metadata } from "next";
import { TicketAnatomyScreen } from "@/features/reference/ticket-anatomy";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = { title: "How a ticket works" };

export default async function TicketAnatomyPage() {
  const viewer = await requireStaff({ returnTo: "/reference/ticket-anatomy" });
  return <TicketAnatomyScreen viewer={viewer} />;
}
