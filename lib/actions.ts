"use server";

// ============================================================
// ZagranEasy — Server Actions
// Серверная логика: сохранение заявок, квиз, формы — через NestJS API
// ============================================================

import { apiPost } from "./api";
import { isValidPhone, normalizeKazakhstanPhone } from "./utils";

// ---- Типы для actions ----
interface LeadInput {
  source: "quiz" | "form" | "callback" | "whatsapp";
  service: string;
  name?: string;
  phone?: string;
  message?: string;
  quizAnswers?: Record<string, string | undefined>;
}

interface ActionResult {
  success: boolean;
  error?: string;
  leadId?: string;
}

// ---- Сохранение заявки ----
export async function createLead(input: LeadInput): Promise<ActionResult> {
  // Валидация
  if (input.source === "form" || input.source === "callback") {
    if (!input.name?.trim()) {
      return { success: false, error: "Укажите имя" };
    }
  }

  if (input.source !== "whatsapp" && !input.phone?.trim()) {
    return { success: false, error: "Укажите телефон" };
  }

  if (input.phone && !isValidPhone(input.phone)) {
    return { success: false, error: "Укажите корректный мобильный номер Казахстана" };
  }

  if (input.source === "quiz" && !input.quizAnswers) {
    return { success: false, error: "Ответы квиза отсутствуют" };
  }

  const res = await apiPost<{ id: string }>("/leads", {
    source: input.source,
    service: input.service,
    name: input.name,
    phone: input.phone ? normalizeKazakhstanPhone(input.phone) : undefined,
    message: input.message,
    quiz_answers: input.quizAnswers,
  });

  if (res.error || !res.data) {
    return { success: false, error: res.error || "Ошибка сохранения. Попробуйте позже." };
  }

  return { success: true, leadId: res.data.id };
}

// ---- Квиз: сохранение + определение результата ----
export async function submitQuiz(answers: {
  goal: string;
  budget: string;
  timeline: string;
}): Promise<ActionResult & { recommendedService?: string }> {
  // Определяем рекомендованную услугу
  const recommendedService = answers.goal;

  // Сохраняем как заявку
  const result = await createLead({
    source: "quiz",
    service: recommendedService,
    quizAnswers: answers,
  });

  return {
    ...result,
    recommendedService,
  };
}

// ---- Форма обратного звонка ----
export async function requestCallback(data: {
  name: string;
  phone: string;
  service?: string;
  message?: string;
}): Promise<ActionResult> {
  return createLead({
    source: "callback",
    service: data.service || "general",
    name: data.name,
    phone: data.phone,
    message: data.message,
  });
}
