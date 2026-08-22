"use client";

import Link from "next/link";
import type { CatalogUniversity } from "@/lib/education-catalog";
import { formatTuition, formatMonthlyInstallment } from "@/lib/education-catalog";
import { useCompareList } from "@/lib/hooks/useCompareList";

const ROW_LABELS = ["Цена за год", "Рассрочка", "Дедлайн", "Шанс", "IELTS", "Грант", "Общежитие", "Язык"];

export function Compare({ universities }: { universities: CatalogUniversity[] }) {
  const { ids, remove } = useCompareList();
  const items = ids.map((id) => universities.find((u) => u.id === id)).filter((u): u is CatalogUniversity => Boolean(u));

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D6DEEA] px-5 py-13 text-center">
        <div className="text-[17px] font-bold">Пока пусто</div>
        <div className="mt-2 text-[14px] text-ze-muted">Отметьте вузы кнопкой «Сравнить» в каталоге.</div>
        <Link href="/education" className="mt-4 inline-block rounded-xl bg-ze-primary px-5 py-3 text-[14px] font-semibold text-white">
          Открыть каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid gap-3" style={{ gridTemplateColumns: `150px repeat(${items.length}, minmax(200px, 1fr))`, minWidth: items.length > 2 ? "820px" : "auto" }}>
        <div className="flex flex-col">
          <div className="h-[104px]" />
          {ROW_LABELS.map((r) => (
            <div key={r} className="border-t border-ze-border py-3.5 pr-1 text-[13px] font-semibold text-ze-muted">
              {r}
            </div>
          ))}
        </div>
        {items.map((u) => (
          <div key={u.id} className="flex flex-col overflow-hidden rounded-2xl border border-ze-border bg-white">
            <div className="flex h-[104px] flex-col gap-1.5 border-b border-[#F1F4F9] p-3.5">
              <div className="text-[15px] font-bold leading-tight">{u.name}</div>
              <div className="text-[12.5px] text-ze-muted">
                {u.flag} {u.city} {u.rankingNational ? `· #${u.rankingNational}` : ""}
              </div>
              <button onClick={() => remove(u.id)} className="mt-auto self-start text-[12.5px] font-semibold text-red-600">
                Убрать
              </button>
            </div>
            {[
              formatTuition(u.tuitionFrom),
              formatMonthlyInstallment(u.tuitionFrom),
              u.deadlineLabel,
              `${u.admissionChance}%`,
              u.ieltsRequired ? "Нужен 6.0" : "Не нужен",
              u.hasGrant ? "Есть" : "Нет",
              u.hasDormitory ? "Есть" : "Нет",
              u.languages.join(", "),
            ].map((v, i) => (
              <div key={i} className="border-t border-[#F1F4F9] p-3.5 text-[14px] font-semibold">
                {v}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
