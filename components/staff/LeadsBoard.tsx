"use client";

import { useMemo, useState } from "react";
import { Search, Inbox } from "lucide-react";
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
        <div className="relative min-w-0 sm:w-[280px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по имени, телефону, услуге…"
            className="w-full rounded-xl border border-ze-border bg-white py-3 pl-9.5 pr-4 text-[14px] outline-none transition-colors focus:border-ze-primary"
          />
        </div>
      </div>

      <div className="mt-3.5 flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-[#D6DEEA] bg-white px-6 py-14 text-center">
            <Inbox className="h-7 w-7 text-ze-muted" strokeWidth={1.5} />
            <div className="text-[14.5px] text-ze-muted">
              {leads.length === 0 ? "Пока нет заявок." : "Под эти условия ничего не найдено."}
            </div>
          </div>
        )}
        {filtered.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
