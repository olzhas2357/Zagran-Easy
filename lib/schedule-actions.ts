"use server";

import { revalidatePath } from "next/cache";
import { apiDelete, apiPatch, apiPost } from "./api";
import { getToken } from "./session-data";
import type { ScheduleFormat, ScheduleLanguage } from "./schedule-data";

async function result<T>(request: Promise<{ data: T; error?: string }>) {
  const response = await request;
  if (response.error) return { success: false as const, error: response.error };
  revalidatePath("/staff/schedule");
  revalidatePath("/account/schedule");
  return { success: true as const, data: response.data };
}

export interface ScheduleSlotInput {
  language: ScheduleLanguage;
  lessonDate: string;
  timeStart: string;
  timeEnd: string;
  format: ScheduleFormat;
  capacity: number;
}

function slotBody(input: ScheduleSlotInput) {
  return {
    language: input.language,
    lesson_date: input.lessonDate,
    time_start: input.timeStart,
    time_end: input.timeEnd,
    format: input.format,
    capacity: input.capacity,
  };
}

export async function addScheduleSlot(input: ScheduleSlotInput) {
  const token = await getToken();
  return result(apiPost("/schedule/slots", slotBody(input), token));
}

export async function updateScheduleSlot(slotId: string, input: ScheduleSlotInput) {
  const token = await getToken();
  return result(apiPatch(`/schedule/slots/${slotId}`, slotBody(input), token));
}

export async function deleteScheduleSlot(slotId: string) {
  const token = await getToken();
  return result(apiDelete(`/schedule/slots/${slotId}`, token));
}

export async function copyScheduleDay(sourceDate: string, targetDate: string) {
  const token = await getToken();
  return result<{ copied: number; skipped: number; conflicts: { language: ScheduleLanguage; time_start: string; time_end: string; format: ScheduleFormat; reason: string }[] }>(
    apiPost("/schedule/days/copy", { source_date: sourceDate, target_date: targetDate }, token),
  );
}

export async function enrollScheduleStudent(slotId: string, studentName: string, studentPhone: string) {
  if (!studentName.trim()) return { success: false as const, error: "Введите имя студента" };
  const token = await getToken();
  return result(apiPost("/schedule/enrollments", {
    slot_id: slotId,
    student_name: studentName.trim(),
    student_phone: studentPhone.trim() || undefined,
  }, token));
}

export async function enrollMyScheduleSlot(slotId: string) {
  const token = await getToken();
  return result(apiPost("/schedule/enrollments/self", { slot_id: slotId }, token));
}

export async function removeScheduleEnrollment(enrollmentId: string) {
  const token = await getToken();
  return result(apiDelete(`/schedule/enrollments/${enrollmentId}`, token));
}
