// lib/cache/request-cache.ts
/**
 * Request-level caching utilities using React Cache API
 * These cache for the duration of a single request, preventing duplicate fetches
 */
import { cache } from "react";
import { supabase } from "@/lib/backend/supabaseClient";

/**
 * Cached skills fetch - deduplicates requests during SSR/RSC
 */
export const getSkills = cache(async () => {
  const { data, error } = await supabase
    .from("skill")
    .select("id,name,category,icon_bucket,icon_path,icon_alt,created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[cache/getSkills] db error:", error);
    throw new Error("Failed to fetch skills");
  }

  return (data ?? []).map((r) => {
    const path = r.icon_path ?? "";
    const src = /^https?:\/\//i.test(path)
      ? path
      : supabase.storage.from(r.icon_bucket).getPublicUrl(path).data.publicUrl;

    return {
      id: r.id,
      name: r.name,
      category: r.category,
      src,
      alt: r.icon_alt ?? r.name,
      weight: 0,
      xOffset: 0,
      yOffset: 0,
    };
  });
});

/**
 * Cached projects fetch
 */
export const getProjects = cache(async (category?: string | null) => {
  let query = supabase
    .from("project")
    .select(`
      id,
      title,
      description,
      category,
      github_url,
      languages,
      cover_image_href,
      sort_order
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (category && category.toLowerCase() !== "all") {
    query = query.ilike("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[cache/getProjects] db error:", error);
    throw new Error("Failed to fetch projects");
  }

  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    category: r.category ?? "Build",
    github_url: r.github_url ?? "",
    languages: (r.languages as string[]) ?? [],
    cover_image_url: r.cover_image_href ?? undefined,
  }));
});

/**
 * Cached roadmap fetch
 */
export const getRoadmap = cache(async () => {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("roadmap_item")
    .select("id,title,details,start_date,end_date,icon_bucket,icon_path,icon_alt")
    .lte("start_date", nowIso)
    .order("start_date", { ascending: false })
    .limit(5);

  if (error) {
    console.error("[cache/getRoadmap] db error:", error);
    throw new Error("Failed to fetch roadmap");
  }

  const mapped = (data ?? []).map((r) => {
    const path = r.icon_path ?? "";
    const icon = /^https?:\/\//i.test(path)
      ? path
      : supabase.storage.from(r.icon_bucket).getPublicUrl(path).data.publicUrl;

    return {
      id: r.id,
      title: r.title,
      description: r.details ?? "",
      icon,
      from: r.start_date,
      to: r.end_date ?? null,
    };
  });

  // Sort ascending for timeline
  mapped.sort((a, b) => new Date(a.from!).getTime() - new Date(b.from!).getTime());

  return mapped;
});

/**
 * Cached skill categories fetch
 */
export const getSkillCategories = cache(async () => {
  const { data, error } = await supabase
    .from("skill_category")
    .select("key,title,blurb,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[cache/getSkillCategories] db error:", error);
    throw new Error("Failed to fetch skill categories");
  }

  return data ?? [];
});

/**
 * Cached contact social links fetch
 */
export const getContactSocials = cache(async () => {
  const { data, error } = await supabase
    .from("contact_social")
    .select("id,name,href,svg_path,viewbox,is_active,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("[cache/getContactSocials] db error:", error);
    throw new Error("Failed to fetch contact socials");
  }

  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.name,
    href: r.href,
    svgPath: r.svg_path,
    viewBox: r.viewbox ?? "0 0 24 24",
  }));
});
