// ============================================================
// ZagranEasy — чтение серверной сессии (/staff, /teacher, /account).
// Отдельно от lib/session.ts ("use server"-модуль с login/logoutAction,
// который импортируют клиентские компоненты) — здесь используется
// next/headers, несовместимый с клиентским бандлом.
// ============================================================

import { cache } from "react";
import { cookies } from "next/headers";
import { apiGet } from "./api";
import type { SessionUser } from "./session";

const COOKIE_NAME = "ze_session";

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

// cache() дедуплицирует /auth/me в рамках одного запроса — layout и page
// защищённых разделов обычно оба вызывают getSessionUser()/getCurrentProfile().
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const token = await getToken();
  if (!token) return null;
  const res = await apiGet<SessionUser>("/auth/me", token);
  if (res.error || !res.data) return null;
  return res.data;
});
