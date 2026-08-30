"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/DataTable";

interface StudentRow {
  id: string;
  current_exam: string | null;
  current_level: string | null;
  target_level: string | null;
  target_country: string | null;
  profiles?: { full_name: string | null; role: string };
}

const LIMIT = 20;

export default function AdminStudentsPage() {
  const { token } = useAuth();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadedPage, setLoadedPage] = useState<number | null>(null);
  const loading = loadedPage !== page;

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    apiGet<StudentRow[]>(`/students?page=${page}&limit=${LIMIT}`, token).then((res) => {
      if (cancelled) return;
      setStudents(res.data || []);
      setTotal(res.total ?? 0);
      setLoadedPage(page);
    });
    return () => {
      cancelled = true;
    };
  }, [token, page]);

  const columns: Column<StudentRow>[] = [
    { key: "full_name", title: "Имя", render: (row) => row.profiles?.full_name || "Без имени" },
    { key: "current_exam", title: "Экзамен", render: (row) => (row.current_exam ? row.current_exam.toUpperCase() : "—") },
    {
      key: "level",
      title: "Уровень",
      render: (row) => (row.current_level && row.target_level ? `${row.current_level} → ${row.target_level}` : "—"),
    },
    { key: "target_country", title: "Страна", render: (row) => row.target_country || "—" },
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
        loading={loading}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
