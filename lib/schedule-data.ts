import { apiGet } from "./api";
import { getToken } from "./session-data";

export type ScheduleLanguage = "english" | "chinese";
export type ScheduleFormat = "offline" | "online";
export type TrialBookingStatus = "booked" | "attended" | "enrolled" | "thinking" | "declined" | "no_show" | "cancelled";

export type ScheduleEnrollment = {
  id: string;
  student_id: string | null;
  student_name: string;
  student_phone: string | null;
  enrolled_at: string;
  enrollment_type?: "group" | "trial";
  trial_status?: TrialBookingStatus;
  duration_minutes?: number;
};

export type ScheduleSlot = {
  id: string;
  group_id?: string | null;
  group_title?: string | null;
  teacher_id?: string | null;
  teacher_name?: string | null;
  course_id?: string | null;
  course_name?: string | null;
  classroom_id?: string | null;
  classroom_name?: string | null;
  status?: "scheduled" | "cancelled" | "completed";
  meeting_url?: string | null;
  meeting_provider?: "meet" | "zoom" | null;
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

export type ScheduleResult = {
  slots: ScheduleSlot[];
  error: string | null;
};

export type ScheduleGroupStatus = "draft" | "active" | "completed" | "cancelled";

export type ScheduleRule = {
  id: string;
  weekday: number;
  time_start: string;
  time_end: string;
};

export type ScheduleGroup = {
  id: string;
  title: string;
  teacher_id: string;
  teacher_name: string;
  course_id: string | null;
  course_name: string | null;
  format: ScheduleFormat;
  classroom_id: string | null;
  classroom_name: string | null;
  capacity: number;
  enrollment_count: number;
  starts_on: string;
  ends_on: string;
  status: ScheduleGroupStatus;
  rules: ScheduleRule[];
};

export type ScheduleResourceOption = { id: string; name: string };
export type ScheduleResources = {
  teachers: ScheduleResourceOption[];
  courses: ScheduleResourceOption[];
  classrooms: ScheduleResourceOption[];
};

function relatedName(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  return ((value as Record<string, unknown>).full_name as string) || null;
}

export async function getScheduleResources(): Promise<ScheduleResources> {
  const token = await getToken();
  const [teachers, courses, classrooms] = await Promise.all([
    apiGet<Record<string, unknown>[]>("/teachers?limit=100", token),
    apiGet<Record<string, unknown>[]>("/courses?limit=100", token),
    apiGet<Record<string, unknown>[]>("/schedule/classrooms", token),
  ]);

  return {
    teachers: (teachers.data || []).map((row) => ({ id: row.id as string, name: relatedName(row.profiles) || (row.full_name as string) || "Без имени" })),
    courses: (courses.data || []).map((row) => ({ id: row.id as string, name: (row.title as string) || (row.name as string) || "Курс" })),
    classrooms: (classrooms.data || []).map((row) => ({ id: row.id as string, name: (row.name as string) || "Кабинет" })),
  };
}

export async function getSchedule(input?: {
  from?: string;
  to?: string;
  language?: ScheduleLanguage;
  format?: ScheduleFormat;
}): Promise<ScheduleResult> {
  const token = await getToken();
  const params = new URLSearchParams();
  if (input?.from) params.set("from", input.from);
  if (input?.to) params.set("to", input.to);
  if (input?.language) params.set("language", input.language);
  if (input?.format) params.set("format", input.format);
  const query = params.size ? `?${params.toString()}` : "";
  const response = await apiGet<ScheduleSlot[]>(`/schedule${query}`, token);
  if (response.error) return { slots: [], error: response.error };
  if (!response.data) return { slots: [], error: "Сервер не вернул расписание" };
  return { slots: response.data, error: null };
}
