"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, UsersRound, ArrowRight, CalendarClock } from "lucide-react";
import type { Client } from "@/lib/types";

const STATUS_LABEL: Record<Client["salesStatus"], string> = {
  new: "Новый",
  qualified: "Квалифицирован",
  proposal: "Предложение",
  negotiation: "Переговоры",
  won: "Продажа",
  lost: "Отказ",
};

export function ClientsList({ clients }: { clients: Client[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return clients;
    return clients.filter((client) =>
      [client.fullName, client.phone, client.email, client.product]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value),
    );
  }, [clients, query]);

  return (
    <div>
      <div className="relative mt-5 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ФИО, телефон, email или продукт"
          className="w-full rounded-xl border border-ze-border bg-white py-3 pl-10 pr-4 text-[14px] outline-none focus:border-ze-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-5 flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-[#D6DEEA] bg-white px-6 py-14 text-center">
          <UsersRound className="h-7 w-7 text-ze-muted" strokeWidth={1.5} />
          <p className="text-[14px] text-ze-muted">{clients.length ? "Клиенты не найдены" : "Пока нет клиентов. Конвертируйте первую заявку."}</p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-[20px] border border-ze-border bg-white">
          {filtered.map((client) => (
            <Link
              key={client.id}
              href={`/staff/clients/${client.id}`}
              className="group flex flex-col gap-3 border-b border-ze-border p-4 transition-colors last:border-0 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-ze-ink">{client.fullName}</span>
                  {client.leadCategory && <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-ze-primary">{client.leadCategory}</span>}
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{STATUS_LABEL[client.salesStatus]}</span>
                </div>
                <div className="mt-1 text-[13px] text-ze-muted">{[client.phone, client.email, client.product].filter(Boolean).join(" · ") || "Контакты не заполнены"}</div>
              </div>
              <div className="flex items-center gap-3 text-[12.5px] text-ze-muted">
                {client.nextContactAt && (
                  <span className="flex items-center gap-1.5"><CalendarClock className="h-4 w-4" />{new Date(client.nextContactAt).toLocaleString("ru-RU")}</span>
                )}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
