"use server";

// ============================================================
// ZagranEasy — Кабинет студента: серверные экшены (мутации)
// через NestJS API (роль student проверяется на бэкенде).
// ============================================================

import { revalidatePath } from "next/cache";
import { apiPost, apiPatch } from "./api";
import { getSessionUser, getToken } from "./session-data";

export async function uploadSpeakingAudio(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Запись не найдена" };
  if (!file.type.startsWith("audio/")) return { success: false, error: "Файл записи должен быть аудио" };
  if (file.size > 20 * 1024 * 1024) return { success: false, error: "Запись не должна быть больше 20 МБ" };

  const token = await getToken();
  if (!token) return { success: false, error: "Не авторизован" };

  const upload = new FormData();
  upload.set("file", file);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

  try {
    const res = await fetch(`${API_URL}/uploads?bucket=speaking-audio`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: upload,
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || json.success === false) return { success: false, error: json.message || "Не удалось загрузить запись" };
    return { success: true, url: json.data?.url || json.url };
  } catch {
    return { success: false, error: "Нет подключения к серверу" };
  }
}

export interface SetGoalInput {
  goalId: string | null;
  examType: string;
  targetScore: number | null;
  currentScore: number | null;
}

export async function setMyGoal(input: SetGoalInput): Promise<{ success: boolean; error?: string }> {
  if (!input.examType.trim()) return { success: false, error: "Выберите направление подготовки" };
  if (!input.goalId && input.targetScore === null) return { success: false, error: "Укажите целевой балл" };

  const token = await getToken();

  if (input.goalId) {
    const res = await apiPatch(
      `/goals/${input.goalId}`,
      {
        exam_type: input.examType.trim(),
        target_score: input.targetScore ?? undefined,
        current_score: input.currentScore ?? undefined,
      },
      token
    );
    if (res.error) return { success: false, error: res.error };
  } else {
    const user = await getSessionUser();
    if (!user) return { success: false, error: "Не авторизован" };

    const res = await apiPost(
      "/goals",
      {
        student_id: user.profile.id,
        exam_type: input.examType.trim(),
        target_score: input.targetScore,
        current_score: input.currentScore ?? undefined,
      },
      token
    );
    if (res.error) return { success: false, error: res.error };
  }

  revalidatePath("/account");
  return { success: true };
}

// POST /tasks/:id/submit (роль student) создаёт запись в task_attempts —
// это и есть "отправка ответа", отдельного эндпоинта на /assignments нет.
// `answer` — строка для текстовых типов (writing/vocabulary/...) или JSON-строка
// (массив/объект) для структурированных типов (multiple_select/matching/fill_blanks) —
// см. lib/task-types.ts и разбор на бэкенде в tasks.service.ts submit().
export async function submitAssignmentAnswer(
  taskId: string,
  answer: string,
  timeSpentSeconds: number
): Promise<{ success: boolean; error?: string }> {
  if (!answer.trim()) return { success: false, error: "Введите ответ перед отправкой" };

  const token = await getToken();
  const res = await apiPost(`/tasks/${taskId}/submit`, { answer: answer.trim(), time_spent_seconds: Math.max(0, Math.round(timeSpentSeconds)) }, token);
  if (res.error) return { success: false, error: res.error };

  revalidatePath("/account/homework");
  return { success: true };
}
