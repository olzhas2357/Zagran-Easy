"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight, TriangleAlert } from "lucide-react";
import { loginAction } from "@/lib/session";

export function LoginForm({
  roleLabel,
  subtitle,
  defaultNext,
  accent = "primary",
}: {
  roleLabel: string;
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
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await loginAction(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    const next = searchParams.get("next") || defaultNext;
    router.push(next);
    router.refresh();
  }

  const buttonClass = accent === "navy" ? "bg-ze-navy hover:bg-[#182338]" : "bg-ze-primary hover:bg-ze-primary-dark";
  const sessionExpired = searchParams.get("reason") === "session_expired";

  // Красиво форматируем заголовок без уродливых запятых и пробелов
  const welcomeText = roleLabel && roleLabel.trim() 
    ? `Добро пожаловать, ${roleLabel.trim()}!` 
    : "Добро пожаловать!";

  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center overflow-y-auto bg-[#FAFCFF] px-4 py-6 sm:px-6">
      
      {/* Задний фон на весь экран */}
      <div 
        className="absolute inset-0 h-full w-full"
        style={{ background: "linear-gradient(135deg, #EAF2FF 0%, #F3F8FF 28%, #FAFCFF 52%, #EAF9FB 100%)" }}
      >
        <div className="pointer-events-none absolute -left-28 top-[-8%] h-[380px] w-[380px] rounded-full bg-[#CFE2FF]/60 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 bottom-[-12%] h-[340px] w-[340px] rounded-full bg-[#BFEFF7]/60 blur-[100px]" />
      </div>

      {/* Увеличенная карточка: max-w-[400px], больше отступов px-8 py-9 */}
      <div className="relative z-10 my-auto w-full max-w-[400px] rounded-[28px] border border-white/60 bg-white p-7 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:p-9">
        
        {/* Компактный и изящный логотип */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center filter drop-shadow-[0_10px_20px_rgba(26,86,219,0.14)]">
          <Image
            src="/logo-icon.png"
            alt="ZagranEasy"
            width={669}
            height={477}
            priority
            className="h-auto w-full object-contain"
          />
        </div>

        {/* Скорректированный увеличенный заголовок */}
        <h1 className="mt-5 text-center text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[25px]">
          {welcomeText}
        </h1>
        <p className="mx-auto mt-2 max-w-[300px] text-center text-[14px] leading-relaxed text-ze-muted">{subtitle}</p>

        {sessionExpired && (
          <div className="mt-5 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-[13px] leading-relaxed text-amber-900">
            <TriangleAlert className="mt-0.5 h-4 w-4 flex-none" />
            <span>Сессия истекла. Войдите в аккаунт ещё раз.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`${sessionExpired ? "mt-5" : "mt-7"} flex flex-col gap-4`}>
          <div>
            <label className="text-[13px] font-semibold text-ze-muted">Электронная почта</label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
              <input
                type="email"
                required
                placeholder="Введите электронную почту"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-ze-border bg-ze-surface py-3 pl-10 pr-4 text-[14px] text-ze-ink outline-none transition-colors placeholder:text-slate-400 focus:border-ze-primary focus:ring-[3px] focus:ring-ze-primary/10"
              />
            </div>
          </div>
          
          <div>
            <label className="text-[13px] font-semibold text-ze-muted">Пароль</label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-ze-border bg-ze-surface py-3 pl-10 pr-10 text-[14px] text-ze-ink outline-none transition-colors placeholder:text-slate-400 focus:border-ze-primary focus:ring-[3px] focus:ring-ze-primary/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:text-ze-ink"
              >
                {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
              </button>
            </div>
          </div>

          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold text-white transition-colors disabled:opacity-60 ${buttonClass}`}
          >
            {loading ? "Входим…" : "Войти"}
            {!loading && <ArrowRight className="h-4 w-4" strokeWidth={2} />}
          </button>
        </form>
      </div>
    </div>
  );
}
