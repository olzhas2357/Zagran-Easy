// ============================================================
// ZagranEasy — Data Access Layer
// Публичный каталог (образование, туры) — через NestJS API.
// Остальной контент (работа, недвижимость, отзывы, визовые шаги) — пока
// не вынесен в отдельный бэкенд-модуль, читается из локальных данных.
// ============================================================

import { apiGet } from "./api";
import { workCountries, properties, reviews, visaSteps, visaServices, realEstateRegions } from "@/data/content";
import { tours as staticTours, getTourBySlug } from "@/data/tours";
import type { EducationCountry, University, Tour, WorkCountry, Property, Review } from "./types";

// ===================== EDUCATION =====================
// NestJS возвращает строки в snake_case — мапим их в camelCase-типы приложения.

function mapCountryRow(row: Record<string, unknown>): EducationCountry {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    nameEn: (row.name_en as string) || "",
    flag: row.flag as string,
    continent: (row.continent as string) || "",
    cities: (row.cities as string[]) || [],
    description: (row.description as string) || "",
    longDescription: (row.long_description as string) || "",
    badgeColor: (row.badge_color as EducationCountry["badgeColor"]) || "blue",
    imageUrl: (row.image_url as string) || "",
    heroImageUrl: (row.hero_image_url as string) || "",
    universityCount: (row.university_count as number) ?? 0,
    features: (row.features as string[]) || [],
    isActive: Boolean(row.is_active),
    sortOrder: (row.sort_order as number) ?? 0,
  };
}

function mapUniversityRow(row: Record<string, unknown>): University {
  return {
    id: row.id as string,
    countryId: row.country_id as string,
    slug: row.slug as string,
    name: row.name as string,
    nameLocal: (row.name_local as string) || "",
    city: row.city as string,
    type: (row.type as University["type"]) || "public",
    programs: (row.degree_levels as string[]) || [],
    languages: (row.languages as string[]) || [],
    specialties: (row.specialties as string[]) || [],
    tuitionFrom: (row.tuition_from as number) ?? 0,
    tuitionTo: (row.tuition_to as number) ?? 0,
    hasGrant: Boolean(row.has_grant),
    grantDetails: (row.grant_details as string) || "",
    hasDormitory: Boolean(row.has_dormitory),
    dormitoryCost: (row.dormitory_cost as number) ?? 0,
    requirements: (row.requirements as string[]) || [],
    description: (row.description as string) || "",
    imageUrl: (row.image_url as string) || "",
    galleryImages: (row.gallery_images as string[]) || [],
    dormitoryImages: (row.dormitory_images as string[]) || [],
    websiteUrl: (row.website_url as string) || "",
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
    isActive: row.is_active === undefined ? true : Boolean(row.is_active),
    sortOrder: (row.sort_order as number) ?? 0,
  };
}

export async function fetchEducationCountries(): Promise<EducationCountry[]> {
  const res = await apiGet<Record<string, unknown>[]>("/countries");
  if (res.error || !res.data) return [];
  return res.data.filter((c) => c.is_active).map(mapCountryRow).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function fetchEducationCountry(slug: string): Promise<EducationCountry | null> {
  const countries = await fetchEducationCountries();
  return countries.find((c) => c.slug === slug) || null;
}

export async function fetchUniversities(country: { id: string; slug: string }): Promise<University[]> {
  const res = await apiGet<Record<string, unknown>[]>(`/universities?country=${country.id}&limit=100`);
  if (res.error || !res.data) return [];
  return res.data.map(mapUniversityRow).sort((a, b) => a.sortOrder - b.sortOrder);
}

// Плоский каталог вузов по всем странам — для /education (поиск + фильтры) и /education/compare.
export async function fetchAllUniversities(): Promise<University[]> {
  const res = await apiGet<Record<string, unknown>[]>("/universities?limit=100");
  if (res.error || !res.data) return [];
  return res.data.map(mapUniversityRow);
}

// Один вуз по глобальному slug (не привязан к стране в URL) — для /education/[slug].
export async function fetchUniversityBySlug(slug: string): Promise<University | null> {
  const res = await apiGet<Record<string, unknown>>(`/universities/${slug}`);
  if (res.error || !res.data) return null;
  return mapUniversityRow(res.data);
}

// ===================== TOURS =====================
// Пока не вынесены в NestJS — статический контент.

export async function fetchTours(): Promise<Tour[]> {
  return staticTours;
}

export async function fetchTour(slug: string): Promise<Tour | null> {
  return getTourBySlug(slug) || null;
}

// ===================== WORK =====================

export async function fetchWorkCountries(): Promise<WorkCountry[]> {
  return workCountries;
}

// ===================== REAL ESTATE =====================

export async function fetchProperties(): Promise<Property[]> {
  return properties;
}

// ===================== REVIEWS =====================

export async function fetchReviews(): Promise<Review[]> {
  return reviews;
}

// ===================== STATIC CONTENT =====================

export function getVisaSteps() {
  return visaSteps;
}

export function getVisaServices() {
  return visaServices;
}

export function getRealEstateRegions() {
  return realEstateRegions;
}

export function getFaqItems() {
  return faqItems;
}
