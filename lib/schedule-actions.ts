"use server";

import { revalidatePath } from "next/cache";
import { apiDelete, apiPatch, apiPost } from "./api";
import { getToken } from "./session-data";

async function result<T>(request: Promise<{ data: T; error?: string }>) {
  const response = await request;
  if (response.error) return { success: false, error: response.error };
  revalidatePath("/staff/schedule");
  return { success: true, data: response.data };
}

export async function updateScheduleCourse(courseId: string, input: { name?: string; days?: string; offline_cap?: number; online_cap?: number }) {
  const token = await getToken();
  return result(apiPatch(`/schedule/courses/${courseId}`, input, token));
}

export async function updateScheduleSlot(slotId: string, input: { time_start?: string; time_end?: string }) {
  const token = await getToken();
  return result(apiPatch(`/schedule/slots/${slotId}`, input, token));
}

export async function addScheduleSlot(courseId: string, timeStart = "00:00", timeEnd = "00:00") {
  const token = await getToken();
  return result(apiPost("/schedule/slots", { course_id: courseId, time_start: timeStart, time_end: timeEnd }, token));
}

export async function deleteScheduleSlot(slotId: string) {
  const token = await getToken();
  return result(apiDelete(`/schedule/slots/${slotId}`, token));
}

export async function enrollScheduleStudent(slotId: string, format: "offline" | "online", studentName: string, studentPhone: string) {
  if (!studentName.trim()) return { success: false, error: "Введите имя студента" };
  const token = await getToken();
  return result(apiPost("/schedule/enrollments", { slot_id: slotId, format, student_name: studentName.trim(), student_phone: studentPhone.trim() || undefined }, token));
}

export async function removeScheduleEnrollment(enrollmentId: string) {
  const token = await getToken();
  return result(apiDelete(`/schedule/enrollments/${enrollmentId}`, token));
}
