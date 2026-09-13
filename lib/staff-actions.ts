"use server";

// ============================================================
// ZagranEasy — Кабинет менеджера: серверные экшены (мутации)
// через NestJS API (роли admin/manager проверяются на бэкенде).
// ============================================================

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiPatch, apiPost } from "./api";
import { getToken } from "./session-data";
import { getLeadActivities } from "./staff-data";
import type { Lead, UniversityProgram, AdmissionStory } from "./types";

// Ленивая подгрузка заметок по лиду — вызывается из клиентского LeadCard
// при первом разворачивании, чтобы не тянуть все заметки на списке лидов сразу.
export async function getLeadActivitiesAction(leadId: string) {
  return getLeadActivities(leadId);
}

export async function updateLeadStatus(leadId: string, status: Lead["status"]) {
  const token = await getToken();
  const res = await apiPatch(`/leads/${leadId}`, { status }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/staff/leads");
  return { success: true };
}

export async function addLeadActivity(leadId: string, note: string) {
  if (!note.trim()) return { success: false, error: "Пустая заметка" };
  const token = await getToken();
  const res = await apiPost(`/leads/${leadId}/activities`, { note: note.trim() }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/staff/leads");
  return { success: true };
}

export async function convertLeadToClient(leadId: string) {
  const token = await getToken();
  const res = await apiPost<{ id: string }>(`/clients/from-lead/${leadId}`, {}, token);
  if (res.error || !res.data) return { success: false, error: res.error || "Не удалось создать клиента" };
  revalidatePath("/staff/leads");
  revalidatePath("/staff/clients");
  return { success: true, clientId: res.data.id };
}

export async function addClientNote(clientId: string, body: string) {
  if (!body.trim()) return { success: false, error: "Пустая заметка" };
  const token = await getToken();
  const res = await apiPost(`/clients/${clientId}/notes`, { body: body.trim() }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath(`/staff/clients/${clientId}`);
  return { success: true };
}

export interface ClientInput {
  fullName: string;
  phone?: string;
  email?: string;
  city?: string;
  leadCategory?: "A+" | "A" | "B" | "C" | "";
  salesStatus?: "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  product?: string;
  studyCountry?: string;
  specialty?: string;
  educationLevel?: string;
  intakeYear?: number | null;
  intakeName?: string;
  budget?: number | null;
  languageLevel?: string;
  needsGrant?: boolean;
  needsDormitory?: boolean;
  preferences?: string;
  dealProbability?: number | null;
  nextAction?: string;
  nextContactAt?: string;
}

function clientInputToBody(input: ClientInput) {
  return {
    full_name: input.fullName.trim(),
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    city: input.city?.trim() || null,
    lead_category: input.leadCategory || null,
    sales_status: input.salesStatus || "new",
    product: input.product?.trim() || null,
    study_country: input.studyCountry?.trim() || null,
    specialty: input.specialty?.trim() || null,
    education_level: input.educationLevel?.trim() || null,
    intake_year: input.intakeYear || null,
    intake_name: input.intakeName?.trim() || null,
    budget: input.budget ?? null,
    language_level: input.languageLevel?.trim() || null,
    needs_grant: Boolean(input.needsGrant),
    needs_dormitory: Boolean(input.needsDormitory),
    preferences: input.preferences?.trim() || null,
    deal_probability: input.dealProbability ?? null,
    next_action: input.nextAction?.trim() || null,
    next_contact_at: input.nextContactAt || null,
  };
}

export async function createClient(input: ClientInput) {
  if (!input.fullName.trim()) return { success: false, error: "Укажите ФИО" };
  const token = await getToken();
  const res = await apiPost<{ id: string }>("/clients", clientInputToBody(input), token);
  if (res.error || !res.data) return { success: false, error: res.error || "Не удалось создать клиента" };
  revalidatePath("/staff/clients");
  return { success: true, clientId: res.data.id };
}

export async function updateClient(clientId: string, input: ClientInput) {
  if (!input.fullName.trim()) return { success: false, error: "Укажите ФИО" };
  const token = await getToken();
  const res = await apiPatch(`/clients/${clientId}`, clientInputToBody(input), token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/staff/clients");
  revalidatePath(`/staff/clients/${clientId}`);
  return { success: true, clientId };
}

export async function addUniversityToClient(clientId: string, universityId: string) {
  const token = await getToken();
  const res = await apiPost(`/clients/${clientId}/universities`, { university_id: universityId }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath(`/staff/clients/${clientId}`);
  return { success: true };
}

export async function updateClientUniversity(clientId: string, selectionId: string, input: Record<string, unknown>) {
  const token = await getToken();
  const res = await apiPatch(`/clients/${clientId}/universities/${selectionId}`, input, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath(`/staff/clients/${clientId}`);
  return { success: true };
}

export async function markUniversityVerified(universityId: string) {
  const token = await getToken();
  const res = await apiPatch(`/admin/universities/${universityId}/verify`, {}, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/staff/universities");
  return { success: true };
}

// Сохранение тарифа калькулятора (key = education_fees/education_packages/...).
export async function updateCalculatorSetting(key: string, value: Record<string, unknown>) {
  const token = await getToken();
  const res = await apiPatch(`/calculator-settings/${key}`, { value }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/staff/calculator");
  return { success: true };
}

export async function toggleUniversityActive(universityId: string, isActive: boolean) {
  const token = await getToken();
  const res = await apiPatch(`/admin/universities/${universityId}/active`, { is_active: isActive }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/staff/universities");
  revalidatePath("/education");
  return { success: true };
}

// Загружает один файл (фото или PDF) через NestJS (бакет university-media) и
// возвращает публичную ссылку.
export async function uploadUniversityFile(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Файл не выбран" };

  const token = await getToken();
  if (!token) return { success: false, error: "Не авторизован" };

  const upload = new FormData();
  upload.set("file", file);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
  try {
    const res = await fetch(`${API_URL}/uploads?bucket=university-media`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: upload,
    });
    const json = await res.json();
    if (!res.ok || json.success === false) {
      return { success: false, error: json.message || "Ошибка загрузки файла" };
    }
    return { success: true, url: json.data.url };
  } catch {
    return { success: false, error: "Нет подключения к серверу" };
  }
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

// Общие поля формы вуза → snake_case для NestJS API.
function universityInputToBody(input: NewUniversityInput) {
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

// Создаёт новый вуз из формы /staff/universities/new.
export async function createUniversity(input: NewUniversityInput): Promise<{ success: boolean; error?: string }> {
  if (!input.name.trim() || !input.slug.trim() || !input.countryId || !input.city.trim()) {
    return { success: false, error: "Заполните название, страну, город и slug" };
  }

  const token = await getToken();
  const res = await apiPost("/admin/universities", universityInputToBody(input), token);
  if (res.error) return { success: false, error: res.error };

  revalidatePath("/staff/universities");
  revalidatePath("/education");
  redirect("/staff/universities");
}

// Обновляет существующий вуз из формы /staff/universities/[id]/edit.
export async function updateUniversity(universityId: string, input: NewUniversityInput): Promise<{ success: boolean; error?: string }> {
  if (!input.name.trim() || !input.slug.trim() || !input.countryId || !input.city.trim()) {
    return { success: false, error: "Заполните название, страну, город и slug" };
  }

  const token = await getToken();
  const res = await apiPatch(`/admin/universities/${universityId}`, universityInputToBody(input), token);
  if (res.error) return { success: false, error: res.error };

  revalidatePath("/staff/universities");
  revalidatePath("/education");
  revalidatePath("/education/[slug]", "page");
  redirect("/staff/universities");
}
