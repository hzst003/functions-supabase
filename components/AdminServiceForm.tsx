"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef } from "react";
import {
  createService,
  updateService,
  type AdminFormState,
} from "@/lib/admin-actions";

const emptyState: AdminFormState = { ok: false, message: "" };

const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-copper-400/40 focus:border-navy-700 focus:ring-2";

const SAMPLE = {
  title: "智慧园区弱电集成",
  summary: "综合布线、安防与智能化系统一体化交付。",
  body: "面向政企园区提供综合布线、安防监控、门禁对讲与机房建设，实现通信与弱电系统协同落地。",
  sort: "5",
  published: true,
};

export type AdminServiceFormInitial = {
  id: string;
  title: string;
  summary: string;
  body: string;
  sort: number;
  published: boolean;
  coverUrl?: string;
};

function setInput(
  form: HTMLFormElement,
  name: string,
  value: string | boolean,
) {
  const el = form.elements.namedItem(name);
  if (!el) return;
  if (el instanceof HTMLInputElement) {
    if (el.type === "checkbox") {
      el.checked = Boolean(value);
      return;
    }
    el.value = String(value);
    return;
  }
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
    el.value = String(value);
  }
}

export function AdminServiceForm({
  mode = "create",
  initial,
}: {
  mode?: "create" | "edit";
  initial?: AdminServiceFormInitial;
}) {
  const actionFn = mode === "edit" ? updateService : createService;
  const [state, action, pending] = useActionState(actionFn, emptyState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.ok || mode !== "create") return;
    formRef.current?.reset();
  }, [state, mode]);

  function fillSample() {
    const form = formRef.current;
    if (!form || mode !== "create") return;
    setInput(form, "title", SAMPLE.title);
    setInput(form, "summary", SAMPLE.summary);
    setInput(form, "body", SAMPLE.body);
    setInput(form, "sort", SAMPLE.sort);
    setInput(form, "published", SAMPLE.published);
  }

  return (
    <form
      ref={formRef}
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
      {mode === "edit" && initial ? (
        <input type="hidden" name="id" value={initial.id} />
      ) : null}

      {mode === "create" ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            可点「自动填表」快速填入示例，再按需修改。
          </p>
          <button
            type="button"
            onClick={fillSample}
            className="rounded-lg border border-navy-800 px-3 py-1.5 text-sm font-medium text-navy-900 hover:bg-slate-50"
          >
            自动填表
          </button>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block font-medium text-navy-900">标题 *</span>
          <input
            name="title"
            required
            maxLength={120}
            defaultValue={initial?.title}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-navy-900">排序 *</span>
          <input
            name="sort"
            type="number"
            required
            min={0}
            max={9999}
            defaultValue={initial?.sort ?? 1}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block font-medium text-navy-900">摘要 *</span>
          <textarea
            name="summary"
            required
            maxLength={300}
            rows={2}
            defaultValue={initial?.summary}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block font-medium text-navy-900">正文 *</span>
          <textarea
            name="body"
            required
            maxLength={20000}
            rows={8}
            defaultValue={initial?.body}
            placeholder="可直接写段落，或粘贴简单 HTML。"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block font-medium text-navy-900">
            {mode === "edit" ? "更换封面图" : "封面图"}
          </span>
          {mode === "edit" && initial?.coverUrl ? (
            <div className="relative mb-3 h-36 w-full max-w-md overflow-hidden rounded-lg bg-navy-100">
              <Image
                src={initial.coverUrl}
                alt="当前封面"
                fill
                className="object-cover"
                sizes="28rem"
              />
            </div>
          ) : null}
          <input
            name="cover"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-slate-600"
          />
          {mode === "edit" ? (
            <span className="mt-1 block text-xs text-slate-500">
              不选择新文件则保留原封面。
            </span>
          ) : null}
        </label>
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-navy-900">
        <input
          name="published"
          type="checkbox"
          defaultChecked={initial?.published ?? true}
          className="rounded border-slate-300"
        />
        立即发布
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
      >
        {pending
          ? mode === "edit"
            ? "更新中..."
            : "保存中..."
          : mode === "edit"
            ? "更新业务"
            : "保存业务"}
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
                href="/services"
                className="font-medium text-navy-800 underline"
              >
                查看前台页面
              </Link>
              {" · "}
              <Link
                href="/admin/services"
                className="font-medium text-navy-800 underline"
              >
                返回列表
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}
