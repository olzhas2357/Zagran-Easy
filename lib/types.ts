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

export interface EducationPackageExtraCost {
  title: string;
  amount: number | null;
  currency: string | null;
  period: string | null;
}

export interface EducationPackage {
  id: string;
  countryId: string;
  slug: string;
  name: string;
  description: string;
  stages: string[];
  priceFrom: number | null;
  priceCurrency: string | null;
  priceNote: string;
  extraCosts: EducationPackageExtraCost[];
  selectionGuide: string;
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

export type UniversityCatalogKind = "programs" | "intakes" | "requirements" | "costs" | "scholarships";

export interface UniversityCatalogItem {
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

export type UniversityCatalog = Record<UniversityCatalogKind, UniversityCatalogItem[]>;

export interface University {
  id: string;
  countryId: string;
  slug: string;
  name: string;
  nameLocal: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  googleMapsUrl: string;
  type: "public" | "private" | null;
  programs: string[]; // уровни: "Бакалавр", "Магистр", "PhD"...
  languages: string[];
  specialties: string[]; // специальности: "IT", "Инженерия", "Медицина"... (фильтр каталога)
  tuitionFrom: number | null;
  tuitionTo: number;
  tuitionCurrency: string;
  hasGrant: boolean;
  grantDetails: string;
  hasDormitory: boolean;
  dormitoryCost: number;
  dormitoryCurrency: string;
  applicationFee: number | null;
  applicationFeeCurrency: string;
  medicalInsuranceCost: number | null;
  medicalInsuranceCurrency: string;
  requirements: string[];
  description: string;
  imageUrl: string;
  imageAttribution?: string;
  imageAttributionUrl?: string;
  logoUrl: string;
  galleryImages?: string[]; // доп. фото кампуса — под галерею на странице вуза
  dormitoryImages?: string[]; // фото общежития
  websiteUrl: string;
  youtubeUrl: string;
  virtualTourUrl: string;
  contactEmail: string;
  contactPhone: string;
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
  advantages: string[];
  limitations: string[];
  informationSource: string;
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
  quizAnswers?: Record<string, string | undefined> | null;
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

export type ClientSalesStatus = "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
export type ClientAdmissionStage = "not_started" | "documents" | "submitted" | "review" | "accepted" | "visa" | "enrolled" | "closed";

export interface Client {
  id: string;
  leadId: string | null;
  assignedManagerId: string;
  assignedManagerName: string | null;
  fullName: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  birthDate: string | null;
  parentName: string | null;
  parentPhone: string | null;
  parentEmail: string | null;
  preferredContact: "phone" | "whatsapp" | "email" | "telegram" | null;
  source: string | null;
  leadCategory: "A+" | "A" | "B" | "C" | null;
  salesStatus: ClientSalesStatus;
  product: string | null;
  studyCountry: string | null;
  specialty: string | null;
  educationLevel: string | null;
  intakeYear: number | null;
  intakeName: string | null;
  budget: number | null;
  budgetCurrency: string;
  languageLevel: string | null;
  languageExams: Record<string, string | number | null>;
  needsGrant: boolean;
  needsDormitory: boolean;
  preferences: string | null;
  dealProbability: number | null;
  refusalReason: string | null;
  nextAction: string | null;
  nextContactAt: string | null;
  admissionStage: ClientAdmissionStage;
  createdAt: string;
  updatedAt: string;
}

export interface ClientNote {
  id: string;
  clientId: string;
  authorId: string;
  authorName: string | null;
  body: string;
  createdAt: string;
}

export interface ClientUniversity {
  id: string; universityId: string; name: string; slug: string; city: string;
  priority: number; status: string; matchScore: number | null;
  recommendationReason: string | null; risks: string | null; managerComment: string | null;
  visibleToStudent: boolean;
}

export interface Profile {
  id: string;
  fullName: string | null;
  role: "admin" | "manager";
  phone: string | null;
  regions: string[];
  createdAt: string;
}

export type ManagerTaskType = "call" | "whatsapp" | "meeting" | "document_review" | "payment" | "proposal" | "application" | "reminder" | "other";
export type ManagerTaskPriority = "low" | "normal" | "high" | "urgent";
export type ManagerTaskStatus = "open" | "in_progress" | "completed" | "cancelled";

export interface ManagerTask {
  id: string;
  managerId: string;
  managerName: string | null;
  clientId: string | null;
  clientName: string | null;
  admissionCaseId: string | null;
  stageId: string | null;
  title: string;
  description: string | null;
  taskType: ManagerTaskType;
  priority: ManagerTaskPriority;
  status: ManagerTaskStatus;
  dueAt: string | null;
  completedAt: string | null;
  resultComment: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type KnowledgeArticleStatus = "draft" | "review" | "published" | "archived";

export interface KnowledgeArticle {
  id: string;
  title: string;
  section: string;
  content: string;
  language: string;
  status: KnowledgeArticleStatus;
  source: string | null;
  authorId: string;
  authorName: string | null;
  publishedBy: string | null;
  publishedAt: string | null;
  lastUpdatedAt: string;
  nextReviewAt: string | null;
  version: number;
  allowedRoles: string[];
  createdAt: string;
}

export type StaffResourceStatus = "draft" | "review" | "published" | "archived";
export type StaffResourceCategory = "company" | "services" | "presentations" | "documents" | "sales" | "marketing" | "training" | "templates" | "links";
export type StaffResourceType = "document" | "presentation" | "link" | "video" | "template";

export interface StaffResource {
  id: string;
  title: string;
  description: string;
  category: StaffResourceCategory;
  service: string | null;
  resourceType: StaffResourceType;
  status: StaffResourceStatus;
  originalName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  knowledgeArticleId: string | null;
  knowledgeArticleTitle: string | null;
  uploadedBy: string;
  uploaderName: string | null;
  publishedAt: string | null;
  nextReviewAt: string | null;
  version: number;
  isFeatured: boolean;
  allowedRoles: string[];
  createdAt: string;
  updatedAt: string;
}

// Учитель — расширение profiles строкой в teachers (id = profiles.id).
// "Учительство" определяется наличием этой строки, а не profiles.role
// (там check ограничен 'admin'|'manager').
export interface TeacherProfile {
  id: string;
  fullName: string | null;
  phone: string | null;
  specializations: string[];
  bio: string | null;
  maxStudents: number | null;
  hourlyRate: number | null;
  imageUrl: string | null;
  experience: string | null;
  certificateUrl: string | null;
  isPublished: boolean;
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
