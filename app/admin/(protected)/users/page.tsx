"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { RoleBadge } from "@/components/admin/RoleBadge";

interface UserRow {
  id: string;
  full_name: string | null;
  role: string;
  phone: string | null;
  created_at: string;
}

const ROLE_FILTERS = [
  { value: "", label: "Все" },
  { value: "student", label: "Студенты" },
  { value: "teacher", label: "Учителя" },
  { value: "parent", label: "Родители" },
  { value: "admin", label: "Админы" },
];

const LIMIT = 20;

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loadedPage, setLoadedPage] = useState<number | null>(null);
  const loading = loadedPage !== page;

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    apiGet<UserRow[]>(`/users?page=${page}&limit=${LIMIT}`, token).then((res) => {
      if (cancelled) return;
      setUsers(res.data || []);
      setTotal(res.total ?? 0);
      setLoadedPage(page);
    });
    return () => {
      cancelled = true;
    };
  }, [token, page]);

  const filtered = users.filter((u) => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (search && !(u.full_name || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns: Column<UserRow>[] = [
    { key: "full_name", title: "Имя", render: (row) => row.full_name || "Без имени" },
    { key: "role", title: "Роль", render: (row) => <RoleBadge role={row.role} /> },
    { key: "phone", title: "Телефон", render: (row) => row.phone || "—" },
    {
      key: "created_at",
      title: "Создан",
      render: (row) => new Date(row.created_at).toLocaleDateString("ru-RU"),
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900">Пользователи</h1>
          <p className="mt-1 text-[14px] text-slate-500">{total} всего.</p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-blue-700"
        >
          + Создать пользователя
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {ROLE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setRoleFilter(f.value)}
            className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              roleFilter === f.value ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени…"
          className="ml-auto w-full max-w-[240px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none focus:border-blue-600"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
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
