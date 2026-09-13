"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import type { ClientNote } from "@/lib/types";
import { addClientNote } from "@/lib/staff-actions";

export function ClientNotes({ clientId, notes }: { clientId: string; notes: ClientNote[] }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!body.trim()) return;
    startTransition(async () => {
      const result = await addClientNote(clientId, body);
      if (!result.success) return setError(result.error || "Не удалось добавить заметку");
      setBody("");
      setError(null);
      router.refresh();
    });
  }

  return (
    <section className="rounded-[20px] border border-ze-border bg-white p-5">
      <h2 className="text-[16px] font-bold">Заметки</h2>
      <div className="mt-4 flex gap-2">
        <input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && submit()}
          placeholder="Что обсудили, договорённости, следующий шаг"
          className="min-w-0 flex-1 rounded-xl border border-ze-border px-3.5 py-2.5 text-[13.5px] outline-none focus:border-ze-primary"
        />
        <button onClick={submit} disabled={pending || !body.trim()} className="rounded-xl bg-ze-primary px-4 text-white disabled:opacity-50" aria-label="Добавить заметку">
          <Send className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mt-2 text-[12.5px] text-red-600">{error}</p>}
      <div className="mt-4 flex flex-col gap-2.5">
        {notes.length === 0 && <p className="text-[13px] text-ze-muted">Заметок пока нет.</p>}
        {notes.map((note) => (
          <div key={note.id} className="rounded-xl bg-[#F7F9FC] px-3.5 py-3">
            <p className="text-[13.5px] leading-relaxed text-slate-700">{note.body}</p>
            <p className="mt-1.5 text-[11.5px] text-slate-400">{note.authorName || "Менеджер"} · {new Date(note.createdAt).toLocaleString("ru-RU")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
