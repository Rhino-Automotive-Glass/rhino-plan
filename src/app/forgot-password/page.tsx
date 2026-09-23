"use client";

import { AuthLayout, ForgotPasswordForm } from "@rhino-automotive-glass/auth-ui";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  return (
    <AuthLayout
      backgroundImage="/parabrisas-medallones-van-camioneta-autobuses.webp"
      title="Rhino Plan"
      subtitle="Reset your password"
    >
      <ForgotPasswordForm supabase={supabase} />
      <Link href="/login" className="text-sm text-blue-600 hover:underline block text-center mt-4">
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
