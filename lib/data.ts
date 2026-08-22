// ============================================================
// ZagranEasy — Data Access Layer
// Единая точка доступа к данным:
//   - Если Supabase подключён И запрос успешен → читает из БД
//   - Если нет / если БД вернула ошибку (например, миграции ещё
//     не применены) → читает из data/*.ts (seed data)
// При миграции на Supabase — меняется только этот файл
// ============================================================

import { supabase, USE_DB } from "./db";
import { educationCountries, universities, getCountryBySlug, getUniversitiesByCountryId } from "@/data/education";
import { tours, getTourBySlug } from "@/data/tours";
import { workCountries, properties, reviews, visaSteps, visaServices, realEstateRegions } from "@/data/content";
import type { EducationCountry, University, Tour, WorkCountry, Property, Review } from "./types";

// Логируем ошибку один раз за запрос — не даём БД молча "работать" на пустых данных.
function warnDbFallback(table: string, error: unknown) {
  console.warn(`[data] Supabase-запрос к "${table}" не удался, используем seed-данные:`, error);
}

// ===================== EDUCATION =====================
// Supabase возвращает строки в snake_case — мапим их в camelCase-типы приложения.

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
  if (USE_DB) {
    const { data, error } = await supabase
      .from("education_countries")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (!error) return (data || []).map(mapCountryRow);
    warnDbFallback("education_countries", error);
  }
  return educationCountries.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function fetchEducationCountry(slug: string): Promise<EducationCountry | null> {
  if (USE_DB) {
    const { data, error } = await supabase
      .from("education_countries")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!error) return data ? mapCountryRow(data) : null;
    warnDbFallback("education_countries", error);
  }
  return getCountryBySlug(slug) || null;
}

export async function fetchUniversities(country: { id: string; slug: string }): Promise<University[]> {
  if (USE_DB) {
    const { data, error } = await supabase
      .from("universities")
      .select("*")
      .eq("country_id", country.id)
      .eq("is_active", true)
      .order("sort_order");
    if (!error) return (data || []).map(mapUniversityRow);
    warnDbFallback("universities", error);
  }
  return getUniversitiesByCountryId(country.id);
}

// Плоский каталог вузов по всем странам — для /education (поиск + фильтры) и /education/compare.
export async function fetchAllUniversities(): Promise<University[]> {
  if (USE_DB) {
    const { data, error } = await supabase
      .from("universities")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (!error) return (data || []).map(mapUniversityRow);
    warnDbFallback("universities", error);
  }
  return universities.filter((u) => u.isActive);
}

// Один вуз по глобальному slug (не привязан к стране в URL) — для /education/[slug].
export async function fetchUniversityBySlug(slug: string): Promise<University | null> {
  if (USE_DB) {
    const { data, error } = await supabase.from("universities").select("*").eq("slug", slug).single();
    if (!error) return data ? mapUniversityRow(data) : null;
    warnDbFallback("universities", error);
  }
  return universities.find((u) => u.slug === slug) || null;
}

// ===================== TOURS =====================

function mapTourRow(row: Record<string, unknown>): Tour {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    region: (row.region as string) || "",
    description: (row.description as string) || "",
    highlights: (row.highlights as string[]) || [],
    durationDays: (row.duration_days as number) ?? 0,
    priceFrom: (row.price_from as number) ?? 0,
    hotelStars: (row.hotel_stars as number) ?? 0,
    includes: (row.includes as string[]) || [],
    imageUrl: (row.image_url as string) || "",
    isHot: Boolean(row.is_hot),
  };
}

export async function fetchTours(): Promise<Tour[]> {
  if (USE_DB) {
    const { data, error } = await supabase.from("tours").select("*").order("sort_order");
    if (!error) return (data || []).map(mapTourRow);
    warnDbFallback("tours", error);
  }
  return tours;
}

export async function fetchTour(slug: string): Promise<Tour | null> {
  if (USE_DB) {
    const { data, error } = await supabase.from("tours").select("*").eq("slug", slug).single();
    if (!error) return data ? mapTourRow(data) : null;
    warnDbFallback("tours", error);
  }
  return getTourBySlug(slug) || null;
}

// ===================== WORK =====================

function mapWorkCountryRow(row: Record<string, unknown>): WorkCountry {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    flag: (row.flag as string) || "",
    industries: (row.industries as string[]) || [],
    description: (row.description as string) || "",
    salaryRange: (row.salary_range as string) || "",
    imageUrl: (row.image_url as string) || "",
  };
}

export async function fetchWorkCountries(): Promise<WorkCountry[]> {
  if (USE_DB) {
    const { data, error } = await supabase.from("work_countries").select("*").order("name");
    if (!error) return (data || []).map(mapWorkCountryRow);
    warnDbFallback("work_countries", error);
  }
  return workCountries;
}

// ===================== REAL ESTATE =====================

function mapPropertyRow(row: Record<string, unknown>): Property {
  return {
    id: row.id as string,
    title: row.title as string,
    location: (row.location as string) || "",
    city: (row.city as string) || "",
    rooms: (row.rooms as number) ?? 0,
    areaSqm: (row.area_sqm as number) ?? 0,
    priceUsd: (row.price_usd as number) ?? 0,
    features: (row.features as string[]) || [],
    isHotDeal: Boolean(row.is_hot_deal),
    imageUrl: (row.image_url as string) || "",
  };
}

export async function fetchProperties(): Promise<Property[]> {
  if (USE_DB) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("is_hot_deal", { ascending: false });
    if (!error) return (data || []).map(mapPropertyRow);
    warnDbFallback("properties", error);
  }
  return properties;
}

// ===================== REVIEWS =====================

function mapReviewRow(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    name: row.name as string,
    service: (row.service as string) || "",
    text: row.text as string,
    avatar: (row.avatar as string) || "",
    rating: (row.rating as number) ?? 5,
  };
}

export async function fetchReviews(): Promise<Review[]> {
  if (USE_DB) {
    const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (!error) return (data || []).map(mapReviewRow);
    warnDbFallback("reviews", error);
  }
  return reviews;
}

// ===================== STATIC CONTENT =====================
// Эти данные не в БД — всегда из файлов

export function getVisaSteps() {
  return visaSteps;
}

export function getVisaServices() {
  return visaServices;
}

export function getRealEstateRegions() {
  return realEstateRegions;
}
