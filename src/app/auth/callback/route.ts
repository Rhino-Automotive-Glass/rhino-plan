import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_OTP_TYPES: EmailOtpType[] = [
  "invite",
  "signup",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

// Only same-origin paths; rejects "//host" and "/\host" open redirects.
function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return "/";
  }
  return next;
}

// Handles token-hash email links (?token_hash=&type=) and PKCE codes (?code=).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = getSafeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (searchParams.has("error")) {
    return NextResponse.redirect(`${origin}/auth/error`);
  }

  const supabase = await createClient();

  if (tokenHash && type && VALID_OTP_TYPES.includes(type as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    if (!error) {
      // Recovery must finish on the reset page regardless of `next`.
      const destination = type === "recovery" ? "/reset-password" : next;
      return NextResponse.redirect(new URL(destination, origin));
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}
