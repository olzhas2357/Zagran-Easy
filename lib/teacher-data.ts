// ============================================================
// ZagranEasy — Кабинет преподавателя: серверные запросы от имени
// залогиненного учителя (RLS: is_teacher() / is_my_student() / teacher_id = auth.uid()).
// ============================================================

import { createSupabaseServerClient } from "./supabase/server";
import type { TeacherProfile } from "./types";

function mapTeacherRow(row: Record<string, unknown>): TeacherProfile {
  const profile = (Array.isArray(row.profiles) ? row.profiles[0] : row.profiles) as
    | Record<string, unknown>
    | undefined;
  return {
    id: row.id as string,
    fullName: (profile?.full_name as string) ?? null,
    phone: (profile?.phone as string) ?? null,
    specializations: (row.specializations as string[]) || [],
    bio: (row.bio as string) ?? null,
    maxStudents: (row.max_students as number) ?? null,
    hourlyRate: (row.hourly_rate as number) ?? null,
  };
}

// Профиль текущего учителя — источник правды для роли "учитель".
// Наличие строки в teachers (а не profiles.role) определяет доступ к /teacher/*.
export async function getCurrentTeacher(): Promise<TeacherProfile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("teachers")
    .select("id, specializations, bio, max_students, hourly_rate, profiles(full_name, phone)")
    .eq("id", user.id)
    .maybeSingle();
  if (error || !data) return null;
  return mapTeacherRow(data);
}

export interface DashboardStats {
  studentsCount: number;
  lessonsToday: number;
  pendingReviewCount: number;
  attendanceRate: number | null;
}

export async function getDashboardStats(teacherId: string): Promise<DashboardStats> {
  const supabase = await createSupabaseServerClient();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

  const [studentsRes, lessonsRes, reviewsRes, attendanceRes] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).eq("teacher_id", teacherId),
    supabase
      .from("scheduled_lessons")
      .select("id", { count: "exact", head: true })
      .eq("teacher_id", teacherId)
      .gte("scheduled_at", startOfToday)
      .lt("scheduled_at", startOfTomorrow),
    supabase
      .from("task_attempts")
      .select("id, students!inner(teacher_id)", { count: "exact", head: true })
      .eq("status", "pending_review")
      .is("reviewed_by", null)
      .eq("students.teacher_id", teacherId),
    supabase
      .from("lesson_attendance")
      .select("attended, scheduled_lessons!inner(teacher_id)")
      .eq("scheduled_lessons.teacher_id", teacherId),
  ]);

  const attendanceRows = attendanceRes.data || [];
  const attendanceRate =
    attendanceRows.length > 0
      ? Math.round((attendanceRows.filter((r) => r.attended).length / attendanceRows.length) * 100)
      : null;

  return {
    studentsCount: studentsRes.count ?? 0,
    lessonsToday: lessonsRes.count ?? 0,
    pendingReviewCount: reviewsRes.count ?? 0,
    attendanceRate,
  };
}

export interface NextLesson {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl: string | null;
  studentCount: number;
}

export async function getNextLesson(teacherId: string): Promise<NextLesson | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("scheduled_lessons")
    .select("id, title, description, scheduled_at, duration_minutes, meeting_url, student_ids")
    .eq("teacher_id", teacherId)
    .gt("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;

  return {
    id: data.id as string,
    title: data.title as string,
    description: (data.description as string) ?? null,
    scheduledAt: data.scheduled_at as string,
    durationMinutes: data.duration_minutes as number,
    meetingUrl: (data.meeting_url as string) ?? null,
    studentCount: ((data.student_ids as string[]) || []).length,
  };
}

export interface PendingReview {
  id: string;
  studentName: string;
  taskTitle: string;
  createdAt: string;
}

export async function getPendingReviews(teacherId: string, limit = 5): Promise<PendingReview[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("task_attempts")
    .select("id, created_at, tasks(title), students!inner(teacher_id, profiles(full_name))")
    .eq("status", "pending_review")
    .is("reviewed_by", null)
    .eq("students.teacher_id", teacherId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];

  return data.map((row) => {
    const task = Array.isArray(row.tasks) ? row.tasks[0] : row.tasks;
    const student = Array.isArray(row.students) ? row.students[0] : row.students;
    const studentProfile = student ? (Array.isArray(student.profiles) ? student.profiles[0] : student.profiles) : undefined;
    return {
      id: row.id as string,
      studentName: (studentProfile?.full_name as string) || "Без имени",
      taskTitle: (task?.title as string) || "Задание",
      createdAt: row.created_at as string,
    };
  });
}
