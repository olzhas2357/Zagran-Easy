"use server";

// ============================================================
// ZagranEasy — Кабинет преподавателя: серверные экшены (мутации)
// через NestJS API (роль teacher проверяется на бэкенде).
// ============================================================

import { revalidatePath } from "next/cache";
import { apiDelete, apiPatch, apiPost } from "./api";
import { getSessionUser, getToken } from "./session-data";

export interface UpdateLessonInput {
  title: string;
  description: string;
  scheduledAt: string; // ISO
  durationMinutes: number;
  meetingUrl: string;
  meetingProvider: "zoom" | "meet";
  materials: { name: string; url: string }[];
  homeworkTaskIds: string[];
}

export interface NewLessonInput {
  title: string;
  description: string;
  scheduledAt: string; // ISO
  durationMinutes: number;
  studentIds: string[];
  meetingUrl: string;
  meetingProvider: "zoom" | "meet";
  materials: { name: string; url: string }[];
  homeworkTaskIds: string[];
}

export async function createLesson(input: NewLessonInput): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!input.title.trim()) return { success: false, error: "Укажите название урока" };
  if (!input.scheduledAt) return { success: false, error: "Укажите дату и время урока" };

  const token = await getToken();
  const res = await apiPost<{ id: string }>(
    "/scheduled-lessons",
    {
      student_ids: input.studentIds,
      title: input.title.trim(),
      description: input.description.trim() || undefined,
      scheduled_at: input.scheduledAt,
      duration_minutes: input.durationMinutes,
      meeting_url: input.meetingUrl.trim() || undefined,
      meeting_provider: input.meetingProvider,
      materials: input.materials,
      homework_task_ids: input.homeworkTaskIds,
    },
    token
  );

  if (res.error || !res.data) return { success: false, error: res.error || "Не удалось создать урок" };

  revalidatePath("/teacher/lessons");
  revalidatePath("/teacher");
  return { success: true, id: res.data.id };
}

export async function uploadLessonMaterial(
  formData: FormData
): Promise<{ success: boolean; url?: string; name?: string; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Файл не выбран" };

  const token = await getToken();
  if (!token) return { success: false, error: "Не авторизован" };

  const upload = new FormData();
  upload.set("file", file);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
  try {
    const res = await fetch(`${API_URL}/uploads?bucket=lesson-materials`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: upload,
    });
    const json = await res.json();
    if (!res.ok || json.success === false) {
      return { success: false, error: json.message || "Ошибка загрузки файла" };
    }
    return { success: true, url: json.data.url, name: json.data.name };
  } catch {
    return { success: false, error: "Нет подключения к серверу" };
  }
}

export async function uploadListeningAudio(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Файл не выбран" };
  if (!file.type.startsWith("audio/") && file.type !== "video/mp4") return { success: false, error: "Выберите аудио или MP4-файл" };
  const token = await getToken();
  if (!token) return { success: false, error: "Не авторизован" };
  const upload = new FormData();
  upload.set("file", file);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
  try {
    const response = await fetch(`${API_URL}/uploads?bucket=listening-audio`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: upload });
    const json = await response.json();
    if (!response.ok || json.success === false) return { success: false, error: json.message || "Не удалось загрузить аудио" };
    return { success: true, url: json.data?.url || json.url };
  } catch {
    return { success: false, error: "Нет подключения к серверу" };
  }
}

export async function updateLesson(
  lessonId: string,
  input: UpdateLessonInput
): Promise<{ success: boolean; error?: string }> {
  if (!input.title.trim()) return { success: false, error: "Укажите название урока" };
  if (!input.scheduledAt) return { success: false, error: "Укажите дату и время урока" };

  const token = await getToken();
  const res = await apiPatch(
    `/scheduled-lessons/${lessonId}`,
    {
      title: input.title.trim(),
      description: input.description.trim() || undefined,
      scheduled_at: input.scheduledAt,
      duration_minutes: input.durationMinutes,
      meeting_url: input.meetingUrl.trim() || undefined,
      meeting_provider: input.meetingProvider,
      materials: input.materials,
      homework_task_ids: input.homeworkTaskIds,
    },
    token
  );

  if (res.error) return { success: false, error: res.error };

  revalidatePath("/teacher/lessons");
  revalidatePath(`/teacher/lessons/${lessonId}`);
  revalidatePath("/teacher");
  return { success: true };
}

export async function cancelLesson(lessonId: string): Promise<{ success: boolean; error?: string }> {
  const token = await getToken();
  const res = await apiPatch(`/scheduled-lessons/${lessonId}`, { status: "cancelled" }, token);
  if (res.error) return { success: false, error: res.error };

  revalidatePath("/teacher/lessons");
  revalidatePath(`/teacher/lessons/${lessonId}`);
  return { success: true };
}

