import { apiGet } from "./api";
import { getToken } from "./session-data";

export type ScheduleLanguage = "english" | "chinese";
export type ScheduleFormat = "offline" | "online";

export type ScheduleEnrollment = {
  id: string;
  student_id: string | null;
  student_name: string;
  student_phone: string | null;
  enrolled_at: string;
};

export type ScheduleSlot = {
  id: string;
  language: ScheduleLanguage;
  language_name: string;
  lesson_date: string;
  time_start: string;
  time_end: string;
  format: ScheduleFormat;
  capacity: number;
  free_places: number;
  enrollment_count: number;
  is_enrolled: boolean;
  my_enrollment_id: string | null;
  enrollments: ScheduleEnrollment[];
};

export async function getSchedule(input?: {
  from?: string;
  to?: string;
  language?: ScheduleLanguage;
  format?: ScheduleFormat;
}): Promise<ScheduleSlot[]> {
  const token = await getToken();
  const params = new URLSearchParams();
  if (input?.from) params.set("from", input.from);
  if (input?.to) params.set("to", input.to);
  if (input?.language) params.set("language", input.language);
  if (input?.format) params.set("format", input.format);
  const query = params.size ? `?${params.toString()}` : "";
  const response = await apiGet<ScheduleSlot[]>(`/schedule${query}`, token);
  if (response.error || !response.data) return [];
  return response.data;
}
