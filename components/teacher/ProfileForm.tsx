"use client";

import { useState, useTransition } from "react";
import { updateTeacherProfile } from "@/lib/teacher-actions";

const inputClass =
  "w-full rounded-lg border border-ze-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-ze-primary";
const textareaClass = `${inputClass} resize-none`;

export function ProfileForm({ initialBio, initialSpecializations }: { initialBio: string; initialSpecializations: string[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [bio, setBio] = useState(initialBio);
  const [specText, setSpecText] = useState(initialSpecializations.join(", "));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const specializations = specText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      const res = await updateTeacherProfile({ bio, specializations });
      if (!res.success) {
        setError(res.error || "Не удалось сохранить");
        return;
      }
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <label className="block">
        <div className="mb-1.5 text-[12px] font-semibold text-ze-muted">О себе</div>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={textareaClass} />
      </label>

      <label className="block">
        <div className="mb-1.5 text-[12px] font-semibold text-ze-muted">Специализации (через запятую)</div>
        <input value={specText} onChange={(e) => setSpecText(e.target.value)} placeholder="ielts, hsk" className={inputClass} />
      </label>

      {error && <div className="text-[13px] text-red-600">{error}</div>}
      {saved && !error && <div className="text-[13px] text-green-600">Сохранено.</div>}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-lg bg-ze-primary px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-ze-primary-dark disabled:opacity-60"
      >
        {isPending ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}
