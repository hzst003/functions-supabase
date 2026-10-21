export function readPage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);
  if (!Number.isInteger(page) || page < 1 || page > 1000) return 1;
  return page;
}

export function pageHref(
  base: string,
  page: number,
  query?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function readCategory(
  value: string | string[] | undefined,
  allowed: readonly string[],
) {
  const raw = (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
  return allowed.includes(raw) ? raw : "";
}

export function serviceAnchor(id: string) {
  return `service-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

const PHONE_RE =
  /^(?:\+?86[-\s]?)?(?:1[3-9]\d{9}|0\d{2,3}[-\s]?\d{7,8}|400[-\s]?\d{3}[-\s]?\d{4}|800[-\s]?\d{3}[-\s]?\d{4})$/;

export function isPhone(value: string) {
  return PHONE_RE.test(value);
}

export function phoneHref(phone: string) {
  const compact = phone.replace(/[^\d+]/g, "");
  return compact ? `tel:${compact}` : "";
}

export function mailHref(email: string) {
  return email.includes("@") ? `mailto:${email}` : "";
}

export function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
