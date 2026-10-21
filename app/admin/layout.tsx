import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pb = await requireAdmin();
  const loggedIn = Boolean(pb);

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-md px-6 py-16">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-navy-900"
          >
            返回官网
          </Link>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminNav />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl px-10 py-10">{children}</div>
      </div>
    </div>
  );
}
