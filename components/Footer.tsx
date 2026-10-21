import Link from "next/link";
import { mailHref, phoneHref } from "@/lib/format";
import type { Settings } from "@/lib/types";

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <h3 className="text-lg font-semibold text-navy-950">
            {settings.companyName}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {settings.tagline}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-navy-800">
            快速链接
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-navy-900">
                关于我们
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-navy-900">
                业务领域
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-navy-900">
                工程业绩
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-navy-900">
                新闻动态
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-navy-900">
                联系我们
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-navy-800">
            联系方式
          </h4>
          <ul className="mt-3 space-y-2 break-words text-sm leading-7">
            <li>
              电话：
              <a href={phoneHref(settings.phone)} className="hover:text-navy-900">
                {settings.phone}
              </a>
            </li>
            <li>
              邮箱：
              <a href={mailHref(settings.email)} className="hover:text-navy-900">
                {settings.email}
              </a>
            </li>
            <li>地址：{settings.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {settings.companyName} 版权所有
      </div>
    </footer>
  );
}
