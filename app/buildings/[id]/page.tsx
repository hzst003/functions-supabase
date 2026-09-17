import { notFound } from "next/navigation";
import { FloorStack } from "@/components/FloorStack";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getBuildingById,
  getBuildingRentalCount,
  getFloorStack,
} from "@/lib/data";

export default async function BuildingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const building = getBuildingById(id);
  if (!building) notFound();

  const floors = getFloorStack(building.id);
  const rentingCount = getBuildingRentalCount(building.id);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader title={building.name} backHref="/buildings" />
      <main className="mx-auto w-full max-w-md flex-1 space-y-3 px-4 py-3">
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-zinc-500">共 {building.floors} 层</p>
          <p className="mt-1 text-base font-semibold text-rose-600">
            {rentingCount}套出租
          </p>
        </div>
        <FloorStack floors={floors} />
      </main>
    </div>
  );
}
