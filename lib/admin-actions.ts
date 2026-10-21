"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  ADMIN_COLLECTION,
  adminProjectsUrl,
  clearAdminSession,
  requireAdmin,
  setAdminToken,
} from "./admin-auth";
import { isPhone } from "./format";
import { createPb, isValidProjectSlug } from "./pb";
import { PROJECT_CATEGORIES } from "./project-constants";

export type AdminFormState = {
  ok: boolean;
  message: string;
  slug?: string;
};

type ProjectFields = {
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
  cover: FormDataEntryValue | null;
};

function parseProjectFields(formData: FormData):
  | { ok: true; fields: ProjectFields }
  | { ok: false; message: string } {
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase();
  const category = String(formData.get("category") || "").trim();
  const yearRaw = String(formData.get("year") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const client = String(formData.get("client") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  let body = String(formData.get("body") || "").trim();
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const cover = formData.get("cover");

  if (!title || title.length > 120) {
    return { ok: false, message: "请填写有效标题（不超过 120 字）。" };
  }
  if (!isValidProjectSlug(slug)) {
    return {
      ok: false,
      message: "slug 仅允许字母、数字与连字符，例如 pudong-5g-sites。",
    };
  }
  if (!PROJECT_CATEGORIES.includes(category as (typeof PROJECT_CATEGORIES)[number])) {
    return { ok: false, message: "请选择有效分类。" };
  }
  const year = Number(yearRaw);
  if (!Number.isInteger(year) || year < 1990 || year > 2100) {
    return { ok: false, message: "请填写有效年份。" };
  }
  if (!location || location.length > 100) {
    return { ok: false, message: "请填写地点（不超过 100 字）。" };
  }
  if (!client || client.length > 100) {
    return { ok: false, message: "请填写业主（不超过 100 字）。" };
  }
  if (!summary || summary.length > 300) {
    return { ok: false, message: "请填写摘要（不超过 300 字）。" };
  }
  if (!body || body.length > 20000) {
    return { ok: false, message: "请填写正文（不超过 20000 字）。" };
  }
  if (!body.includes("<")) {
    body = body
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join("");
  }

  if (cover instanceof File && cover.size > 0) {
    if (cover.size > 5 * 1024 * 1024) {
      return { ok: false, message: "封面不超过 5MB。" };
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(cover.type)) {
      return { ok: false, message: "封面仅支持 JPEG、PNG 或 WebP。" };
    }
  }

  return {
    ok: true,
    fields: {
      title,
      slug,
      category,
      year,
      location,
      client,
      summary,
      body,
      featured,
      published,
      cover,
    },
  };
}

function toPayload(fields: ProjectFields, includeCover: boolean) {
  const payload = new FormData();
  payload.set("title", fields.title);
  payload.set("slug", fields.slug);
  payload.set("category", fields.category);
  payload.set("year", String(fields.year));
  payload.set("location", fields.location);
  payload.set("client", fields.client);
  payload.set("summary", fields.summary);
  payload.set("body", fields.body);
  payload.set("featured", fields.featured ? "true" : "false");
  payload.set("published", fields.published ? "true" : "false");
  if (
    includeCover &&
    fields.cover instanceof File &&
    fields.cover.size > 0
  ) {
    payload.set("cover", fields.cover);
  }
  return payload;
}

function revalidateProjectPaths(slug: string, previousSlug?: string) {
  updateTag("projects");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/projects/${previousSlug}`);
  }
  revalidatePath("/admin/projects");
}

function slugConflictMessage(error: unknown, fallback: string) {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as { response?: { data?: { slug?: { message?: string } } } })
      .response?.data?.slug?.message
  ) {
    return "该 slug 已存在，请换一个。";
  }
  return fallback;
}

export async function loginAdmin(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { ok: false, message: "请填写邮箱和密码。" };
  }

  const pb = createPb();
  try {
    const auth = await pb
      .collection(ADMIN_COLLECTION)
      .authWithPassword(email, password);
    await setAdminToken(auth.token);
  } catch (error) {
    console.error("[admin] login", error);
    return { ok: false, message: "邮箱或密码不正确。" };
  }

  redirect(adminProjectsUrl());
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createProject(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const parsed = parseProjectFields(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  try {
    await pb.collection("projects").create(toPayload(parsed.fields, true));
  } catch (error) {
    console.error("[admin] createProject", error);
    return {
      ok: false,
      message: slugConflictMessage(error, "保存失败，请检查填写内容后重试。"),
    };
  }

  revalidateProjectPaths(parsed.fields.slug);

  return {
    ok: true,
    message: parsed.fields.published
      ? "业绩已发布。"
      : "业绩已保存（未发布）。",
    slug: parsed.fields.slug,
  };
}

export async function updateProject(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !/^[a-z0-9]+$/i.test(id)) {
    return { ok: false, message: "无效的业绩记录。" };
  }

  const parsed = parseProjectFields(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  let previousSlug = "";
  try {
    const existing = await pb.collection("projects").getOne(id);
    previousSlug = String(existing.slug || "");
    await pb
      .collection("projects")
      .update(id, toPayload(parsed.fields, true));
  } catch (error) {
    console.error("[admin] updateProject", error);
    return {
      ok: false,
      message: slugConflictMessage(error, "更新失败，请检查填写内容后重试。"),
    };
  }

  revalidateProjectPaths(parsed.fields.slug, previousSlug);

  return {
    ok: true,
    message: parsed.fields.published
      ? "业绩已更新并发布。"
      : "业绩已更新（未发布）。",
    slug: parsed.fields.slug,
  };
}

type ServiceFields = {
  title: string;
  summary: string;
  body: string;
  sort: number;
  published: boolean;
  cover: FormDataEntryValue | null;
};

function parseServiceFields(formData: FormData):
  | { ok: true; fields: ServiceFields }
  | { ok: false; message: string } {
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  let body = String(formData.get("body") || "").trim();
  const sortRaw = String(formData.get("sort") || "").trim();
  const published = formData.get("published") === "on";
  const cover = formData.get("cover");

  if (!title || title.length > 120) {
    return { ok: false, message: "请填写有效标题（不超过 120 字）。" };
  }
  if (!summary || summary.length > 300) {
    return { ok: false, message: "请填写摘要（不超过 300 字）。" };
  }
  if (!body || body.length > 20000) {
    return { ok: false, message: "请填写正文（不超过 20000 字）。" };
  }
  if (!body.includes("<")) {
    body = body
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join("");
  }
  const sort = Number(sortRaw);
  if (!Number.isInteger(sort) || sort < 0 || sort > 9999) {
    return { ok: false, message: "请填写有效排序号（0–9999）。" };
  }
  if (cover instanceof File && cover.size > 0) {
    if (cover.size > 5 * 1024 * 1024) {
      return { ok: false, message: "封面不超过 5MB。" };
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(cover.type)) {
      return { ok: false, message: "封面仅支持 JPEG、PNG 或 WebP。" };
    }
  }

  return {
    ok: true,
    fields: { title, summary, body, sort, published, cover },
  };
}

function toServicePayload(fields: ServiceFields) {
  const payload = new FormData();
  payload.set("title", fields.title);
  payload.set("summary", fields.summary);
  payload.set("body", fields.body);
  payload.set("sort", String(fields.sort));
  payload.set("published", fields.published ? "true" : "false");
  if (fields.cover instanceof File && fields.cover.size > 0) {
    payload.set("cover", fields.cover);
  }
  return payload;
}

function revalidateServicePaths() {
  updateTag("services");
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function createService(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const parsed = parseServiceFields(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  try {
    await pb.collection("services").create(toServicePayload(parsed.fields));
  } catch (error) {
    console.error("[admin] createService", error);
    return { ok: false, message: "保存失败，请检查填写内容后重试。" };
  }

  revalidateServicePaths();

  return {
    ok: true,
    message: parsed.fields.published
      ? "业务已发布。"
      : "业务已保存（未发布）。",
  };
}

export async function updateService(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !/^[a-z0-9]+$/i.test(id)) {
    return { ok: false, message: "无效的业务记录。" };
  }

  const parsed = parseServiceFields(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  try {
    await pb
      .collection("services")
      .update(id, toServicePayload(parsed.fields));
  } catch (error) {
    console.error("[admin] updateService", error);
    return { ok: false, message: "更新失败，请检查填写内容后重试。" };
  }

  revalidateServicePaths();

  return {
    ok: true,
    message: parsed.fields.published
      ? "业务已更新并发布。"
      : "业务已更新（未发布）。",
  };
}

type NewsFields = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  publishedAt: string;
  published: boolean;
  cover: FormDataEntryValue | null;
};

function parseNewsFields(formData: FormData):
  | { ok: true; fields: NewsFields }
  | { ok: false; message: string } {
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase();
  const summary = String(formData.get("summary") || "").trim();
  let body = String(formData.get("body") || "").trim();
  const publishedAtRaw = String(formData.get("publishedAt") || "").trim();
  const published = formData.get("published") === "on";
  const cover = formData.get("cover");

  if (!title || title.length > 120) {
    return { ok: false, message: "请填写有效标题（不超过 120 字）。" };
  }
  if (!isValidProjectSlug(slug)) {
    return {
      ok: false,
      message: "slug 仅允许字母、数字与连字符，例如 company-award-2026。",
    };
  }
  if (!summary || summary.length > 300) {
    return { ok: false, message: "请填写摘要（不超过 300 字）。" };
  }
  if (!body || body.length > 20000) {
    return { ok: false, message: "请填写正文（不超过 20000 字）。" };
  }
  if (!body.includes("<")) {
    body = body
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join("");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAtRaw)) {
    return { ok: false, message: "请填写有效发布日期。" };
  }
  const publishedAtDate = new Date(`${publishedAtRaw}T00:00:00.000Z`);
  if (Number.isNaN(publishedAtDate.getTime())) {
    return { ok: false, message: "请填写有效发布日期。" };
  }
  const publishedAt = publishedAtDate.toISOString();

  if (cover instanceof File && cover.size > 0) {
    if (cover.size > 5 * 1024 * 1024) {
      return { ok: false, message: "封面不超过 5MB。" };
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(cover.type)) {
      return { ok: false, message: "封面仅支持 JPEG、PNG 或 WebP。" };
    }
  }

  return {
    ok: true,
    fields: { title, slug, summary, body, publishedAt, published, cover },
  };
}

function toNewsPayload(fields: NewsFields) {
  const payload = new FormData();
  payload.set("title", fields.title);
  payload.set("slug", fields.slug);
  payload.set("summary", fields.summary);
  payload.set("body", fields.body);
  payload.set("publishedAt", fields.publishedAt);
  payload.set("published", fields.published ? "true" : "false");
  if (fields.cover instanceof File && fields.cover.size > 0) {
    payload.set("cover", fields.cover);
  }
  return payload;
}

function revalidateAboutPaths() {
  updateTag("settings");
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

function plainTextToHtml(value: string) {
  if (value.includes("<")) return value;
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${line}</p>`)
    .join("");
}

export async function updateAbout(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !/^[a-z0-9]+$/i.test(id)) {
    return { ok: false, message: "无效的公司简介记录。" };
  }

  const aboutSubtitle = String(formData.get("aboutSubtitle") || "").trim();
  let about = String(formData.get("about") || "").trim();
  if (!aboutSubtitle || aboutSubtitle.length > 200) {
    return { ok: false, message: "请填写页头说明（不超过 200 字）。" };
  }
  if (!about || about.length > 20000) {
    return { ok: false, message: "请填写公司简介（不超过 20000 字）。" };
  }
  about = plainTextToHtml(about);

  try {
    const existing = await pb.collection("settings").getOne(id);
    if (!existing?.id) {
      return { ok: false, message: "未找到公司简介记录。" };
    }
    await pb.collection("settings").update(id, { aboutSubtitle, about });
  } catch (error) {
    console.error("[admin] updateAbout", error);
    return { ok: false, message: "保存失败，请稍后重试。" };
  }

  revalidateAboutPaths();

  return { ok: true, message: "关于我们已更新。" };
}

