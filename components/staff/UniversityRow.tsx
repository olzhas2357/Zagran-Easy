"use client";

import { useTransition } from "react";
import Link from "next/link";
import type { University } from "@/lib/types";
import { formatTuitionAmount, isVerificationStale } from "@/lib/education-catalog";
import { markUniversityVerified, toggleUniversityActive } from "@/lib/staff-actions";

function daysAgoLabel(lastVerifiedAt: string | null): string {
  if (!lastVerifiedAt) return "никогда";
  const days = Math.floor((Date.now() - new Date(lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "сегодня";
  return `${days} дн. назад`;
}

export function UniversityRow({ university }: { university: University }) {
  const [isPending, startTransition] = useTransition();
  const stale = isVerificationStale(university.lastVerifiedAt);

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_190px] items-center gap-3 border-b border-[#F4F6FA] px-4.5 py-4 text-[14px] transition-colors last:border-0 hover:bg-ze-surface/60">
      <div className="min-w-0">
        <div className={`font-semibold ${university.isActive ? "" : "text-slate-400"}`}>{university.name}</div>
        <div className="mt-0.5 text-[12.5px] text-slate-400">
          {university.city} · {university.programsCount} программ{!university.isActive && " · скрыт"}
        </div>
      </div>
      <div className="font-semibold">{formatTuitionAmount(university.tuitionFrom)}</div>
      <div>{university.deadlineLabel || "—"}</div>
      <div>
        <span
          className={`rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold ${
            university.presentationUrl ? "bg-[#EEF3FB] text-ze-primary" : "bg-red-50 text-red-600"
          }`}
        >
          {university.presentationUrl ? "PDF" : "Нет файла"}
        </span>
      </div>
      <div>
        <span className={`rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold ${stale ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
          {daysAgoLabel(university.lastVerifiedAt)}
        </span>
      </div>
      <div className="flex flex-wrap justify-end gap-1.5">
        <Link
          href={`/staff/universities/${university.id}/edit`}
          className="rounded-lg border border-ze-border bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-slate-700 transition-colors hover:border-ze-primary hover:text-ze-primary"
        >
          Редактировать
        </Link>
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              markUniversityVerified(university.id);
            })
          }
          className="rounded-lg border border-ze-border bg-[#F4F6FA] px-2.5 py-1.5 text-[12.5px] font-semibold text-slate-700 transition-colors hover:border-ze-primary hover:text-ze-primary disabled:opacity-50"
        >
          Проверено
        </button>
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              toggleUniversityActive(university.id, !university.isActive);
            })
          }
          className="rounded-lg border border-ze-border bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-slate-700 transition-colors hover:border-slate-300 disabled:opacity-50"
        >
          {university.isActive ? "Скрыть" : "Показать"}
        </button>
      </div>
    </div>
  );
}
