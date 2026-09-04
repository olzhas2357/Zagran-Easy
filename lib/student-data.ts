// ============================================================
// ZagranEasy — Кабинет студента: уроки и домашние задания через
// NestJS API от имени залогиненного студента (роль student).
// Бэкенд сам ограничивает списки ролью — см. lib/teacher-data.ts.
// ============================================================

import { apiGet } from "./api";
import { getSessionUser, getToken } from "./session-data";

export async function getCurrentStudent(): Promise<{ id: string; email?: string } | null> {
  const user = await getSessionUser();
  if (!user || user.profile.role !== "student") return null;
  return { id: user.id, email: user.email };
}

function pickFirst(row: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key];
  }
  return null;
}

export interface StudentLessonListItem {
  id: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string | null;
  meetingUrl: string | null;
}

function mapLessonRow(row: Record<string, unknown>): StudentLessonListItem {
  return {
    id: row.id as string,
    title: (row.title as string) || "Урок",
    scheduledAt: row.scheduled_at as string,
    durationMinutes: (row.duration_minutes as number) ?? 60,
    status: (row.status as string) ?? null,
    meetingUrl: (row.meeting_url as string) ?? null,
  };
}

export async function getMyLessons(): Promise<StudentLessonListItem[]> {
  const token = await getToken();
  // /scheduled-lessons (без /my) не фильтрует по студенту — отдаёт уроки всех.
  const res = await apiGet<Record<string, unknown>[]>("/scheduled-lessons/my", token);
  if (res.error || !res.data) return [];
  return res.data.map(mapLessonRow).sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));
}

export async function getMyLessonsSplit(): Promise<{ upcoming: StudentLessonListItem[]; past: StudentLessonListItem[] }> {
  const lessons = await getMyLessons();
  const now = Date.now();
  const upcoming = lessons.filter((l) => new Date(l.scheduledAt).getTime() >= now).reverse();
  const past = lessons.filter((l) => new Date(l.scheduledAt).getTime() < now);
  return { upcoming, past };
}

export interface StudentLessonDetail extends StudentLessonListItem {
  description: string | null;
  materials: { name: string; url: string }[];
  homeworkTaskIds: string[];
}

export async function getMyLessonById(lessonId: string): Promise<StudentLessonDetail | null> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>(`/scheduled-lessons/${lessonId}`, token);
  if (res.error || !res.data) return null;

  const row = res.data;
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
    materials,
    homeworkTaskIds: (row.homework_task_ids as string[]) || [],
  };
}

export interface StudentAssignmentListItem {
  id: string;
  taskTitle: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
  reviewScore: number | null;
}

function mapAssignmentRow(row: Record<string, unknown>): StudentAssignmentListItem {
  return {
    id: row.id as string,
    taskTitle: (row.title as string) || "Задание",
    status: (row.status as string) || "pending",
    dueDate: (row.due_date as string) ?? null,
    createdAt: (row.created_at as string) || (row.due_date as string) || "",
    reviewScore: (row.review_score as number) ?? null,
  };
}

export async function getMyAssignments(): Promise<StudentAssignmentListItem[]> {
  const token = await getToken();
  // GET /assignments (список без /my) закрыт ролями teacher/admin — студенту
  // нужен /assignments/my (сам определяет student_id по токену).
  const res = await apiGet<Record<string, unknown>[]>("/assignments/my", token);
  if (res.error || !res.data) return [];
  return res.data.map(mapAssignmentRow);
}

export interface StudentGoal {
  id: string;
  examType: string;
  currentScore: number | null;
  targetScore: number | null;
  progress: number | null;
}

// Модель цели уже используется на стороне учителя (см. getStudentById в
// teacher-data.ts: goals[] на строке студента, активная — status === "active").
// /students/me — self-service версия /students/:id для роли student.
export async function getMyGoal(): Promise<StudentGoal | null> {
  const user = await getSessionUser();
  if (!user || user.profile.role !== "student") return null;

  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>("/students/me", token);
  if (res.error || !res.data) return null;

  const row = res.data;
  const goalsList = (Array.isArray(row.goals) ? row.goals : row.goals ? [row.goals] : []) as Record<string, unknown>[];
  const goal = goalsList.find((g) => g.status === "active") ?? goalsList[0];
  if (!goal?.exam_type) return null;

  return {
    id: goal.id as string,
    examType: goal.exam_type as string,
    currentScore: (goal.current_score as number) ?? null,
    targetScore: (goal.target_score as number) ?? null,
    progress: (goal.progress as number) ?? null,
  };
}

export interface StudentAssignmentDetail extends StudentAssignmentListItem {
  taskId: string | null;
  taskQuestion: string | null;
  taskType: string | null;
  answerText: string | null;
  reviewComment: string | null;
  reviewErrors: string | null;
}

export async function getMyAssignmentById(assignmentId: string): Promise<StudentAssignmentDetail | null> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>(`/assignments/${assignmentId}`, token);
  if (res.error || !res.data) return null;

  const row = res.data;
  const tasks = (row.tasks as Record<string, unknown>[]) || [];
  const task = tasks[0];

  return {
    ...mapAssignmentRow(row),
    taskId: (task?.id as string) ?? null,
    taskQuestion: (pickFirst(task || {}, ["question", "prompt", "description", "title"]) as string) ?? null,
    taskType: (pickFirst(task || {}, ["type", "task_type"]) as string) ?? null,
    answerText: (row.answer_text as string) ?? null,
    reviewComment: (row.review_comment as string) ?? null,
    reviewErrors: (row.review_errors as string) ?? null,
  };
}
