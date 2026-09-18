"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { CatalogUniversity } from "@/lib/education-catalog";
import { formatTuition } from "@/lib/education-catalog";
import { createLead } from "@/lib/actions";
import { isValidPhone } from "@/lib/utils";

interface Question {
  q: string;
  opts: string[];
}

export function EducationQuiz({ universities }: { universities: CatalogUniversity[] }) {
  const countries = useMemo(() => Array.from(new Set(universities.map((u) => u.country))).sort(), [universities]);

  const questions: Question[] = useMemo(
    () => [
      { q: "Куда хотите поступать?", opts: [...countries, "Пока не решил"] },
      { q: "Какой бюджет на год обучения?", opts: ["До $2 500", "$2 500 — $4 500", "Более $4 500", "Нужна рассрочка"] },
      { q: "Есть ли сертификат IELTS?", opts: ["Есть IELTS", "Сдам до подачи", "Нет и не планирую"] },
    ],
    [countries]
  );

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const done = step >= 3;
  const current = questions[Math.min(step, 2)];
  const answered = answers[Math.min(step, 2)] !== null;

  const matches = useMemo(() => {
    const country = answers[0] !== null ? questions[0].opts[answers[0]] : null;
    let list = universities.filter((u) => !u.needsVerification).sort((a, b) => b.ratingStars - a.ratingStars);
    if (country && country !== "Пока не решил") list = list.filter((u) => u.country === country);
    if (answers[2] === 2) list = list.filter((u) => !u.ieltsRequired);
    return list.slice(0, 3);
  }, [universities, answers, questions]);

  function pick(i: number) {
    setAnswers((a) => {
      const next = [...a];
      next[Math.min(step, 2)] = i;
      return next;
    });
  }

  function next() {
    if (answers[Math.min(step, 2)] === null) return;
    setStep((s) => s + 1);
  }

  function reset() {
    setStep(0);
    setAnswers([null, null, null]);
    setPhone("");
    setSubmitted(false);
    setSubmitError(null);
  }

  const summary = answers.map((a, i) => (a === null ? null : questions[i].opts[a])).filter(Boolean).join(" · ");

  function handleSubmit() {
    if (!isValidPhone(phone)) return;
    setSubmitError(null);
    startTransition(async () => {
      try {
        const result = await createLead({
          source: "quiz",
          service: "education",
          phone,
          message: `Подбор вуза: ${summary}. Найдено: ${matches.map((m) => m.name).join(", ")}`,
          quizAnswers: {
            country: answers[0] === null ? undefined : questions[0].opts[answers[0]],
            budget: answers[1] === null ? undefined : questions[1].opts[answers[1]],
            ielts: answers[2] === null ? undefined : questions[2].opts[answers[2]],
          },
        });
        if (!result.success) {
          setSubmitError(result.error ?? "Не получилось сохранить подборку. Попробуйте ещё раз.");
          return;
        }
        setSubmitted(true);
      } catch {
        setSubmitError("Не получилось сохранить подборку. Проверьте связь и попробуйте ещё раз.");
      }
    });
  }

  return (
    <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-extrabold tracking-tight sm:text-[25px]">Подбор университета</h2>
        <div className="flex-none text-[13px] font-semibold text-ze-muted">{done ? "Готово" : `Шаг ${step + 1} из 3`}</div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#EEF1F6]">
        <div className="h-full rounded-full bg-ze-primary transition-all duration-300" style={{ width: `${done ? 100 : (step / 3) * 100}%` }} />
      </div>

      {!done && (
        <div className="mt-5.5">
          <div className="text-[17px] font-bold sm:text-[20px]">{current.q}</div>
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {current.opts.map((label, i) => {
              const active = answers[Math.min(step, 2)] === i;
              return (
                <button
                  key={label}
                  onClick={() => pick(i)}
                  className={`flex items-center gap-2.5 rounded-[14px] border-[1.5px] px-4 py-3.5 text-left text-[15px] font-medium ${
                    active ? "border-ze-primary bg-[#F3F7FF] text-ze-primary" : "border-ze-border bg-white text-ze-ink"
                  }`}
                >
                  <span className="flex-1">{label}</span>
                  <span className={`h-[18px] w-[18px] flex-none rounded-full border-[1.5px] ${active ? "border-ze-primary bg-[radial-gradient(circle,#1A56DB_0_4px,#fff_5px_100%)]" : "border-[#D3DBE7] bg-white"}`} />
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-xl border border-ze-border bg-white px-[18px] py-[13px] text-[14.5px] font-semibold text-ze-muted disabled:opacity-40"
            >
              Назад
            </button>
            <button
              onClick={next}
              disabled={!answered}
              className={`rounded-xl px-[22px] py-[13px] text-[14.5px] font-semibold text-white ${answered ? "bg-ze-primary hover:bg-ze-primary-dark" : "cursor-not-allowed bg-[#C3CFE3]"}`}
            >
              {step === 2 ? "Показать подборку" : "Далее"}
            </button>
          </div>
        </div>
      )}

      {done && !submitted && (
        <div className="mt-5.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#E9F9F1] text-[19px] font-bold text-emerald-600">✓</div>
            <div>
              <div className="text-[17px] font-bold">Подобрали {matches.length} университета</div>
              <div className="mt-0.5 text-[13.5px] text-ze-muted">{summary}</div>
            </div>
          </div>
          <div className="mt-4.5 flex flex-col gap-2.5">
            {matches.map((m) => (
              <Link
                key={m.id}
                href={`/education/${m.slug}`}
                className="flex items-center gap-3 rounded-[14px] border border-ze-border bg-white p-3 hover:border-ze-primary"
              >
                <span className="h-[52px] w-[52px] flex-none rounded-[11px] bg-[repeating-linear-gradient(135deg,#EDF0F5_0_6px,#E4E9F1_6px_12px)]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-bold">{m.name}</span>
                  <span className="mt-0.5 block text-[12.5px] text-ze-muted">
                    {m.flag} {m.city}
                  </span>
                </span>
                <span className="flex-none text-right">
                  <span className="block text-[14.5px] font-bold">{formatTuition(m.tuitionFrom, m.tuitionCurrency)}</span>
                  <span className="mt-0.5 block text-[12px] font-semibold text-ze-muted">
                    ★ {m.ratingStars.toFixed(1)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4.5 flex flex-col gap-2.5 sm:flex-row">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (___) ___ __ __"
              className="min-w-0 flex-1 rounded-xl border border-ze-border bg-ze-surface px-4 py-[15px] text-[15px] text-ze-ink"
            />
            <button
              onClick={handleSubmit}
              disabled={!isValidPhone(phone) || isPending}
              className="flex-none rounded-xl bg-ze-accent px-[22px] py-[15px] text-[15px] font-semibold text-white hover:bg-ze-accent-dark disabled:opacity-50"
            >
              {isPending ? "Отправляем…" : "Сохранить подборку"}
            </button>
          </div>
          {submitError && <p className="text-[13.5px] font-medium text-red-600" role="alert">{submitError}</p>}
          <button onClick={reset} className="mt-3.5 text-[13.5px] font-semibold text-ze-muted hover:text-ze-ink">
            Пройти заново
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-5.5 rounded-2xl bg-[#F5F8FE] p-5 text-center">
          <div className="text-[16px] font-bold">Подборка сохранена</div>
          <p className="mt-1.5 text-[14px] text-ze-muted">Менеджер свяжется и поможет с документами по выбранным вузам.</p>
        </div>
      )}
    </div>
  );
}
