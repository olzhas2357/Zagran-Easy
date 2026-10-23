// ============================================================
// ZagranEasy — Mock tests (IELTS / HSK): чтение через NestJS API.
// Список и тест публичные; правильные ответы бэкенд не отдаёт.
// ============================================================

import { apiGet } from "./api";

export interface MockTestListItem {
  id: string;
  title: string;
  examType: string;
  description: string | null;
  durationMinutes: number | null;
}

export interface MockTestTask {
  id: string;
  title: string;
  question: string | null;
  type: string | null;
  options: Record<string, unknown> | null;
  audioUrl: string | null;
}

export interface MockTestDetail extends MockTestListItem {
  tasks: MockTestTask[];
}

function mapListItem(row: Record<string, unknown>): MockTestListItem {
  const duration = Number(row.time_limit_minutes ?? 0);
  return {
    id: String(row.id),
    title: String(row.title ?? "Mock test"),
    examType: String(row.exam_type ?? ""),
    description: typeof row.level === "string" && row.level ? `Уровень: ${row.level}` : null,
    durationMinutes: duration > 0 ? duration : null,
  };
}

export async function getMockTests(examType?: string): Promise<MockTestListItem[]> {
  const query = examType ? `?exam_type=${encodeURIComponent(examType)}` : "";
  const res = await apiGet<Record<string, unknown>[]>(`/mock-tests${query}`);
  if (res.error || !Array.isArray(res.data)) return [];
  return res.data.map(mapListItem);
}

export async function getMockTest(id: string): Promise<MockTestDetail | null> {
  const res = await apiGet<Record<string, unknown>>(`/mock-tests/${encodeURIComponent(id)}`);
  if (res.error || !res.data) return null;

  const row = res.data;
  const tasks = Array.isArray(row.tasks) ? (row.tasks as Record<string, unknown>[]) : [];
  return {
    ...mapListItem(row),
    tasks: tasks.map((task) => ({
      id: String(task.id),
      title: String(task.title ?? "Задание"),
      question: typeof task.question === "string" ? task.question : null,
      type: typeof task.type === "string" ? task.type : null,
      options: task.options && typeof task.options === "object" ? (task.options as Record<string, unknown>) : null,
      audioUrl:
        typeof task.question_audio_url === "string" && task.question_audio_url
          ? task.question_audio_url
          : typeof task.audio_url === "string"
            ? task.audio_url
            : null,
    })),
  };
}
