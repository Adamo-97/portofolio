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

  // 2) map to DTO, attempt to append cache-busting query param using storage metadata
  const mapped = await Promise.all((data ?? []).map(async (r) => {
    const path = r.icon_path ?? "";

    let icon: string | undefined;
    if (/^https?:\/\//i.test(path)) {
      icon = path;
    } else if (path) {
      const publicUrl = supabase.storage.from(r.icon_bucket).getPublicUrl(path).data.publicUrl;

      try {
        // cast to any because TS types for the client may not include getMetadata
        const storageAny: any = supabase.storage.from(r.icon_bucket);
        const metaRes = await storageAny.getMetadata(path);
        const meta = metaRes?.data;
        if (meta && meta.updated_at) {
          const t = Date.parse(meta.updated_at as string) || Date.now();
          icon = `${publicUrl}?v=${t}`;
        } else {
          icon = publicUrl;
        }
      } catch {
        // If metadata fetch fails, fall back to the public URL
        icon = publicUrl;
      }
    }

    return {
      id: r.id,
      title: r.title,
      description: r.details ?? "",
      icon,
      from: r.start_date,
      to: r.end_date ?? null,
    };
  }));

  // 3) sort ascending for left→right reading order
  mapped.sort((a, b) => new Date(a.from!).getTime() - new Date(b.from!).getTime());

  return NextResponse.json(mapped);
}
