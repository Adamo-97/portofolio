// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/backend/supabaseClient";
export const revalidate = 0;

export async function GET() {
  const { data, error } = await supabase
    .from("contact_social")
    .select("id,name,href,svg_path,viewbox,is_active,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("[/api/contact] db error:", error);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  const mapped = (data ?? []).map((r) => ({
    id: r.id,
    title: r.name,
    href: r.href,
    svgPath: r.svg_path,
    viewBox: r.viewbox ?? "0 0 24 24",
  }));

  return NextResponse.json(mapped);
}
