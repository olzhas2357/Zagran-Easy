"use server";

// ============================================================
// ZagranEasy — Кабинет студента: серверные экшены (мутации)
// через NestJS API (роль student проверяется на бэкенде).
// ============================================================

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiPost, apiPatch } from "./api";
import { getSessionUser, getToken } from "./session-data";

function redirectExpiredSession(nextPath: string): never {
  redirect(`/auth/session-expired?login=/account/login&next=${encodeURIComponent(nextPath)}`);
}

async function uploadStudentFile(
  formData: FormData,
  options: { bucket: "speaking-audio" | "assignment-photos"; kind: "audio" | "image"; maxBytes: number }
): Promise<{ success: boolean; url?: string; path?: string; name?: string; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Файл не найден" };
  if (!file.type.startsWith(`${options.kind}/`)) {
    return { success: false, error: options.kind === "image" ? "Можно загрузить только изображение" : "Файл записи должен быть аудио" };
  }
  if (file.size > options.maxBytes) {
    return { success: false, error: options.kind === "image" ? "Фото должно быть меньше 8 МБ" : "Запись не должна быть больше 20 МБ" };
  }

  const token = await getToken();
  if (!token) redirectExpiredSession("/account/homework");

  const upload = new FormData();
  upload.set("file", file);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

  let res: Response;
  let json: { success?: boolean; message?: string; url?: string; path?: string; name?: string; data?: { url?: string; path?: string; name?: string } };
  try {
    res = await fetch(`${API_URL}/uploads?bucket=${options.bucket}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: upload,
      cache: "no-store",
    });
    json = await res.json() as typeof json;
  } catch {
    return { success: false, error: "Нет подключения к серверу" };
  }
  if (res.status === 401) redirectExpiredSession("/account/homework");
  if (!res.ok || json.success === false) return { success: false, error: String(json.message || "Не удалось загрузить файл") };
  const data = json.data;
  return {
    success: true,
    url: String(data?.url || json.url || ""),
    path: String(data?.path || json.path || ""),
    name: String(data?.name || json.name || file.name),
  };
}

export async function uploadSpeakingAudio(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  return uploadStudentFile(formData, { bucket: "speaking-audio", kind: "audio", maxBytes: 20 * 1024 * 1024 });
}

export async function uploadHomeworkPhoto(
  formData: FormData
): Promise<{ success: boolean; url?: string; path?: string; name?: string; error?: string }> {
  return uploadStudentFile(formData, { bucket: "assignment-photos", kind: "image", maxBytes: 8 * 1024 * 1024 });
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
    if (res.authExpired) redirectExpiredSession("/account");
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
    if (res.authExpired) redirectExpiredSession("/account");
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
  if (res.authExpired) redirectExpiredSession("/account/homework");
  if (res.error) return { success: false, error: res.error };

  revalidatePath("/account/homework");
  return { success: true };
}

export async function turnInAssignment(assignmentId: string): Promise<{ success: boolean; error?: string }> {
  const res = await apiPost(`/assignments/${assignmentId}/submit`, {}, await getToken());
  if (res.authExpired) redirectExpiredSession(`/account/homework/${assignmentId}`);
  if (res.error) return { success: false, error: res.error };
  revalidatePath(`/account/homework/${assignmentId}`);
  revalidatePath("/account/homework");
  return { success: true };
}

export async function reopenSubmittedAssignment(assignmentId: string): Promise<{ success: boolean; error?: string }> {
  const res = await apiPost(`/assignments/${assignmentId}/reopen`, {}, await getToken());
  if (res.authExpired) redirectExpiredSession(`/account/homework/${assignmentId}`);
  if (res.error) return { success: false, error: res.error };
  revalidatePath(`/account/homework/${assignmentId}`);
  revalidatePath("/account/homework");
  return { success: true };
}
