"use server";

import { redirect } from "next/navigation";
import { apiPost } from "./api";
import { getToken } from "./session-data";

export interface MockTestResult {
  score: number;
  correct: number;
  autoTotal: number;
  pendingReview: number;
  details: Array<{ taskId: string; isCorrect: boolean | null; explanation: string | null }>;
}

function mapResult(data: Record<string, unknown>): MockTestResult {
  const details = Array.isArray(data.details) ? (data.details as Record<string, unknown>[]) : [];
  return {
    score: Number(data.score ?? 0),
    correct: Number(data.correct ?? 0),
    autoTotal: Number(data.auto_total ?? 0),
    pendingReview: Number(data.pending_review ?? 0),
    details: details.map((d) => ({
      taskId: String(d.task_id),
      isCorrect: typeof d.is_correct === "boolean" ? d.is_correct : null,
      explanation: typeof d.explanation === "string" ? d.explanation : null,
    })),
  };
}

// Публичная проверка без аккаунта: результат не сохраняется.
export async function checkMockTest(
  mockTestId: string,
  answers: Record<string, unknown>,
  timeSpentSeconds: number,
): Promise<{ success: true; result: MockTestResult } | { success: false; error: string }> {
  const res = await apiPost<Record<string, unknown>>(
    `/mock-tests/${encodeURIComponent(mockTestId)}/check`,
    { answers, time_spent_seconds: Math.max(0, Math.round(timeSpentSeconds)) },
  );
  if (res.error || !res.data) return { success: false, error: res.error || "Не удалось проверить тест" };
  return { success: true, result: mapResult(res.data) };
}

export async function submitMockTest(
  mockTestId: string,
  answers: Record<string, unknown>,
  timeSpentSeconds: number,
): Promise<{ success: true; result: MockTestResult } | { success: false; error: string }> {
  const token = await getToken();
  const res = await apiPost<Record<string, unknown>>(
    `/mock-tests/${encodeURIComponent(mockTestId)}/submit`,
    { answers, time_spent_seconds: Math.max(0, Math.round(timeSpentSeconds)) },
    token,
  );

  if (res.authExpired) {
    redirect(`/auth/session-expired?login=/account/login&next=${encodeURIComponent(`/account/mock-test/${mockTestId}`)}`);
  }
  if (res.error || !res.data) return { success: false, error: res.error || "Не удалось отправить тест" };

  return { success: true, result: mapResult(res.data) };
}
