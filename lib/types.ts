// ============================================================
// ZagranEasy — TypeScript Types
// ============================================================

export interface EducationCountry {
  id: string;
  slug: string;
  name: string;
  flag: string;
  cities: string[];
  description: string;
  badgeColor: "blue" | "red" | "amber" | "green" | "purple";
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export interface University {
  id: string;
  countrySlug: string;
  name: string;
  city: string;
  programs: string[];
  languages: string[];
  tuitionFrom: number;
  hasGrant: boolean;
  imageUrl: string;
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
