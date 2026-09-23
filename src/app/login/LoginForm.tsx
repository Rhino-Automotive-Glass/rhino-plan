"use client";

import { useState } from "react";
import { signIn } from "../auth-actions";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const fields = new FormData(event.currentTarget);
    const result = await signIn(
      String(fields.get("email") ?? ""),
      String(fields.get("password") ?? "")
    );
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="input-base" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input-base" />
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary btn-md w-full">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
