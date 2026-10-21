import { cookies } from "next/headers";
import { createPb, PB_URL } from "./pb";
import { ADMIN_COLLECTION, ADMIN_COOKIE } from "./admin-constants";

export { ADMIN_COLLECTION, ADMIN_COOKIE };

const COOKIE_MAX_AGE = 60 * 60 * 24 * 5; // 5 days

export async function setAdminToken(token: string) {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function getAdminToken() {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value || "";
}

export async function getAdminPb() {
  const pb = createPb();
  const token = await getAdminToken();
  if (token) {
    pb.authStore.save(token, null);
  }
  return pb;
}

export async function requireAdmin() {
  const pb = await getAdminPb();
  if (!pb.authStore.isValid) {
    return null;
  }
  try {
    await pb.collection(ADMIN_COLLECTION).authRefresh();
    return pb;
  } catch {
    pb.authStore.clear();
    await clearAdminSession();
    return null;
  }
}

export function adminLoginUrl() {
  return "/admin/login";
}

export function adminProjectsUrl() {
  return "/admin/projects";
}

export function adminProjectsNewUrl() {
  return "/admin/projects/new";
}

export { PB_URL };
