"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef } from "react";
import {
  createMilestone,
  updateMilestone,
  type AdminFormState,
} from "@/lib/admin-actions";

const emptyState: AdminFormState = { ok: false, message: "" };

const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-copper-400/40 focus:border-navy-700 focus:ring-2";

const SAMPLE = {
  year: String(new Date().getFullYear()),
  title: "完成省级通信工程总承包资质延续",
  description:
    "公司完成通信工程施工总承包资质延续，业务覆盖 5G 建设、光纤传输与政企弱电，服务范围进一步扩大。",
};

export type AdminMilestoneFormInitial = {
  id: string;
  year: number;
  title: string;
  description: string;
};

function setInput(form: HTMLFormElement, name: string, value: string) {
  const el = form.elements.namedItem(name);
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    el.value = value;
  }
}

export function AdminMilestoneForm({
  mode = "create",
  initial,
}: {
  mode?: "create" | "edit";
  initial?: AdminMilestoneFormInitial;
}) {
  const actionFn = mode === "edit" ? updateMilestone : createMilestone;
  const [state, action, pending] = useActionState(actionFn, emptyState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.ok || mode !== "create") return;
    formRef.current?.reset();
  }, [state, mode]);

  function fillSample() {
    const form = formRef.current;
    if (!form || mode !== "create") return;
    setInput(form, "year", SAMPLE.year);
    setInput(form, "title", SAMPLE.title);
    setInput(form, "description", SAMPLE.description);
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

      <div className="grid gap-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-navy-900">年份 *</span>
          <input
            name="year"
            type="number"
            required
            min={1900}
            max={2100}
            defaultValue={initial?.year ?? new Date().getFullYear()}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
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
          <span className="mb-1 block font-medium text-navy-900">说明 *</span>
          <textarea
            name="description"
            required
            maxLength={2000}
            rows={5}
            defaultValue={initial?.description}
            className={fieldClass}
          />
        </label>
      </div>
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
            ? "更新历程"
            : "保存历程"}
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
              <Link href="/about" className="font-medium text-navy-800 underline">
                查看前台页面
              </Link>
              {" · "}
              <Link
                href="/admin/milestones"
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
