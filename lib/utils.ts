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
export function waQuizMessage(answers: Record<string, string | undefined>): string {
  const fieldLabels: Record<string, string> = {
    country: "Страна",
    when: "Срок поступления",
    budget: "Бюджет",
    prepTiming: "Начало подготовки",
    level: "Желаемый уровень языка",
  };
  return [
    "Здравствуйте! Прошёл квиз на сайте.",
    ...Object.entries(answers)
      .filter(([, value]) => value)
      .map(([key, value]) => `${fieldLabels[key] ?? key}: ${value}`),
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
  return `от ${currency}${(amount ?? 0).toLocaleString("ru-RU")}`;
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
const KAZAKHSTAN_MOBILE_PREFIXES = new Set([
  "700", "701", "702", "705", "706", "707", "708",
  "747", "771", "775", "776", "777", "778",
]);

export const KAZAKHSTAN_PHONE_START = "+7 ";

function getKazakhstanNationalDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (phone.trim().startsWith("+7") || (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8")))) {
    return digits.slice(1, 11);
  }

  return digits.slice(0, 10);
}

export function formatKazakhstanPhone(phone: string): string {
  const national = getKazakhstanNationalDigits(phone);
  if (!national) return KAZAKHSTAN_PHONE_START;

  const prefix = national.slice(0, 3);
  const first = national.slice(3, 6);
  const second = national.slice(6, 8);
  const third = national.slice(8, 10);

  let formatted = `+7 (${prefix}`;
  if (prefix.length === 3) formatted += ")";
  if (first) formatted += ` ${first}`;
  if (second) formatted += ` ${second}`;
  if (third) formatted += ` ${third}`;
  return formatted;
}

export function normalizeKazakhstanPhone(phone: string): string | null {
  if (!isValidPhone(phone)) return null;
  return `+7${getKazakhstanNationalDigits(phone)}`;
}

function isObviouslyFakeSubscriber(subscriber: string): boolean {
  if (/^(\d)\1{6}$/.test(subscriber)) return true;

  const ascending = "01234567890123456";
  const descending = "98765432109876543";
  return ascending.includes(subscriber) || descending.includes(subscriber);
}

export function isValidPhone(phone: string): boolean {
  const national = getKazakhstanNationalDigits(phone);
  if (national.length !== 10) return false;
  if (!KAZAKHSTAN_MOBILE_PREFIXES.has(national.slice(0, 3))) return false;
  return !isObviouslyFakeSubscriber(national.slice(3));
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
