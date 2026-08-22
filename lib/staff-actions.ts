"use server";

// ============================================================
// ZagranEasy — Кабинет менеджера: серверные экшены (мутации)
// Все проверки прав идут через RLS (is_staff()/is_admin()) —
// экшены сами по себе ничего не проверяют, полагаются на политику БД.
// ============================================================

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "./supabase/server";
import { getLeadActivities } from "./staff-data";
import type { Lead } from "./types";

// Ленивая подгрузка заметок по лиду — вызывается из клиентского LeadCard
// при первом разворачивании, чтобы не тянуть все заметки на списке лидов сразу.
export async function getLeadActivitiesAction(leadId: string) {
  return getLeadActivities(leadId);
}

export async function updateLeadStatus(leadId: string, status: Lead["status"]) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/staff/leads");
  return { success: true };
}

export async function addLeadActivity(leadId: string, note: string) {
  if (!note.trim()) return { success: false, error: "Пустая заметка" };
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("lead_activities").insert({
    lead_id: leadId,
    author_id: user?.id || null,
    note: note.trim(),
  });
  if (error) return { success: false, error: error.message };
  revalidatePath("/staff/leads");
  return { success: true };
}

export async function markUniversityVerified(universityId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("universities")
    .update({ last_verified_at: new Date().toISOString().slice(0, 10) })
    .eq("id", universityId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/staff/universities");
  return { success: true };
}

export async function toggleUniversityActive(universityId: string, isActive: boolean) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("universities").update({ is_active: isActive }).eq("id", universityId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/staff/universities");
  revalidatePath("/education");
  return { success: true };
}
