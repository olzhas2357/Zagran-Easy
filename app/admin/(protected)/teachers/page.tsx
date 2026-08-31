"use client"

import { Column, DataTable } from "@/components/admin/DataTable";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface TeacherRow {
    id: string;
    specializations: string | null;
    bio: string | null;
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
                row.specializations ? (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[12.5px] font-semibold text-blue-700">{row.specializations}</span>
                ) : (
                <span className="text-slate-400">—</span>
              ),
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