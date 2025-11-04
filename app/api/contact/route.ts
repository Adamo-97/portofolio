// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { getContactSocials } from "@/lib/cache/request-cache";

// Cache contact socials for 1 hour (rarely changes)
export const revalidate = 3600;

export async function GET() {
  try {
    const socials = await getContactSocials();
    return NextResponse.json(socials);
  } catch (error) {
    console.error("[/api/contact] error:", error);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }
}
