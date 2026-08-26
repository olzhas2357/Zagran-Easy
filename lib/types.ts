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

export interface UniversityProgram {
  name: string;
  meta: string;
  price: string;
}

export interface AdmissionStory {
  name: string;
  meta: string;
  text: string;
}

export interface University {
  id: string;
  countryId: string;
  slug: string;
  name: string;
  nameLocal: string;
  city: string;
  type: "public" | "private";
  programs: string[]; // уровни: "Бакалавр", "Магистр", "PhD"...
  languages: string[];
  specialties: string[]; // специальности: "IT", "Инженерия", "Медицина"... (фильтр каталога)
  tuitionFrom: number;
  tuitionTo: number;
  hasGrant: boolean;
  grantDetails: string;
  hasDormitory: boolean;
  dormitoryCost: number;
  requirements: string[];
  description: string;
  imageUrl: string;
  galleryImages?: string[]; // доп. фото кампуса — под галерею на странице вуза
  dormitoryImages?: string[]; // фото общежития
  websiteUrl: string;
  rankingNational: number | null;
  rankingWorld: number | null;
  ieltsRequired: boolean;
  isPartner: boolean;
  admissionChance: number | null; // редакторская оценка шанса поступления, %
  deadlineLabel: string;
  deadlineDate: string | null;
  ratingStars: number;
  reviewsCount: number;
  programsCount: number;
  presentationUrl: string | null;
  presentationPages: number | null;
  lastVerifiedAt: string | null;
  programList: UniversityProgram[];
  stories: AdmissionStory[];
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
  source: "quiz" | "form" | "whatsapp" | "callback";
  service: string;
  name: string | null;
  phone: string | null;
  message: string | null;
  quizAnswers?: { goal: string; budget: string; timeline: string } | null;
  status: "new" | "in_progress" | "done";
  assignedTo: string | null;
  createdAt: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  authorId: string | null;
  note: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  fullName: string | null;
  role: "admin" | "manager";
  phone: string | null;
  regions: string[];
  createdAt: string;
}

export interface ApplicationStep {
  label: string;
  date: string;
  state: "done" | "now" | "wait";
}

export interface ApplicationDocument {
  name: string;
  note: string;
  ok: boolean;
}

export interface ApplicationDeadline {
  title: string;
  date: string;
  urgent: boolean;
}

export interface Application {
  id: string;
  userId: string;
  universityId: string | null;
  programName: string | null;
  status: "submitted" | "documents" | "review" | "decision" | "visa";
  steps: ApplicationStep[];
  documents: ApplicationDocument[];
  deadlines: ApplicationDeadline[];
  paymentTotal: number | null;
  paymentCurrency: string;
  installmentsTotal: number;
  installmentsPaid: number;
  nextPaymentDate: string | null;
  managerId: string | null;
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
