import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata: Metadata = {
  title: "后台登录",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold text-navy-950">后台登录</h1>
      <p className="mt-2 text-sm text-slate-600">使用管理员账号登录后可新增工程业绩。</p>
      <div className="mt-8">
        <AdminLoginForm />
      </div>
    </section>
  );
}
