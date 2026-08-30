"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/api";
import { StatsCard } from "@/components/admin/StatsCard";
import { CreditCard, FileText, GraduationCap, Users } from "lucide-react";

interface Lead {
  id: string;
  name: string | null;
  service: string;
  source: string;
  status: string;
  created_at: string;
}

interface StudentRow {
  id: string;
  current_exam: string | null;
  current_level: string | null;
  target_level: string | null;
  profiles?: { full_name: string | null };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [usersTotal, setUsersTotal] = useState<number | null>(null);
  const [studentsTotal, setStudentsTotal] = useState<number | null>(null);
  const [leadsTotal, setLeadsTotal] = useState<number | null>(null);
  const [paymentsTotal, setPaymentsTotal] = useState<number | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentStudents, setRecentStudents] = useState<StudentRow[]>([]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    Promise.all([
      apiGet<unknown[]>("/users?limit=1", token),
      apiGet<StudentRow[]>("/students?limit=5", token),
      apiGet<Lead[]>("/leads?limit=5", token),
      apiGet<unknown[]>("/payments?limit=1", token),
    ]).then(([usersRes, studentsRes, leadsRes, paymentsRes]) => {
      if (cancelled) return;
      setUsersTotal(usersRes.total ?? null);
      setStudentsTotal(studentsRes.total ?? null);
      setRecentStudents(studentsRes.data || []);
      setLeadsTotal(leadsRes.total ?? null);
      setRecentLeads(leadsRes.data || []);
      setPaymentsTotal(paymentsRes.total ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-[14px] text-slate-500">Обзор ZagranEasy.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={Users} value={usersTotal ?? "—"} label="Пользователей" />
        <StatsCard icon={GraduationCap} value={studentsTotal ?? "—"} label="Студентов" />
        <StatsCard icon={FileText} value={leadsTotal ?? "—"} label="Заявок" />
        <StatsCard icon={CreditCard} value={paymentsTotal ?? "—"} label="Платежей" />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-slate-900">Последние заявки</h2>
          <Link href="/admin/leads" className="text-[13px] font-semibold text-blue-600 hover:underline">
            Все заявки →
          </Link>
        </div>
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="px-5 py-6 text-center text-[13.5px] text-slate-400">Загрузка…</div>
          ) : recentLeads.length > 0 ? (
            recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between px-5 py-3.5 text-[13.5px]">
                <span className="text-slate-800">
                  <span className="font-semibold">{lead.name || "Без имени"}</span> · {lead.service} ·{" "}
                  <span className="text-slate-400">{lead.source}</span>
                </span>
                <span className="text-slate-500">{formatDate(lead.created_at)}</span>
              </div>
            ))
          ) : (
            <div className="px-5 py-6 text-center text-[13.5px] text-slate-400">Заявок пока нет.</div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-slate-900">Последние студенты</h2>
          <Link href="/admin/students" className="text-[13px] font-semibold text-blue-600 hover:underline">
            Все студенты →
          </Link>
        </div>
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="px-5 py-6 text-center text-[13.5px] text-slate-400">Загрузка…</div>
          ) : recentStudents.length > 0 ? (
            recentStudents.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3.5 text-[13.5px]">
                <span className="text-slate-800">
                  <span className="font-semibold">{s.profiles?.full_name || "Без имени"}</span>
                  {s.current_exam && <span className="text-slate-400"> · {s.current_exam.toUpperCase()}</span>}
                </span>
                {s.current_level && s.target_level && (
                  <span className="text-slate-500">
                    {s.current_level} → {s.target_level}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="px-5 py-6 text-center text-[13.5px] text-slate-400">Студентов пока нет.</div>
          )}
        </div>
      </div>
    </div>
  );
}
