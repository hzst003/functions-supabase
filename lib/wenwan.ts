import manifest from "@/public/wenwan/_manifest.json";

export type WenwanItem = {
  no: number;
  name: string;
  category: string;
  categoryKey: string;
  query: string;
  price: number;
  src: string;
};

type ManifestItem = {
  no: number;
  cat: string;
  name: string;
  query: string;
};

const PRICES: Record<number, number> = {
  1: 280,
  2: 180,
  3: 360,
  4: 680,
  5: 2800,
  6: 3600,
  7: 1280,
  8: 4800,
  9: 3600,
  10: 2200,
  11: 260,
  12: 880,
  13: 1280,
  14: 1680,
  15: 480,
  16: 680,
  17: 980,
  18: 180,
  19: 680,
  20: 360,
  21: 220,
  22: 2800,
  23: 1680,
  24: 3600,
  25: 1280,
  26: 880,
  27: 460,
  28: 1280,
  29: 380,
  30: 680,
  31: 2680,
  32: 480,
  33: 980,
  34: 560,
  35: 1680,
  36: 180,
  37: 680,
  38: 860,
  39: 1280,
  40: 480,
  41: 260,
  42: 120,
  43: 380,
  44: 2680,
  45: 1880,
  46: 3600,
  47: 4800,
  48: 2280,
  49: 1680,
  50: 3280,
  51: 680,
  52: 1880,
  53: 2680,
  54: 880,
  55: 1280,
  56: 680,
  57: 980,
  58: 480,
  59: 1680,
  60: 1280,
  61: 6800,
  62: 880,
  63: 680,
  64: 2680,
  65: 1880,
  66: 80,
  67: 360,
  68: 2280,
  69: 480,
  70: 1680,
  71: 1280,
  72: 1880,
  73: 3680,
  74: 2680,
  75: 880,
  76: 1280,
  77: 680,
  78: 1880,
  79: 1280,
  80: 680,
  81: 380,
  82: 880,
  83: 460,
  84: 2680,
  85: 1280,
  86: 1880,
  87: 180,
};

function padNo(no: number) {
  return String(no).padStart(2, "0");
}

function categoryLabel(cat: string) {
  return cat.replace(/^\d+/, "");
}

export function formatWenwanPrice(price: number) {
  return `¥${price.toLocaleString("zh-CN")}`;
}

export function getWenwanItems(): WenwanItem[] {
  return (manifest as ManifestItem[]).map((item) => ({
    no: item.no,
    name: item.name,
    category: categoryLabel(item.cat),
    categoryKey: item.cat,
    query: item.query,
    price: (PRICES[item.no] ?? 0) / 10,
    src: encodeURI(`/wenwan/${padNo(item.no)}-${item.name}.jpg`),
  }));
}

export function getWenwanCategories(items: WenwanItem[] = getWenwanItems()) {
  const seen = new Set<string>();
  const categories: { key: string; label: string }[] = [];
  for (const item of items) {
    if (seen.has(item.categoryKey)) continue;
    seen.add(item.categoryKey);
    categories.push({ key: item.categoryKey, label: item.category });
  }
  return categories;
}