export interface NewCourseInput {
  slug: string;
  title: string;
  examType: string;
  description: string;
  levelFrom: string;
  levelTo: string;
  totalLessons: number;
  totalTasks: number;
  estimatedHours: number;
  isActive: boolean;
  imageUrl: string;
}

export async function createCourse(input: NewCourseInput): Promise<{ success: boolean; id?: string; slug?: string; error?: string }> {
  if (!input.title.trim()) return { success: false, error: "Укажите название курса" };
  if (!input.slug.trim()) return { success: false, error: "Укажите slug курса" };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug.trim())) {
    return { success: false, error: "Slug может содержать только латинские буквы, цифры и дефисы" };
  }
  if (!input.examType.trim()) return { success: false, error: "Укажите экзамен или направление" };

  const token = await getToken();
  const res = await apiPost<{ id: string }>(
    "/courses",
    {
      slug: input.slug.trim().toLowerCase(),
      title: input.title.trim(),
      exam_type: input.examType.trim(),
      description: input.description.trim() || undefined,
      level_from: input.levelFrom.trim() || undefined,
      level_to: input.levelTo.trim() || undefined,
      total_lessons: input.totalLessons,
      total_tasks: input.totalTasks,
      estimated_hours: input.estimatedHours,
      is_active: input.isActive,
      image_url: input.imageUrl.trim() || undefined,
    },
    token,
  );

  if (res.error || !res.data) return { success: false, error: res.error || "Не удалось создать курс" };

  revalidatePath("/teacher/courses");
  revalidatePath("/courses/[slug]", "page");
  return { success: true, id: res.data.id, slug: input.slug.trim().toLowerCase() };
}

export async function updateCourse(courseId: string, input: NewCourseInput): Promise<{ success: boolean; slug?: string; error?: string }> {
  const token = await getToken();
  const res = await apiPatch(
    `/courses/${courseId}`,
    {
      slug: input.slug.trim().toLowerCase(),
      title: input.title.trim(),
      exam_type: input.examType.trim(),
      description: input.description.trim() || undefined,
      level_from: input.levelFrom.trim() || undefined,
      level_to: input.levelTo.trim() || undefined,
      total_lessons: input.totalLessons,
      total_tasks: input.totalTasks,
      estimated_hours: input.estimatedHours,
      is_active: input.isActive,
      image_url: input.imageUrl.trim() || undefined,
    },
    token,
  );
  if (res.error) return { success: false, error: res.error };
  revalidatePath("/teacher/courses");
  revalidatePath(`/teacher/courses/${courseId}/edit`);
  revalidatePath(`/courses/${input.slug.trim().toLowerCase()}`);
  return { success: true, slug: input.slug.trim().toLowerCase() };
}

export interface CourseSectionInput {
  slug: string;
  title: string;
  icon: string;
  sortOrder: number;
}

