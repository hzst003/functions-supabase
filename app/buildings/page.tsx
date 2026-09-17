import { BuildingList } from "@/components/BuildingList";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getBuildingRentalCount,
  getBuildings,
  getCommunity,
  getCommunityStats,
} from "@/lib/data";

export default function BuildingsPage() {
  const community = getCommunity();
  const { buildingCount, maxFloors } = getCommunityStats();
  const buildings = getBuildings().map((building) => ({
    ...building,
    rentingCount: getBuildingRentalCount(building.id),
  }));

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader title={community.name} backHref="/" />
      <main className="mx-auto w-full max-w-md flex-1 space-y-3 px-4 py-3">
        <p className="text-sm text-zinc-500">
          共 {buildingCount} 幢 · 最高 {maxFloors} 层
        </p>
        <BuildingList buildings={buildings} />
      </main>
    </div>
  );
}
