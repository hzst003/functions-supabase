import { RentalCard } from "@/components/RentalCard";
import { RentalFilters } from "@/components/RentalFilters";
import { SiteHeader } from "@/components/SiteHeader";
import { filterRentals, getBuildings } from "@/lib/data";

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const building = firstParam(params.building) ?? "";
  const layout = firstParam(params.layout) ?? "";
  const price = firstParam(params.price) ?? "";

  const buildings = getBuildings();
  const rentals = filterRentals({
    building: building || undefined,
    layout: layout || undefined,
    price: price || undefined,
  });

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader title="出租房源" backHref="/" />
      <main className="mx-auto w-full max-w-md flex-1 space-y-3 px-4 py-3">
        <RentalFilters
          buildings={buildings}
          initialBuilding={building}
          initialLayout={layout}
          initialPrice={price}
        />

        {rentals.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-500">
            没有符合条件的房源，请调整筛选条件。
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-zinc-500">共 {rentals.length} 套房源</p>
            {rentals.map((rental) => (
              <RentalCard key={rental.id} rental={rental} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
