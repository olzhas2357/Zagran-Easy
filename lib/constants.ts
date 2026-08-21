// ============================================================
// ZagranEasy — Constants & Utilities
// ============================================================

export const SITE = {
  name: "ZagranEasy",
  tagline: "Весь мир — в одном месте",
  description: "Обучение, работа, туры, визы, недвижимость за рубежом. Одна команда решает все вопросы.",
  phone: "+7 747 911 2606",
  phoneClean: "77479112606",
  email: "ZagranEasy.office@gmail.com",
  instagram: "zagraneasyy",
  instagramUrl: "https://www.instagram.com/zagraneasyy",
  address: "г. Алматы, ул. Сатпаева 30/8, офис Блок С 3 этаж 148",
  url: "https://zagraneasy.kz",
} as const;

export const SERVICES = [
  { id: "education", icon: "🎓", title: "Обучение", subtitle: "за рубежом", color: "emerald", href: "/education" },
  { id: "tours",     icon: "✈️", title: "Туры",     subtitle: "по миру",     color: "sky",     href: "/tours" },
  { id: "work",      icon: "💼", title: "Работа",   subtitle: "за границей", color: "violet",  href: "/work" },
  { id: "visa",      icon: "🗽", title: "Виза USA", subtitle: "B1/B2, F-1",  color: "blue",    href: "/visa-usa" },
  { id: "realestate",icon: "🏠", title: "Жильё",    subtitle: "за рубежом",  color: "amber",   href: "/realestate" },
] as const;

export const STATS = [
  { value: 3200, suffix: "+", label: "Клиентов" },
  { value: 50,   suffix: "+", label: "Университетов" },
  { value: 98,   suffix: "%", label: "Успешных виз" },
] as const;

// Отдельный номер WhatsApp для модуля образования
export const EDUCATION_PHONE = "77470382914";

// Tailwind color map for service cards
export const SERVICE_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800" },
  sky:     { bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-700",     badge: "bg-sky-100 text-sky-800" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700",  badge: "bg-violet-100 text-violet-800" },
  blue:    { bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700",    badge: "bg-blue-100 text-blue-800" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   badge: "bg-amber-100 text-amber-800" },
};
