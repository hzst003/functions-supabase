import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { fileUrl } from "@/lib/pb";

export function NewsCard({ item }: { item: NewsItem }) {
  const cover = fileUrl(item.collectionId, item.id, item.cover);

  return (
    <Link
      href={`/news/${item.slug}`}
      className="block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-copper-300 hover:shadow-md"
    >
      {cover ? (
        <div className="relative h-40 overflow-hidden bg-navy-100">
          <Image
            src={cover}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : null}
      <div className="p-5">
        <time className="text-xs text-slate-500">
          {formatDate(item.publishedAt)}
        </time>
        <h3 className="mt-2 text-lg font-semibold text-navy-950">{item.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {item.summary}
        </p>
      </div>
    </Link>
  );
}
