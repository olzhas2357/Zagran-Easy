"use client"

import { Column, DataTable } from "@/components/admin/DataTable";
import { apiGet } from "@/lib/api";
import { apiDelete, apiPatch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2 } from "lucide-react";


interface TeacherRow {
    id: string;
    specializations: string[] | null;
    bio: string | null;
    is_published: boolean;
    profiles?: {full_name:string | null; role:string};  
}

function initials(name: string | null | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

const LIMIT = 20;

export default function AdminTeaachersPage(){
    const router = useRouter();
    const {token} = useAuth();
    const [teachers, setTeachers] = useState<TeacherRow[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loadedPage, setLoadedPage] = useState<number | null>(null);
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const loading = loadedPage !== page;

    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        apiGet<TeacherRow[]>(`/teachers?page=${page}&limit=${LIMIT}`, token).then((res) => {
            if (cancelled) return;
            setTeachers(res.data || []);
            setTotal(res.total ?? 0);
            setLoadedPage(page);
        });
        return () => {
            cancelled = true;
        };
    }, [token, page]);

    async function togglePublished(row: TeacherRow) {
        if (!token) return;
        setPendingId(row.id); setError(null);
        const response = await apiPatch(`/teachers/${row.id}/publication`, { is_published: !row.is_published }, token);
        if (response.error) setError(response.error);
        else setTeachers((items) => items.map((item) => item.id === row.id ? { ...item, is_published: !item.is_published } : item));
        setPendingId(null);
    }

    async function removeTeacher(row: TeacherRow) {
        if (!token || !window.confirm(`Удалить преподавателя «${row.profiles?.full_name || "Без имени"}» и его учётную запись? Это действие нельзя отменить.`)) return;
        setPendingId(row.id); setError(null);
        const response = await apiDelete(`/users/${row.id}`, token);
        if (response.error) setError(response.error);
        else { setTeachers((items) => items.filter((item) => item.id !== row.id)); setTotal((value) => Math.max(0, value - 1)); }
        setPendingId(null);
    }

    const columns: Column<TeacherRow>[] = [
        {
            key: "full_name",
            title: "Учитель",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-emerald-50 text-[12px] font-bold text-emerald-700">
                        {initials(row.profiles?.full_name)}
                    </div>
                    <div className="min-w-0 truncate font-semibold text-slate-900">{row.profiles?.full_name || "Без имени"}</div>
                </div>
            ),
        },
        {
            key: "specializations",
            title: "специализации",
            render: (row) =>
                row.specializations?.length ? (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[12.5px] font-semibold text-blue-700">{row.specializations.join(", ")}</span>
                ) : (
                <span className="text-slate-400">—</span>
              ),
        },
        {
            key: "is_published",
            title: "Публикация",
            render: (row) => <span className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${row.is_published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{row.is_published ? "Опубликован" : "Скрыт"}</span>,
        },
        {
            key: "actions",
            title: "Действия",
            render: (row) => <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}><button type="button" disabled={pendingId === row.id} onClick={() => void togglePublished(row)} title={row.is_published ? "Скрыть с публичной страницы" : "Опубликовать"} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-ze-primary disabled:opacity-40">{row.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button><button type="button" disabled={pendingId === row.id} onClick={() => void removeTeacher(row)} title="Удалить преподавателя" className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button></div>,
        },
         {
            key: "bio",
            title: "БИО",
            render: (row) =>
                row.bio ? (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[12.5px] font-semibold text-blue-700">{row.bio}</span>
                ) : (
                <span className="text-slate-400">—</span>
              ),
        },
    ];
    return (
        <div className="flex flex-col gap-6 p-5 sm:p-8">
            <div>
                <h1 className="text-[24px] font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Учителя</h1>
                <p className="mt-1.5 text-[14.5px] text-slate-500">{total} всего.</p>
            </div>
            {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            
    
            <DataTable
                columns={columns}
                data={teachers}
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
