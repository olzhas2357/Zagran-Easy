// ============================================================
// ZagranEasy — Каталог образования: подготовка данных для UI
// Объединяет University + EducationCountry в плоскую структуру
// для каталога/сравнения/подбора, плюс общие форматтеры.
// ============================================================

import type { EducationCountry, University } from "./types";

export interface CatalogUniversity {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  countrySlug: string;
  flag: string;
  type: University["type"];
  languages: string[];
  specialties: string[];
  tuitionFrom: number;
  ieltsRequired: boolean;
  hasGrant: boolean;
  hasDormitory: boolean;
  isPartner: boolean;
  admissionChance: number;
  deadlineLabel: string;
  deadlineSoon: boolean;
  rankingNational: number | null;
  ratingStars: number;
  reviewsCount: number;
  programsCount: number;
  needsVerification: boolean;
  source: University;
}

// Карточка не проверялась менеджером >90 дней — CMS помечает "требует уточнения"
// (см. app/staff/universities), и такой вуз не должен попадать в рекомендации квиза.
const VERIFICATION_STALE_DAYS = 90;

export function isVerificationStale(lastVerifiedAt: string | null): boolean {
  if (!lastVerifiedAt) return true;
  const days = (Date.now() - new Date(lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24);
  return days > VERIFICATION_STALE_DAYS;
}

const SOON_WINDOW_DAYS = 30;

function isDeadlineSoon(deadlineDate: string | null): boolean {
  if (!deadlineDate) return false;
  const diffMs = new Date(deadlineDate).getTime() - Date.now();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= SOON_WINDOW_DAYS;
}

export function buildCatalog(universities: University[], countries: EducationCountry[]): CatalogUniversity[] {
  const countryById = new Map(countries.map((c) => [c.id, c]));

  return universities
    .filter((u) => u.isActive)
    .map((u) => {
      const country = countryById.get(u.countryId);
      return {
        id: u.id,
        slug: u.slug,
        name: u.name,
        city: u.city,
        country: country?.name || "",
        countrySlug: country?.slug || "",
        flag: country?.flag || "",
        type: u.type,
        languages: u.languages,
        specialties: u.specialties,
        tuitionFrom: u.tuitionFrom,
        ieltsRequired: u.ieltsRequired,
        hasGrant: u.hasGrant,
        hasDormitory: u.hasDormitory,
        isPartner: u.isPartner,
        admissionChance: u.admissionChance ?? 50,
        deadlineLabel: u.deadlineLabel,
        deadlineSoon: isDeadlineSoon(u.deadlineDate),
        rankingNational: u.rankingNational,
        ratingStars: u.ratingStars,
        reviewsCount: u.reviewsCount,
        programsCount: u.programsCount,
        needsVerification: isVerificationStale(u.lastVerifiedAt),
        source: u,
      };
    });
}

// ---- Форматтеры, общие для каталога/сравнения/подбора ----

export function formatTuitionAmount(amount: number): string {
  if (amount <= 0) return "бесплатно";
  return `$${amount.toLocaleString("ru-RU")}`;
}

export function formatTuition(amount: number): string {
  if (amount <= 0) return "бесплатно";
  return `${formatTuitionAmount(amount)} / год`;
}

// Ставка условная (тенге за доллар) — только для ориентировочной рассрочки в UI.
const KZT_RATE = 490;

export function formatMonthlyInstallment(tuitionFromUsd: number): string {
  const monthly = Math.round((tuitionFromUsd * KZT_RATE) / 12 / 1000);
  return `от ${monthly} 000 ₸ / мес`;
}

export function chanceColor(chance: number): { text: string; bar: string } {
  if (chance >= 75) return { text: "text-emerald-600", bar: "bg-emerald-500" };
  if (chance >= 50) return { text: "text-blue-700", bar: "bg-blue-600" };
  return { text: "text-amber-700", bar: "bg-amber-500" };
}
