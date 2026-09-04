"use server";

// ============================================================
// ZagranEasy — Кабинет студента: серверные экшены (мутации)
// через NestJS API (роль student проверяется на бэкенде).
// ============================================================

import { revalidatePath } from "next/cache";
import { apiPost, apiPatch } from "./api";
import { getSessionUser, getToken } from "./session-data";

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
