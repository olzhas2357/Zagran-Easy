"use server";

import { revalidatePath } from "next/cache";
import { apiDelete, apiPatch, apiPost } from "./api";
import { getToken } from "./session-data";

export interface MockTestInput {
  examType: "ielts" | "hsk";
  title: string;
  level: string;
  timeLimitMinutes: number;
  taskIds: string[];
  isActive: boolean;
}

type ActionResult = { success: true } | { success: false; error: string };

function toBody(input: MockTestInput) {
  return {
    exam_type: input.examType,
    title: input.title.trim(),
    level: input.level.trim() || undefined,
    time_limit_minutes: input.timeLimitMinutes,
    task_ids: input.taskIds,
    is_active: input.isActive,
  };
}

function refresh() {
  revalidatePath("/teacher/mock-tests");
  revalidatePath("/mock-test");
  revalidatePath("/account/mock-test");
}

export async function createMockTest(input: MockTestInput): Promise<ActionResult> {
  const res = await apiPost("/mock-tests", toBody(input), await getToken());
  if (res.error) return { success: false, error: res.error };
  refresh();
  return { success: true };
}

export async function updateMockTest(id: string, input: MockTestInput): Promise<ActionResult> {
  const res = await apiPatch(`/mock-tests/${encodeURIComponent(id)}`, toBody(input), await getToken());
  if (res.error) return { success: false, error: res.error };
  refresh();
  return { success: true };
}

export async function setMockTestActive(id: string, isActive: boolean): Promise<ActionResult> {
  const res = await apiPatch(`/mock-tests/${encodeURIComponent(id)}`, { is_active: isActive }, await getToken());
  if (res.error) return { success: false, error: res.error };
  refresh();
  return { success: true };
}

export async function deleteMockTest(id: string): Promise<ActionResult> {
  const res = await apiDelete(`/mock-tests/${encodeURIComponent(id)}`, await getToken());
  if (res.error) return { success: false, error: res.error };
  refresh();
  return { success: true };
}
