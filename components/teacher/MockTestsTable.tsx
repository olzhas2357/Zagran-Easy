"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteMockTest, setMockTestActive } from "@/lib/mock-test-manage-actions";
import type { ManagedMockTest } from "@/lib/mock-test-manage-data";

export function MockTestsTable({ tests }: { tests: ManagedMockTest[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<{ success: true } | { success: false; error: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (!res.success) return setError(res.error);
      router.refresh();
    });
  }

  if (!tests.length) return <p className="text-sm text-ze-muted">Тестов пока нет. Создайте первый.</p>;

  return (
    <div className="space-y-3">
      {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
      {tests.map((test) => (
        <div key={test.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-ze-border bg-white p-4">
          <div className="min-w-0 flex-1">
            <div className="font-bold text-ze-ink">{test.title}</div>
            <div className="text-xs text-ze-muted">
              {test.examType.toUpperCase()}{test.level ? ` · ${test.level}` : ""} · {test.taskIds.length} вопросов · {test.timeLimitMinutes ?? "—"} мин ·{" "}
              <span className={test.isActive ? "text-green-600" : "text-amber-600"}>{test.isActive ? "опубликован" : "скрыт"}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {test.isActive && <Link href={`/mock-test/${test.id}`} target="_blank" className="rounded-lg border border-ze-border px-3 py-1.5 hover:bg-slate-50">Открыть</Link>}
            <Link href={`/teacher/mock-tests/${test.id}/edit`} className="rounded-lg border border-ze-border px-3 py-1.5 hover:bg-slate-50">Изменить</Link>
            <button type="button" disabled={isPending} onClick={() => run(() => setMockTestActive(test.id, !test.isActive))} className="rounded-lg border border-ze-border px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50">
              {test.isActive ? "Скрыть" : "Опубликовать"}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => { if (confirm(`Удалить тест «${test.title}»?`)) run(() => deleteMockTest(test.id)); }}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
