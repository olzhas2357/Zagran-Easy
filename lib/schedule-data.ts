import { apiGet } from "./api";
import { getToken } from "./session-data";

export type ScheduleFormat = "offline" | "online";
export type ScheduleEnrollment = {
  id: string;
  slot_id: string;
  format: ScheduleFormat;
  student_name: string;
  student_phone: string | null;
};

export type ScheduleSlot = {
  id: string;
  course_id: string;
  time_start: string;
  time_end: string;
  sort_order: number;
  enrollments: ScheduleEnrollment[];
};

export type ScheduleCourse = {
  id: string;
  name: string;
  days: string;
  offline_cap: number;
  online_cap: number;
  slots: ScheduleSlot[];
};

export async function getSchedule(): Promise<ScheduleCourse[]> {
  const token = await getToken();
  const response = await apiGet<ScheduleCourse[]>("/schedule", token);
  if (response.error || !response.data) return [];
  return response.data;
}

export async function getScheduleToken() {
  return getToken();
}
