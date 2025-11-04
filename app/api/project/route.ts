// app/api/project/route.ts
import { NextResponse } from "next/server";
import { getProjects } from "@/lib/cache/request-cache";

// Cache projects for 30 minutes (updated less frequently)
export const revalidate = 1800;
// Mark as dynamic since we use query parameters
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const projects = await getProjects(category);
    return NextResponse.json(projects);
  } catch (err) {
    console.error("[/api/project] error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
