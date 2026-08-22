// ============================================================
// ZagranEasy — Кабинет менеджера: серверные запросы от имени
// залогиненного сотрудника (RLS: is_staff() / is_admin()).
// ============================================================

import { createSupabaseServerClient } from "./supabase/server";
import { USE_DB } from "./db";
import type { Profile, Lead, LeadActivity, University } from "./types";

function mapProfileRow(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    fullName: (row.full_name as string) ?? null,
    role: (row.role as Profile["role"]) || "manager",
    phone: (row.phone as string) ?? null,
    regions: (row.regions as string[]) || [],
    createdAt: row.created_at as string,
  };
}

function mapLeadRow(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    source: row.source as Lead["source"],
    service: row.service as string,
    name: (row.name as string) ?? null,
    phone: (row.phone as string) ?? null,
    message: (row.message as string) ?? null,
    quizAnswers: (row.quiz_answers as Lead["quizAnswers"]) ?? null,
    status: (row.status as Lead["status"]) || "new",
    assignedTo: (row.assigned_to as string) ?? null,
    createdAt: row.created_at as string,
  };
}

function mapActivityRow(row: Record<string, unknown>): LeadActivity {
  return {
    id: row.id as string,
    leadId: row.lead_id as string,
    authorId: (row.author_id as string) ?? null,
    note: row.note as string,
    createdAt: row.created_at as string,
  };
}

// Профиль текущего сотрудника — источник правды для роли (admin/manager).
// Возвращает null и для гостя, и для обычного клиента без записи в profiles.
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!USE_DB) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error || !data) return null;
  return mapProfileRow(data);
}

// Все вузы (включая неактивные черновики) — для CMS в /staff/universities.
export async function getUniversitiesForAdmin(): Promise<University[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("universities").select("*").order("sort_order");
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    countryId: row.country_id,
    slug: row.slug,
    name: row.name,
    nameLocal: row.name_local || "",
    city: row.city,
    type: row.type || "public",
    programs: row.degree_levels || [],
    languages: row.languages || [],
    specialties: row.specialties || [],
    tuitionFrom: row.tuition_from ?? 0,
    tuitionTo: row.tuition_to ?? 0,
    hasGrant: Boolean(row.has_grant),
    grantDetails: row.grant_details || "",
    hasDormitory: Boolean(row.has_dormitory),
    dormitoryCost: row.dormitory_cost ?? 0,
    requirements: row.requirements || [],
    description: row.description || "",
    imageUrl: row.image_url || "",
    websiteUrl: row.website_url || "",
    rankingNational: row.ranking_national ?? null,
    rankingWorld: row.ranking_world ?? null,
    ieltsRequired: Boolean(row.ielts_required),
    isPartner: Boolean(row.is_partner),
    admissionChance: row.admission_chance ?? null,
    deadlineLabel: row.deadline_label || "",
    deadlineDate: row.deadline_date ?? null,
    ratingStars: row.rating_stars ?? 4.5,
    reviewsCount: row.reviews_count ?? 0,
    programsCount: row.programs_count ?? 0,
    presentationUrl: row.presentation_url ?? null,
    presentationPages: row.presentation_pages ?? null,
    lastVerifiedAt: row.last_verified_at ?? null,
    programList: row.program_list || [],
    stories: row.stories || [],
    isActive: row.is_active === undefined ? true : Boolean(row.is_active),
    sortOrder: row.sort_order ?? 0,
  }));
}

export async function getLeadsForAdmin(): Promise<Lead[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapLeadRow);
}

export async function getLeadActivities(leadId: string): Promise<LeadActivity[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lead_activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapActivityRow);
}

export async function getStaffProfiles(): Promise<Profile[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at");
  if (error || !data) return [];
  return data.map(mapProfileRow);
}
