"use client";

import { useState } from "react";
import type { TaskOption } from "@/lib/teacher-data";
import { TASK_TYPE_LABEL } from "@/lib/task-types";

export function TaskPicker({ tasks, selectedIds, onToggle }: { tasks: TaskOption[]; selectedIds: string[]; onToggle: (id: string) => void }) {
  const [folderId, setFolderId] = useState("all");
  const [search, setSearch] = useState("");
  const folders = Array.from(new Map(tasks.filter((task) => task.folderId).map((task) => [task.folderId!, task.folderName || "Папка"]))).sort((a, b) => a[1].localeCompare(b[1]));
  const visible = tasks.filter((task) => (folderId === "all" || (task.folderId || "") === folderId) && task.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  return <div className="space-y-3">
    <div className="grid gap-2 sm:grid-cols-2">
      <select aria-label="Папка заданий" value={folderId} onChange={(event) => setFolderId(event.target.value)} className="w-full rounded-xl border border-ze-border bg-white px-3 py-2.5 text-sm"><option value="all">Все папки</option><option value="">Без папки</option>{folders.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
      <input aria-label="Поиск задания" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Название задания" className="w-full rounded-xl border border-ze-border bg-white px-3 py-2.5 text-sm" />
    </div>
    <p className="text-xs text-ze-muted">Выбрано: {selectedIds.length}. Можно выбрать одно или несколько заданий.</p>
    {selectedIds.length > 0 && <div className="flex flex-wrap gap-2">{tasks.filter((task) => selectedIds.includes(task.id)).map((task) => <button key={task.id} type="button" onClick={() => onToggle(task.id)} aria-label={`Убрать задание «${task.title}»`} className="rounded-lg bg-blue-50 px-2 py-1 text-xs text-ze-primary">{task.title} ×</button>)}</div>}
    <div className="max-h-80 space-y-2 overflow-y-auto">{visible.map((task) => <label key={task.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${selectedIds.includes(task.id) ? "border-ze-primary bg-blue-50" : "border-ze-border bg-white"}`}>
      <input type="checkbox" checked={selectedIds.includes(task.id)} onChange={() => onToggle(task.id)} className="mt-1" />
      <span><span className="block font-semibold">{task.title}</span><span className="text-xs text-ze-muted">{task.folderName || "Без папки"} · {TASK_TYPE_LABEL[task.type || ""] || task.type}</span></span>
    </label>)}</div>
    {!visible.length && <p className="text-sm text-ze-muted">{tasks.length ? "Задания не найдены." : "Создайте задания в разделе «База знаний»."}</p>}
  </div>;
}
