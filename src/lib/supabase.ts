import "server-only";
import { createClient } from "@supabase/supabase-js";

// Admin client (service role key) — bypasses RLS, server-side only.
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for supabaseAdmin");
}
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseServiceRoleKey
);
