import { NextResponse } from "next/server";
import { getSkillCategories } from "@/lib/cache/request-cache";

// Cache skill categories for 1 hour (static data)
export const revalidate = 3600;

export async function GET() {
  try {
    const categories = await getSkillCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("[/api/skill-categories] error:", error);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }
}
