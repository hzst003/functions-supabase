import Link from "next/link";
import type { FloorRental } from "@/lib/data";

type FloorStackProps = {
  floors: FloorRental[];
};

export function FloorStack({ floors }: FloorStackProps) {
  return (
    <ol className="space-y-2">
      {floors.map(({ floor, rentals }) => {
        const hasRentals = rentals.length > 0;
        return (
          <li
            key={floor}
            className={`rounded-xl border px-3 ${
              hasRentals
                ? "border-rose-200 bg-rose-50 py-3"
                : "border-zinc-200 bg-white py-2"
            }`}
          >
            <div className="flex min-h-8 flex-wrap items-center gap-2">
              <span
                className={`min-w-10 text-sm font-semibold ${
                  hasRentals ? "text-rose-700" : "text-zinc-500"
                }`}
              >
                {floor}F
              </span>
              {hasRentals ? (
                <div className="flex flex-wrap gap-2">
                  {rentals.map((rental) => (
                    <Link
                      key={rental.id}
                      href={`/rentals/${rental.id}`}
                      className="inline-flex min-h-11 items-center rounded-lg bg-white px-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200 active:bg-rose-100"
                    >
                      {rental.room}出租
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-zinc-400">暂无房源</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
