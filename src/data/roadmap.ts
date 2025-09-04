// data/roadmap.ts
// Edit this file to control your roadmap content.

export type RoadmapItemType = "project" | "work" | "education" | "cert";

export type RoadmapItem = {
  id: string;
  type: RoadmapItemType;
  title: string;
  org?: string;                 // company/school
  period: string;               // e.g., "2023 — Present"
  summary: string;              // one-line hook
  details?: string[];           // bullet details for the collapsible area
  tech?: string[];              // shown as badges
  linkLabel?: string;           // optional CTA label
  linkHref?: string;            // optional CTA link
};

export const ROADMAP: RoadmapItem[] = [
  {
    id: "proj-nkt",
    type: "project",
    title: "NKT Cable Analytics Platform",
    org: "NKT (Academic–Industry Project)",
    period: "2024 — 2025",
    summary: "Multi-layered AI-assisted analytics (Vue3 front-end, .NET backend).",
    details: [
      "Semantic Kernel functions, GraphQL to masterPlan API, Mapster DTOs",
      "Azure DevOps pipelines, microservices patterns, CI/CD",
    ],
    tech: ["Vue 3", "C#/.NET", "GraphQL", "Azure DevOps", "Semantic Kernel"],
    linkLabel: "Case Study",
    linkHref: "#",
  },
  {
    id: "edu-bth",
    type: "education",
    title: "BSc Software Engineering",
    org: "Blekinge Tekniska Högskola (BTH)",
    period: "2023 — Present",
    summary: "Software engineering core: web, databases, testing, UX.",
    details: [
      "Unit testing, usability & interaction design, data modeling",
      "Team projects, code reviews, Agile rituals",
    ],
    tech: ["JavaScript/TS", "Next.js", "SQL", "Cypress", "Figma"],
  },
  {
    id: "proj-fl-nonmotor",
    type: "project",
    title: "Florida Non-Motorist Crash Analysis",
    org: "Academic Research",
    period: "2024",
    summary: "Normalized SQL DB (3NF) + Python analytics and visualizations.",
    details: [
      "Stored procedures (trend/leaderboards), matplotlib charts",
      "County heatmaps, risk factors vs. functional class",
    ],
    tech: ["MySQL", "Python", "Pandas", "Matplotlib"],
    linkLabel: "Repo",
    linkHref: "#",
  },
  {
    id: "work-freelance",
    type: "work",
    title: "Freelance Developer",
    org: "Self-employed",
    period: "2022 — Present",
    summary: "Full-stack apps, dashboards, and automation for clients.",
    details: [
      "Auth, CRUD, file storage, deploys on Vercel/Netlify",
      "Content pipelines & analytics integrations",
    ],
    tech: ["Next.js", "Supabase", "Prisma", "Tailwind"],
  },
  {
    id: "cert-sql",
    type: "cert",
    title: "SQL & Data Modeling",
    org: "Certification",
    period: "2024",
    summary: "Advanced joins, normalization, query tuning.",
    tech: ["SQL", "ERD", "Indexing"],
  },
];