export async function createCourseSection(courseId: string, input: CourseSectionInput) {
  const token = await getToken();
  const res = await apiPost(`/courses/${courseId}/sections`, {
    slug: input.slug,
    title: input.title,
    icon: input.icon || undefined,
    sort_order: input.sortOrder,
  }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath(`/teacher/courses/${courseId}/edit`);
  revalidatePath(`/courses/${input.slug}`);
  return { success: true };
}

export async function updateCourseSection(courseId: string, sectionId: string, input: CourseSectionInput) {
  const token = await getToken();
  const res = await apiPatch(`/courses/${courseId}/sections/${sectionId}`, {
    slug: input.slug,
    title: input.title,
    icon: input.icon || undefined,
    sort_order: input.sortOrder,
  }, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath(`/teacher/courses/${courseId}/edit`);
  return { success: true };
}

export async function deleteCourseSection(courseId: string, sectionId: string) {
  const token = await getToken();
  const res = await apiDelete(`/courses/${courseId}/sections/${sectionId}`, token);
  if (res.error) return { success: false, error: res.error };
  revalidatePath(`/teacher/courses/${courseId}/edit`);
  return { success: true };
}

export async function saveLessonBoard(
  lessonId: string,
  boardData: Record<string, unknown>,
  version: number,
): Promise<{ success: boolean; version?: number; error?: string }> {
  const token = await getToken();
  const res = await apiPatch<{ version: number }>(
    `/scheduled-lessons/${lessonId}/board`,
    { board_data: boardData, version },
    token,
  );
  if (res.error || !res.data) return { success: false, error: res.error || "Не удалось сохранить доску" };
  revalidatePath(`/teacher/lessons/${lessonId}/board`);
  revalidatePath(`/account/lessons/${lessonId}/board`);
  return { success: true, version: res.data.version };
}

export interface NewTaskInput {
  title: string;
  type: string;
  examType: string;
  question: string;
  section: string;
  difficulty: string;
  correctAnswer: string;
  explanation: string;
  xpReward: number | null;
  autoCheck: boolean;
  // Структурированные данные для multiple_choice/multiple_select/matching/fill_blanks —
  // см. lib/task-types.ts. Для остальных типов не заполняется.
  options?: Record<string, unknown>;
  audioUrl?: string;
}

export async function createTask(input: NewTaskInput): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!input.title.trim()) return { success: false, error: "Укажите название задания" };
  if (!input.question.trim()) return { success: false, error: "Укажите текст задания" };
  if (!input.examType.trim()) return { success: false, error: "Укажите экзамен" };

  const token = await getToken();
  const res = await apiPost<{ id: string }>(
    "/tasks",
    {
      title: input.title.trim(),
      type: input.type,
      exam_type: input.examType.trim(),
      question: input.question.trim(),
      section: input.section.trim() || undefined,
      difficulty: input.difficulty.trim() || undefined,
      options: input.options ?? undefined,
      correct_answer: input.correctAnswer.trim() || undefined,
      explanation: input.explanation.trim() || undefined,
      xp_reward: input.xpReward ?? undefined,
      auto_check: input.autoCheck,
      audio_url: input.audioUrl?.trim() || undefined,
    },
    token
  );

  if (res.error || !res.data) return { success: false, error: res.error || "Не удалось создать задание" };

  revalidatePath("/teacher/tasks");
  return { success: true, id: res.data.id };
}

export interface NewAssignmentInput {
  studentId: string;
  taskIds: string[];
  title: string;
  dueDate: string; // ISO
}

export async function createAssignment(
  input: NewAssignmentInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!input.studentId) return { success: false, error: "Выберите ученика" };
  if (input.taskIds.length === 0) return { success: false, error: "Выберите хотя бы одно задание" };
  if (!input.title.trim()) return { success: false, error: "Укажите название задания" };
  if (!input.dueDate) return { success: false, error: "Укажите дедлайн" };

  const token = await getToken();
  const res = await apiPost<{ id: string }>(
    "/assignments",
    {
      student_id: input.studentId,
      task_ids: input.taskIds,
      title: input.title.trim(),
      due_date: input.dueDate,
    },
    token
  );

  if (res.error || !res.data) return { success: false, error: res.error || "Не удалось назначить задание" };

  revalidatePath("/teacher/assignments");
  revalidatePath("/teacher");
  return { success: true, id: res.data.id };
}

export interface ReviewInput {
  assignmentId: string;
  taskId: string;
  score: number;
  comment: string;
  errors: string;
}

export async function reviewAssignment(input: ReviewInput): Promise<{ success: boolean; error?: string }> {
  const token = await getToken();
  const res = await apiPatch(
    `/assignments/${input.assignmentId}/review`,
    {
      task_id: input.taskId,
      score: input.score,
      comment: input.comment.trim() || undefined,
      errors: input.errors.trim() || undefined,
    },
    token
  );
  if (res.error) return { success: false, error: res.error };

  revalidatePath("/teacher/assignments");
  revalidatePath(`/teacher/assignments/${input.assignmentId}`);
  revalidatePath("/teacher");
  return { success: true };
}

export interface TeacherProfileInput {
  bio: string;
  specializations: string[];
  imageUrl?: string;
}

export async function updateTeacherProfile(input: TeacherProfileInput): Promise<{ success: boolean; error?: string }> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Не авторизован" };

  const token = await getToken();
  const res = await apiPatch(
    `/teachers/${user.profile.id}`,
    {
      bio: input.bio.trim() || undefined,
      specializations: input.specializations,
      image_url: input.imageUrl?.trim() || undefined,
    },
    token
  );
  if (res.error) return { success: false, error: res.error };

  revalidatePath("/teacher/profile");
  return { success: true };
}

export async function uploadTeacherAvatar(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Файл не выбран" };

  const token = await getToken();
  if (!token) return { success: false, error: "Не авторизован" };

  const upload = new FormData();
  upload.set("file", file);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
  try {
    const res = await fetch(`${API_URL}/uploads?bucket=teacher-avatars`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: upload,
    });
    const json = await res.json();
    if (!res.ok || json.success === false) {
      return { success: false, error: json.message || "Ошибка загрузки файла" };
    }
    return { success: true, url: json.data.url };
  } catch {
    return { success: false, error: "Нет подключения к серверу" };
  }
}
