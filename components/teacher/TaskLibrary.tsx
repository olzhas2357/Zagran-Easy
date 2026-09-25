"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderOpen, Plus } from "lucide-react";
import type { TaskFolder, TaskListItem } from "@/lib/teacher-data";
import { createTaskFolder, moveTaskToFolder } from "@/lib/teacher-actions";
import { TASK_TYPE_LABEL } from "@/lib/task-types";

export function TaskLibrary({ folders, tasks }: { folders: TaskFolder[]; tasks: TaskListItem[] }) {
  const router = useRouter();
  const [folderId, setFolderId] = useState("all");
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const visible = tasks.filter((task) => (folderId === "all" || (task.folderId || "") === folderId) && `${task.title} ${task.question}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const newTaskUrl = `/teacher/tasks/new${folderId && folderId !== "all" ? `?folder=${encodeURIComponent(folderId)}` : ""}`;

  function createFolder(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await createTaskFolder(name);
      if (!result.success) { setError(result.error); return; }
      setName(""); setFolderId(result.data.id); router.refresh();
    });
  }

  return <div className="grid items-start gap-5 lg:grid-cols-[260px_1fr]">
    <aside className="rounded-2xl border border-ze-border bg-white p-4">
      <h2 className="mb-3 font-bold">Папки</h2>
      <div className="space-y-1">{[{ id: "all", name: "Все задания" }, { id: "", name: "Без папки" }, ...folders].map((folder) => <button key={folder.id} type="button" aria-pressed={folderId === folder.id} onClick={() => setFolderId(folder.id)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm ${folderId === folder.id ? "bg-blue-50 font-bold text-ze-primary" : "hover:bg-slate-50"}`}>
        <FolderOpen className="h-4 w-4 shrink-0" /><span className="min-w-0 break-words">{folder.name}</span><span className="ml-auto text-xs text-ze-muted">{folder.id === "all" ? tasks.length : tasks.filter((task) => (task.folderId || "") === folder.id).length}</span>
      </button>)}</div>
      <form onSubmit={createFolder} className="mt-5 border-t border-ze-border pt-4">
        <label className="text-xs font-semibold" htmlFor="folder-name">Новая папка</label>
        <input id="folder-name" required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="Например, Present Simple" className="mt-2 w-full rounded-xl border border-ze-border px-3 py-2 text-sm" />
        <button disabled={pending || !name.trim()} className="mt-2 w-full rounded-xl bg-ze-primary px-3 py-2 text-sm font-bold text-white disabled:opacity-50">Создать папку</button>
      </form>
    </aside>
    <section>
      <div className="mb-4 flex flex-wrap gap-3">
        <input aria-label="Поиск заданий" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Найти задание…" className="min-w-0 flex-1 rounded-xl border border-ze-border bg-white px-4 py-2.5 text-sm" />
        <Link href={newTaskUrl} className="inline-flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" />Создать задание</Link>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="space-y-3">{visible.map((task) => <article key={task.id} className="rounded-2xl border border-ze-border bg-white p-4">
        <h3 className="font-bold">{task.title}</h3>
        <p className="mt-1 text-xs text-ze-muted">{TASK_TYPE_LABEL[task.type || ""] || task.type} {task.examType && `· ${task.examType.toUpperCase()}`} {task.xpReward !== null && `· ${task.xpReward} XP`}</p>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm">{task.question}</p>
        <label className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ze-muted">Папка
          <select aria-label={`Папка задания «${task.title}»`} value={task.folderId || ""} disabled={pending} onChange={(event) => {
            const nextFolder = event.target.value || null; setError("");
            startTransition(async () => { const result = await moveTaskToFolder(task.id, nextFolder); if (!result.success) setError(result.error); else router.refresh(); });
          }} className="max-w-full rounded-lg border border-ze-border bg-white px-2 py-1.5 text-ze-ink"><option value="">Без папки</option>{folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select>
        </label>
      </article>)}</div>
      {!visible.length && <p className="rounded-2xl border border-dashed border-ze-border bg-white p-8 text-center text-sm text-ze-muted">{search ? "Задания не найдены." : "В этой папке пока нет заданий. Создайте первое задание."}</p>}
    </section>
  </div>;
}
