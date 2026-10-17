// ============================================================
// ZagranEasy — Кабинет менеджера: серверные запросы через NestJS API
// от имени залогиненного сотрудника (роль admin/manager).
// ============================================================

import { cache } from "react";
import { apiGet } from "./api";
import { getSessionUser, getToken } from "./session-data";
import type { Profile, Lead, LeadActivity, University, Client, ClientNote, ClientUniversity, ManagerTask, KnowledgeArticle, StaffResource } from "./types";
import { DEFAULT_CALCULATOR_SETTINGS, type CalculatorSettings } from "./calculator";

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

function relatedProfileName(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  return ((value as Record<string, unknown>).full_name as string) ?? null;
}

function mapClientRow(row: Record<string, unknown>): Client {
  return {
    id: row.id as string,
    leadId: (row.lead_id as string) ?? null,
    assignedManagerId: row.assigned_manager_id as string,
    assignedManagerName: relatedProfileName(row.profiles),
    fullName: row.full_name as string,
    phone: (row.phone as string) ?? null,
    email: (row.email as string) ?? null,
    city: (row.city as string) ?? null,
    birthDate: (row.birth_date as string) ?? null,
    parentName: (row.parent_name as string) ?? null,
    parentPhone: (row.parent_phone as string) ?? null,
    parentEmail: (row.parent_email as string) ?? null,
    preferredContact: (row.preferred_contact as Client["preferredContact"]) ?? null,
    source: (row.source as string) ?? null,
    leadCategory: (row.lead_category as Client["leadCategory"]) ?? null,
    salesStatus: (row.sales_status as Client["salesStatus"]) || "new",
    product: (row.product as string) ?? null,
    studyCountry: (row.study_country as string) ?? null,
    specialty: (row.specialty as string) ?? null,
    educationLevel: (row.education_level as string) ?? null,
    intakeYear: (row.intake_year as number) ?? null,
    intakeName: (row.intake_name as string) ?? null,
    budget: (row.budget as number) ?? null,
    budgetCurrency: (row.budget_currency as string) || "KZT",
    languageLevel: (row.language_level as string) ?? null,
    languageExams: (row.language_exams as Client["languageExams"]) || {},
    needsGrant: Boolean(row.needs_grant),
    needsDormitory: Boolean(row.needs_dormitory),
    preferences: (row.preferences as string) ?? null,
    dealProbability: (row.deal_probability as number) ?? null,
    refusalReason: (row.refusal_reason as string) ?? null,
    nextAction: (row.next_action as string) ?? null,
    nextContactAt: (row.next_contact_at as string) ?? null,
    admissionStage: (row.admission_stage as Client["admissionStage"]) || "not_started",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapClientNoteRow(row: Record<string, unknown>): ClientNote {
  return {
    id: row.id as string,
    clientId: row.client_id as string,
    authorId: row.author_id as string,
    authorName: relatedProfileName(row.profiles),
    body: row.body as string,
    createdAt: row.created_at as string,
  };
}

// Профиль текущего сотрудника — источник правды для роли (admin/manager).
// Возвращает null и для гостя, и для пользователя без нужной роли.
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getSessionUser();
  if (!user) return null;
  return mapProfileRow(user.profile as unknown as Record<string, unknown>);
});

