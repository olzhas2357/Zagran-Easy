"use client";

import { useMemo, useState } from "react";
import { Search, Inbox } from "lucide-react";
import type { Lead } from "@/lib/types";
import { LeadCard } from "@/components/staff/LeadCard";

const COLUMNS: { key: Lead["status"]; label: string; dot: string }[] = [
  { key: "new", label: "Новые", dot: "bg-blue-500" },
  { key: "in_progress", label: "В работе", dot: "bg-amber-500" },
  { key: "done", label: "Завершённые", dot: "bg-emerald-500" },
];

export function LeadsBoard({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) => {
      const haystack = [l.name, l.phone, l.message, l.service].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [leads, query]);

  const byColumn = useMemo(() => {
    const m: Record<string, Lead[]> = { new: [], in_progress: [], done: [] };
    for (const l of filtered) m[l.status]?.push(l);
    return m;
  }, [filtered]);

  return (
    <div>
      <div className="mt-5 relative w-full sm:max-w-[340px]">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по имени, телефону, услуге…"
          className="w-full rounded-xl border border-ze-border bg-white py-3 pl-9.5 pr-4 text-[14px] outline-none transition-colors focus:border-ze-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-[#D6DEEA] bg-white px-6 py-14 text-center">
          <Inbox className="h-7 w-7 text-ze-muted" strokeWidth={1.5} />
          <div className="text-[14.5px] text-ze-muted">
            {leads.length === 0 ? "Пока нет заявок." : "Под эти условия ничего не найдено."}
          </div>
        </div>
      ) : (
        <div className="mt-4 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {COLUMNS.map((col) => {
            const items = byColumn[col.key] || [];
            return (
              <div key={col.key} className="w-[85vw] flex-none snap-start sm:w-auto">
                <div className="flex items-center gap-2 px-1 pb-3">
                  <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                  <span className="text-[13.5px] font-bold text-ze-ink">{col.label}</span>
                  <span className="rounded-full bg-[#F1F4FC] px-2 py-0.5 text-[12px] font-semibold text-ze-muted">{items.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {items.length === 0 ? (
                    <div className="rounded-[16px] border border-dashed border-[#E3E8F2] bg-white/60 px-4 py-8 text-center text-[13px] text-ze-muted">
                      Пусто
                    </div>
                  ) : (
                    items.map((lead) => <LeadCard key={lead.id} lead={lead} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
