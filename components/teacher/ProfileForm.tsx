"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { updateTeacherProfile } from "@/lib/teacher-actions";

const inputClass =
  "w-full rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none transition-colors focus:border-ze-primary";
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
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <label className="block">
        <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">О себе</div>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={textareaClass} />
      </label>

      <label className="block">
        <div className="mb-1.5 text-[13px] font-semibold text-ze-muted">Специализации (через запятую)</div>
        <input value={specText} onChange={(e) => setSpecText(e.target.value)} placeholder="ielts, hsk" className={inputClass} />
      </label>

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}
      {saved && !error && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-[13.5px] font-medium text-emerald-700">
          <CheckCircle2 className="h-4.5 w-4.5" strokeWidth={2} />
          Сохранено.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}
