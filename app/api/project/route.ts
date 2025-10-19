// app/api/project/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/backend/supabaseClient";

// Cache projects for 30 minutes (updated less frequently)
export const revalidate = 1800;
// Mark as dynamic since we use query parameters
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

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

    // Apply category filter if provided and not "all"
    if (category && category.toLowerCase() !== "all") {
      query = query.ilike("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[/api/project] db error:", error);
      return NextResponse.json({ error: "db" }, { status: 500 });
    }

    const mapped = (data ?? []).map((r) => {
      return {
        id: r.id,
        title: r.title,
        description: r.description ?? "",
        category: r.category ?? "Build",
        github_url: r.github_url ?? "",
        languages: (r.languages as string[]) ?? [],
        cover_image_url: r.cover_image_href ?? undefined,
      };
    });

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("[/api/project] error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
