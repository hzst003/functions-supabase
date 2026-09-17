"use client";

import { useRouter } from "next/navigation";
import type { Building } from "@/lib/types";

type RentalFiltersProps = {
  buildings: Building[];
  initialBuilding?: string;
  initialLayout?: string;
  initialPrice?: string;
};

type FilterState = {
  building: string;
  layout: string;
  price: string;
};

export function RentalFilters({
  buildings,
  initialBuilding = "",
  initialLayout = "",
  initialPrice = "",
}: RentalFiltersProps) {
  const router = useRouter();
  const current: FilterState = {
    building: initialBuilding,
    layout: initialLayout,
    price: initialPrice,
  };
  const hasFilters = Boolean(
    current.building || current.layout || current.price,
  );

  function apply(next: FilterState) {
    const params = new URLSearchParams();
    if (next.building) params.set("building", next.building);
    if (next.layout) params.set("layout", next.layout);
    if (next.price) params.set("price", next.price);
    const query = params.toString();
    router.push(query ? `/rentals?${query}` : "/rentals");
  }

  const selectClassName =
    "h-11 w-full rounded-xl border border-zinc-300 bg-white px-2 text-base text-zinc-900";

  return (
    <form
      className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid grid-cols-3 gap-2">
        <label className="block text-xs text-zinc-500">
          <span className="mb-1 block">楼栋</span>
          <select
            value={current.building}
            onChange={(e) => apply({ ...current, building: e.target.value })}
            className={selectClassName}
          >
            <option value="">全部</option>
            {buildings.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs text-zinc-500">
          <span className="mb-1 block">户型</span>
          <select
            value={current.layout}
            onChange={(e) => apply({ ...current, layout: e.target.value })}
            className={selectClassName}
          >
            <option value="">全部</option>
            <option value="1">1室</option>
            <option value="2">2室</option>
            <option value="3">3室</option>
          </select>
        </label>

        <label className="block text-xs text-zinc-500">
          <span className="mb-1 block">价格</span>
          <select
            value={current.price}
            onChange={(e) => apply({ ...current, price: e.target.value })}
            className={selectClassName}
          >
            <option value="">全部</option>
            <option value="lt3000">3000以下</option>
            <option value="3000-4000">3000-4000</option>
            <option value="gte4000">4000及以上</option>
          </select>
        </label>
      </div>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => apply({ building: "", layout: "", price: "" })}
          className="mt-2 w-full min-h-10 rounded-xl text-sm font-medium text-zinc-600 active:bg-zinc-100"
        >
          清除筛选
        </button>
      ) : null}
    </form>
  );
}
