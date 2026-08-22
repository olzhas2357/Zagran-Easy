"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm({
  title,
  subtitle,
  defaultNext,
  accent = "primary",
}: {
  title: string;
  subtitle: string;
  defaultNext: string;
  accent?: "primary" | "navy";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message === "Invalid login credentials" ? "Неверный email или пароль" : error.message);
      return;
    }
    const next = searchParams.get("next") || defaultNext;
    router.push(next);
    router.refresh();
  }

  const buttonClass = accent === "navy" ? "bg-ze-navy hover:bg-[#182338]" : "bg-ze-primary hover:bg-ze-primary-dark";

  return (
    <div className="w-full max-w-[400px] rounded-[20px] border border-ze-border bg-white p-7 shadow-[0_6px_24px_rgba(15,23,42,0.07)]">
      <h1 className="text-[22px] font-extrabold tracking-tight">{title}</h1>
      <p className="mt-1.5 text-[14px] text-ze-muted">{subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <div>
          <label className="text-[13px] font-semibold text-ze-muted">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-ze-border bg-ze-surface px-4 py-3 text-[15px] text-ze-ink outline-none focus:border-ze-primary"
          />
        </div>
        <div>
          <label className="text-[13px] font-semibold text-ze-muted">Пароль</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-ze-border bg-ze-surface px-4 py-3 text-[15px] text-ze-ink outline-none focus:border-ze-primary"
          />
        </div>

        {error && <div className="rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className={`mt-1.5 rounded-xl py-3.5 text-[15px] font-semibold text-white transition-colors disabled:opacity-60 ${buttonClass}`}
        >
          {loading ? "Входим…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
