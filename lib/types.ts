// ============================================================
// ZagranEasy — TypeScript Types
// ============================================================

export interface EducationCountry {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  flag: string;
  continent: string;
  cities: string[];
  description: string;
  longDescription: string;
  badgeColor: "blue" | "red" | "amber" | "green" | "purple";
  imageUrl: string;
  heroImageUrl: string;
  universityCount: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface University {
  id: string;
  countryId: string;
  slug: string;
  name: string;
  nameLocal: string;
  city: string;
  type: "public" | "private";
  programs: string[];
  languages: string[];
  tuitionFrom: number;
  tuitionTo: number;
  hasGrant: boolean;
  grantDetails: string;
  hasDormitory: boolean;
  dormitoryCost: number;
  requirements: string[];
  description: string;
  imageUrl: string;
  websiteUrl: string;
  rankingNational: number | null;
  rankingWorld: number | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  region: string;
  description: string;
  highlights: string[];
  durationDays: number;
  priceFrom: number;
  hotelStars: number;
  includes: string[];
  imageUrl: string;
  isHot: boolean;
}

export interface WorkCountry {
  id: string;
  slug: string;
  name: string;
  flag: string;
  industries: string[];
  description: string;
  salaryRange: string;
  imageUrl: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  rooms: number;
  areaSqm: number;
  priceUsd: number;
  features: string[];
  isHotDeal: boolean;
  imageUrl: string;
}

export interface Lead {
  id: string;
  source: "quiz" | "form" | "whatsapp";
  service: "education" | "tours" | "work" | "visa" | "realestate";
  name: string;
  phone: string;
  message: string;
  quizAnswers?: { goal: string; budget: string; timeline: string };
  status: "new" | "in_progress" | "done";
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  service: string;
  text: string;
  avatar: string;
  rating: number;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  href: string;
}
