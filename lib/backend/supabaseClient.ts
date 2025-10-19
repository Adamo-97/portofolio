// lib/backend/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Validate required environment variables at startup
const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;

if (!url) {
  throw new Error("Missing required environment variable: SUPABASE_URL");
}

if (!anon) {
  throw new Error("Missing required environment variable: SUPABASE_ANON_KEY");
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: false },
});
