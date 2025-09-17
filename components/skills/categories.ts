// Small config for the 6 categories. Extend blurbs freely.
export type CategoryKey =
  | "Languages"
  | "Frontend"
  | "Backend & Data"
  | "Mobile"
  | "Design & IDEs"
  | "QA & Workflow";

// Explicit order so cycling is deterministic.
export const CATEGORY_ORDER: CategoryKey[] = [
  "Languages",
  "Frontend",
  "Backend & Data",
  "Mobile",
  "Design & IDEs",
  "QA & Workflow",
];

export const CATEGORIES: Record<
  CategoryKey,
  { title: string; blurb: string }
> = {
  Languages: {
    title: "Languages",
    blurb: "Core programming languages that power everything else.",
  },
  Frontend: {
    title: "Frontend",
    blurb: "Interfaces, frameworks, and the craft of the browser.",
  },
  "Backend & Data": {
    title: "Backend & Data",
    blurb: "APIs, services, storage engines, and query layers.",
  },
  Mobile: {
    title: "Mobile",
    blurb: "Native and cross-platform stacks for phones and tablets.",
  },
  "Design & IDEs": {
    title: "Design & IDEs",
    blurb: "Visual tools and editors that shape the dev loop.",
  },
  "QA & Workflow": {
    title: "QA & Workflow",
    blurb: "Testing, automation, and the glue for calm ops.",
  },
};

// Legacy shim (so "Build" | "Design" | "Data" | "Workflow" still work if passed in)
type OldKey = "Build" | "Design" | "Data" | "Workflow";
const LEGACY_TO_NEW: Record<OldKey, CategoryKey> = {
  Build: "Frontend", // adjust to taste
  Design: "Design & IDEs",
  Data: "Backend & Data",
  Workflow: "QA & Workflow",
};

export const normalizeCategory = (k?: string): CategoryKey | undefined => {
  if (!k) return undefined;
  if ((CATEGORY_ORDER as string[]).includes(k)) return k as CategoryKey;
  return LEGACY_TO_NEW[k as OldKey];
};

export const nextCategory = (k: CategoryKey): CategoryKey => {
  const i = CATEGORY_ORDER.indexOf(k);
  return CATEGORY_ORDER[(i + 1) % CATEGORY_ORDER.length];
};

export const prevCategory = (k: CategoryKey): CategoryKey => {
  const i = CATEGORY_ORDER.indexOf(k);
  return CATEGORY_ORDER[(i - 1 + CATEGORY_ORDER.length) % CATEGORY_ORDER.length];
};
