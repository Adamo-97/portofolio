import { NextResponse } from "next/server";
import { getRoadmap } from "@/lib/cache/request-cache";

// Cache roadmap data for 2 hours (rarely changes)
export const revalidate = 7200;

export async function GET() {
  try {
    const roadmap = await getRoadmap();
    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("[/api/roadmap] error:", error);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }
}
