"use server";

import { headers } from "next/headers";
import { isPhone } from "./format";
import { createInquiry } from "./pb";
import { allowInquiry } from "./rate-limit";

export type InquiryState = {
  ok: boolean;
  message: string;
};

async function clientIp() {
  const headerList = await headers();
  return (
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "local"
  );
}

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const website = String(formData.get("website") || "").trim();
  if (website) {
    return { ok: true, message: "留言已提交，我们会尽快与您联系。" };
  }

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || name.length > 50) {
    return { ok: false, message: "请填写有效姓名（不超过 50 字）。" };
  }
  if (!phone || phone.length > 30 || !isPhone(phone)) {
    return { ok: false, message: "请填写有效联系电话，如手机号或 400 电话。" };
  }
  if (company.length > 100) {
    return { ok: false, message: "单位名称不超过 100 字。" };
  }
  if (!message || message.length > 2000) {
    return { ok: false, message: "请填写留言内容（不超过 2000 字）。" };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "邮箱格式不正确。" };
  }

  if (!allowInquiry(await clientIp())) {
    return {
      ok: false,
      message: "提交过于频繁，请稍后再试或直接致电联系我们。",
    };
  }

  try {
    await createInquiry({
      name,
      phone,
      email: email || undefined,
      company: company || undefined,
      message,
    });
    return { ok: true, message: "留言已提交，我们会尽快与您联系。" };
  } catch (error) {
    console.error("[inquiry] create", error);
    return {
      ok: false,
      message: "提交失败，请稍后重试或直接致电联系我们。",
    };
  }
}
