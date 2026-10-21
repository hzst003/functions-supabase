"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/lib/admin-actions";

const groups = [
  {
    label: "内容",
    items: [
      { href: "/admin/projects", label: "工程业绩" },
      { href: "/admin/services", label: "业务领域" },
      { href: "/admin/news", label: "新闻动态" },
      { href: "/admin/milestones", label: "发展历程" },
    ],
  },
  {
    label: "网站",
    items: [
      { href: "/admin/logo", label: "标志" },
      { href: "/admin/footer", label: "页脚" },
      { href: "/admin/about", label: "关于我们" },
      { href: "/admin/qualifications", label: "资质能力" },
      { href: "/admin/contact", label: "联系方式" },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-5">
        <p className="text-sm font-semibold text-navy-950">管理后台</p>
        <Link
          href="/"
          className="mt-2 inline-block text-sm text-slate-500 hover:text-navy-900"
        >
          返回官网
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="px-3 text-xs font-semibold tracking-wider text-slate-400">
              {group.label}
            </p>
            <ul className="mt-2 space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2 text-sm ${
                        active
                          ? "bg-navy-900 font-medium text-white"
                          : "text-navy-900 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <form action={logoutAdmin} className="border-t border-slate-200 p-4">
        <button
          type="submit"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-navy-900 hover:bg-slate-50"
        >
          退出登录
        </button>
      </form>
    </aside>
  );
}
