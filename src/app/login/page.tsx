"use client";

import { AuthLayout, LoginForm } from "@rhino-automotive-glass/auth-ui";
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
    </AuthLayout>
  );
}
