import type { Metadata } from "next";
import { SimulatorScreen } from "@/features/simulator/simulator-screens";
import { requireStaff } from "@/lib/auth";
import { getSimulation } from "@/lib/content/repository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const viewer = await requireStaff();
  const simulation = await getSimulation(viewer, slug);
  return simulation
    ? { title: simulation.title, description: simulation.summary }
    : { title: "Simulation not found" };
}

export default async function SimulatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const viewer = await requireStaff({ returnTo: `/practice/simulator/${slug}` });
  return <SimulatorScreen viewer={viewer} slug={slug} />;
}
