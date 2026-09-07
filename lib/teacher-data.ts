// ============================================================
// ZagranEasy — Кабинет преподавателя: серверные запросы через NestJS API
// от имени залогиненного учителя (роль teacher).
// ============================================================

import { cache } from "react";
import { apiGet } from "./api";
import { getSessionUser, getToken } from "./session-data";
import type { TeacherProfile } from "./types";
import type { CourseModule, RealLanguageCourse } from "./language-data";

function unwrapProfile(row: Record<string, unknown>): Record<string, unknown> | undefined {
  const p = row.profiles;
  return (Array.isArray(p) ? p[0] : p) as Record<string, unknown> | undefined;
}

function mapTeacherRow(row: Record<string, unknown>): TeacherProfile {
  const profile = unwrapProfile(row);
  return {
    id: row.id as string,
    fullName: (profile?.full_name as string) ?? null,
    phone: (profile?.phone as string) ?? null,
    specializations: (row.specializations as string[]) || [],
    bio: (row.bio as string) ?? null,
    maxStudents: (row.max_students as number) ?? null,
    hourlyRate: (row.hourly_rate as number) ?? null,
    imageUrl: (row.image_url as string) ?? null,
  };
}

// Профиль текущего учителя — источник правды для роли "учитель".
export const getCurrentTeacher = cache(async (): Promise<TeacherProfile | null> => {
  const user = await getSessionUser();
  if (!user || user.profile.role !== "teacher") return null;
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>(`/teachers/${user.profile.id}`, token);
  if (res.error || !res.data) return null;
  return mapTeacherRow(res.data);
});

export interface DashboardStats {
  studentsCount: number;
  lessonsToday: number;
  pendingReviewCount: number;
  attendanceRate: number | null;
}

export async function getDashboardStats(teacherId: string): Promise<DashboardStats> {
  const token = await getToken();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

  const [studentsRes, lessonsRes, pendingRes] = await Promise.all([
    apiGet<unknown[]>(`/teachers/${teacherId}/students`, token),
    apiGet<unknown[]>(`/scheduled-lessons?from=${startOfToday}&to=${startOfTomorrow}`, token),
    apiGet<unknown[]>("/assignments?status=pending", token),
  ]);

  return {
    studentsCount: studentsRes.data?.length ?? 0,
    lessonsToday: lessonsRes.data?.length ?? 0,
    pendingReviewCount: pendingRes.data?.length ?? 0,
    // Агрегат посещаемости пока не отдаётся NestJS API отдельным эндпоинтом.
    attendanceRate: null,
  };
}

export interface NextLesson {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: string;
  durationMinutes: number;
  meetingUrl: string | null;
  meetingProvider: "zoom" | "meet" | null;
  studentCount: number;
}

export async function getNextLesson(teacherId: string): Promise<NextLesson | null> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>(`/scheduled-lessons?from=${new Date().toISOString()}`, token);
  if (res.error || !res.data || res.data.length === 0) return null;

  const data = res.data.filter((r) => r.teacher_id === teacherId).sort((a, b) => (a.scheduled_at as string).localeCompare(b.scheduled_at as string))[0];
  if (!data) return null;

  return {
    id: data.id as string,
    title: data.title as string,
    description: (data.description as string) ?? null,
    scheduledAt: data.scheduled_at as string,
    durationMinutes: data.duration_minutes as number,
    meetingUrl: (data.meeting_url as string) ?? null,
    meetingProvider: data.meeting_provider === "zoom" || data.meeting_provider === "meet" ? data.meeting_provider : null,
    studentCount: ((data.student_ids as string[]) || []).length,
  };
}

export interface PendingReview {
  id: string;
  studentName: string;
  taskTitle: string;
  createdAt: string;
}

