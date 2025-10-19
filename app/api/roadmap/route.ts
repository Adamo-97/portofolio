import { NextResponse } from "next/server";
import { supabase } from "@/lib/backend/supabaseClient";

// Cache roadmap data for 2 hours (rarely changes)
export const revalidate = 7200;

export async function GET() {
  // 1) get newest 5 by start_date that are not in the future
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("roadmap_item")
    .select("id,title,details,start_date,end_date,icon_bucket,icon_path,icon_alt")
    .lte("start_date", nowIso)
    .order("start_date", { ascending: false })
    .limit(5);

  if (error) {
    console.error("[/api/roadmap] db error:", error);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  // 2) map to DTO
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

  // 3) sort ascending for left→right reading order
  mapped.sort((a, b) => new Date(a.from!).getTime() - new Date(b.from!).getTime());

  return NextResponse.json(mapped);
}
