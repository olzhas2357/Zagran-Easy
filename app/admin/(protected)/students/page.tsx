"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/DataTable";

interface StudentRow {
  id: string;
  teacher_id: string | null;
  current_exam: string | null;
  current_level: string | null;
  target_level: string | null;
  target_country: string | null;
  profiles?: { full_name: string | null; role: string };
}

interface TeacherRow {
  id: string;
  profiles?: { full_name: string | null };
}

function initials(name: string | null | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

const LIMIT = 20;

export default function AdminStudentsPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [teacherNames, setTeacherNames] = useState<Record<string, string>>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadedPage, setLoadedPage] = useState<number | null>(null);
  const loading = loadedPage !== page;

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    Promise.all([
      apiGet<StudentRow[]>(`/students?page=${page}&limit=${LIMIT}`, token),
      apiGet<TeacherRow[]>("/teachers?limit=100", token),
    ]).then(([res, teachersRes]) => {
      if (cancelled) return;
      setStudents(res.data || []);
      setTotal(res.total ?? 0);
      setTeacherNames(Object.fromEntries(
        (teachersRes.data || []).map((teacher) => [teacher.id, teacher.profiles?.full_name || "Без имени"]),
      ));
      setLoadedPage(page);
    });
    return () => {
      cancelled = true;
    };
  }, [token, page]);

  const columns: Column<StudentRow>[] = [
    {
      key: "full_name",
      title: "Студент",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-emerald-50 text-[12px] font-bold text-emerald-700">
            {initials(row.profiles?.full_name)}
          </div>
          <div className="min-w-0">
            <div className="truncate font-semibold text-slate-900">{row.profiles?.full_name || "Без имени"}</div>
            <div className="truncate text-[12.5px] text-slate-400">{row.current_exam ? row.current_exam.toUpperCase() : "Экзамен не выбран"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "teacher",
      title: "Закреплённый преподаватель",
      render: (row) => row.teacher_id ? (
        <span className="font-medium text-slate-700">{teacherNames[row.teacher_id] || "Преподаватель"}</span>
      ) : (
        <span className="font-semibold text-amber-600">Не назначен</span>
      ),
    },
    {
      key: "level",
      title: "Уровень",
      render: (row) =>
        row.current_level && row.target_level ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[12.5px] font-semibold text-slate-700">
            {row.current_level} <span className="text-slate-400">→</span> {row.target_level}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      key: "target_country",
      title: "Страна",
      render: (row) =>
        row.target_country ? (
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[12.5px] font-semibold text-blue-700">{row.target_country}</span>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Студенты</h1>
        <p className="mt-1.5 text-[14.5px] text-slate-500">{total} всего.</p>
      </div>

      <DataTable
        columns={columns}
        data={students}
        total={total}
        page={page}
        limit={LIMIT}
        onPageChange={setPage}
        onRowClick={(row) => router.push(`/admin/users/${row.id}/edit`)}
        loading={loading}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
