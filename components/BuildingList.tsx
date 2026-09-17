"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Building } from "@/lib/types";

type BuildingWithCount = Building & {
  rentingCount: number;
};

type BuildingListProps = {
  buildings: BuildingWithCount[];
};

export function BuildingList({ buildings }: BuildingListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const keyword = query.trim();
    if (!keyword) return buildings;
    return buildings.filter(
      (building) =>
        building.id === keyword ||
        building.name.includes(keyword) ||
        building.name.replace("幢", "") === keyword,
    );
  }, [buildings, query]);

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="sr-only">输入幢号查找</span>
        <input
          type="search"
          inputMode="numeric"
          enterKeyHint="search"
          placeholder="输入幢号，如 12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-base text-zinc-900 placeholder:text-zinc-400"
        />
      </label>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-8 text-center text-sm text-zinc-500">
          没有找到该幢
        </p>
      ) : (
        <ul className="grid grid-cols-4 gap-2">
          {filtered.map((building) => {
            const hasRentals = building.rentingCount > 0;
            return (
              <li key={building.id}>
                <Link
                  href={`/buildings/${building.id}`}
                  className={`flex min-h-[4.5rem] flex-col items-center justify-center rounded-2xl border px-1 py-2 text-center active:scale-[0.98] ${
                    hasRentals
                      ? "border-rose-200 bg-rose-50"
                      : "border-zinc-200 bg-white"
                  }`}
                >
                  <p className="text-[15px] font-semibold text-zinc-900">
                    {building.name}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      hasRentals ? "font-medium text-rose-600" : "text-zinc-400"
                    }`}
                  >
                    {hasRentals ? `${building.rentingCount}套` : "暂无"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
