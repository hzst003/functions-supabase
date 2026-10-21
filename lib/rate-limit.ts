const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

export function allowInquiry(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((ts) => now - ts < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 5000) {
    for (const [key, stamps] of hits) {
      if (!stamps.some((ts) => now - ts < WINDOW_MS)) hits.delete(key);
    }
  }
  return true;
}
