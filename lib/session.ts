"use server";

// ============================================================
// ZagranEasy — серверная сессия для /staff, /teacher, /account.
// Токен NestJS (/auth/login) хранится в httpOnly-cookie, а не в
// localStorage (в отличие от /admin), т.к. эти страницы — server
// components и читают данные на сервере при каждом запросе.
// ============================================================

import { cookies } from "next/headers";
import { api, apiGet } from "./api";

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

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = await getToken();
  if (!token) return null;
  const res = await apiGet<SessionUser>("/auth/me", token);
  if (res.error || !res.data) return null;
  return res.data;
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
