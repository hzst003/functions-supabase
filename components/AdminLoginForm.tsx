"use client";

import { startTransition, useActionState } from "react";
import { loginAdmin, type AdminFormState } from "@/lib/admin-actions";

const initial: AdminFormState = { ok: false, message: "" };

const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-copper-400/40 focus:border-navy-700 focus:ring-2";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initial);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => {
          action(formData);
        });
      }}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-navy-900">邮箱</span>
        <input
          name="email"
          type="email"
          required
          defaultValue="xu@126.com"
          autoComplete="username"
          className={fieldClass}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-navy-900">密码</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {pending ? "登录中..." : "登录"}
      </button>
      {state.message ? (
        <p className="text-sm text-red-600" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
