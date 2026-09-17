import Image from "next/image";
import Link from "next/link";
import { formatLayout, getBuildingName } from "@/lib/data";
import type { Rental } from "@/lib/types";

type RentalCardProps = {
  rental: Rental;
};

export function RentalCard({ rental }: RentalCardProps) {
  const cover = rental.images[0] ?? "/images/community.jpg";
  const buildingName = getBuildingName(rental.buildingId);

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <Link
        href={`/rentals/${rental.id}`}
        className="flex items-stretch gap-3 p-3 active:bg-zinc-50"
      >
        <div className="relative h-[5.5rem] w-[6.5rem] shrink-0 overflow-hidden rounded-xl bg-zinc-100">
          <Image
            src={cover}
            alt={rental.title}
            fill
            className="object-cover"
            sizes="104px"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <p className="truncate text-[15px] font-medium text-zinc-900">
              {formatLayout(rental)} · {rental.area}㎡
            </p>
            <p className="mt-1 truncate text-sm text-zinc-500">
              {buildingName} · {rental.floor}楼
            </p>
          </div>
          <p className="text-lg font-semibold text-rose-600">
            ¥{rental.price}
            <span className="text-sm font-normal text-zinc-500">/月</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
