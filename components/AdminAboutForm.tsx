"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { updateAbout, type AdminFormState } from "@/lib/admin-actions";

const emptyState: AdminFormState = { ok: false, message: "" };

const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-copper-400/40 focus:border-navy-700 focus:ring-2";

export function AdminAboutForm({
  id,
  aboutSubtitle,
  about,
}: {
  id: string;
  aboutSubtitle: string;
  about: string;
}) {
  const [state, action, pending] = useActionState(updateAbout, emptyState);

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
        <span className="mb-1 block font-medium text-navy-900">页头说明 *</span>
        <textarea
          name="aboutSubtitle"
          required
          maxLength={200}
          rows={2}
          defaultValue={aboutSubtitle}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-navy-900">公司简介 *</span>
        <textarea
          name="about"
          required
          maxLength={20000}
          rows={12}
          defaultValue={about}
          placeholder="可直接写段落，或粘贴简单 HTML。"
          className={fieldClass}
        />
      </label>
      <p className="text-xs text-slate-500">
        页头说明显示在「关于我们」标题下方。简介可用纯文本，空行会拆成段落。
      </p>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {pending ? "保存中..." : "保存关于我们"}
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
              <Link
                href="/about"
                className="font-medium text-navy-800 underline"
              >
                查看前台页面
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}
