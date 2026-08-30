"use client";

import { useState, useTransition } from "react";
import { MessageSquare, ChevronDown, Send } from "lucide-react";
import type { Lead, LeadActivity } from "@/lib/types";
import { updateLeadStatus, addLeadActivity, getLeadActivitiesAction } from "@/lib/staff-actions";

const STATUS_LABEL: Record<Lead["status"], string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Завершена",
};

const STATUS_STYLE: Record<Lead["status"], string> = {
  new: "bg-[#EBF1FE] text-ze-primary",
  in_progress: "bg-amber-50 text-amber-700",
  done: "bg-emerald-50 text-emerald-700",
};

const SOURCE_LABEL: Record<Lead["source"], string> = {
  quiz: "Квиз",
  form: "Заявка",
  whatsapp: "WhatsApp",
  callback: "Обратный звонок",
};

export function LeadCard({ lead }: { lead: Lead }) {
  const [expanded, setExpanded] = useState(false);
  const [activities, setActivities] = useState<LeadActivity[] | null>(null);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  function changeStatus(status: Lead["status"]) {
    startTransition(() => {
      updateLeadStatus(lead.id, status);
    });
  }

  function toggleExpanded() {
    setExpanded((v) => !v);
    if (activities === null) {
      startTransition(async () => {
        setActivities(await getLeadActivitiesAction(lead.id));
      });
    }
  }

  function submitNote() {
    if (!note.trim()) return;
    const text = note.trim();
    setNote("");
    startTransition(async () => {
      await addLeadActivity(lead.id, text);
      setActivities((prev) => [
        { id: `local-${Date.now()}`, leadId: lead.id, authorId: null, note: text, createdAt: new Date().toISOString() },
        ...(prev || []),
      ]);
    });
  }

  return (
    <div className="rounded-[20px] border border-ze-border bg-white p-4.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-200 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2.5 py-1 text-[12px] font-bold ${STATUS_STYLE[lead.status]}`}>{STATUS_LABEL[lead.status]}</span>
            <span className="text-[12.5px] font-semibold text-ze-muted">{SOURCE_LABEL[lead.source]} · {lead.service}</span>
          </div>
          <div className="mt-2 text-[16px] font-bold">{lead.name || lead.phone || "Без контакта"}</div>
          {lead.phone && lead.name && <div className="mt-0.5 text-[13.5px] text-ze-muted">{lead.phone}</div>}
          {lead.message && <p className="mt-2 max-w-[520px] text-[14px] leading-relaxed text-slate-700">{lead.message}</p>}
          {lead.quizAnswers && (
            <div className="mt-2 text-[13px] text-ze-muted">
              {lead.quizAnswers.goal} · {lead.quizAnswers.budget} · {lead.quizAnswers.timeline}
            </div>
          )}
        </div>
        <div className="flex flex-none flex-col items-end gap-2">
          <div className="text-[12.5px] text-slate-400">{new Date(lead.createdAt).toLocaleString("ru-RU")}</div>
          <div className="flex gap-1.5">
            {(["new", "in_progress", "done"] as const).map((s) => (
              <button
                key={s}
                disabled={isPending || lead.status === s}
                onClick={() => changeStatus(s)}
                className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  lead.status === s ? "cursor-default bg-ze-primary text-white" : "border border-ze-border bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={toggleExpanded} className="mt-3.5 flex items-center gap-1.5 text-[13px] font-semibold text-ze-primary">
        <MessageSquare className="h-3.5 w-3.5" strokeWidth={2} />
        {expanded ? "Скрыть заметки" : "Заметки"}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>

      {expanded && (
        <div className="mt-3 border-t border-[#F1F4F9] pt-3.5">
          <div className="flex gap-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Добавить заметку — что обсудили, следующий шаг…"
              className="min-w-0 flex-1 rounded-xl border border-ze-border px-3.5 py-2.5 text-[13.5px] outline-none transition-colors focus:border-ze-primary"
              onKeyDown={(e) => e.key === "Enter" && submitNote()}
            />
            <button
              onClick={submitNote}
              disabled={isPending || !note.trim()}
              className="flex flex-none items-center gap-1.5 rounded-xl bg-ze-primary px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-ze-primary-dark disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" strokeWidth={2} />
              Добавить
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {activities === null && <div className="text-[13px] text-slate-400">Загрузка…</div>}
            {activities?.length === 0 && <div className="text-[13px] text-slate-400">Заметок пока нет</div>}
            {activities?.map((a) => (
              <div key={a.id} className="rounded-xl bg-[#F7F9FC] px-3.5 py-2.5 text-[13.5px]">
                <div className="text-slate-700">{a.note}</div>
                <div className="mt-1 text-[11.5px] text-slate-400">{new Date(a.createdAt).toLocaleString("ru-RU")}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
