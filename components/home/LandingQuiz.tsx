"use client";

import { useState, useTransition } from "react";
import { Compass, ArrowLeft, ArrowRight, CheckCircle2, Check } from "lucide-react";
import { createLead } from "@/lib/actions";
import { waUrl, waQuizMessage, isValidPhone } from "@/lib/utils";

const QUESTIONS = [
  {
    q: "В какую страну вы планируете поступать?",
    key: "goal" as const,
    opts: [
      { label: "Китай", value: "china" },
      { label: "Турция", value: "turkey" },
      { label: "Италия", value: "italy" },
      { label: "США", value: "usa" },
      { label: "другое", value: "another" },
    ],
  },
  {
    q: "Какой бюджет рассматриваете?",
    key: "budget" as const,
    opts: [
      { label: "До 500 000 ₸", value: "До 500 000 ₸" },
      { label: "500 000 — 2 000 000 ₸", value: "500 000 — 2 000 000 ₸" },
      { label: "Более 2 000 000 ₸", value: "Более 2 000 000 ₸" },
      { label: "Нужна рассрочка", value: "Нужна рассрочка" },
    ],
  },
  {
    q: "Когда планируете начать?",
    key: "timeline" as const,
    opts: [
      { label: "В этом месяце", value: "В этом месяце" },
      { label: "Через 1–3 месяца", value: "Через 1–3 месяца" },
      { label: "Через полгода", value: "Через полгода" },
      { label: "Пока изучаю", value: "Пока изучаю" },
    ],
  },
];

type Answers = { goal: string; budget: string; timeline: string };

export function LandingQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const done = step >= QUESTIONS.length;
  const current = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  const answeredCurrent = Boolean(answers[current.key]);

  function pick(value: string) {
    setAnswers((a) => ({ ...a, [current.key]: value }));
  }

  function next() {
    if (!answers[current.key]) return;
    setStep((s) => s + 1);
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setPhone("");
    setSubmitted(false);
  }

  const fullAnswers = answers as Answers;
  const summary = [answers.goal && QUESTIONS[0].opts.find((o) => o.value === answers.goal)?.label, answers.budget, answers.timeline]
    .filter(Boolean)
    .join(" · ");

  function handleSubmitPhone() {
    if (!isValidPhone(phone)) return;
    startTransition(async () => {
      await createLead({
        source: "quiz",
        service: fullAnswers.goal,
        phone,
        quizAnswers: fullAnswers,
      });
      setSubmitted(true);
    });
  }

  return (
    <div className="rounded-[24px] border border-ze-border bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:p-9 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-blue-50 dark:bg-white/10">
            <Compass className="h-5.5 w-5.5 text-ze-primary dark:text-[#8FD9F5]" strokeWidth={1.75} />
          </div>
          <h2 className="text-[19px] font-extrabold tracking-tight sm:text-[27px] dark:text-white">Не знаете, что выбрать?</h2>
        </div>
        <div className="flex-none rounded-full bg-ze-surface px-3 py-1.5 text-[12.5px] font-semibold text-ze-muted dark:bg-white/10 dark:text-white/60">
          {done ? "Готово" : `Шаг ${step + 1} из ${QUESTIONS.length}`}
        </div>
      </div>

      <div className="mt-5 flex gap-1.5">
        {QUESTIONS.map((q, i) => (
          <div key={q.key} className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEF1F6] dark:bg-white/10">
            <div
              className={`h-full rounded-full bg-ze-primary transition-all duration-500 ease-out dark:bg-[#8FD9F5] ${
                i < step || done ? "w-full" : i === step ? "w-1/2" : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      {!done && (
        <div className="mt-6">
          <div className="text-[17px] font-bold tracking-tight sm:text-[20px] dark:text-white">{current.q}</div>
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {current.opts.map((opt) => {
              const active = answers[current.key] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => pick(opt.value)}
                  className={`flex items-center gap-3 rounded-2xl border-[1.5px] px-4 py-3.5 text-left text-[15px] font-medium transition-all duration-200 ${
                    active
                      ? "border-ze-primary bg-[#F3F7FF] text-ze-primary shadow-[0_4px_14px_rgba(26,86,219,0.12)] dark:border-[#8FD9F5] dark:bg-white/10 dark:text-[#8FD9F5] dark:shadow-none"
                      : "border-ze-border bg-white text-ze-ink hover:-translate-y-0.5 hover:border-[#B9C8E8] hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:border-white/25 dark:hover:shadow-none"
                  }`}
                >
                  <span className="flex-1">{opt.label}</span>
                  <span
                    className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-[1.5px] transition-colors ${
                      active ? "border-ze-primary bg-ze-primary dark:border-[#8FD9F5] dark:bg-[#8FD9F5]" : "border-[#D3DBE7] bg-white dark:border-white/25 dark:bg-transparent"
                    }`}
                  >
                    {active && <Check className="h-3 w-3 text-white dark:text-[#0B132B]" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 rounded-xl border border-ze-border bg-white px-[18px] py-[13px] text-[14.5px] font-semibold text-ze-muted transition-all duration-200 hover:border-slate-300 hover:text-ze-ink disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60 dark:hover:border-white/25 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Назад
            </button>
            <button
              onClick={next}
              disabled={!answeredCurrent}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-[22px] py-[13px] text-[14.5px] font-semibold text-white transition-all duration-200 sm:flex-none ${
                answeredCurrent
                  ? "cursor-pointer bg-ze-primary shadow-[0_6px_16px_rgba(26,86,219,0.24)] hover:-translate-y-0.5 hover:bg-ze-primary-dark hover:shadow-[0_8px_20px_rgba(26,86,219,0.3)]"
                  : "cursor-not-allowed bg-[#E4E9F3] text-[#9BA8C2] dark:bg-white/10 dark:text-white/30"
              }`}
            >
              {step === QUESTIONS.length - 1 ? "Показать варианты" : "Далее"}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {done && !submitted && (
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#E9F9F1] text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
              <CheckCircle2 className="h-5.5 w-5.5" strokeWidth={2} />
            </div>
            <div>
              <div className="text-[17px] font-bold dark:text-white">Подобрали для вас направление</div>
              <div className="mt-0.5 text-[13.5px] text-ze-muted dark:text-white/60">{summary}</div>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (___) ___ __ __"
              className="min-w-0 flex-1 rounded-xl border border-ze-border bg-ze-surface px-4 py-[15px] text-[15px] text-ze-ink dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30"
            />
            <button
              onClick={handleSubmitPhone}
              disabled={!isValidPhone(phone) || isPending}
              className="flex-none rounded-xl bg-ze-accent px-[22px] py-[15px] text-[15px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-accent-dark disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
            >
              {isPending ? "Отправляем…" : "Получить подборку"}
            </button>
          </div>
          <button onClick={reset} className="mt-3.5 text-[13.5px] font-semibold text-ze-muted hover:text-ze-ink dark:text-white/50 dark:hover:text-white">
            Пройти заново
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-6 rounded-2xl border border-ze-border/70 bg-ze-surface p-6 text-center dark:border-white/10 dark:bg-white/[0.04]">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#E9F9F1] text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="mt-3 text-[16px] font-bold dark:text-white">Заявка принята</div>
          <p className="mt-1.5 text-[14px] text-ze-muted dark:text-white/60">Менеджер свяжется в течение рабочего дня. Можно написать прямо сейчас:</p>
          <a
            href={waUrl(waQuizMessage(fullAnswers))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-ze-whatsapp px-5 py-3 text-[14.5px] font-bold text-white shadow-[0_6px_16px_rgba(37,211,102,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-whatsapp-dark"
          >
            Написать в WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
