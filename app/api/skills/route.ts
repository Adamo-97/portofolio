import { NextResponse } from "next/server";
import { supabase } from "@/lib/backend/supabaseClient";

// Cache skills data for 1 hour (skills don't change frequently)
export const revalidate = 3600;

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
  // For each stored icon path, attempt to read its storage metadata and append a
  // cache-busting query param using the file's updated_at timestamp. This lets
  // deployed sites pick up updated files without requiring a full redeploy.
  const mapped = await Promise.all((data ?? []).map(async (r) => {
    const path = r.icon_path ?? "";

    let src: string | undefined;
    if (/^https?:\/\//i.test(path)) {
      src = path;
    } else if (path) {
      // Public URL
      const publicUrl = supabase.storage.from(r.icon_bucket).getPublicUrl(path).data.publicUrl;

      // Try to read file metadata to get updated_at for cache-busting
      try {
        // cast to any because older TS types in this workspace may not include getMetadata
        const storageAny: any = supabase.storage.from(r.icon_bucket);
        const metaRes = await storageAny.getMetadata(path);
        const meta = metaRes?.data;
        if (meta && meta.updated_at) {
          const t = Date.parse(meta.updated_at as string) || Date.now();
          src = `${publicUrl}?v=${t}`;
        } else {
          src = publicUrl;
        }
      } catch (e) {
        // If metadata fails, fall back to the public URL
        src = publicUrl;
      }
    }

    return {
      id: r.id,
      name: r.name,
      category: r.category,      // e.g., "Frontend", "Languages", etc.
      src,                       // public icon URL (Supabase Storage), optionally versioned
      alt: r.icon_alt ?? r.name, // a11y fallback
      // Optional fields expected by UI (safe defaults to preserve design/order)
      weight: 0,
      xOffset: 0,
      yOffset: 0,
    };
  }));

  return NextResponse.json(mapped);
}
