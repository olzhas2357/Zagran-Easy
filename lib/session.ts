"use server";

// ============================================================
// ZagranEasy — server actions логина/логаута для /staff, /teacher, /account.
// Токен NestJS (/auth/login) хранится в httpOnly-cookie, а не в
// localStorage (в отличие от /admin). Импортируется клиентскими компонентами
// (LoginForm, SignOutButton) — держите этот файл свободным от next/headers
// импортов вне action-функций и от неэкшн-экспортов (см. lib/session-data.ts).
// ============================================================

import { cookies } from "next/headers";
import { api } from "./api";

const COOKIE_NAME = "ze_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 дней

export interface SessionProfile {
  id: string;
  role: "admin" | "manager" | "teacher" | "student" | "parent";
  full_name: string | null;
  [key: string]: unknown;
}

export interface SessionUser {
  id: string;
  email?: string;
  profile: SessionProfile;
}

export async function loginAction(email: string, password: string): Promise<{ error?: string; role?: string }> {
  const res = await api<{
    user: { id: string; email?: string };
    session: { access_token: string; refresh_token: string; expires_at?: number } | null;
    profile: SessionProfile | null;
  }>("/auth/login", { method: "POST", body: { email, password } });

  if (res.error || !res.data) return { error: res.error || "Не удалось войти" };
  if (!res.data.session || !res.data.profile) return { error: "Профиль не найден" };

  const store = await cookies();
  store.set(COOKIE_NAME, res.data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return { role: res.data.profile.role };
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  store.delete(COOKIE_NAME);
  if (token) {
    await api("/auth/logout", { method: "POST", token }).catch(() => {});
  }
}
