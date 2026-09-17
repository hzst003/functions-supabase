import Image from "next/image";
import Link from "next/link";
import { getCommunity, getCommunityStats, getRentingCount } from "@/lib/data";

export default function HomePage() {
  const community = getCommunity();
  const rentingCount = getRentingCount();
  const { buildingCount, maxFloors } = getCommunityStats();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-4">
      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="relative aspect-[16/9] bg-zinc-100">
          <Image
            src={community.cover}
            alt={community.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 448px) 100vw, 448px"
          />
        </div>
        <div className="space-y-4 p-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              {community.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">{community.address}</p>
            <p className="mt-1 text-sm text-zinc-500">
              共 {buildingCount} 幢 · 低层住宅 · 最高 {maxFloors} 层
            </p>
          </div>

          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            正在出租：{rentingCount}套
          </p>

          <div className="space-y-3">
            <Link
              href="/rentals"
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 text-[15px] font-medium text-white active:bg-zinc-700"
            >
              查看全部房源
            </Link>
            <Link
              href="/buildings"
              className="flex min-h-12 w-full items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 text-[15px] font-medium text-zinc-800 active:bg-zinc-50"
            >
              按楼栋查看
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
