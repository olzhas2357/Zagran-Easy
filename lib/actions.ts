"use server";

// ============================================================
// ZagranEasy — Server Actions
// Серверная логика: сохранение заявок, квиз, формы
// ============================================================

import { supabase, USE_DB } from "./db";

// ---- Типы для actions ----
interface LeadInput {
  source: "quiz" | "form" | "callback";
  service: string;
  name?: string;
  phone?: string;
  message?: string;
  quizAnswers?: {
    goal: string;
    budget: string;
    timeline: string;
  };
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
    if (!input.phone?.trim()) {
      return { success: false, error: "Укажите телефон" };
    }
  }

  if (input.source === "quiz" && !input.quizAnswers) {
    return { success: false, error: "Ответы квиза отсутствуют" };
  }

  // Если Supabase подключён — сохраняем в БД
  if (USE_DB) {
    const { data, error } = await supabase
      .from("leads")
      .insert({
        source: input.source,
        service: input.service,
        name: input.name || null,
        phone: input.phone || null,
        message: input.message || null,
        quiz_answers: input.quizAnswers || null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: "Ошибка сохранения. Попробуйте позже." };
    }

    return { success: true, leadId: data.id };
  }

  // Без Supabase — логируем в консоль (для разработки)
  const fakeId = `local-${Date.now()}`;
  console.log("📩 New lead (local):", { id: fakeId, ...input });
  return { success: true, leadId: fakeId };
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
