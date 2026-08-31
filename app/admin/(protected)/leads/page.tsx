"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/DataTable";

interface LeadRow {
  id: string;
  name: string | null;
  phone: string | null;
  service: string;
  source: string;
  status: string;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Готово",
};

const LIMIT = 20;

function initials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

const SOURCE_LABELS: Record<string, string> = {
  quiz: "Квиз",
  form: "Форма",
  whatsapp: "WhatsApp",
  calculator: "Калькулятор",
};

export default function AdminLeadsPage() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadedPage, setLoadedPage] = useState<number | null>(null);
  const loading = loadedPage !== page;

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    apiGet<LeadRow[]>(`/leads?page=${page}&limit=${LIMIT}`, token).then((res) => {
      if (cancelled) return;
      setLeads(res.data || []);
      setTotal(res.total ?? 0);
      setLoadedPage(page);
    });
    return () => {
      cancelled = true;
    };
  }, [token, page]);

  const columns: Column<LeadRow>[] = [
    {
      key: "name",
      title: "Заявка",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-violet-50 text-[12px] font-bold text-violet-700">
            {initials(row.name)}
          </div>
          <div className="min-w-0">
            <div className="truncate font-semibold text-slate-900">{row.name || "Без имени"}</div>
            <div className="truncate text-[12.5px] text-slate-400">{row.phone || "Телефон не указан"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "service",
      title: "Услуга",
      render: (row) => (
        <div>
          <div className="font-medium text-slate-800">{row.service}</div>
          <div className="text-[12.5px] text-slate-400">{SOURCE_LABELS[row.source] || row.source}</div>
        </div>
      ),
    },
    {
      key: "status",
      title: "Статус",
      render: (row) => (
        <span className={`rounded-full px-2.5 py-1 text-[12.5px] font-semibold ${STATUS_STYLES[row.status] || "bg-slate-100 text-slate-600"}`}>
          {STATUS_LABELS[row.status] || row.status}
        </span>
      ),
    },
    { key: "created_at", title: "Дата", render: (row) => new Date(row.created_at).toLocaleDateString("ru-RU") },
  ];

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Заявки</h1>
        <p className="mt-1.5 text-[14.5px] text-slate-500">{total} всего.</p>
      </div>

      <DataTable
        columns={columns}
        data={leads}
        total={total}
        page={page}
        limit={LIMIT}
        onPageChange={setPage}
        loading={loading}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
