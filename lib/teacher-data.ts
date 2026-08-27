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
    .select("id, created_at, tasks(title), students!inner(teacher_id, profiles!students_id_fkey(full_name))")
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

export interface StudentListItem {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  examType: string | null;
  currentScore: number | null;
  targetScore: number | null;
  progress: number | null;
  streak: number | null;
  xp: number | null;
}

function mapStudentRow(row: Record<string, unknown>): StudentListItem {
  const profile = (Array.isArray(row.profiles) ? row.profiles[0] : row.profiles) as
    | Record<string, unknown>
    | undefined;
  const goalsList = (Array.isArray(row.goals) ? row.goals : row.goals ? [row.goals] : []) as Record<
    string,
    unknown
  >[];
  const goal = goalsList.find((g) => g.status === "active") ?? goalsList[0];

  return {
    id: row.id as string,
    fullName: (profile?.full_name as string) ?? null,
    avatarUrl: (profile?.avatar_url as string) ?? null,
    examType: (goal?.exam_type as string) ?? null,
    currentScore: (goal?.current_score as number) ?? null,
    targetScore: (goal?.target_score as number) ?? null,
    progress: (goal?.progress as number) ?? null,
    streak: (row.current_streak as number) ?? null,
    xp: (row.total_xp as number) ?? null,
  };
}

export async function getStudents(teacherId: string): Promise<StudentListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("students")
    .select(
      "*, profiles!students_id_fkey(full_name, avatar_url), goals(exam_type, current_score, target_score, progress, status)"
    )
    .eq("teacher_id", teacherId);
  if (error || !data) return [];

  return (data as Record<string, unknown>[]).map(mapStudentRow);
}

export interface StudentDetail extends StudentListItem {
  phone: string | null;
}

export async function getStudentById(teacherId: string, studentId: string): Promise<StudentDetail | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("students")
    .select(
      "*, profiles!students_id_fkey(full_name, avatar_url, phone), goals(exam_type, current_score, target_score, progress, status)"
    )
    .eq("teacher_id", teacherId)
    .eq("id", studentId)
    .maybeSingle();
  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  const profile = (Array.isArray(row.profiles) ? row.profiles[0] : row.profiles) as
    | Record<string, unknown>
    | undefined;

  return {
    ...mapStudentRow(row),
    phone: (profile?.phone as string) ?? null,
  };
}

export interface StudentOption {
  id: string;
  fullName: string | null;
}

export async function getStudentsForSelect(teacherId: string): Promise<StudentOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("students")
    .select("id, profiles!students_id_fkey(full_name)")
    .eq("teacher_id", teacherId);
  if (error || !data) return [];

  return (data as Record<string, unknown>[]).map((row) => {
    const profile = (Array.isArray(row.profiles) ? row.profiles[0] : row.profiles) as
      | Record<string, unknown>
      | undefined;
    return { id: row.id as string, fullName: (profile?.full_name as string) ?? null };
  });
}

// Reads the first present key from a row — used where the exact column name
// on task_attempts/tasks isn't confirmed against the live Supabase schema.
function pickFirst(row: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key];
  }
  return null;
}

export interface TaskOption {
  id: string;
  title: string;
  type: string | null;
}

export async function getTaskBank(): Promise<TaskOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    title: (pickFirst(row, ["title", "name"]) as string) || "Задание",
    type: (pickFirst(row, ["type", "task_type"]) as string) ?? null,
  }));
}

export interface LessonListItem {
  id: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  studentCount: number;
  status: string | null;
  meetingUrl: string | null;
}

function mapLessonRow(row: Record<string, unknown>): LessonListItem {
  return {
    id: row.id as string,
    title: (row.title as string) || "Урок",
    scheduledAt: row.scheduled_at as string,
    durationMinutes: (row.duration_minutes as number) ?? 60,
    studentCount: ((row.student_ids as string[]) || []).length,
    status: (row.status as string) ?? null,
    meetingUrl: (row.meeting_url as string) ?? null,
  };
}

export async function getLessons(teacherId: string): Promise<LessonListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("scheduled_lessons")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("scheduled_at", { ascending: false });
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map(mapLessonRow);
}

export async function getLessonsSplit(teacherId: string): Promise<{ upcoming: LessonListItem[]; past: LessonListItem[] }> {
  const lessons = await getLessons(teacherId);
  const now = Date.now();
  const upcoming = lessons.filter((l) => new Date(l.scheduledAt).getTime() >= now).reverse();
  const past = lessons.filter((l) => new Date(l.scheduledAt).getTime() < now);
  return { upcoming, past };
}

export interface LessonDetail extends LessonListItem {
  description: string | null;
  studentIds: string[];
  students: StudentOption[];
  materials: { name: string; url: string }[];
  homeworkTaskIds: string[];
}

