import Link from "next/link";
import { Plus, ClipboardList, Sparkles } from "lucide-react";
import { getTasks } from "@/lib/teacher-data";

const TYPE_LABEL: Record<string, string> = {
  single_choice: "Один вариант",
  multiple_choice: "Несколько вариантов",
  text: "Текстовый ответ",
  essay: "Эссе",
  listening: "Аудирование",
  speaking: "Говорение",
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Лёгкая",
  medium: "Средняя",
  hard: "Сложная",
};

export default async function TeacherTasksPage() {
  const tasks = await getTasks();

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[28px]">Банк заданий</h1>
          <p className="mt-1.5 text-[14.5px] text-ze-muted">Задания для уроков и домашних работ учеников.</p>
        </div>
        <Link
          href="/teacher/tasks/new"
          className="flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={2} />
          Создать задание
        </Link>
      </div>

      {tasks.length > 0 ? (
        <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {tasks.map((t) => (
            <div key={t.id} className="flex items-start gap-3 px-5 py-4 text-[14px]">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-blue-50">
                <ClipboardList className="h-4.5 w-4.5 text-blue-700" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ze-ink">{t.title}</span>
                  {t.examType && (
                    <span className="rounded-full bg-ze-surface px-2.5 py-0.5 text-[11.5px] font-bold uppercase text-ze-muted">
                      {t.examType}
                    </span>
                  )}
                  {t.difficulty && (
                    <span className="rounded-full bg-ze-surface px-2.5 py-0.5 text-[11.5px] font-semibold text-ze-muted">
                      {DIFFICULTY_LABEL[t.difficulty] || t.difficulty}
                    </span>
                  )}
                </div>
                <div className="mt-1 truncate text-[13px] text-ze-muted">
                  {(t.type && TYPE_LABEL[t.type]) || t.type} {t.section && `· ${t.section}`}
                </div>
                {t.question && <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-ze-ink">{t.question}</p>}
              </div>
              {t.xpReward !== null && (
                <span className="flex flex-none items-center gap-1 text-[12.5px] font-semibold text-amber-600">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                  {t.xpReward} XP
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-ze-border bg-white px-5 py-9 text-center">
          <ClipboardList className="h-7 w-7 text-ze-muted" strokeWidth={1.5} />
          <div className="text-[14.5px] font-semibold text-ze-ink">Заданий пока нет</div>
          <div className="text-[13px] text-ze-muted">Создайте первое задание для урока или домашней работы.</div>
        </div>
      )}
    </div>
  );
}