function mapAdminUniversityRow(row: Record<string, unknown>): University {
  return {
    id: row.id as string,
    countryId: row.country_id as string,
    slug: row.slug as string,
    name: row.name as string,
    nameLocal: (row.name_local as string) || "",
    city: row.city as string,
    latitude: (row.latitude as number) ?? null,
    longitude: (row.longitude as number) ?? null,
    address: (row.address as string) || "",
    googleMapsUrl: (row.google_maps_url as string) || "",
    type: (row.type as University["type"]) ?? null,
    programs: (row.degree_levels as string[]) || [],
    languages: (row.languages as string[]) || [],
    specialties: (row.specialties as string[]) || [],
    tuitionFrom: (row.tuition_from as number | null) ?? null,
    tuitionTo: (row.tuition_to as number) ?? 0,
    tuitionCurrency: (row.tuition_currency as string) || "USD",
    hasGrant: Boolean(row.has_grant),
    grantDetails: (row.grant_details as string) || "",
    hasDormitory: Boolean(row.has_dormitory),
    dormitoryCost: (row.dormitory_cost as number) ?? 0,
    dormitoryCurrency: (row.dormitory_currency as string) || "USD",
    applicationFee: (row.application_fee as number) ?? null,
    applicationFeeCurrency: (row.application_fee_currency as string) || "USD",
    medicalInsuranceCost: (row.medical_insurance_cost as number) ?? null,
    medicalInsuranceCurrency: (row.medical_insurance_currency as string) || "USD",
    requirements: (row.requirements as string[]) || [],
    description: (row.description as string) || "",
    imageUrl: (row.image_url as string) || "",
    logoUrl: (row.logo_url as string) || "",
    galleryImages: (row.gallery_images as string[]) || [],
    dormitoryImages: (row.dormitory_images as string[]) || [],
    websiteUrl: (row.website_url as string) || "",
    youtubeUrl: (row.youtube_url as string) || "",
    virtualTourUrl: (row.virtual_tour_url as string) || "",
    contactEmail: (row.contact_email as string) || "",
    contactPhone: (row.contact_phone as string) || "",
    rankingNational: (row.ranking_national as number) ?? null,
    rankingWorld: (row.ranking_world as number) ?? null,
    ieltsRequired: Boolean(row.ielts_required),
    isPartner: Boolean(row.is_partner),
    admissionChance: (row.admission_chance as number) ?? null,
    deadlineLabel: (row.deadline_label as string) || "",
    deadlineDate: (row.deadline_date as string) ?? null,
    ratingStars: (row.rating_stars as number) ?? 4.5,
    reviewsCount: (row.reviews_count as number) ?? 0,
    programsCount: (row.programs_count as number) ?? 0,
    presentationUrl: (row.presentation_url as string) ?? null,
    presentationPages: (row.presentation_pages as number) ?? null,
    lastVerifiedAt: (row.last_verified_at as string) ?? null,
    programList: (row.program_list as University["programList"]) || [],
    stories: (row.stories as University["stories"]) || [],
    advantages: (row.advantages as string[]) || [],
    limitations: (row.limitations as string[]) || [],
    informationSource: (row.information_source as string) || "",
    isActive: row.is_active === undefined ? true : Boolean(row.is_active),
    sortOrder: (row.sort_order as number) ?? 0,
  };
}

// Все вузы (включая неактивные черновики) — для CMS в /staff/universities.
export async function getUniversitiesForAdmin(): Promise<University[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>("/admin/universities", token);
  if (res.error || !res.data) return [];
  return res.data.map(mapAdminUniversityRow);
}

// Один вуз по id (включая неактивные) — для формы редактирования.
export async function getUniversityForAdmin(id: string): Promise<University | null> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>(`/admin/universities/${id}`, token);
  if (res.error || !res.data) return null;
  return mapAdminUniversityRow(res.data);
}

export async function getUniversityCatalog(id: string): Promise<import("./types").UniversityCatalog> {
  const token = await getToken();
  const res = await apiGet<import("./types").UniversityCatalog>(`/admin/universities/${id}/catalog`, token);
  return res.data || { programs: [], intakes: [], requirements: [], costs: [], scholarships: [] };
}

export interface UniversityImportHistoryItem {
  id: string; file_name: string; status: string; total_rows: number; valid_rows: number; error_rows: number; created_at: string;
}

export async function getUniversityImportHistory(): Promise<UniversityImportHistoryItem[]> {
  const token = await getToken();
  const res = await apiGet<UniversityImportHistoryItem[]>("/admin/universities/imports/history", token);
  return res.data || [];
}

export async function getCostCalculationContext(clientId: string): Promise<Record<string, unknown> | null> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>(`/cost-calculations/context/${clientId}`, token);
  return res.data || null;
}

export async function getClientCostCalculations(clientId: string): Promise<Record<string, unknown>[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>(`/cost-calculations/client/${clientId}`, token);
  return res.data || [];
}

export async function getLeadsForAdmin(): Promise<Lead[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>("/leads?limit=100", token);
  if (res.error || !res.data) return [];
  return res.data.map(mapLeadRow);
}

export async function getLeadActivities(leadId: string): Promise<LeadActivity[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>(`/leads/${leadId}/activities`, token);
  if (res.error || !res.data) return [];
  return res.data.map(mapActivityRow);
}

export async function getClients(): Promise<Client[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>("/clients?limit=100", token);
  if (res.error || !res.data) return [];
  return res.data.map(mapClientRow);
}

export async function getClient(id: string): Promise<Client | null> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>(`/clients/${id}`, token);
  if (res.error || !res.data) return null;
  return mapClientRow(res.data);
}

export async function getClientNotes(id: string): Promise<ClientNote[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>(`/clients/${id}/notes`, token);
  if (res.error || !res.data) return [];
  return res.data.map(mapClientNoteRow);
}

