import type { Metadata } from "next";
import { TicketAnatomyScreen } from "@/features/reference/ticket-anatomy";
import { GuideFooter } from "@/features/guide/guide-chrome";
import { GUEST_VIEWER } from "@/lib/auth/types";

export const metadata: Metadata = {
  title: "How a ticket works",
  description:
    "The Footprints New Issue form field by field: what belongs in the title, how to pick a category, what the description must contain, and who to route it to.",
  alternates: { canonical: "/guide/ticket-basics" },
};

export default function TicketBasicsPage() {
  return (
    <>
      <TicketAnatomyScreen viewer={GUEST_VIEWER} basePath="/guide" />
      <GuideFooter />
    </>
  );
}
