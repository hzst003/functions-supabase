"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatWenwanPrice, type WenwanItem } from "@/lib/wenwan";

type WenwanGalleryProps = {
  items: WenwanItem[];
  categories: { key: string; label: string }[];
};

export function WenwanGallery({ items, categories }: WenwanGalleryProps) {
  const [categoryKey, setCategoryKey] = useState("");

  const visibleItems = useMemo(
    () =>
      categoryKey
        ? items.filter((item) => item.categoryKey === categoryKey)
        : items,
    [categoryKey, items],
  );

  return (
    <div className="space-y-3">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <CategoryChip
          label="全部"
          active={!categoryKey}
          onClick={() => setCategoryKey("")}
        />
        {categories.map((category) => (
          <CategoryChip
            key={category.key}
            label={category.label}
            active={categoryKey === category.key}
            onClick={() => setCategoryKey(category.key)}
          />
        ))}
      </div>

      <p className="text-sm text-zinc-500">共 {visibleItems.length} 件</p>

      <ul className="grid grid-cols-2 gap-2">
        {visibleItems.map((item, index) => (
          <li key={item.no} className="group relative z-0 hover:z-10">
            <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-zinc-300 group-hover:shadow-xl group-active:-translate-y-1 group-active:shadow-lg">
              <div className="relative aspect-square overflow-hidden bg-zinc-100">
                <Image
                  src={item.src}
                  alt={item.name}
                  fill
                  priority={index < 4}
                  className="object-cover transition-[scale] duration-500 ease-out group-hover:scale-110 group-active:scale-105"
                  sizes="(max-width: 448px) 50vw, 224px"
                />
                <span className="absolute right-2 bottom-2 rounded-full bg-rose-600/95 px-2.5 py-1 text-sm font-semibold text-white shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
                  {formatWenwanPrice(item.price)}
                </span>
              </div>
              <div className="space-y-0.5 px-2.5 py-2">
                <p className="truncate text-[15px] font-medium text-zinc-900">
                  {item.name}
                </p>
                <p className="truncate text-xs text-zinc-500">{item.category}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 shrink-0 rounded-full px-3 text-sm font-medium ${
        active
          ? "bg-zinc-900 text-white"
          : "border border-zinc-300 bg-white text-zinc-700"
      }`}
    >
      {label}
    </button>
  );
}
