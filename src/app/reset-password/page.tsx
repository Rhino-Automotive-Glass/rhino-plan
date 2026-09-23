"use client";

import { AuthLayout, UpdatePasswordForm } from "@rhino-automotive-glass/auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Reached from the recovery email via /auth/callback, which sets the recovery session.
export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <AuthLayout
      backgroundImage="/parabrisas-medallones-van-camioneta-autobuses.webp"
      title="Rhino Plan"
      subtitle="Choose a new password"
    >
      <UpdatePasswordForm supabase={supabase} onSuccess={() => router.replace("/")} />
      <Link href="/login" className="text-sm text-blue-600 hover:underline block text-center mt-4">
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
