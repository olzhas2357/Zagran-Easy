import { apiGet } from "./api";
import { getToken } from "./session-data";

export interface LessonBoardSnapshot {
  id: string;
  lessonId: string;
  boardData: Record<string, unknown>;
  version: number;
  updatedAt: string | null;
}

export async function getLessonBoard(lessonId: string): Promise<LessonBoardSnapshot | null> {
  const token = await getToken();
  const res = await apiGet<Record<string, unknown>>(`/scheduled-lessons/${lessonId}/board`, token);
  if (res.error || !res.data) return null;
  return {
    id: res.data.id as string,
    lessonId: res.data.lesson_id as string,
    boardData: (res.data.board_data as Record<string, unknown>) || { elements: [], appState: {}, files: {} },
    version: (res.data.version as number) || 0,
    updatedAt: (res.data.updated_at as string) ?? null,
  };
}