export async function getLessonById(teacherId: string, lessonId: string): Promise<LessonDetail | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("scheduled_lessons")
    .select("*")
    .eq("teacher_id", teacherId)
    .eq("id", lessonId)
    .maybeSingle();
  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  const studentIds = (row.student_ids as string[]) || [];

  let students: StudentOption[] = [];
  if (studentIds.length > 0) {
    const { data: studentRows } = await supabase
      .from("students")
      .select("id, profiles!students_id_fkey(full_name)")
      .in("id", studentIds);
    students = ((studentRows as Record<string, unknown>[]) || []).map((r) => {
      const profile = (Array.isArray(r.profiles) ? r.profiles[0] : r.profiles) as Record<string, unknown> | undefined;
      return { id: r.id as string, fullName: (profile?.full_name as string) ?? null };
    });
  }

  const rawMaterials = row.materials;
  const materials = Array.isArray(rawMaterials)
    ? (rawMaterials as Record<string, unknown>[]).map((m) => ({
        name: (m.name as string) || "Материал",
        url: m.url as string,
      }))
    : [];

  return {
    ...mapLessonRow(row),
    description: (row.description as string) ?? null,
    studentIds,
    students,
    materials,
    homeworkTaskIds: (row.homework_task_ids as string[]) || [],
  };
}

export interface AssignmentListItem {
  id: string;
  studentId: string;
  studentName: string;
  taskTitle: string;
  status: string;
  createdAt: string;
  reviewScore: number | null;
}

function mapAssignmentRow(row: Record<string, unknown>): AssignmentListItem {
  const task = Array.isArray(row.tasks) ? row.tasks[0] : row.tasks;
  const student = Array.isArray(row.students) ? row.students[0] : row.students;
  const studentProfile = (student
    ? Array.isArray((student as Record<string, unknown>).profiles)
      ? ((student as Record<string, unknown>).profiles as Record<string, unknown>[])[0]
      : (student as Record<string, unknown>).profiles
    : undefined) as Record<string, unknown> | undefined;

  return {
    id: row.id as string,
    studentId: (student as Record<string, unknown>)?.id as string,
    studentName: (studentProfile?.full_name as string) || "Без имени",
    taskTitle: ((task as Record<string, unknown>)?.title as string) || "Задание",
    status: (row.status as string) || "pending_review",
    createdAt: row.created_at as string,
    reviewScore: (row.review_score as number) ?? null,
  };
}

export async function getAssignments(teacherId: string): Promise<AssignmentListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("task_attempts")
    .select("*, tasks(title), students!inner(id, teacher_id, profiles!students_id_fkey(full_name))")
    .eq("students.teacher_id", teacherId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map(mapAssignmentRow);
}

export interface AssignmentDetail extends AssignmentListItem {
  taskQuestion: string | null;
  taskType: string | null;
  answerText: string | null;
  reviewComment: string | null;
  reviewErrors: string | null;
}

export async function getAssignmentById(teacherId: string, attemptId: string): Promise<AssignmentDetail | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("task_attempts")
    .select("*, tasks(*), students!inner(id, teacher_id, profiles!students_id_fkey(full_name))")
    .eq("students.teacher_id", teacherId)
    .eq("id", attemptId)
    .maybeSingle();
  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  const task = (Array.isArray(row.tasks) ? row.tasks[0] : row.tasks) as Record<string, unknown> | undefined;

  return {
    ...mapAssignmentRow(row),
    taskQuestion: (pickFirst(task || {}, ["question", "prompt", "description", "title"]) as string) ?? null,
    taskType: (pickFirst(task || {}, ["type", "task_type"]) as string) ?? null,
    answerText: (pickFirst(row, ["answer_text", "answer", "content", "response_text", "response", "text"]) as string) ?? null,
    reviewComment: (row.review_comment as string) ?? null,
    reviewErrors: (row.review_errors as string) ?? null,
  };
}

export interface MaterialItem {
  name: string;
  url: string;
  lessonId: string;
  lessonTitle: string;
  scheduledAt: string;
}

export async function getMaterials(teacherId: string): Promise<MaterialItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("scheduled_lessons")
    .select("id, title, scheduled_at, materials")
    .eq("teacher_id", teacherId)
    .order("scheduled_at", { ascending: false });
  if (error || !data) return [];

  const items: MaterialItem[] = [];
  for (const row of data as Record<string, unknown>[]) {
    const rawMaterials = row.materials;
    if (!Array.isArray(rawMaterials)) continue;
    for (const m of rawMaterials as Record<string, unknown>[]) {
      if (!m?.url) continue;
      items.push({
        name: (m.name as string) || "Материал",
        url: m.url as string,
        lessonId: row.id as string,
        lessonTitle: (row.title as string) || "Урок",
        scheduledAt: row.scheduled_at as string,
      });
    }
  }
  return items;
}
