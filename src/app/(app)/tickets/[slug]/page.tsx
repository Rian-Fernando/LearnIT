import type { Metadata } from "next";
import { TicketScreen } from "@/features/reference/reference-screens";
import { requireStaff } from "@/lib/auth";
import { getTicket } from "@/lib/content/repository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const viewer = await requireStaff();
  const ticket = await getTicket(viewer, slug);
  return ticket
    ? { title: ticket.title, description: ticket.summary }
    : { title: "Reference ticket not found" };
}

export default async function TicketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const viewer = await requireStaff({ returnTo: `/tickets/${slug}` });
  return <TicketScreen viewer={viewer} slug={slug} />;
}