function revalidateNewsPaths(slug: string, previousSlug?: string) {
  updateTag("news");
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/news/${previousSlug}`);
  }
  revalidatePath("/admin/news");
}

export async function createNews(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const parsed = parseNewsFields(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  try {
    await pb.collection("news").create(toNewsPayload(parsed.fields));
  } catch (error) {
    console.error("[admin] createNews", error);
    return {
      ok: false,
      message: slugConflictMessage(error, "保存失败，请检查填写内容后重试。"),
    };
  }

  revalidateNewsPaths(parsed.fields.slug);

  return {
    ok: true,
    message: parsed.fields.published
      ? "新闻已发布。"
      : "新闻已保存（未发布）。",
    slug: parsed.fields.slug,
  };
}

export async function updateNews(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !/^[a-z0-9]+$/i.test(id)) {
    return { ok: false, message: "无效的新闻记录。" };
  }

  const parsed = parseNewsFields(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  let previousSlug = "";
  try {
    const existing = await pb.collection("news").getOne(id);
    previousSlug = String(existing.slug || "");
    await pb.collection("news").update(id, toNewsPayload(parsed.fields));
  } catch (error) {
    console.error("[admin] updateNews", error);
    return {
      ok: false,
      message: slugConflictMessage(error, "更新失败，请检查填写内容后重试。"),
    };
  }

  revalidateNewsPaths(parsed.fields.slug, previousSlug);

  return {
    ok: true,
    message: parsed.fields.published
      ? "新闻已更新并发布。"
      : "新闻已更新（未发布）。",
    slug: parsed.fields.slug,
  };
}

const QUALIFICATIONS_MAX = 5000;

export async function updateQualifications(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !/^[a-z0-9]+$/i.test(id)) {
    return { ok: false, message: "无效的资质能力记录。" };
  }

  const qualifications = String(formData.get("qualifications") || "").trim();
  if (!qualifications || qualifications.length > QUALIFICATIONS_MAX) {
    return {
      ok: false,
      message: `请填写资质能力（不超过 ${QUALIFICATIONS_MAX} 字）。`,
    };
  }

  try {
    const existing = await pb.collection("settings").getOne(id);
    if (!existing?.id) {
      return { ok: false, message: "未找到资质能力记录。" };
    }
    await pb.collection("settings").update(id, { qualifications });
  } catch (error) {
    console.error("[admin] updateQualifications", error);
    return { ok: false, message: "保存失败，请稍后重试。" };
  }

  revalidateAboutPaths();
  revalidatePath("/admin/qualifications");

  return { ok: true, message: "资质能力已更新。" };
}

type MilestoneFields = {
  year: number;
  title: string;
  description: string;
};

function parseMilestoneFields(formData: FormData):
  | { ok: true; fields: MilestoneFields }
  | { ok: false; message: string } {
  const yearRaw = String(formData.get("year") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();

  const year = Number(yearRaw);
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return { ok: false, message: "请填写有效年份（1900–2100）。" };
  }
  if (!title || title.length > 120) {
    return { ok: false, message: "请填写有效标题（不超过 120 字）。" };
  }
  if (!description || description.length > 2000) {
    return { ok: false, message: "请填写说明（不超过 2000 字）。" };
  }

  return { ok: true, fields: { year, title, description } };
}

function toMilestonePayload(fields: MilestoneFields) {
  const payload = new FormData();
  payload.set("year", String(fields.year));
  payload.set("title", fields.title);
  payload.set("description", fields.description);
  return payload;
}

function revalidateMilestonePaths() {
  updateTag("milestones");
  revalidatePath("/about");
  revalidatePath("/admin/milestones");
}

export async function createMilestone(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const parsed = parseMilestoneFields(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  try {
    await pb.collection("milestones").create(toMilestonePayload(parsed.fields));
  } catch (error) {
    console.error("[admin] createMilestone", error);
    return { ok: false, message: "保存失败，请检查填写内容后重试。" };
  }

  revalidateMilestonePaths();

  return { ok: true, message: "发展历程已添加。" };
}

export async function updateMilestone(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !/^[a-z0-9]+$/i.test(id)) {
    return { ok: false, message: "无效的历程记录。" };
  }

  const parsed = parseMilestoneFields(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  try {
    await pb
      .collection("milestones")
      .update(id, toMilestonePayload(parsed.fields));
  } catch (error) {
    console.error("[admin] updateMilestone", error);
    return { ok: false, message: "更新失败，请检查填写内容后重试。" };
  }

  revalidateMilestonePaths();

  return { ok: true, message: "发展历程已更新。" };
}

const CONTACT_ADDRESS_MAX = 200;

function revalidateContactPaths() {
  updateTag("settings");
  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/admin/contact");
}

export async function updateContact(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !/^[a-z0-9]+$/i.test(id)) {
    return { ok: false, message: "无效的联系方式记录。" };
  }

  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const address = String(formData.get("address") || "").trim();

  if (!phone || phone.length > 30 || !isPhone(phone)) {
    return { ok: false, message: "请填写有效联系电话，如手机号或 400 电话。" };
  }
  if (!email || email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "请填写有效邮箱。" };
  }
  if (!address || address.length > CONTACT_ADDRESS_MAX) {
    return {
      ok: false,
      message: `请填写地址（不超过 ${CONTACT_ADDRESS_MAX} 字）。`,
    };
  }

  try {
    const existing = await pb.collection("settings").getOne(id);
    if (!existing?.id) {
      return { ok: false, message: "未找到联系方式记录。" };
    }
    await pb.collection("settings").update(id, { phone, email, address });
  } catch (error) {
    console.error("[admin] updateContact", error);
    return { ok: false, message: "保存失败，请稍后重试。" };
  }

  revalidateContactPaths();

  return { ok: true, message: "联系方式已更新。" };
}

const LOGO_MAX_BYTES = 2 * 1024 * 1024;
const LOGO_TYPES = ["image/jpeg", "image/png", "image/webp"];

function revalidateLogoPaths() {
  updateTag("settings");
  revalidatePath("/", "layout");
  revalidatePath("/admin/logo");
}

export async function updateLogo(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !/^[a-z0-9]+$/i.test(id)) {
    return { ok: false, message: "无效的标志记录。" };
  }

  const companyName = String(formData.get("companyName") || "").trim();
  if (!companyName || companyName.length > 40) {
    return { ok: false, message: "请填写标志右侧文字（不超过 40 字）。" };
  }

  const uploaded = formData.get("logo");
  const file =
    uploaded instanceof File && uploaded.size > 0 ? uploaded : null;
  const remove = formData.get("removeLogo") === "on";

  if (file) {
    if (file.size > LOGO_MAX_BYTES) {
      return { ok: false, message: "标志图片不超过 2MB。" };
    }
    if (!LOGO_TYPES.includes(file.type)) {
      return { ok: false, message: "标志仅支持 JPEG、PNG 或 WebP。" };
    }
  }

  try {
    const existing = await pb.collection("settings").getOne(id);
    if (!existing?.id) {
      return { ok: false, message: "未找到标志记录。" };
    }
    if (file) {
      const payload = new FormData();
      payload.set("companyName", companyName);
      payload.set("logo", file);
      await pb.collection("settings").update(id, payload);
    } else if (remove) {
      await pb.collection("settings").update(id, { companyName, logo: "" });
    } else {
      await pb.collection("settings").update(id, { companyName });
    }
  } catch (error) {
    console.error("[admin] updateLogo", error);
    return { ok: false, message: "保存失败，请稍后重试。" };
  }

  revalidateLogoPaths();

  return { ok: true, message: "页头已更新。" };
}

const FOOTER_NAME_MAX = 40;
const FOOTER_TAGLINE_MAX = 40;

function revalidateFooterPaths() {
  updateTag("settings");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/admin/footer");
  revalidatePath("/admin/logo");
}

export async function updateFooterIntro(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const pb = await requireAdmin();
  if (!pb) {
    return { ok: false, message: "登录已失效，请重新登录。" };
  }

  const id = String(formData.get("id") || "").trim();
  if (!id || !/^[a-z0-9]+$/i.test(id)) {
    return { ok: false, message: "无效的页脚记录。" };
  }

  const companyName = String(formData.get("companyName") || "").trim();
  const tagline = String(formData.get("tagline") || "").trim();
  if (!companyName || companyName.length > FOOTER_NAME_MAX) {
    return {
      ok: false,
      message: `请填写公司名称（不超过 ${FOOTER_NAME_MAX} 字）。`,
    };
  }
  if (!tagline || tagline.length > FOOTER_TAGLINE_MAX) {
    return {
      ok: false,
      message: `请填写标语（不超过 ${FOOTER_TAGLINE_MAX} 字）。`,
    };
  }

  try {
    const existing = await pb.collection("settings").getOne(id);
    if (!existing?.id) {
      return { ok: false, message: "未找到页脚记录。" };
    }
    await pb.collection("settings").update(id, { companyName, tagline });
  } catch (error) {
    console.error("[admin] updateFooterIntro", error);
    return { ok: false, message: "保存失败，请稍后重试。" };
  }

  revalidateFooterPaths();

  return { ok: true, message: "页脚已更新。" };
}
