// ============================================================
// ZagranEasy — Utility Functions
// ============================================================

import { SITE } from "./constants";

// ---- WhatsApp ----
// Генерирует ссылку на WhatsApp с готовым текстом.
// phone позволяет переопределить номер (например, отдельный номер для education).
export function waUrl(message: string, phone: string = SITE.phoneClean): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// Формирует текст заявки для WhatsApp из квиза
export function waQuizMessage(answers: {
  goal: string;
  budget: string;
  timeline: string;
}): string {
  const goalMap: Record<string, string> = {
    education: "Обучение за рубежом",
    tours: "Туры",
    work: "Работа за границей",
    visa: "Виза в США",
  };
  return [
    "Здравствуйте! Прошёл квиз на сайте.",
    `Цель: ${goalMap[answers.goal] || answers.goal}`,
    `Бюджет: ${answers.budget}`,
    `Сроки: ${answers.timeline}`,
    "",
    "Хочу бесплатную консультацию.",
  ].join("\n");
}

// Формирует текст заявки для конкретной услуги
export function waServiceMessage(
  service: string,
  detail?: string
): string {
  const parts = [`Здравствуйте! Интересует: ${service}`];
  if (detail) parts.push(detail);
  parts.push("", "Хочу узнать подробнее.");
  return parts.join("\n");
}

// ---- Форматирование ----
export function formatPrice(
  amount: number,
  currency: "$" | "€" | "₸" = "$"
): string {
  return `от ${currency}${amount.toLocaleString("ru-RU")}`;
}

export function formatArea(sqm: number): string {
  return `${sqm} м²`;
}

export function formatDuration(days: number): string {
  if (days === 1) return "1 день";
  if (days < 5) return `${days} дня`;
  return `${days} дней`;
}

// ---- Валидация ----
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 12;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---- URL / Slug ----
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

// ---- Анимации (для Framer Motion) ----
export const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const scaleOnHover = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 300, damping: 20 },
};
