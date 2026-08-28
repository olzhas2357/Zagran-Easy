"use server";

// ============================================================
// ZagranEasy — Кабинет преподавателя: серверные экшены (мутации)
// через NestJS API (роль teacher проверяется на бэкенде).
// ============================================================

import { revalidatePath } from "next/cache";
import { apiPatch, apiPost } from "./api";
import { getSessionUser, getToken } from "./session";

export interface NewLessonInput {
  title: string;
  description: string;
  scheduledAt: string; // ISO
  durationMinutes: number;
  studentIds: string[];
  meetingUrl: string;
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

export interface ReviewInput {
  attemptId: string;
  score: number;
  comment: string;
  errors: string;
}

export async function reviewAssignment(input: ReviewInput): Promise<{ success: boolean; error?: string }> {
  const token = await getToken();
  const res = await apiPatch(
    `/assignments/${input.attemptId}/review`,
    { score: input.score, comment: input.comment.trim() || undefined, errors: input.errors.trim() || undefined },
    token
  );
  if (res.error) return { success: false, error: res.error };

  revalidatePath("/teacher/assignments");
  revalidatePath(`/teacher/assignments/${input.attemptId}`);
  revalidatePath("/teacher");
  return { success: true };
}

export interface TeacherProfileInput {
  bio: string;
  specializations: string[];
}

export async function updateTeacherProfile(input: TeacherProfileInput): Promise<{ success: boolean; error?: string }> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Не авторизован" };

  const token = await getToken();
  const res = await apiPatch(
    `/teachers/${user.profile.id}`,
    { bio: input.bio.trim() || undefined, specializations: input.specializations },
    token
  );
  if (res.error) return { success: false, error: res.error };

  revalidatePath("/teacher/profile");
  return { success: true };
}
