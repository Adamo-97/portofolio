import { NextResponse } from "next/server";
import { supabase } from "@/lib/backend/supabaseClient";

// Cache skill categories for 1 hour (static data)
export const revalidate = 3600;

export async function GET() {
  const { data, error } = await supabase
    .from("skill_category")
    .select("name,title,blurb");

  if (error) {
    console.error("[/api/skill-categories] db error:", error);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  // Alphabetical is fine; no index column needed
  const mapped = (data ?? [])
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({
      key: c.name,                 // stable key used by skill.category FK
      title: c.title ?? c.name,    // fallback to name
      blurb: c.blurb ?? "",        // optional description
    }));

  return NextResponse.json(mapped);
}
