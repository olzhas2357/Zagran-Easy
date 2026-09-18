"use server";

// ============================================================
// ZagranEasy — Кабинет менеджера: серверные экшены (мутации)
// через NestJS API (роли admin/manager проверяются на бэкенде).
// ============================================================

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiDelete, apiPatch, apiPost } from "./api";
import { getToken } from "./session-data";
import { getLeadActivities } from "./staff-data";
import type { Lead, UniversityProgram, AdmissionStory } from "./types";
import type { UniversityCatalogItem, UniversityCatalogKind } from "./types";
import type { KnowledgeArticleStatus, ManagerTaskPriority, ManagerTaskStatus, ManagerTaskType } from "./types";

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
  revalidatePath("/admin/universities");
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

export interface ManagerTaskInput {
  managerId: string; clientId?: string | null; admissionCaseId?: string | null; stageId?: string | null;
  title: string; description?: string | null; taskType: ManagerTaskType; priority: ManagerTaskPriority; dueAt?: string | null;
}

export async function createManagerTask(input: ManagerTaskInput) {
  const token = await getToken();
  if (!token) return { success: false, error: "Не авторизован" };
  if (!input.title.trim()) return { success: false, error: "Укажите название задачи" };
  const res = await apiPost("/manager-tasks", {
    manager_id: input.managerId, client_id: input.clientId || null, admission_case_id: input.admissionCaseId || null,
    stage_id: input.stageId || null, title: input.title.trim(), description: input.description?.trim() || null,
    task_type: input.taskType, priority: input.priority, due_at: input.dueAt || null,
  }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/staff/tasks");
  return { success: true };
}

export async function updateManagerTask(taskId: string, input: { status?: ManagerTaskStatus; dueAt?: string; resultComment?: string }) {
  const token = await getToken();
  const body: Record<string, unknown> = {};
  if (input.status) body.status = input.status;
  if (input.dueAt) body.due_at = input.dueAt;
  if (input.resultComment !== undefined) body.result_comment = input.resultComment.trim() || null;
  const res = await apiPatch(`/manager-tasks/${taskId}`, body, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/staff/tasks");
  return { success: true };
}

export interface KnowledgeArticleInput {
  title: string; section: string; content: string; language: string; source?: string | null;
  nextReviewAt?: string | null; allowedRoles: string[]; status?: KnowledgeArticleStatus;
}

export async function createKnowledgeArticle(input: KnowledgeArticleInput) {
  const token = await getToken();
  if (!input.title.trim() || !input.content.trim()) return { success: false, error: "Заполните заголовок и содержание" };
  const res = await apiPost("/knowledge-articles", {
    title: input.title.trim(), section: input.section, content: input.content.trim(), language: input.language,
    source: input.source?.trim() || null, next_review_at: input.nextReviewAt || null,
    allowed_roles: input.allowedRoles, status: input.status || "draft",
  }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/staff/knowledge");
  return { success: true };
}

export async function updateKnowledgeArticle(articleId: string, input: KnowledgeArticleInput) {
  const token = await getToken();
  if (!input.title.trim() || !input.content.trim()) return { success: false, error: "Заполните заголовок и содержание" };
  const res = await apiPatch(`/knowledge-articles/${articleId}`, {
    title: input.title.trim(), section: input.section, content: input.content.trim(), language: input.language,
    source: input.source?.trim() || null, next_review_at: input.nextReviewAt || null,
    allowed_roles: input.allowedRoles,
  }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/staff/knowledge");
  return { success: true };
}

export async function changeKnowledgeArticleStatus(articleId: string, status: KnowledgeArticleStatus) {
  const token = await getToken();
  const res = await apiPatch(`/knowledge-articles/${articleId}/status`, { status }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/staff/knowledge");
  return { success: true };
}

export async function toggleUniversityActive(universityId: string, isActive: boolean) {
  const token = await getToken();
  const res = await apiPatch(`/admin/universities/${universityId}/active`, { is_active: isActive }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/admin/universities");
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

export interface UniversityImportPreview {
  id: string;
  file_name: string;
  headers: string[];
  preview_rows: Record<string, unknown>[];
  total_rows: number;
}

export async function previewUniversityImport(formData: FormData): Promise<{ success: boolean; preview?: UniversityImportPreview; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Выберите CSV или XLSX файл" };
  const token = await getToken();
  if (!token) return { success: false, error: "Не авторизован" };
  const upload = new FormData(); upload.set("file", file);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
  try {
    const res = await fetch(`${API_URL}/admin/universities/imports/preview`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: upload });
    const json = await res.json();
    if (!res.ok || json.success === false) return { success: false, error: Array.isArray(json.message) ? json.message.join(", ") : json.message || "Ошибка чтения файла" };
    return { success: true, preview: json.data as UniversityImportPreview };
  } catch { return { success: false, error: "Нет подключения к серверу" }; }
}

export async function commitUniversityImport(importId: string, mapping: Record<string, string>) {
  const token = await getToken();
  const res = await apiPost<{ valid_rows: number; error_rows: number; errors: { row: number; message: string }[] }>(
    `/admin/universities/imports/${importId}/commit`, { mapping }, token
  );
  if (res.error || !res.data) return { success: false as const, error: res.error || "Не удалось выполнить импорт" };
  revalidatePath("/admin/universities");
  revalidatePath("/admin/universities/import");
  revalidatePath("/education");
  return { success: true as const, result: res.data };
}

export interface NewUniversityInput {
  countryId: string;
  slug: string;
  name: string;
  nameLocal: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  googleMapsUrl: string;
  type: "public" | "private";
  programs: string[];
  languages: string[];
  specialties: string[];
  tuitionFrom: number;
  tuitionTo: number;
  tuitionCurrency: string;
  hasGrant: boolean;
  grantDetails: string;
  hasDormitory: boolean;
  dormitoryCost: number;
  dormitoryCurrency: string;
  applicationFee: number | null;
  applicationFeeCurrency: string;
  medicalInsuranceCost: number | null;
  medicalInsuranceCurrency: string;
  requirements: string[];
  description: string;
  imageUrl: string;
  logoUrl: string;
  galleryImages: string[];
  dormitoryImages: string[];
  websiteUrl: string;
  youtubeUrl: string;
  virtualTourUrl: string;
  contactEmail: string;
  contactPhone: string;
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
  advantages: string[];
  limitations: string[];
  informationSource: string;
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
    latitude: input.latitude,
    longitude: input.longitude,
    address: input.address.trim() || null,
    google_maps_url: input.googleMapsUrl.trim() || null,
    type: input.type,
    degree_levels: input.programs,
    languages: input.languages,
    specialties: input.specialties,
    tuition_from: input.tuitionFrom,
    tuition_to: input.tuitionTo,
    tuition_currency: input.tuitionCurrency,
    has_grant: input.hasGrant,
    grant_details: input.grantDetails.trim() || null,
    has_dormitory: input.hasDormitory,
    dormitory_cost: input.dormitoryCost,
    dormitory_currency: input.dormitoryCurrency,
    application_fee: input.applicationFee,
    application_fee_currency: input.applicationFeeCurrency,
    medical_insurance_cost: input.medicalInsuranceCost,
    medical_insurance_currency: input.medicalInsuranceCurrency,
    requirements: input.requirements,
    description: input.description.trim(),
    image_url: input.imageUrl || null,
    logo_url: input.logoUrl || null,
    gallery_images: input.galleryImages,
    dormitory_images: input.dormitoryImages,
    website_url: input.websiteUrl.trim() || null,
    youtube_url: input.youtubeUrl.trim() || null,
    virtual_tour_url: input.virtualTourUrl.trim() || null,
    contact_email: input.contactEmail.trim() || null,
    contact_phone: input.contactPhone.trim() || null,
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
    advantages: input.advantages,
    limitations: input.limitations,
    information_source: input.informationSource.trim() || null,
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

  revalidatePath("/admin/universities");
  revalidatePath("/education");
  redirect("/admin/universities");
}

// Обновляет существующий вуз из формы /staff/universities/[id]/edit.
export async function updateUniversity(universityId: string, input: NewUniversityInput): Promise<{ success: boolean; error?: string }> {
  if (!input.name.trim() || !input.slug.trim() || !input.countryId || !input.city.trim()) {
    return { success: false, error: "Заполните название, страну, город и slug" };
  }

  const token = await getToken();
  const res = await apiPatch(`/admin/universities/${universityId}`, universityInputToBody(input), token);
  if (res.error) return { success: false, error: res.error };

  revalidatePath("/admin/universities");
  revalidatePath("/education");
  revalidatePath("/education/[slug]", "page");
  redirect("/admin/universities");
}

export async function saveUniversityCatalogItem(
  universityId: string,
  kind: UniversityCatalogKind,
  data: Omit<UniversityCatalogItem, "id">,
  itemId?: string
) {
  const token = await getToken();
  const path = `/admin/universities/${universityId}/catalog/${kind}${itemId ? `/${itemId}` : ""}`;
  const res = itemId
    ? await apiPatch<UniversityCatalogItem>(path, { data }, token)
    : await apiPost<UniversityCatalogItem>(path, { data }, token);
  if (res.error || !res.data) return { success: false as const, error: res.error || "Не удалось сохранить запись" };
  revalidatePath(`/admin/universities/${universityId}/edit`);
  return { success: true as const, item: res.data };
}

export async function deleteUniversityCatalogItem(universityId: string, kind: UniversityCatalogKind, itemId: string) {
  const token = await getToken();
  const res = await apiDelete(`/admin/universities/${universityId}/catalog/${kind}/${itemId}`, token);
  if (res.error) return { success: false as const, error: res.error };
  revalidatePath(`/admin/universities/${universityId}/edit`);
  return { success: true as const };
}

export async function saveCostCalculation(input: Record<string, unknown>) {
  const token = await getToken();
  const res = await apiPost<Record<string, unknown>>("/cost-calculations", input, token);
  if (res.error || !res.data) return { success: false as const, error: res.error || "Не удалось сохранить расчёт" };
  revalidatePath(`/staff/clients/${input.client_id}`);
  return { success: true as const, calculation: res.data };
}

export async function createCostCalculationVersion(id: string, clientId: string) {
  const token = await getToken();
  const res = await apiPost<Record<string, unknown>>(`/cost-calculations/${id}/version`, {}, token);
  if (res.error || !res.data) return { success: false as const, error: res.error || "Не удалось создать версию" };
  revalidatePath(`/staff/clients/${clientId}`);
  return { success: true as const, calculation: res.data };
}

export async function publishCostCalculation(id: string, clientId: string) {
  const token = await getToken();
  const res = await apiPost<{ public_token: string }>(`/cost-calculations/${id}/publish`, {}, token);
  if (res.error || !res.data) return { success: false as const, error: res.error || "Не удалось опубликовать" };
  revalidatePath(`/staff/clients/${clientId}`);
  return { success: true as const, token: res.data.public_token };
}
