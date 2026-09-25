"use client";

import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost } from "@/lib/api";

type Child = { id: string; profiles?: { full_name: string | null } };

export function ParentChildren({ parentId, token }: { parentId: string; token: string | null }) {
  const [children, setChildren] = useState<Child[]>([]);
  const [students, setStudents] = useState<Child[]>([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    async function loadStudents() {
      const all: Child[] = [];
      for (let page = 1; ; page++) {
        const result = await apiGet<Child[]>(`/students?limit=100&page=${page}`, token);
        if (result.error) return { data: all, error: result.error };
        all.push(...(result.data || []));
        if (!result.data?.length || all.length >= (result.total ?? all.length)) return { data: all };
        if (cancelled) return { data: all };
      }
    }
    async function load() {
      const [linked, available] = await Promise.all([
        apiGet<Child[]>(`/parents/${parentId}/children`, token),
        loadStudents(),
      ]);
      if (cancelled) return;
      setError(linked.error || available.error || null);
      setChildren(linked.data || []);
      setStudents(available.data || []);
      setBusy(false);
    }
    void load();
    return () => { cancelled = true; };
  }, [parentId, token]);

  async function change(studentId: string, link: boolean) {
    setBusy(true);
    setError(null);
    const path = `/parents/${parentId}/children/${studentId}`;
    const result = link ? await apiPost(path, {}, token) : await apiDelete(path, token);
    if (result.error) setError(result.error);
    else {
      const refreshed = await apiGet<Child[]>(`/parents/${parentId}/children`, token);
      if (refreshed.error) setError(`Связь сохранена, но список не обновился: ${refreshed.error}`);
      else { setChildren(refreshed.data || []); setSelected(""); }
    }
    setBusy(false);
  }

  return <section className="rounded-xl border border-slate-200 p-4">
    <h2 className="font-semibold">Дети родителя</h2>
    <p className="mt-1 text-xs text-slate-500">Привязка сохраняется отдельно от профиля пользователя.</p>
    {children.map((child) => <div key={child.id} className="mt-3 flex items-center justify-between gap-3 text-sm">
      <span>{child.profiles?.full_name || child.id}</span>
      <button type="button" disabled={busy} onClick={() => void change(child.id, false)} className="text-red-600 disabled:opacity-50">Отвязать</button>
    </div>)}
    {!busy && !error && children.length === 0 && <p className="mt-3 text-sm text-slate-500">Дети пока не привязаны.</p>}
    <label className="mt-4 block text-sm">Добавить ребёнка
      <select value={selected} onChange={(event) => setSelected(event.target.value)} disabled={busy} className="mt-2 w-full rounded-xl border border-slate-200 p-3">
        <option value="">Выберите студента</option>
        {students.filter((student) => !children.some((child) => child.id === student.id)).map((student) => <option key={student.id} value={student.id}>{student.profiles?.full_name || student.id}</option>)}
      </select>
    </label>
    <button type="button" disabled={busy || !selected} onClick={() => void change(selected, true)} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50">{busy ? "Загрузка…" : "Привязать"}</button>
    {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
  </section>;
}
