export const PROJECT_CATEGORIES = [
  "5G基站",
  "光纤传输",
  "室分覆盖",
  "弱电智能化",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
