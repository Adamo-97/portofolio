import { NextResponse } from "next/server";
import { supabase } from "@/lib/backend/supabaseClient";

export async function GET() {
  // Tiny ping: try a lightweight select from a small table
  const { error } = await supabase.from("profile").select("id").limit(1);
  if (error) {
    console.error("[health] supabase error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