export async function getTeacherDashboard(teacherId: string): Promise<{
  stats: DashboardStats;
  nextLesson: NextLesson | null;
  pendingReviews: PendingReview[];
}> {
  const token = await getToken();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const [studentsRes, lessonsRes, assignmentsRes] = await Promise.all([
    apiGet<unknown[]>(`/teachers/${teacherId}/students`, token),
    apiGet<Record<string, unknown>[]>(`/scheduled-lessons?from=${now.toISOString()}`, token),
    apiGet<Record<string, unknown>[]>("/assignments?status=pending", token),
  ]);

  const lessons = lessonsRes.data || [];
  const lessonsToday = lessons.filter((row) => (row.scheduled_at as string) >= startOfToday).length;
  const nextLessonRow = lessons
    .filter((row) => new Date(row.scheduled_at as string).getTime() >= now.getTime())
    .sort((a, b) => (a.scheduled_at as string).localeCompare(b.scheduled_at as string))[0];

  const nextLesson: NextLesson | null = nextLessonRow
    ? {
        id: nextLessonRow.id as string,
        title: nextLessonRow.title as string,
        description: (nextLessonRow.description as string) ?? null,
        scheduledAt: nextLessonRow.scheduled_at as string,
        durationMinutes: nextLessonRow.duration_minutes as number,
        meetingUrl: (nextLessonRow.meeting_url as string) ?? null,
        meetingProvider: nextLessonRow.meeting_provider === "zoom" || nextLessonRow.meeting_provider === "meet" ? nextLessonRow.meeting_provider : null,
        studentCount: ((nextLessonRow.student_ids as string[]) || []).length,
      }
    : null;

  const pendingReviews = (assignmentsRes.data || []).slice(0, 5).map((row) => {
    const studentRow = (Array.isArray(row.students) ? row.students[0] : row.students) as Record<string, unknown> | undefined;
    const studentProfile = unwrapProfile(studentRow || {});
    return {
      id: row.id as string,
      studentName: (studentProfile?.full_name as string) || "Без имени",
      taskTitle: (row.title as string) || "Задание",
      createdAt: (row.created_at as string) || (row.due_date as string) || "",
    };
  });

  return {
    stats: {
      studentsCount: studentsRes.data?.length ?? 0,
      lessonsToday,
      pendingReviewCount: assignmentsRes.data?.length ?? 0,
      attendanceRate: null,
    },
    nextLesson,
    pendingReviews,
  };
}

