import { NextResponse } from "next/server";
import { getSkills } from "@/lib/cache/request-cache";

// Cache skills data for 1 hour (skills don't change frequently)
export const revalidate = 3600;

export async function GET() {
  try {
    const skills = await getSkills();
    return NextResponse.json(skills);
  } catch (error) {
    console.error("[/api/skills] error:", error);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }
}
