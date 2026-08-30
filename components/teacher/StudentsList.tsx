"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, User, Flame, ChevronRight, Users } from "lucide-react";
import type { StudentListItem } from "@/lib/teacher-data";

function initials(name: string | null) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

export function StudentsList({ students }: { students: StudentListItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => (s.fullName || "").toLowerCase().includes(q) || (s.examType || "").toLowerCase().includes(q));
  }, [students, query]);

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-ze-border bg-white px-5 py-9 text-center">
        <Users className="h-7 w-7 text-ze-muted" strokeWidth={1.5} />
        <div className="text-[14.5px] font-semibold text-ze-ink">У вас пока нет учеников</div>
      </div>
    );
  }

  return (
    <div>
      {students.length > 4 && (
        <div className="relative mb-4 max-w-[320px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по имени или цели…"
            className="w-full rounded-xl border border-ze-border bg-white py-2.5 pl-9.5 pr-4 text-[14px] outline-none transition-colors focus:border-ze-primary"
          />
        </div>
      )}

      <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        {filtered.map((student) => {
          const progress = Math.min(100, Math.max(0, student.progress ?? 0));
          return (
            <Link
              key={student.id}
              href={`/teacher/students/${student.id}`}
              className="flex items-center gap-3.5 px-4.5 py-3.5 transition-colors hover:bg-ze-surface sm:px-5 sm:py-4"
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-ze-surface text-[13px] font-bold text-ze-ink">
                {student.fullName ? initials(student.fullName) : <User className="h-4.5 w-4.5 text-ze-muted" strokeWidth={1.75} />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[14.5px] font-bold text-ze-ink">{student.fullName || "Без имени"}</span>
                  {student.examType && (
                    <span className="flex-none rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                      {student.examType.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-ze-surface">
                  <div className="h-full rounded-full bg-ze-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="hidden flex-none items-center gap-4 text-[13px] text-ze-muted sm:flex">
                {student.streak !== null && (
                  <span className="flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} fill="currentColor" />
                    {student.streak}
                  </span>
                )}
                <span className="w-9 text-right font-semibold text-ze-ink">{progress}%</span>
              </div>

              <ChevronRight className="h-4.5 w-4.5 flex-none text-ze-muted" strokeWidth={2} />
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-5 py-9 text-center text-[13.5px] text-ze-muted">Ничего не найдено.</div>
        )}
      </div>
    </div>
  );
}
