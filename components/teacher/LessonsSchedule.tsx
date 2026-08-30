"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock, Users, CalendarClock, History } from "lucide-react";
import type { LessonListItem } from "@/lib/teacher-data";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function dayLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Сегодня";
  if (date.toDateString() === tomorrow.toDateString()) return "Завтра";
  return date.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });
}

function groupByDay(lessons: LessonListItem[]) {
  const groups = new Map<string, LessonListItem[]>();
  for (const lesson of lessons) {
    const key = dayLabel(lesson.scheduledAt);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(lesson);
  }
  return Array.from(groups.entries());
}

function LessonRow({ lesson }: { lesson: LessonListItem }) {
  return (
    <Link
      href={`/teacher/lessons/${lesson.id}`}
      className="flex items-center gap-4 px-4.5 py-3.5 transition-colors hover:bg-ze-surface sm:px-5"
    >
      <div className="flex w-14 flex-none flex-col items-center rounded-xl bg-ze-surface py-2 text-[12.5px] font-bold text-ze-ink">
        {formatTime(lesson.scheduledAt)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14.5px] font-semibold text-ze-ink">{lesson.title}</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-ze-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
            {lesson.durationMinutes} мин
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
            {lesson.studentCount} учеников
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ icon: Icon, text }: { icon: typeof CalendarClock; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-ze-border bg-white px-5 py-9 text-center">
      <Icon className="h-6 w-6 text-ze-muted" strokeWidth={1.5} />
      <div className="text-[13.5px] text-ze-muted">{text}</div>
    </div>
  );
}

export function LessonsSchedule({ upcoming, past }: { upcoming: LessonListItem[]; past: LessonListItem[] }) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const grouped = useMemo(() => groupByDay(tab === "upcoming" ? upcoming : [...past].reverse()), [tab, upcoming, past]);

  return (
    <div>
      <div className="flex gap-1.5 rounded-[11px] border border-ze-border bg-[#F4F6FA] p-0.5 sm:w-fit">
        <button
          onClick={() => setTab("upcoming")}
          className={`flex-1 rounded-[9px] px-4 py-2 text-[13.5px] font-semibold transition-colors sm:flex-none ${
            tab === "upcoming" ? "bg-white text-ze-ink shadow-[0_1px_2px_rgba(15,23,42,0.12)]" : "text-ze-muted"
          }`}
        >
          Предстоящие ({upcoming.length})
        </button>
        <button
          onClick={() => setTab("past")}
          className={`flex-1 rounded-[9px] px-4 py-2 text-[13.5px] font-semibold transition-colors sm:flex-none ${
            tab === "past" ? "bg-white text-ze-ink shadow-[0_1px_2px_rgba(15,23,42,0.12)]" : "text-ze-muted"
          }`}
        >
          Прошедшие ({past.length})
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {grouped.length > 0 ? (
          grouped.map(([label, lessons]) => (
            <div key={label}>
              <div className="mb-2 px-1 text-[13px] font-bold capitalize text-ze-muted">{label}</div>
              <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                {lessons.map((lesson) => (
                  <LessonRow key={lesson.id} lesson={lesson} />
                ))}
              </div>
            </div>
          ))
        ) : tab === "upcoming" ? (
          <EmptyState icon={CalendarClock} text="Нет предстоящих уроков." />
        ) : (
          <EmptyState icon={History} text="Прошедших уроков пока нет." />
        )}
      </div>
    </div>
  );
}
