// ============================================================
// ZagranEasy — Data Access Layer
// Единая точка доступа к данным:
//   - Если Supabase подключён → читает из БД
//   - Если нет → читает из data/*.ts (seed data)
// При миграции на Supabase — меняется только этот файл
// ============================================================

import { supabase, USE_DB } from "./db";
import { educationCountries, universities, getCountryBySlug, getUniversitiesByCountry } from "@/data/education";
import { tours, getTourBySlug } from "@/data/tours";
import { workCountries, properties, reviews, visaSteps, visaServices, realEstateRegions } from "@/data/content";
import type { EducationCountry, University, Tour, WorkCountry, Property, Review } from "./types";

// ===================== EDUCATION =====================

export async function fetchEducationCountries(): Promise<EducationCountry[]> {
  if (USE_DB) {
    const { data } = await supabase
      .from("education_countries")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    return data || [];
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
    return data;
  }
  return getCountryBySlug(slug) || null;
}

export async function fetchUniversities(countrySlug: string): Promise<University[]> {
  if (USE_DB) {
    const { data } = await supabase
      .from("universities")
      .select("*")
      .eq("country_slug", countrySlug)
      .order("name");
    return data || [];
  }
  return getUniversitiesByCountry(countrySlug);
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
