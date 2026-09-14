"use client";

// ============================================================
// ZagranEasy — auth-контекст для админ-панели: логинится через
// NestJS (/auth/login, оборачивает Supabase Auth), хранит access_token
// в localStorage и подставляет его во все запросы к API.
// ============================================================

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "./api";
import { logoutAction, persistSessionAction } from "./session";

export type Role = "admin" | "manager" | "teacher" | "student" | "parent";

interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  [key: string]: unknown;
}

interface User {
  id: string;
  email?: string;
  profile: Profile;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const TOKEN_KEY = "ze_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const saved = localStorage.getItem(TOKEN_KEY);

    Promise.resolve()
      .then(() => (saved ? api<User>("/auth/me", { token: saved }) : null))
      .then(async (res) => {
        if (cancelled) return;
        if (saved && res?.data && !res.error) {
          await persistSessionAction(saved);
          if (cancelled) return;
          setUser(res.data);
          setToken(saved);
        } else if (saved) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email: string, password: string) {
    const res = await api<{
      user: { id: string; email?: string };
      session: { access_token: string; refresh_token: string; expires_at?: number } | null;
      profile: Profile | null;
    }>("/auth/login", { method: "POST", body: { email, password } });

    if (res.error || !res.data) return { error: res.error || "Не удалось войти" };
    if (!res.data.session || !res.data.profile) return { error: "Профиль не найден" };

    const newToken = res.data.session.access_token;
    await persistSessionAction(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser({ id: res.data.user.id, email: res.data.user.email, profile: res.data.profile });
    return {};
  }

  async function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    await logoutAction();
  }

  const role = user?.profile?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        // Строгая изоляция порталов: manager — это /staff, не /admin.
        isAdmin: role === "admin",
        isTeacher: role === "teacher",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
