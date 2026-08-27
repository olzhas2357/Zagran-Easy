"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.push(searchParams.get("next") || "/admin");
  }

  return (
    <div className="w-full max-w-[400px] rounded-[20px] border border-slate-200 bg-white p-7 shadow-[0_6px_24px_rgba(15,23,42,0.07)]">
      <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900">ZagranEasy Admin</h1>
      <p className="mt-1.5 text-[14px] text-slate-500">Вход для администраторов и менеджеров.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <div>
          <label className="text-[13px] font-semibold text-slate-500">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-slate-900 outline-none focus:border-blue-600"
          />
        </div>
        <div>
          <label className="text-[13px] font-semibold text-slate-500">Пароль</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-slate-900 outline-none focus:border-blue-600"
          />
        </div>

        {error && <div className="rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-1.5 rounded-xl bg-blue-600 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Входим…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
