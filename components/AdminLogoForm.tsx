"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useActionState } from "react";
import { updateLogo, type AdminFormState } from "@/lib/admin-actions";

const emptyState: AdminFormState = { ok: false, message: "" };

const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-copper-400/40 focus:border-navy-700 focus:ring-2";

export function AdminLogoForm({
  id,
  logoUrl,
  companyName,
}: {
  id: string;
  logoUrl: string;
  companyName: string;
}) {
  const [state, action, pending] = useActionState(updateLogo, emptyState);
  const mark = companyName.trim().slice(0, 1) || "企";

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
      <div>
        <p className="mb-2 text-sm font-medium text-navy-900">当前标志</p>
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded object-contain"
          />
        ) : (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-navy-900 text-sm font-bold text-white">
            {mark}
          </span>
        )}
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-navy-900">右侧文字 *</span>
        <input
          name="companyName"
          required
          maxLength={40}
          defaultValue={companyName}
          className={fieldClass}
        />
        <span className="mt-1 block text-xs text-slate-500">
          显示在标志右侧，同时用于页脚和网页标题。
        </span>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-navy-900">更换标志</span>
        <input
          name="logo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-sm text-slate-600"
        />
        <span className="mt-1 block text-xs text-slate-500">
          支持 JPEG、PNG、WebP，不超过 2MB。建议方形图片，显示在页头公司名称左侧。
        </span>
      </label>
      {logoUrl ? (
        <label className="inline-flex items-center gap-2 text-sm text-navy-900">
          <input
            name="removeLogo"
            type="checkbox"
            className="rounded border-slate-300"
          />
          去掉图片，改回文字标志
        </label>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {pending ? "保存中..." : "保存"}
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
                查看页头
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}