export async function getClientUniversities(id: string): Promise<ClientUniversity[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>(`/clients/${id}/universities`, token);
  if (res.error || !res.data) return [];
  return res.data.map((row) => { const u = (row.universities || {}) as Record<string, unknown>; return {
    id: row.id as string, universityId: row.university_id as string, name: u.name as string, slug: u.slug as string, city: u.city as string,
    priority: Number(row.priority), status: row.status as string, matchScore: (row.match_score as number) ?? null,
    recommendationReason: (row.recommendation_reason as string) ?? null, risks: (row.risks as string) ?? null,
    managerComment: (row.manager_comment as string) ?? null, visibleToStudent: Boolean(row.visible_to_student),
  }; });
}

// Тарифы калькулятора — редактируются менеджером, хранятся в Supabase
// (таблица calculator_settings). Отсутствующие ключи подстраховываются
// значениями по умолчанию из lib/calculator.ts.
export async function getCalculatorSettings(): Promise<CalculatorSettings> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>("/calculator-settings", token);
  if (res.error || !res.data) return DEFAULT_CALCULATOR_SETTINGS;
  return { ...DEFAULT_CALCULATOR_SETTINGS, ...res.data } as CalculatorSettings;
}

export async function getStaffProfiles(): Promise<Profile[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>("/users?limit=100", token);
  if (res.error || !res.data) return [];
  return res.data
    .map((row) => ({ ...row, id: row.id, full_name: row.full_name, role: row.role, phone: row.phone, created_at: row.created_at }))
    .map(mapProfileRow)
    .filter((p) => p.role === "admin" || p.role === "manager");
}

function mapManagerTaskRow(row: Record<string, unknown>): ManagerTask {
  const manager = row.manager as Record<string, unknown> | null;
  const client = row.client as Record<string, unknown> | null;
  return {
    id: row.id as string, managerId: row.manager_id as string, managerName: (manager?.full_name as string) ?? null,
    clientId: (row.client_id as string) ?? null, clientName: (client?.full_name as string) ?? null,
    admissionCaseId: (row.admission_case_id as string) ?? null, stageId: (row.stage_id as string) ?? null,
    title: row.title as string, description: (row.description as string) ?? null,
    taskType: row.task_type as ManagerTask["taskType"], priority: row.priority as ManagerTask["priority"],
    status: row.status as ManagerTask["status"], dueAt: (row.due_at as string) ?? null,
    completedAt: (row.completed_at as string) ?? null, resultComment: (row.result_comment as string) ?? null,
    createdBy: row.created_by as string, createdAt: row.created_at as string, updatedAt: row.updated_at as string,
  };
}

export async function getManagerTasks(): Promise<ManagerTask[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>("/manager-tasks?limit=100", token);
  return res.data?.map(mapManagerTaskRow) || [];
}

function mapKnowledgeArticleRow(row: Record<string, unknown>): KnowledgeArticle {
  const author = row.author as Record<string, unknown> | null;
  return {
    id: row.id as string, title: row.title as string, section: row.section as string,
    content: row.content as string, language: row.language as string,
    status: row.status as KnowledgeArticle["status"], source: (row.source as string) ?? null,
    authorId: row.author_id as string, authorName: (author?.full_name as string) ?? null,
    publishedBy: (row.published_by as string) ?? null, publishedAt: (row.published_at as string) ?? null,
    lastUpdatedAt: row.updated_at as string, nextReviewAt: (row.next_review_at as string) ?? null,
    version: Number(row.version), allowedRoles: (row.allowed_roles as string[]) || [], createdAt: row.created_at as string,
  };
}

export async function getKnowledgeArticles(): Promise<KnowledgeArticle[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>("/knowledge-articles?limit=100", token);
  return res.data?.map(mapKnowledgeArticleRow) || [];
}

function mapStaffResourceRow(row: Record<string, unknown>): StaffResource {
  const uploader = row.uploader as Record<string, unknown> | null;
  const article = row.knowledge_article as Record<string, unknown> | null;
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || "",
    category: row.category as StaffResource["category"],
    service: (row.service as string) ?? null,
    resourceType: row.resource_type as StaffResource["resourceType"],
    status: row.status as StaffResource["status"],
    originalName: (row.original_name as string) ?? null,
    mimeType: (row.mime_type as string) ?? null,
    sizeBytes: row.size_bytes == null ? null : Number(row.size_bytes),
    knowledgeArticleId: (row.knowledge_article_id as string) ?? null,
    knowledgeArticleTitle: (article?.title as string) ?? null,
    uploadedBy: row.uploaded_by as string,
    uploaderName: (uploader?.full_name as string) ?? null,
    publishedAt: (row.published_at as string) ?? null,
    nextReviewAt: (row.next_review_at as string) ?? null,
    version: Number(row.version || 1),
    isFeatured: Boolean(row.is_featured),
    allowedRoles: (row.allowed_roles as string[]) || [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getStaffResources(): Promise<StaffResource[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>("/staff-resources?limit=100", token);
  return res.data?.map(mapStaffResourceRow) || [];
}
