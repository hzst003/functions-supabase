"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/",
    label: "首页",
    match: (pathname: string) => pathname === "/",
  },
  {
    href: "/rentals",
    label: "房源",
    match: (pathname: string) => pathname.startsWith("/rentals"),
  },
  {
    href: "/buildings",
    label: "楼栋",
    match: (pathname: string) => pathname.startsWith("/buildings"),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      aria-label="底部导航"
    >
      <div className="mx-auto grid max-w-md grid-cols-3">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-12 items-center justify-center text-sm font-medium ${
                active ? "text-rose-600" : "text-zinc-500"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
