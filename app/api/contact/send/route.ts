import { NextResponse } from "next/server";
import crypto from "crypto";
import { isValidEmail, clamp, NAME_MAX, MESSAGE_MAX } from "@/lib/contact/validate";
import { sendContactMail } from "@/lib/contact/mailer";

export const runtime = "nodejs"; // ensure Node runtime for nodemailer

const MAX_TOTAL_MB = 10; // server-side guard to match your UI
const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024;

// naive in-memory rate limit (per IP); swap for Redis in prod if you like
const bucket = new Map<string, { count: number; ts: number }>();
function ratelimit(ip: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const cur = bucket.get(ip);
  if (!cur || now - cur.ts > windowMs) {
    bucket.set(ip, { count: 1, ts: now });
    return true;
  }
  if (cur.count >= limit) return false;
  cur.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";
    if (!ratelimit(ip)) {
      return NextResponse.json({ ok: false, error: "Too many requests. Please try later." }, { status: 429 });
    }

    const form = await req.formData();
    const name = clamp(String(form.get("name") ?? ""), NAME_MAX);
    const email = String(form.get("email") ?? "").trim();
    const message = clamp(String(form.get("message") ?? ""), MESSAGE_MAX);

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }

    const files = form.getAll("files");
    let total = 0;
    const attachments = [];
    for (const f of files) {
      if (typeof File !== "undefined" && f instanceof File) {
        total += f.size;
        if (total > MAX_TOTAL_BYTES) {
          return NextResponse.json({ ok: false, error: `Attachments exceed ${MAX_TOTAL_MB} MB.` }, { status: 400 });
        }
        const buf = Buffer.from(await f.arrayBuffer());
        attachments.push({ name: f.name, type: f.type, data: buf });
      }
    }

    await sendContactMail({ name, email, message, attachments });

    // log only a hash of the receiver (keeps your address secret in logs)
    const hashTo = process.env.CONTACT_TO
      ? crypto.createHash("sha256").update(process.env.CONTACT_TO).digest("hex").slice(0, 12)
      : "unknown";

    return NextResponse.json({ ok: true, toHash: hashTo });
  } catch (err) {
    console.error("contact/send error:", err);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
