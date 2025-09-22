import { NextResponse } from "next/server";
import { supabase } from "@/lib/backend/supabaseClient";

// Ensure no static caching; always hit Supabase
export const revalidate = 0;

export async function GET() {
  // Pull all skills; categories are fixed in your UI model
  const { data, error } = await supabase
    .from("skill")
    .select("id,name,category,icon_bucket,icon_path,icon_alt,created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[/api/skills] db error:", error);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  // Map to the UI-friendly shape your components already use
  const mapped = (data ?? []).map((r) => {
    const path = r.icon_path ?? "";
    const src = /^https?:\/\//i.test(path)
      ? path
      : supabase.storage.from(r.icon_bucket).getPublicUrl(path).data.publicUrl;

    return {
      id: r.id,
      name: r.name,
      category: r.category,      // e.g., "Frontend", "Languages", etc.
      src,                       // public icon URL (Supabase Storage)
      alt: r.icon_alt ?? r.name, // a11y fallback
      // Optional fields expected by UI (safe defaults to preserve design/order)
      weight: 0,
      xOffset: 0,
      yOffset: 0,
    };
  });

  return NextResponse.json(mapped);
}
