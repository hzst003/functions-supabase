"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef } from "react";
import {
  createProject,
  updateProject,
  type AdminFormState,
} from "@/lib/admin-actions";
import { PROJECT_CATEGORIES } from "@/lib/project-constants";

const emptyState: AdminFormState = { ok: false, message: "" };

const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-copper-400/40 focus:border-navy-700 focus:ring-2";

const SAMPLE = {
  title: "浦东新区骨干光缆扩容工程",
  category: "光纤传输",
  year: String(new Date().getFullYear()),
  location: "上海浦东",
  client: "某运营商上海公司",
  summary: "完成园区骨干光缆扩容与传输设备调测，形成双路由保护。",
  body: "项目覆盖浦东重点产业带，完成管道光缆敷设、熔接测试与 OTN 上联配置。全过程落实安全与质量管控，按期完成验收开通。",
  featured: true,
  published: true,
};

export type AdminProjectFormInitial = {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number;
  location: string;
  client: string;
  summary: string;
  body: string;
  featured: boolean;
  published: boolean;
  coverUrl?: string;
};

function slugFromTitle(title: string) {
  const ascii = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const stamp = Date.now().toString(36);
  return ascii || `project-${stamp}`;
}

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

export function AdminProjectForm({
  mode = "create",
  initial,
}: {
  mode?: "create" | "edit";
  initial?: AdminProjectFormInitial;
}) {
  const actionFn = mode === "edit" ? updateProject : createProject;
  const [state, action, pending] = useActionState(actionFn, emptyState);
  const formRef = useRef<HTMLFormElement>(null);
  const slugTouched = useRef(mode === "edit");

  useEffect(() => {
    if (!state.ok || mode !== "create") return;
    formRef.current?.reset();
    slugTouched.current = false;
  }, [state, mode]);

  function fillSample() {
    const form = formRef.current;
    if (!form || mode !== "create") return;
    const slug = `pudong-fiber-${Date.now().toString(36)}`;
    setInput(form, "title", SAMPLE.title);
    setInput(form, "slug", slug);
    setInput(form, "category", SAMPLE.category);
    setInput(form, "year", SAMPLE.year);
    setInput(form, "location", SAMPLE.location);
    setInput(form, "client", SAMPLE.client);
    setInput(form, "summary", SAMPLE.summary);
    setInput(form, "body", SAMPLE.body);
    setInput(form, "featured", SAMPLE.featured);
    setInput(form, "published", SAMPLE.published);
    slugTouched.current = true;
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
            onChange={(event) => {
              if (slugTouched.current || !formRef.current) return;
              setInput(
                formRef.current,
                "slug",
                slugFromTitle(event.target.value),
              );
            }}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-navy-900">Slug *</span>
          <input
            name="slug"
            required
            pattern="[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*"
            placeholder="pudong-5g-sites"
            defaultValue={initial?.slug}
            className={fieldClass}
            onChange={() => {
              slugTouched.current = true;
            }}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-navy-900">分类 *</span>
          <select
            name="category"
            required
            className={fieldClass}
            defaultValue={initial?.category || ""}
          >
            <option value="" disabled>
              请选择
            </option>
            {PROJECT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-navy-900">年份 *</span>
          <input
            name="year"
            type="number"
            required
            min={1990}
            max={2100}
            defaultValue={initial?.year ?? new Date().getFullYear()}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-navy-900">地点 *</span>
          <input
            name="location"
            required
            maxLength={100}
            defaultValue={initial?.location}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="mb-1 block font-medium text-navy-900">业主 *</span>
          <input
            name="client"
            required
            maxLength={100}
            defaultValue={initial?.client}
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
      <div className="flex flex-wrap gap-6 text-sm text-navy-900">
        <label className="inline-flex items-center gap-2">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={initial?.featured}
            className="rounded border-slate-300"
          />
          精选展示
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            name="published"
            type="checkbox"
            defaultChecked={initial?.published ?? true}
            className="rounded border-slate-300"
          />
          立即发布
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
            ? "更新业绩"
            : "保存业绩"}
      </button>
      {state.message ? (
        <p
          className={`text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}
          role="status"
        >
          {state.message}
          {state.ok && state.slug ? (
            <>
              {" "}
              <Link
                href={`/projects/${state.slug}`}
                className="font-medium text-navy-800 underline"
              >
                查看前台页面
              </Link>
              {mode === "edit" ? (
                <>
                  {" · "}
                  <Link
                    href="/admin/projects"
                    className="font-medium text-navy-800 underline"
                  >
                    返回列表
                  </Link>
                </>
              ) : null}
            </>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}
