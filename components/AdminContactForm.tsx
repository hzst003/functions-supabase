"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { updateContact, type AdminFormState } from "@/lib/admin-actions";

const emptyState: AdminFormState = { ok: false, message: "" };

const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-copper-400/40 focus:border-navy-700 focus:ring-2";

export function AdminContactForm({
  id,
  phone,
  email,
  address,
}: {
  id: string;
  phone: string;
  email: string;
  address: string;
}) {
  const [state, action, pending] = useActionState(updateContact, emptyState);

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
      <input type="hidden" name="id" value={id} />
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-navy-900">电话 *</span>
        <input
          name="phone"
          required
          maxLength={30}
          defaultValue={phone}
          autoComplete="tel"
          className={fieldClass}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-navy-900">邮箱 *</span>
        <input
          name="email"
          type="email"
          required
          maxLength={100}
          defaultValue={email}
          autoComplete="email"
          className={fieldClass}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-navy-900">地址 *</span>
        <textarea
          name="address"
          required
          maxLength={200}
          rows={3}
          defaultValue={address}
          className={fieldClass}
        />
      </label>
      <p className="text-xs text-slate-500">
        保存后会同时更新页脚和「联系我们」页面。
      </p>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {pending ? "保存中..." : "保存联系方式"}
      </button>
      {state.message ? (
        <p
          className={`text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}
          role="status"
        >
          {state.message}
          {state.ok ? (
            <>
              {" "}
              <Link href="/" className="font-medium text-navy-800 underline">
                查看页脚
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}
