"use client";

import { AuthLayout, LoginForm } from "@rhino-automotive-glass/auth-ui";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  return (
    <AuthLayout
      backgroundImage="/parabrisas-medallones-van-camioneta-autobuses.webp"
      title="Rhino Plan"
      subtitle="Sign in with your Rhino account"
    >
      <LoginForm supabase={supabase} redirectTo="/" />
      <div className="flex flex-col items-center gap-2 text-sm mt-4">
        <Link href="/forgot-password" className="text-blue-600 hover:underline">
          Forgot your password?
        </Link>
        <p className="text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
