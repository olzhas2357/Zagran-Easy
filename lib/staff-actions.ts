"use server";

// ============================================================
// ZagranEasy — Кабинет менеджера: серверные экшены (мутации)
// Все проверки прав идут через RLS (is_staff()/is_admin()) —
// экшены сами по себе ничего не проверяют, полагаются на политику БД.
// ============================================================

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { getLeadActivities } from "./staff-data";
import type { Lead, UniversityProgram, AdmissionStory } from "./types";

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

// Загружает один файл (фото или PDF) в бакет university-media и возвращает публичную ссылку.
// Бакет публичный на чтение, писать может только staff (см. миграцию 0005 — RLS storage.objects).
export async function uploadUniversityFile(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Файл не выбран" };

  const supabase = await createSupabaseServerClient();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("university-media").upload(path, file, { contentType: file.type });
  if (error) return { success: false, error: error.message };

  const { data } = supabase.storage.from("university-media").getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}

export interface NewUniversityInput {
  countryId: string;
  slug: string;
  name: string;
  nameLocal: string;
  city: string;
  type: "public" | "private";
  programs: string[];
  languages: string[];
  specialties: string[];
  tuitionFrom: number;
  tuitionTo: number;
  hasGrant: boolean;
  grantDetails: string;
  hasDormitory: boolean;
  dormitoryCost: number;
  requirements: string[];
  description: string;
  imageUrl: string;
  galleryImages: string[];
  dormitoryImages: string[];
  websiteUrl: string;
  rankingNational: number | null;
  rankingWorld: number | null;
  ieltsRequired: boolean;
  isPartner: boolean;
  admissionChance: number | null;
  deadlineLabel: string;
  deadlineDate: string | null;
  ratingStars: number;
  reviewsCount: number;
  presentationUrl: string | null;
  presentationPages: number | null;
  programList: UniversityProgram[];
  stories: AdmissionStory[];
  isActive: boolean;
}

// Общие поля формы вуза → snake_case для Supabase. sort_order и last_verified_at
// не приходят из формы — считаются отдельно в create/update.
function universityInputToRow(input: NewUniversityInput) {
  return {
    country_id: input.countryId,
    slug: input.slug.trim(),
    name: input.name.trim(),
    name_local: input.nameLocal.trim() || null,
    city: input.city.trim(),
    type: input.type,
    degree_levels: input.programs,
    languages: input.languages,
    specialties: input.specialties,
    tuition_from: input.tuitionFrom,
    tuition_to: input.tuitionTo,
    has_grant: input.hasGrant,
    grant_details: input.grantDetails.trim() || null,
    has_dormitory: input.hasDormitory,
    dormitory_cost: input.dormitoryCost,
    requirements: input.requirements,
    description: input.description.trim(),
    image_url: input.imageUrl || null,
    gallery_images: input.galleryImages,
    dormitory_images: input.dormitoryImages,
    website_url: input.websiteUrl.trim() || null,
    ranking_national: input.rankingNational,
    ranking_world: input.rankingWorld,
    ielts_required: input.ieltsRequired,
    is_partner: input.isPartner,
    admission_chance: input.admissionChance,
    deadline_label: input.deadlineLabel.trim() || null,
    deadline_date: input.deadlineDate,
    rating_stars: input.ratingStars,
    reviews_count: input.reviewsCount,
    programs_count: input.programList.length,
    presentation_url: input.presentationUrl,
    presentation_pages: input.presentationPages,
    program_list: input.programList,
    stories: input.stories,
    is_active: input.isActive,
  };
}

// Создаёт новый вуз из формы /staff/universities/new. sortOrder не спрашиваем
// у менеджера — новая карточка встаёт в конец списка; lastVerifiedAt = сегодня,
// т.к. данные только что заполнены вручную и заведомо свежие.
export async function createUniversity(input: NewUniversityInput): Promise<{ success: boolean; error?: string }> {
  if (!input.name.trim() || !input.slug.trim() || !input.countryId || !input.city.trim()) {
    return { success: false, error: "Заполните название, страну, город и slug" };
  }

  const supabase = await createSupabaseServerClient();
  const { count } = await supabase.from("universities").select("id", { count: "exact", head: true });

  const { error } = await supabase.from("universities").insert({
    ...universityInputToRow(input),
    last_verified_at: new Date().toISOString().slice(0, 10),
    sort_order: (count ?? 0) + 1,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/staff/universities");
  revalidatePath("/education");
  redirect("/staff/universities");
}

// Обновляет существующий вуз из формы /staff/universities/[id]/edit.
// Правку данных тоже считаем "проверкой" — last_verified_at обновляется на сегодня.
export async function updateUniversity(universityId: string, input: NewUniversityInput): Promise<{ success: boolean; error?: string }> {
  if (!input.name.trim() || !input.slug.trim() || !input.countryId || !input.city.trim()) {
    return { success: false, error: "Заполните название, страну, город и slug" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("universities")
    .update({
      ...universityInputToRow(input),
      last_verified_at: new Date().toISOString().slice(0, 10),
    })
    .eq("id", universityId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/staff/universities");
  revalidatePath("/education");
  revalidatePath("/education/[slug]", "page");
  redirect("/staff/universities");
}
