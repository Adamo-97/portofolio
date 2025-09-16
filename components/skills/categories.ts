// Small config for the 4 categories. Extend blurbs freely.
export type CategoryKey = "Build" | "Design" | "Data" | "Workflow";

export const CATEGORIES: Record<CategoryKey, { title: string; blurb: string }> = {
  Build:    { title: "Build",    blurb: "Languages, frameworks, shipping production-grade features." },
  Design:   { title: "Design",   blurb: "Interaction, motion, component systems that scale." },
  Data:     { title: "Data",     blurb: "Schemas, APIs, queries and pipelines that don’t cry." },
  Workflow: { title: "Workflow", blurb: "Tooling, automation and glue code for calm ops." },
};
