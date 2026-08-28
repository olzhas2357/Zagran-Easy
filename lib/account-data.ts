// ============================================================
// ZagranEasy — Кабинет студента: серверные запросы через NestJS API
// от имени залогиненного пользователя.
// ============================================================

import { apiGet } from "./api";
import { getSessionUser, getToken } from "./session";
import type { Application } from "./types";

function mapApplicationRow(row: Record<string, unknown>): Application {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    universityId: (row.university_id as string) ?? null,
    programName: (row.program_name as string) ?? null,
    status: (row.status as Application["status"]) || "submitted",
    steps: (row.steps as Application["steps"]) || [],
    documents: (row.documents as Application["documents"]) || [],
    deadlines: (row.deadlines as Application["deadlines"]) || [],
    paymentTotal: (row.payment_total as number) ?? null,
    paymentCurrency: (row.payment_currency as string) || "₸",
    installmentsTotal: (row.installments_total as number) ?? 12,
    installmentsPaid: (row.installments_paid as number) ?? 0,
    nextPaymentDate: (row.next_payment_date as string) ?? null,
    managerId: (row.manager_id as string) ?? null,
    createdAt: row.created_at as string,
  };
}

export async function getCurrentUser(): Promise<{ id: string; email?: string } | null> {
  const user = await getSessionUser();
  if (!user || user.profile.role !== "student") return null;
  return { id: user.id, email: user.email };
}

// Последняя (текущая) заявка пользователя — MVP-упрощение: один активный
// процесс поступления на аккаунт. Несколько заявок параллельно — будущая фаза.
export async function getMyApplication(userId: string): Promise<Application | null> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>(`/applications?limit=1`, token);
  if (res.error || !res.data || res.data.length === 0) return null;
  const row = res.data[0];
  if (row.user_id !== userId) return null;
  return mapApplicationRow(row);
}
