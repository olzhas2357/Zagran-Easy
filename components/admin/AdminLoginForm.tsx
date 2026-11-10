"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    // Главный контейнер фиксируем на весь экран, чтобы фон не собирался в квадрат
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center overflow-y-auto bg-[#FAFCFF] px-4 py-6 sm:px-6">
      
      {/* Задний фон на весь экран с размытыми кругами по углам */}
      <div 
        className="absolute inset-0 h-full w-full"
        style={{ background: "linear-gradient(135deg, #EAF2FF 0%, #F3F8FF 28%, #FAFCFF 52%, #EAF9FB 100%)" }}
      >
        <div className="pointer-events-none absolute -left-28 top-[-8%] h-[380px] w-[380px] rounded-full bg-[#CFE2FF]/60 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 bottom-[-12%] h-[340px] w-[340px] rounded-full bg-[#BFEFF7]/60 blur-[100px]" />
      </div>

      {/* Крупная аккуратная карточка: max-w-[400px], больше отступов p-7 sm:p-9 */}
      <div className="relative z-10 my-auto w-full max-w-[400px] rounded-[28px] border border-white/60 bg-white p-7 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:p-9">
        
        {/* Изящный логотип */}
        <div className="mx-auto flex h-14 w-32 items-center justify-center filter drop-shadow-[0_10px_20px_rgba(26,86,219,0.14)]">
          <Image
            src="/zagraneasy-logo.png"
            alt="ZagranEasy"
            width={1080}
            height={650}
            priority
            className="h-full w-full object-contain"
          />
        </div>

        {/* Чистый заголовок без запятых */}
        <h1 className="mt-5 text-center text-[24px] font-extrabold tracking-tight text-slate-900 sm:text-[25px]">
          ZagranEasy Admin
        </h1>
        <p className="mx-auto mt-2 max-w-[300px] text-center text-[14px] leading-relaxed text-slate-500">
          Вход для администраторов и менеджеров.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-semibold text-slate-500">Email</label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
              <input
                type="email"
                required
                placeholder="Введите ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-[14px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
              />
            </div>
          </div>
          
          <div>
            <label className="text-[13px] font-semibold text-slate-500">Пароль</label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-[14px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:text-slate-900"
              >
                {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
              </button>
            </div>
          </div>

          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Входим…" : "Войти"}
            {!loading && <ArrowRight className="h-4 w-4" strokeWidth={2} />}
          </button>
        </form>
      </div>
    </div>
  );
}
