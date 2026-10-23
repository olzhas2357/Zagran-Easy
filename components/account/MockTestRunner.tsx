"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { MockTestDetail, MockTestTask } from "@/lib/mock-test-data";
import { checkMockTest, submitMockTest, type MockTestResult } from "@/lib/mock-test-actions";
import { waUrl } from "@/lib/utils";

type Answers = Record<string, unknown>;
type Choice = { id: string; text: string };

const MANUAL_TYPES = new Set(["writing", "open_question", "error_correction"]);

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function choicesOf(task: MockTestTask): Choice[] {
  return Array.isArray(task.options?.choices) ? (task.options.choices as Choice[]) : [];
}

function TaskInput({ task, value, onChange }: { task: MockTestTask; value: unknown; onChange: (v: unknown) => void }) {
  const inputClass = "w-full rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none focus:border-ze-primary";

  if (task.type === "multiple_choice") {
    return (
      <div className="flex flex-col gap-2.5">
        {choicesOf(task).map((c) => (
          <label key={c.id} className="flex items-center gap-2.5 rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink has-[:checked]:border-ze-primary has-[:checked]:bg-blue-50">
            <input type="radio" name={task.id} checked={value === c.id} onChange={() => onChange(c.id)} className="h-4.5 w-4.5 accent-ze-primary" />
            {c.text}
          </label>
        ))}
      </div>
    );
  }

  if (task.type === "multiple_select") {
    const selected = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="flex flex-col gap-2.5">
        {choicesOf(task).map((c) => (
          <label key={c.id} className="flex items-center gap-2.5 rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink has-[:checked]:border-ze-primary has-[:checked]:bg-blue-50">
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={(e) => onChange(e.target.checked ? [...selected, c.id] : selected.filter((id) => id !== c.id))}
              className="h-4.5 w-4.5 accent-ze-primary"
            />
            {c.text}
          </label>
        ))}
      </div>
    );
  }

  if (task.type === "fill_blanks") {
    const blanks = Array.isArray(task.options?.blanks) ? (task.options.blanks as unknown[]) : [];
    const values = Array.isArray(value) ? (value as string[]) : blanks.map(() => "");
    return (
      <div className="grid gap-2.5 sm:grid-cols-2">
        {blanks.map((_, i) => (
          <input
            key={i}
            value={values[i] ?? ""}
            onChange={(e) => onChange(blanks.map((_, j) => (j === i ? e.target.value : values[j] ?? "")))}
            placeholder={`Пропуск ${i + 1}`}
            className={inputClass}
          />
        ))}
      </div>
    );
  }

  if (task.type === "matching") {
    const lefts = Array.isArray(task.options?.pairs) ? (task.options.pairs as Array<{ id: string; left: string }>) : [];
    const rights = Array.isArray(task.options?.rights) ? (task.options.rights as Array<{ id: string; right: string }>) : [];
    const current = (value && typeof value === "object" ? value : {}) as Record<string, string>;
    return (
      <div className="flex flex-col gap-2.5">
        {lefts.map((pair) => (
          <div key={pair.id} className="grid items-center gap-2 sm:grid-cols-2">
            <div className="text-[14px] font-medium text-ze-ink">{pair.left}</div>
            <select value={current[pair.id] ?? ""} onChange={(e) => onChange({ ...current, [pair.id]: e.target.value })} className={inputClass}>
              <option value="">Выберите…</option>
              {rights.map((r) => (
                <option key={r.id} value={r.id}>{r.right}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  }

  if (task.type === "speaking") {
    return <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-[13.5px] font-medium text-amber-900">Speaking пока проверяется на занятии с преподавателем — это задание можно пропустить.</div>;
  }

  if (MANUAL_TYPES.has(task.type ?? "")) {
    return <textarea value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} rows={7} placeholder="Ваш ответ — его проверит преподаватель" className={inputClass} />;
  }

  return <input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder="Введите ответ…" className={inputClass} />;
}

export function MockTestRunner({ test, mode = "student" }: { test: MockTestDetail; mode?: "student" | "public" }) {
  const listHref = mode === "public" ? "/mock-test" : "/account/mock-test";
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<MockTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(test.durationMinutes ? test.durationMinutes * 60 : null);
  const startedAt = useRef(0);
  const submitted = useRef(false);
  const answersRef = useRef<Answers>(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  function submit() {
    if (submitted.current) return;
    submitted.current = true;
    setError(null);
    startTransition(async () => {
      const send = mode === "public" ? checkMockTest : submitMockTest;
      const res = await send(test.id, answersRef.current, (Date.now() - startedAt.current) / 1000);
      if (res.success) {
        setResult(res.result);
      } else {
        submitted.current = false;
        setError(res.error);
      }
    });
  }

  useEffect(() => {
    startedAt.current = Date.now();
    if (secondsLeft === null) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s === null ? s : Math.max(0, s - 1)));
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  if (result) {
    const byTask = new Map(result.details.map((d) => [d.taskId, d]));
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-[20px] border border-ze-border bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="text-[13px] font-semibold text-ze-muted">Примерный результат</div>
          <div className="mt-1 text-[40px] font-extrabold tracking-tight text-ze-ink">{result.score}%</div>
          <p className="mt-1 text-[14px] text-ze-muted">
            Верно {result.correct} из {result.autoTotal} заданий с автопроверкой.
            {result.pendingReview > 0 && ` ${result.pendingReview} заданий проверит преподаватель.`}
          </p>
          <p className="mt-3 text-[12.5px] text-ze-muted">Это ориентировочная оценка, а не официальный балл экзамена.</p>
        </div>

        {test.tasks.map((task, i) => {
          const detail = byTask.get(task.id);
          return (
            <div key={task.id} className="rounded-[20px] border border-ze-border bg-white p-5">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-ze-muted">
                {detail?.isCorrect === true && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                {detail?.isCorrect === false && <XCircle className="h-4 w-4 text-red-500" />}
                Вопрос {i + 1}{detail?.isCorrect === null && " · на проверке у преподавателя"}
              </div>
              <p className="mt-1.5 text-[14.5px] text-ze-ink">{task.question ?? task.title}</p>
              {detail?.explanation && <p className="mt-2 rounded-xl bg-blue-50 px-3.5 py-2.5 text-[13.5px] text-blue-900">{detail.explanation}</p>}
            </div>
          );
        })}

        {mode === "public" && (
          <div className="rounded-[20px] border border-sky-200 bg-sky-50 p-5">
            <div className="text-[15px] font-bold text-ze-ink">Хотите разобрать результат с преподавателем?</div>
            <p className="mt-1 text-[13.5px] text-ze-muted">Подскажем, как подготовиться к экзамену, и подберём формат занятий.</p>
            <a
              href={waUrl(`Здравствуйте! Прошёл(ла) mock test «${test.title}», результат ${result.score}%. Хочу узнать, как подготовиться к экзамену.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white"
            >
              Получить консультацию
            </a>
          </div>
        )}

        <Link href={listHref} className="w-fit rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white">К списку тестов</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {secondsLeft !== null && (
        <div className="sticky top-0 z-10 flex w-fit items-center gap-2 rounded-full border border-ze-border bg-white px-4 py-2 text-[14px] font-bold text-ze-ink shadow-sm">
          <Clock3 className="h-4 w-4 text-ze-primary" />
          {formatTime(secondsLeft)}
        </div>
      )}

      {test.tasks.map((task, i) => (
        <div key={task.id} className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="text-[13px] font-semibold text-ze-muted">Вопрос {i + 1} из {test.tasks.length}</div>
          <p className="mt-2 whitespace-pre-line text-[14.5px] leading-relaxed text-ze-ink">{task.question ?? task.title}</p>
          {task.audioUrl && <audio controls src={task.audioUrl} className="mt-3 w-full" />}
          <div className="mt-4">
            <TaskInput task={task} value={answers[task.id]} onChange={(v) => setAnswers((prev) => ({ ...prev, [task.id]: v }))} />
          </div>
        </div>
      ))}

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}
      <button
        type="button"
        onClick={submit}
        disabled={isPending}
        className="w-fit rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all hover:-translate-y-0.5 hover:bg-ze-primary-dark disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending ? "Отправляем…" : "Завершить тест"}
      </button>
    </div>
  );
}
