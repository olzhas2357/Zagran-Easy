import { apiGet } from "./api";
import { getToken } from "./session-data";

export interface ManagedMockTest {
  id: string;
  examType: "ielts" | "hsk";
  title: string;
  level: string;
  timeLimitMinutes: number | null;
  taskIds: string[];
  isActive: boolean;
}

function mapManaged(row: Record<string, unknown>): ManagedMockTest {
  return {
    id: String(row.id),
    examType: row.exam_type === "hsk" ? "hsk" : "ielts",
    title: String(row.title ?? ""),
    level: typeof row.level === "string" ? row.level : "",
    timeLimitMinutes: typeof row.time_limit_minutes === "number" ? row.time_limit_minutes : null,
    taskIds: Array.isArray(row.task_ids) ? (row.task_ids as string[]) : [],
    isActive: row.is_active !== false,
  };
}

export async function getManagedMockTests(): Promise<ManagedMockTest[]> {
  const res = await apiGet<Record<string, unknown>[]>("/mock-tests/manage/list", await getToken());
  if (res.error) throw new Error(res.error);
  return (res.data ?? []).map(mapManaged);
}

export async function getManagedMockTest(id: string): Promise<ManagedMockTest | null> {
  const tests = await getManagedMockTests();
  return tests.find((test) => test.id === id) ?? null;
}
