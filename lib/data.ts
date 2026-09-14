// ============================================================
// ZagranEasy — Data Access Layer
// Публичный каталог (образование, туры) — через NestJS API.
// Остальной контент (работа, недвижимость, отзывы, визовые шаги) — пока
// не вынесен в отдельный бэкенд-модуль, читается из локальных данных.
// ============================================================

import { cache } from "react";
import { apiGet } from "./api";
import { workCountries, properties, reviews, visaSteps, visaServices, realEstateRegions, faqItems } from "@/data/content";
import { tours as staticTours, getTourBySlug } from "@/data/tours";
import type { EducationCountry, University, UniversityCatalog, Tour, WorkCountry, Property, Review } from "./types";
import type { LanguageTeacher, RealLanguageCourse, CourseModule, CourseLesson } from "./language-data";

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
    latitude: (row.latitude as number) ?? null,
    longitude: (row.longitude as number) ?? null,
    address: (row.address as string) || "",
    googleMapsUrl: (row.google_maps_url as string) || "",
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
    applicationFee: (row.application_fee as number) ?? null,
    medicalInsuranceCost: (row.medical_insurance_cost as number) ?? null,
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

// cache() дедуплицирует вызовы с одинаковыми аргументами в рамках одного
// рендера (например layout + page на одну и ту же страницу).
export const fetchEducationCountries = cache(async (): Promise<EducationCountry[]> => {
  const res = await apiGet<Record<string, unknown>[]>("/countries");
  if (res.error || !res.data) return [];
  return res.data.filter((c) => c.is_active).map(mapCountryRow).sort((a, b) => a.sortOrder - b.sortOrder);
});

export async function fetchEducationCountry(slug: string): Promise<EducationCountry | null> {
  const countries = await fetchEducationCountries();
  return countries.find((c) => c.slug === slug) || null;
}

export const fetchUniversities = cache(async (country: { id: string; slug: string }): Promise<University[]> => {
  const res = await apiGet<Record<string, unknown>[]>(`/universities?country=${country.id}&limit=100`);
  if (res.error || !res.data) return [];
  return res.data.map(mapUniversityRow).sort((a, b) => a.sortOrder - b.sortOrder);
});

// Плоский каталог вузов по всем странам — для /education (поиск + фильтры) и /education/compare.
export const fetchAllUniversities = cache(async (): Promise<University[]> => {
  const res = await apiGet<Record<string, unknown>[]>("/universities?limit=100");
  if (res.error || !res.data) return [];
  return res.data.map(mapUniversityRow);
});

// Один вуз по глобальному slug (не привязан к стране в URL) — для /education/[slug].
export const fetchUniversityBySlug = cache(async (slug: string): Promise<University | null> => {
  const res = await apiGet<Record<string, unknown>>(`/universities/${slug}`);
  if (res.error || !res.data) return null;
  return mapUniversityRow(res.data);
});

export const fetchUniversityCatalogBySlug = cache(async (slug: string): Promise<UniversityCatalog> => {
  const res = await apiGet<UniversityCatalog>(`/universities/${slug}/catalog`);
  return res.data || { programs: [], intakes: [], requirements: [], costs: [], scholarships: [] };
});

// ===================== TEACHERS =====================
// Публичный каталог преподавателей для лендинга /language (без авторизации).

function mapPublicTeacherRow(row: Record<string, unknown>): LanguageTeacher {
  const profile = (Array.isArray(row.profiles) ? row.profiles[0] : row.profiles) as Record<string, unknown> | undefined;
  const specializations = (row.specializations as string[]) || [];
  return {
    id: row.id as string,
    name: (profile?.full_name as string) || "Преподаватель ZagranEasy",
    tags: specializations.join(" · "),
    photo: (row.image_url as string) || "",
    bio: (row.bio as string) || "",
  };
}

export function mapPublicCourseRow(
  row: Record<string, unknown>
): RealLanguageCourse {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),

    exam_type: String(row.exam_type ?? ""),
    level_from: String(row.level_from ?? ""),
    level_to: String(row.level_to ?? ""),

    description: String(row.description ?? ""),

    total_lessons: Number(row.total_lessons ?? 0),
    total_tasks: Number(row.total_tasks ?? 0),
    estimated_hours: Number(row.estimated_hours ?? 0),

    image_url: row.image_url
      ? String(row.image_url)
      : null,

    is_active: Boolean(row.is_active),
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at ?? ""),
  };
}

export const fetchPublicTeachers = cache(async (): Promise<LanguageTeacher[]> => {
  const res = await apiGet<Record<string, unknown>[]>("/teachers/public");
  if (res.error || !res.data) return [];
  return res.data.map(mapPublicTeacherRow);
});

export const fetchPublicCourses = cache(
  async (): Promise<RealLanguageCourse[]> => {
    const res = await apiGet<Record<string, unknown>[]>("/courses");

    if (res.error || !res.data) {
      return [];
    }

    return res.data.map(mapPublicCourseRow);
  }
);


export const getCourseModules = cache(
  async (courseId: string): Promise<CourseModule[]> => {
    const res = await apiGet<Record<string, unknown>[]>(
      `/courses/${courseId}/sections`
    );

    if (res.error || !res.data) {
      return [];
    }

    return res.data.map(mapCourseModuleRow).sort((a, b) => a.sort_order - b.sort_order);
  }
);

function mapCourseLessonRow(row: Record<string, unknown>): CourseLesson {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    sort_order: Number(row.sort_order ?? 0),
  };
}

export function mapCourseModuleRow(
  row: Record<string, unknown>
): CourseModule {
  return {
    id: String(row.id ?? ""),
    course_id: String(row.course_id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    icon: String(row.icon ?? ""),
    sort_order: Number(row.sort_order ?? 0),
    lessons: Array.isArray(row.lessons)
      ? row.lessons.map((lesson) =>
          mapCourseLessonRow(lesson as Record<string, unknown>)
        )
      : [],
  };
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
