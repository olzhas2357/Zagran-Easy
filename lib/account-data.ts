// ============================================================
// ZagranEasy — Кабинет студента: серверные запросы от имени
// залогиненного пользователя (через cookie-сессию), чтобы работал RLS.
// ============================================================

import { createSupabaseServerClient } from "./supabase/server";
import { USE_DB } from "./db";
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

export async function getCurrentUser() {
  if (!USE_DB) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Последняя (текущая) заявка пользователя — MVP-упрощение: один активный
// процесс поступления на аккаунт. Несколько заявок параллельно — будущая фаза.
export async function getMyApplication(userId: string): Promise<Application | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return mapApplicationRow(data);
}
