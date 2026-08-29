"use client";

import { useState, useTransition } from "react";
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
  const progress = done ? 100 : (step / QUESTIONS.length) * 100;

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
    <div className="rounded-[20px] border border-ze-border bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)] sm:p-9">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-extrabold tracking-tight sm:text-[27px]">Не знаете, что выбрать?</h2>
        <div className="flex-none text-[13px] font-semibold text-ze-muted">
          {done ? "Готово" : `Шаг ${step + 1} из ${QUESTIONS.length}`}
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#EEF1F6]">
        <div
          className="h-full rounded-full bg-ze-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {!done && (
        <div className="mt-6">
          <div className="text-[17px] font-bold tracking-tight sm:text-[20px]">{current.q}</div>
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {current.opts.map((opt) => {
              const active = answers[current.key] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => pick(opt.value)}
                  className={`flex items-center gap-2.5 rounded-[14px] border-[1.5px] px-4 py-3.5 text-left text-[15px] font-medium transition-colors ${
                    active ? "border-ze-primary bg-[#F3F7FF] text-ze-primary" : "border-ze-border bg-white text-ze-ink"
                  }`}
                >
                  <span className="flex-1">{opt.label}</span>
                  <span
                    className={`h-[18px] w-[18px] flex-none rounded-full border-[1.5px] ${
                      active ? "border-ze-primary bg-[radial-gradient(circle,#1A56DB_0_4px,#fff_5px_100%)]" : "border-[#D3DBE7] bg-white"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-xl border border-ze-border bg-white px-[18px] py-[13px] text-[14.5px] font-semibold text-ze-muted transition-colors hover:border-slate-300 hover:text-ze-ink disabled:opacity-40"
            >
              Назад
            </button>
            <button
              onClick={next}
              disabled={!answeredCurrent}
              className={`rounded-xl px-[22px] py-[13px] text-[14.5px] font-semibold text-white transition-colors ${
                answeredCurrent ? "cursor-pointer bg-ze-primary hover:bg-ze-primary-dark" : "cursor-not-allowed bg-[#C3CFE3]"
              }`}
            >
              {step === QUESTIONS.length - 1 ? "Показать варианты" : "Далее"}
            </button>
          </div>
        </div>
      )}

      {done && !submitted && (
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#E9F9F1] text-[19px] font-bold text-emerald-600">
              ✓
            </div>
            <div>
              <div className="text-[17px] font-bold">Подобрали для вас направление</div>
              <div className="mt-0.5 text-[13.5px] text-ze-muted">{summary}</div>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (___) ___ __ __"
              className="min-w-0 flex-1 rounded-xl border border-ze-border bg-ze-surface px-4 py-[15px] text-[15px] text-ze-ink"
            />
            <button
              onClick={handleSubmitPhone}
              disabled={!isValidPhone(phone) || isPending}
              className="flex-none rounded-xl bg-ze-accent px-[22px] py-[15px] text-[15px] font-semibold text-white transition-colors hover:bg-ze-accent-dark disabled:opacity-50"
            >
              {isPending ? "Отправляем…" : "Получить подборку"}
            </button>
          </div>
          <button onClick={reset} className="mt-3.5 text-[13.5px] font-semibold text-ze-muted hover:text-ze-ink">
            Пройти заново
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-6 rounded-2xl bg-[#F5F8FE] p-5 text-center">
          <div className="text-[16px] font-bold">Заявка принята</div>
          <p className="mt-1.5 text-[14px] text-ze-muted">Менеджер свяжется в течение рабочего дня. Можно написать прямо сейчас:</p>
          <a
            href={waUrl(waQuizMessage(fullAnswers))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-ze-whatsapp px-5 py-3 text-[14.5px] font-bold text-white hover:bg-ze-whatsapp-dark"
          >
            Написать в WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
