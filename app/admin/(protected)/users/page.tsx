"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, UserPlus } from "lucide-react";
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

function initials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

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
    {
      key: "full_name",
      title: "Пользователь",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-blue-50 text-[12px] font-bold text-blue-700">
            {initials(row.full_name)}
          </div>
          <div className="min-w-0">
            <div className="truncate font-semibold text-slate-900">{row.full_name || "Без имени"}</div>
            <div className="truncate text-[12.5px] text-slate-400">{row.phone || "Телефон не указан"}</div>
          </div>
        </div>
      ),
    },
    { key: "role", title: "Роль", render: (row) => <RoleBadge role={row.role} /> },
    {
      key: "created_at",
      title: "Создан",
      render: (row) => new Date(row.created_at).toLocaleDateString("ru-RU"),
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Пользователи</h1>
          <p className="mt-1.5 text-[14.5px] text-slate-500">{total} всего.</p>
        </div>
        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(37,99,235,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
        >
          <UserPlus className="h-4.5 w-4.5" strokeWidth={2} />
          Создать пользователя
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {ROLE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setRoleFilter(f.value)}
            className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
              roleFilter === f.value ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="relative ml-auto w-full max-w-[260px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-[14px] outline-none transition-colors focus:border-blue-600"
          />
        </div>
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
