import type { Metadata } from "next";
import { ReferenceLibraryScreen } from "@/features/reference/reference-library";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { isReferenceMode } from "@/lib/config/experience";

export const metadata: Metadata = { title: "Reference" };

export default async function ReferencePage() {
  if (!isReferenceMode()) redirect("/training");
  const viewer = await requireStaff({ returnTo: "/reference" });
  return <ReferenceLibraryScreen viewer={viewer} />;
}
