import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Public client for server-side access to public tables only.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (service role key) — bypasses RLS, server-side only.
// Used for querying tables like origin_sheets whose RLS only allows authenticated users.
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for supabaseAdmin");
}
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
