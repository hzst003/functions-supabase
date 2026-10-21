"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { updateFooterIntro, type AdminFormState } from "@/lib/admin-actions";

const emptyState: AdminFormState = { ok: false, message: "" };

const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-copper-400/40 focus:border-navy-700 focus:ring-2";

export function AdminFooterForm({
  id,
  companyName,
  tagline,
}: {
  id: string;
  companyName: string;
  tagline: string;
}) {
  const [state, action, pending] = useActionState(
    updateFooterIntro,
    emptyState,
  );

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
        <span className="mb-1 block font-medium text-navy-900">公司名称 *</span>
        <input
          name="companyName"
          required
          maxLength={40}
          defaultValue={companyName}
          className={fieldClass}
        />
        <span className="mt-1 block text-xs text-slate-500">
          页脚左侧第一行。与页头标志右侧文字是同一项。
        </span>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-navy-900">标语 *</span>
        <input
          name="tagline"
          required
          maxLength={40}
          defaultValue={tagline}
          className={fieldClass}
        />
        <span className="mt-1 block text-xs text-slate-500">
          页脚左侧第二行，同时作为首页大标题。
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {pending ? "保存中..." : "保存页脚"}
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