// Бэкенд сам ограничивает список ролью teacher → teacher_id текущего пользователя.
export async function getPendingReviews(_teacherId: string, limit = 5): Promise<PendingReview[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>("/assignments?status=pending", token);
  if (res.error || !res.data) return [];

  return res.data.slice(0, limit).map((row) => {
    const studentRow = (Array.isArray(row.students) ? row.students[0] : row.students) as Record<string, unknown> | undefined;
    const studentProfile = unwrapProfile(studentRow || {});
    return {
      id: row.id as string,
      studentName: (studentProfile?.full_name as string) || "Без имени",
      taskTitle: (row.title as string) || "Задание",
      createdAt: (row.created_at as string) || (row.due_date as string) || "",
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

function mapTeacherStudentRow(row: Record<string, unknown>): StudentListItem {
  const student = (row.students as Record<string, unknown>) || row;
  const profile = unwrapProfile(student);
  return {
    id: student.id as string,
    fullName: (profile?.full_name as string) ?? null,
    avatarUrl: (profile?.avatar_url as string) ?? null,
    // Экзаменационная цель — из отдельного /students/:id (goals), не из списка.
    examType: null,
    currentScore: null,
    targetScore: null,
    progress: null,
    streak: (student.current_streak as number) ?? null,
    xp: (student.total_xp as number) ?? null,
  };
}

export async function getStudents(teacherId: string): Promise<StudentListItem[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>("/teachers/me/students", token);
  if (res.error || !res.data) {
    console.error("Failed to load teacher students", {
      teacherId,
      hasToken: Boolean(token),
      hasData: res.data !== null && res.data !== undefined,
      error: String(res.error || "API не вернул data"),
    });
    return [];
  }
  const rows = Array.isArray(res.data)
    ? res.data
    : ((res.data as unknown as Record<string, unknown>).data as Record<string, unknown>[]) || [];
  return rows
    .filter((row) => {
      const student = (row.students as Record<string, unknown>) || row;
      return !student.teacher_id || student.teacher_id === teacherId;
    })
    .map(mapTeacherStudentRow);
}

export interface StudentDetail extends StudentListItem {
  phone: string | null;
}

export async function getStudentById(teacherId: string, studentId: string): Promise<StudentDetail | null> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>(`/students/${studentId}`, token);
  if (res.error || !res.data) return null;

  const row = res.data;
  if (row.teacher_id !== teacherId) return null;

  const profile = unwrapProfile(row);
  const goalsList = ((Array.isArray(row.goals) ? row.goals : row.goals ? [row.goals] : []) as Record<string, unknown>[]);
  const goal = goalsList.find((g) => g.status === "active") ?? goalsList[0];

  return {
    id: row.id as string,
    fullName: (profile?.full_name as string) ?? null,
    avatarUrl: (profile?.avatar_url as string) ?? null,
    phone: (profile?.phone as string) ?? null,
    examType: (goal?.exam_type as string) ?? null,
    currentScore: (goal?.current_score as number) ?? null,
    targetScore: (goal?.target_score as number) ?? null,
    progress: (goal?.progress as number) ?? null,
    streak: (row.current_streak as number) ?? null,
    xp: (row.total_xp as number) ?? null,
  };
}

export interface StudentOption {
  id: string;
  fullName: string | null;
}

export async function getStudentsForSelect(teacherId: string): Promise<StudentOption[]> {
  const students = await getStudents(teacherId);
  return students.map((s) => ({ id: s.id, fullName: s.fullName }));
}

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
  const tasks = await getTasks();
  return tasks.map((t) => ({ id: t.id, title: t.title, type: t.type }));
}

export async function getTeacherCourse(courseId: string): Promise<(RealLanguageCourse & { sections: CourseModule[] }) | null> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>(`/courses/${courseId}`, token);
  if (res.error || !res.data) return null;
  const sectionsRes = await apiGet<Record<string, unknown>[]>(`/courses/${courseId}/sections`, token);
  return {
    id: String(res.data.id ?? courseId),
    slug: String(res.data.slug ?? ""),
    title: String(res.data.title ?? ""),
    exam_type: String(res.data.exam_type ?? ""),
    level_from: String(res.data.level_from ?? ""),
    level_to: String(res.data.level_to ?? ""),
    description: String(res.data.description ?? ""),
    total_lessons: Number(res.data.total_lessons ?? 0),
    total_tasks: Number(res.data.total_tasks ?? 0),
    estimated_hours: Number(res.data.estimated_hours ?? 0),
    image_url: res.data.image_url ? String(res.data.image_url) : null,
    is_active: Boolean(res.data.is_active),
    sort_order: Number(res.data.sort_order ?? 0),
    created_at: String(res.data.created_at ?? ""),
    sections: (sectionsRes.data ?? []).map((row) => ({
      id: String(row.id ?? ""),
      course_id: String(row.course_id ?? courseId),
      slug: String(row.slug ?? ""),
      title: String(row.title ?? ""),
      icon: String(row.icon ?? "📘"),
      sort_order: Number(row.sort_order ?? 0),
      lessons: Array.isArray(row.lessons) ? row.lessons as CourseModule["lessons"] : [],
    })),
  };
}

export async function getTeacherCourses(): Promise<RealLanguageCourse[]> {
  const token = await getToken();
  let res = await apiGet<Record<string, unknown>[]>("/courses/manage?limit=100", token);
  if (res.error || !res.data) {
    console.error("Failed to load teacher courses from manage endpoint", { error: String(res.error || "empty response"), hasToken: Boolean(token) });
    res = await apiGet<Record<string, unknown>[]>("/courses?limit=100", token);
  }
  if (res.error || !res.data) {
    console.error("Failed to load teacher courses", { error: String(res.error || "empty response"), hasToken: Boolean(token) });
    return [];
  }
  return res.data.map((row) => ({
    id: String(row.id ?? ""), slug: String(row.slug ?? ""), title: String(row.title ?? ""),
    exam_type: String(row.exam_type ?? ""), level_from: String(row.level_from ?? ""), level_to: String(row.level_to ?? ""),
    description: String(row.description ?? ""), total_lessons: Number(row.total_lessons ?? 0), total_tasks: Number(row.total_tasks ?? 0),
    estimated_hours: Number(row.estimated_hours ?? 0), image_url: row.image_url ? String(row.image_url) : null,
    is_active: Boolean(row.is_active), sort_order: Number(row.sort_order ?? 0), created_at: String(row.created_at ?? ""),
  }));
}

export interface TaskListItem {
  id: string;
  title: string;
  type: string | null;
  examType: string | null;
  section: string | null;
  difficulty: string | null;
  question: string;
  options: Record<string, unknown> | null;
  xpReward: number | null;
}

export async function getTasks(): Promise<TaskListItem[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>("/tasks", token);
  if (res.error || !res.data) return [];
  return res.data
    .map((row) => ({
      id: row.id as string,
      title: (pickFirst(row, ["title", "name"]) as string) || "Задание",
      type: (pickFirst(row, ["type", "task_type"]) as string) ?? null,
      examType: (row.exam_type as string) ?? null,
      section: (row.section as string) ?? null,
      difficulty: (row.difficulty as string) ?? null,
      question: (row.question as string) || "",
      options: (row.options as Record<string, unknown>) ?? null,
      xpReward: (row.xp_reward as number) ?? null,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export interface LessonListItem {
  id: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  studentCount: number;
  status: string | null;
  meetingUrl: string | null;
  meetingProvider: "zoom" | "meet" | null;
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
    meetingProvider: row.meeting_provider === "zoom" || row.meeting_provider === "meet" ? row.meeting_provider : null,
  };
}

export async function getLessons(teacherId: string): Promise<LessonListItem[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>(`/scheduled-lessons?teacher_id=${teacherId}`, token);
  if (res.error || !res.data) return [];
  return res.data.map(mapLessonRow).sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));
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
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>(`/scheduled-lessons/${lessonId}`, token);
  if (res.error || !res.data) return null;

  const row = res.data;
  if (row.teacher_id !== teacherId) return null;

  const studentIds = (row.student_ids as string[]) || [];
  const allStudents = studentIds.length > 0 ? await getStudentsForSelect(teacherId) : [];
  const students = allStudents.filter((s) => studentIds.includes(s.id));

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
  const student = (Array.isArray(row.students) ? row.students[0] : row.students) as Record<string, unknown> | undefined;
  const studentProfile = unwrapProfile(student || {});

  return {
    id: row.id as string,
    studentId: (student?.id as string) ?? (row.student_id as string),
    studentName: (studentProfile?.full_name as string) || "Без имени",
    taskTitle: (row.title as string) || "Задание",
    status: (row.status as string) || "pending",
    createdAt: (row.created_at as string) || (row.due_date as string) || "",
    reviewScore: (row.review_score as number) ?? null,
  };
}

// Бэкенд сам ограничивает список ассайнментов ролью teacher → teacher_id
// текущего пользователя (см. AssignmentsController.findAll).
export async function getAssignments(_teacherId: string): Promise<AssignmentListItem[]> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>("/assignments", token);
  if (res.error || !res.data) return [];
  return res.data.map(mapAssignmentRow);
}

export interface AssignmentDetail extends AssignmentListItem {
  tasks: AssignmentTaskDetail[];
}

export interface AssignmentTaskDetail {
  id: string;
  title: string;
  question: string | null;
  type: string | null;
  options: Record<string, unknown> | null;
  audioUrl: string | null;
  answerText: string | null;
  reviewScore: number | null;
  reviewComment: string | null;
  reviewErrors: string | null;
}

export async function getAssignmentById(teacherId: string, assignmentId: string): Promise<AssignmentDetail | null> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>(`/assignments/${assignmentId}`, token);
  if (res.error || !res.data) return null;

  const row = res.data;
  if (row.teacher_id !== teacherId) return null;

  const tasks = (row.tasks as Record<string, unknown>[]) || [];

  return {
    ...mapAssignmentRow(row),
    tasks: tasks.map((task) => {
      const attempt = (task.attempt as Record<string, unknown>) || {};
      return {
        id: task.id as string,
        title: (task.title as string) || "Задание",
        question: (pickFirst(task, ["question", "prompt", "description", "title"]) as string) ?? null,
        type: (pickFirst(task, ["type", "task_type"]) as string) ?? null,
        options: (task.options as Record<string, unknown>) ?? null,
        audioUrl: (task.audio_url as string) ?? null,
        answerText: (attempt.answer as string) ?? null,
        reviewScore: (attempt.review_score as number) ?? null,
        reviewComment: (attempt.review_comment as string) ?? null,
        reviewErrors: (attempt.review_errors as string) ?? null,
      };
    }),
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
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>[]>(`/scheduled-lessons?teacher_id=${teacherId}`, token);
  if (res.error || !res.data) return [];

  const items: MaterialItem[] = [];
  for (const row of res.data) {
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
  return items.sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));
}