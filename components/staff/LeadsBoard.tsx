"use client";

import { useMemo, useState } from "react";
import type { Lead } from "@/lib/types";
import { LeadCard } from "@/components/staff/LeadCard";

const STATUS_TABS: { key: Lead["status"] | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "new", label: "Новые" },
  { key: "in_progress", label: "В работе" },
  { key: "done", label: "Завершённые" },
];

export function LeadsBoard({ leads }: { leads: Lead[] }) {
  const [status, setStatus] = useState<Lead["status"] | "all">("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length, new: 0, in_progress: 0, done: 0 };
    for (const l of leads) c[l.status]++;
    return c;
  }, [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      const haystack = [l.name, l.phone, l.message, l.service].filter(Boolean).join(" ").toLowerCase();
      if (q && !haystack.includes(q)) return false;
      return true;
    });
  }, [leads, status, query]);

  return (
    <div>
      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5 rounded-[11px] border border-ze-border bg-[#F4F6FA] p-0.5">
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setStatus(t.key)}
              className={`rounded-[9px] px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                status === t.key ? "bg-white text-ze-ink shadow-[0_1px_2px_rgba(15,23,42,0.12)]" : "text-ze-muted"
              }`}
            >
              {t.label} <span className="text-[11.5px] font-normal text-ze-muted">{counts[t.key]}</span>
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по имени, телефону, услуге…"
          className="min-w-0 rounded-xl border border-ze-border bg-white px-4 py-2.5 text-[13.5px] outline-none focus:border-ze-primary sm:w-[280px]"
        />
      </div>

      <div className="mt-3.5 flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#D6DEEA] bg-white px-6 py-14 text-center text-[14px] text-ze-muted">
            {leads.length === 0 ? "Пока нет заявок." : "Под эти условия ничего не найдено."}
          </div>
        )}
        {filtered.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
