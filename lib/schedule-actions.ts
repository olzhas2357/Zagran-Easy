"use server";

import { revalidatePath } from "next/cache";
import { apiDelete, apiGet, apiPatch, apiPost } from "./api";
import { getToken } from "./session-data";
import type { ScheduleFormat, ScheduleLanguage } from "./schedule-data";

async function result<T>(request: Promise<{ data: T; error?: string }>) {
  const response = await request;
  if (response.error) return { success: false as const, error: response.error };
  revalidatePath("/admin/schedule");
  revalidatePath("/teacher/schedule");
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

export interface ScheduleGroupInput {
  title: string;
  teacherId: string;
  courseId: string;
  format: ScheduleFormat;
  classroomId?: string;
  capacity: number;
  startsOn: string;
  endsOn: string;
  rules: { weekday: number; timeStart: string; timeEnd: string }[];
}

export async function createScheduleGroup(input: ScheduleGroupInput) {
  const token = await getToken();
  return result(apiPost("/schedule/groups", {
    title: input.title.trim(),
    teacher_id: input.teacherId,
    course_id: input.courseId,
    format: input.format,
    classroom_id: input.format === "offline" ? input.classroomId : undefined,
    capacity: input.capacity,
    starts_on: input.startsOn,
    ends_on: input.endsOn,
    rules: input.rules.map((rule) => ({ weekday: rule.weekday, time_start: rule.timeStart, time_end: rule.timeEnd })),
  }, token));
}

export type ScheduleConflict = {
  date: string;
  requested_time_start: string;
  requested_time_end: string;
  existing_time_start: string;
  existing_time_end: string;
  group_title: string;
  type: "teacher" | "classroom";
  message: string;
};

export async function validateScheduleGroup(input: ScheduleGroupInput) {
  const token = await getToken();
  const response = await apiPost<{ valid: boolean; conflicts: ScheduleConflict[]; sessions_count: number }>("/schedule/groups/validate", {
    title: input.title.trim(), teacher_id: input.teacherId, course_id: input.courseId,
    format: input.format, classroom_id: input.format === "offline" ? input.classroomId : undefined,
    capacity: input.capacity, starts_on: input.startsOn, ends_on: input.endsOn,
    rules: input.rules.map((rule) => ({ weekday: rule.weekday, time_start: rule.timeStart, time_end: rule.timeEnd })),
  }, token);
  if (response.error || !response.data) return { success: false as const, error: response.error || "Не удалось проверить расписание" };
  return { success: true as const, data: response.data };
}

export async function updateScheduleSession(sessionId: string, lessonDate: string, timeStart: string, timeEnd: string) {
  const token = await getToken();
  return result(apiPatch(`/schedule/sessions/${sessionId}`, {
    starts_at: `${lessonDate}T${timeStart}:00+06:00`,
    ends_at: `${lessonDate}T${timeEnd}:00+06:00`,
  }, token));
}

export type EditableScheduleRule = { weekday: number; time_start: string; time_end: string };

export async function getScheduleGroup(groupId: string) {
  const token = await getToken();
  const response = await apiGet<{ id: string; title: string; starts_on: string; ends_on: string; rules: EditableScheduleRule[] }>(`/schedule/groups/${groupId}`, token);
  if (response.error || !response.data) return { success: false as const, error: response.error || "Не удалось загрузить расписание группы" };
  return { success: true as const, data: response.data };
}

export async function updateScheduleGroupFuture(groupId: string, effectiveDate: string, rules: EditableScheduleRule[]) {
  const token = await getToken();
  return result(apiPatch(`/schedule/groups/${groupId}/future`, {
    effective_date: effectiveDate,
    rules: rules.map((rule) => ({ weekday: rule.weekday, time_start: rule.time_start, time_end: rule.time_end })),
  }, token));
}

export async function deleteScheduleGroupFuture(groupId: string, effectiveDate: string) {
  const token = await getToken();
  return result(apiDelete<{ deleted_sessions: number }>(
    `/schedule/groups/${encodeURIComponent(groupId)}/future?effective_date=${encodeURIComponent(effectiveDate)}`, token,
  ));
}

export async function cancelScheduleSession(sessionId: string, reason: string) {
  const token = await getToken();
  return result(apiPatch(`/schedule/sessions/${sessionId}/cancel`, { reason: reason.trim() || undefined }, token));
}

export async function updateScheduleMeeting(sessionId: string, meetingUrl: string) {
  const token = await getToken();
  return result(apiPatch(`/schedule/sessions/${sessionId}/meeting`, { meeting_url: meetingUrl.trim() }, token));
}

export type ScheduleGroupStudent = {
  student_id: string;
  full_name: string;
  phone: string | null;
  membership_id: string | null;
  status: "active" | "removed" | "available";
  assigned_at: string | null;
};

export async function getScheduleGroupStudents(groupId: string) {
  const token = await getToken();
  const response = await apiGet<{ capacity: number; active_count: number; students: ScheduleGroupStudent[] }>(`/schedule/groups/${groupId}/students`, token);
  if (response.error || !response.data) return { success: false as const, error: response.error || "Не удалось загрузить студентов" };
  return { success: true as const, data: response.data };
}

export async function addScheduleGroupStudent(groupId: string, studentId: string) {
  const token = await getToken();
  return result(apiPost(`/schedule/groups/${groupId}/students`, { student_id: studentId }, token));
}

export async function removeScheduleGroupStudent(groupId: string, studentId: string) {
  const token = await getToken();
  return result(apiDelete(`/schedule/groups/${groupId}/students/${studentId}`, token));
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
  void slotId;
  return {
    success: false as const,
    error: "Самостоятельная запись недоступна. Преподавателя и занятия назначает администратор.",
  };
}

export async function removeScheduleEnrollment(enrollmentId: string) {
  const token = await getToken();
  return result(apiDelete(`/schedule/enrollments/${enrollmentId}`, token));
}

export type TrialClient = { id: string; full_name: string; phone: string | null };

export async function getTrialClients() {
  const token = await getToken();
  const response = await apiGet<Record<string, unknown>[]>("/clients?limit=100", token);
  if (response.error) return { success: false as const, error: response.error };
  return { success: true as const, data: (response.data || []).map((row) => ({ id: String(row.id), full_name: String(row.full_name || "Без имени"), phone: row.phone ? String(row.phone) : null })) };
}

export async function createTrialBooking(input: { sessionId: string; clientId?: string; clientName: string; clientPhone?: string; notes?: string }) {
  if (!input.clientName.trim()) return { success: false as const, error: "Укажите имя клиента" };
  const token = await getToken();
  return result(apiPost("/schedule/trials", {
    session_id: input.sessionId, client_id: input.clientId || undefined, client_name: input.clientName.trim(),
    client_phone: input.clientPhone?.trim() || undefined, notes: input.notes?.trim() || undefined,
  }, token));
}

export async function updateTrialBookingStatus(id: string, status: string) {
  const token = await getToken();
  return result(apiPatch(`/schedule/trials/${id}`, { status }, token));
}
