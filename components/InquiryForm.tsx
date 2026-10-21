"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { submitInquiry, type InquiryState } from "@/lib/actions";

const initial: InquiryState = { ok: false, message: "" };

const fieldClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-base outline-none ring-copper-400/40 focus:border-navy-700 focus:ring-2";

export function InquiryForm() {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

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
      className="relative space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
        <label>
          网站
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-navy-900">姓名 *</span>
          <input
            name="name"
            required
            maxLength={50}
            autoComplete="name"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-navy-900">电话 *</span>
          <input
            name="phone"
            required
            maxLength={30}
            autoComplete="tel"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-navy-900">邮箱</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-navy-900">单位</span>
          <input
            name="company"
            maxLength={100}
            autoComplete="organization"
            className={fieldClass}
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-navy-900">留言 *</span>
        <textarea
          name="message"
          required
          maxLength={2000}
          rows={5}
          className={fieldClass}
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-400 focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {pending ? "提交中..." : "提交留言"}
      </button>
      {state.message ? (
        <p
          className={`text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
