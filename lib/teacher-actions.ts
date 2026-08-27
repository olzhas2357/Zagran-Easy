"use server";

// ============================================================
// ZagranEasy — Кабинет преподавателя: серверные экшены (мутации)
// Проверки прав идут через RLS (is_teacher()/teacher_id = auth.uid()/
// is_my_student()) — экшены сами по себе ничего не проверяют.
// ============================================================

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "./supabase/server";

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

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Не авторизован" };

  const { data, error } = await supabase
    .from("scheduled_lessons")
    .insert({
      teacher_id: user.id,
      student_ids: input.studentIds,
      title: input.title.trim(),
      description: input.description.trim() || null,
      scheduled_at: input.scheduledAt,
      duration_minutes: input.durationMinutes,
      meeting_url: input.meetingUrl.trim() || null,
      materials: input.materials,
      homework_task_ids: input.homeworkTaskIds,
      status: "scheduled",
    })
    .select("id")
    .single();

  if (error || !data) return { success: false, error: error?.message || "Не удалось создать урок" };

  // Уведомления ученикам — best effort: точная схема notifications не
  // подтверждена, поэтому ошибка вставки не должна ломать создание урока.
  if (input.studentIds.length > 0) {
    await supabase.from("notifications").insert(
      input.studentIds.map((studentId) => ({
        user_id: studentId,
        title: "Новый урок",
        message: `Урок "${input.title.trim()}" назначен на ${new Date(input.scheduledAt).toLocaleString("ru-RU")}`,
        type: "lesson",
      }))
    );
  }

  revalidatePath("/teacher/lessons");
  revalidatePath("/teacher");
  return { success: true, id: data.id as string };
}

export async function uploadLessonMaterial(
  formData: FormData
): Promise<{ success: boolean; url?: string; name?: string; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { success: false, error: "Файл не выбран" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Не авторизован" };

  const ext = file.name.split(".").pop() || "bin";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("lesson-materials").upload(path, file, { contentType: file.type });
  if (error) return { success: false, error: error.message };

  const { data } = supabase.storage.from("lesson-materials").getPublicUrl(path);
  return { success: true, url: data.publicUrl, name: file.name };
}

export interface ReviewInput {
  attemptId: string;
  score: number;
  comment: string;
  errors: string;
}

export async function reviewAssignment(input: ReviewInput): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Не авторизован" };

  const { data: attempt, error: fetchError } = await supabase
    .from("task_attempts")
    .select("id, student_id")
    .eq("id", input.attemptId)
    .maybeSingle();
  if (fetchError || !attempt) return { success: false, error: "Задание не найдено" };

  const { error } = await supabase
    .from("task_attempts")
    .update({
      reviewed_by: user.id,
      review_score: input.score,
      review_comment: input.comment.trim() || null,
      review_errors: input.errors.trim() || null,
      reviewed_at: new Date().toISOString(),
      status: "reviewed",
    })
    .eq("id", input.attemptId);
  if (error) return { success: false, error: error.message };

  const studentId = attempt.student_id as string;

  // Побочные эффекты — best effort, не должны откатывать сохранённую оценку.
  await supabase.from("notifications").insert({
    user_id: studentId,
    title: "Задание проверено",
    message: `Ваша работа проверена. Оценка: ${input.score}`,
    type: "review",
  });

  await supabase.from("xp_log").insert({
    student_id: studentId,
    amount: 30,
    source: "task",
  });

  const { data: studentRow } = await supabase
    .from("students")
    .select("total_tasks_completed")
    .eq("id", studentId)
    .maybeSingle();
  if (studentRow && typeof studentRow.total_tasks_completed === "number") {
    await supabase
      .from("students")
      .update({ total_tasks_completed: studentRow.total_tasks_completed + 1 })
      .eq("id", studentId);
  }

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
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Не авторизован" };

  const { error } = await supabase
    .from("teachers")
    .update({ bio: input.bio.trim() || null, specializations: input.specializations })
    .eq("id", user.id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/teacher/profile");
  return { success: true };
}
