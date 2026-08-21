// ============================================================
// ZagranEasy — Data Access Layer
// Единая точка доступа к данным:
//   - Если Supabase подключён → читает из БД
//   - Если нет → читает из data/*.ts (seed data)
// При миграции на Supabase — меняется только этот файл
// ============================================================

import { supabase, USE_DB } from "./db";
import { educationCountries, getCountryBySlug, getUniversitiesByCountryId } from "@/data/education";
import { tours, getTourBySlug } from "@/data/tours";
import { workCountries, properties, reviews, visaSteps, visaServices, realEstateRegions } from "@/data/content";
import type { EducationCountry, University, Tour, WorkCountry, Property, Review } from "./types";

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
    programs: (row.programs as string[]) || [],
    languages: (row.languages as string[]) || [],
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
    isActive: row.is_active === undefined ? true : Boolean(row.is_active),
    sortOrder: (row.sort_order as number) ?? 0,
  };
}

export async function fetchEducationCountries(): Promise<EducationCountry[]> {
  if (USE_DB) {
    const { data } = await supabase
      .from("education_countries")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    return (data || []).map(mapCountryRow);
  }
  return educationCountries.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function fetchEducationCountry(slug: string): Promise<EducationCountry | null> {
  if (USE_DB) {
    const { data } = await supabase
      .from("education_countries")
      .select("*")
      .eq("slug", slug)
      .single();
    return data ? mapCountryRow(data) : null;
  }
  return getCountryBySlug(slug) || null;
}

export async function fetchUniversities(country: { id: string; slug: string }): Promise<University[]> {
  if (USE_DB) {
    const { data } = await supabase
      .from("universities")
      .select("*")
      .eq("country_id", country.id)
      .eq("is_active", true)
      .order("sort_order");
    return (data || []).map(mapUniversityRow);
  }
  return getUniversitiesByCountryId(country.id);
}

// ===================== TOURS =====================

export async function fetchTours(): Promise<Tour[]> {
  if (USE_DB) {
    const { data } = await supabase.from("tours").select("*").order("sort_order");
    return data || [];
  }
  return tours;
}

export async function fetchTour(slug: string): Promise<Tour | null> {
  if (USE_DB) {
    const { data } = await supabase.from("tours").select("*").eq("slug", slug).single();
    return data;
  }
  return getTourBySlug(slug) || null;
}

// ===================== WORK =====================

export async function fetchWorkCountries(): Promise<WorkCountry[]> {
  if (USE_DB) {
    const { data } = await supabase.from("work_countries").select("*").order("name");
    return data || [];
  }
  return workCountries;
}

// ===================== REAL ESTATE =====================

export async function fetchProperties(): Promise<Property[]> {
  if (USE_DB) {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("is_hot_deal", { ascending: false });
    return data || [];
  }
  return properties;
}

// ===================== REVIEWS =====================

export async function fetchReviews(): Promise<Review[]> {
  if (USE_DB) {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    return data || [];
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
