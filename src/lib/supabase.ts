import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Public client (anon key) — used for tables with anon-friendly RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (service role key) — bypasses RLS, server-side only.
// Used for querying tables like origin_sheets whose RLS only allows authenticated users.
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase; // fallback to anon if not configured
