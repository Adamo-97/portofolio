// components/skills/categories.ts
/**
 * Skill category definitions and navigation utilities.
 * These should match the categories in your Supabase skill_category table.
 * 
 * Common categories include:
 * - Frontend: React, Vue, Angular, etc.
 * - Backend: Node.js, Python, Java, etc.
 * - Languages: JavaScript, TypeScript, Python, etc.
 * - Database: PostgreSQL, MongoDB, Redis, etc.
 * - DevOps: Docker, Kubernetes, CI/CD, etc.
 * - Tools: Git, VS Code, Figma, etc.
 */

// Update this type to match your actual database categories
export type CategoryKey = 
  | "Frontend" 
  | "Backend" 
  | "Languages" 
  | "Database" 
  | "DevOps" 
  | "Tools"
  | "Cloud"
  | "Mobile"
  | string; // Allow any string for flexibility

export type CategoryInfo = {
  key: CategoryKey;
  title: string;
  blurb: string;
};

// Static category definitions (can be overridden by API data)
// These serve as fallbacks if the API fails
export const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  Frontend: {
    key: "Frontend",
    title: "Frontend",
    blurb: "UI frameworks and libraries for building user interfaces",
  },
  Backend: {
    key: "Backend",
    title: "Backend",
    blurb: "Server-side technologies and frameworks",
  },
  Languages: {
    key: "Languages",
    title: "Languages",
    blurb: "Programming languages and syntax",
  },
  Database: {
    key: "Database",
    title: "Database",
    blurb: "Data storage and management systems",
  },
  DevOps: {
    key: "DevOps",
    title: "DevOps",
    blurb: "Deployment, automation, and infrastructure tools",
  },
  Tools: {
    key: "Tools",
    title: "Tools",
    blurb: "Development tools and utilities",
  },
  Cloud: {
    key: "Cloud",
    title: "Cloud",
    blurb: "Cloud platforms and services",
  },
  Mobile: {
    key: "Mobile",
    title: "Mobile",
    blurb: "Mobile app development frameworks",
  },
};

// Get array of category keys in order
export function getCategoryKeys(): CategoryKey[] {
  return Object.keys(CATEGORIES) as CategoryKey[];
}

// Get next category in sequence (circular)
export function nextCategory(current: CategoryKey): CategoryKey {
  const keys = getCategoryKeys();
  const idx = keys.indexOf(current);
  return keys[(idx + 1) % keys.length];
}

// Get previous category in sequence (circular)
export function prevCategory(current: CategoryKey): CategoryKey {
  const keys = getCategoryKeys();
  const idx = keys.indexOf(current);
  return keys[(idx - 1 + keys.length) % keys.length];
}

// Check if a category exists
export function isCategoryKey(key: string): key is CategoryKey {
  return key in CATEGORIES;
}

// Get category info with fallback
export function getCategoryInfo(key: CategoryKey): CategoryInfo {
  return CATEGORIES[key] || {
    key,
    title: key,
    blurb: "",
  };
}
