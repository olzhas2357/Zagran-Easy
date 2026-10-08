"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { Compass, ArrowLeft, ArrowRight, CheckCircle2, Check } from "lucide-react";
import { createLead } from "@/lib/actions";
import { formatKazakhstanPhone, KAZAKHSTAN_PHONE_START, waUrl, waQuizMessage, isValidPhone } from "@/lib/utils";

/**
 * Each question has a UNIQUE key. Answers are stored in a Record keyed off
 * `typeof QUESTIONS[number]["key"]`, so it's structurally impossible to have
 * two questions silently overwrite the same field (the original bug where
 * two different questions both used `key: "goal"` / `key: "timeline"`).
 */
const QUESTIONS = [
  {
    key: "country",
    q: "В какую страну вы планируете поступать?",
    opts: [
      { label: "Китай", value: "china" },
      { label: "Турция", value: "turkey" },
      { label: "Италия", value: "italy" },
      { label: "США", value: "usa" },
      { label: "Другое", value: "another" },
    ],
  },
  {
    key: "when",
    q: "Когда планируете поступать?",
    opts: [
      { label: "В этом году", value: "В этом году" },
      { label: "В следующем году", value: "В следующем году" },
    ],
  },
  {
    key: "budget",
    q: "Какой бюджет рассматриваете?",
    opts: [
      { label: "До 500 000 ₸", value: "500k" },
      { label: "500 000 — 2 000 000 ₸", value: "500k - 2m" },
      { label: "Более 2 000 000 ₸", value: "more 2m" },
      { label: "Нужна рассрочка", value: "рассрочка" },
    ],
  },
  {
    key: "prepTiming",
    q: "Когда планируете начать подготовку к поступлению? (IELTS, HSK)",
    opts: [
      { label: "В этом месяце", value: "this_month" },
      { label: "Через 1–3 месяца", value: "1_3_months" },
      { label: "Через полгода", value: "6_months" },
      { label: "Пока изучаю варианты", value: "researching" },
    ],
  },
  // {
  //   key: "level",
  //   q: "У нас есть языковой курс по следующим направлениям: IELTS, HSK и свободная разговорная речь. ",
  //   opts: [
  //     { label: "IELTS 5.0–6.5", value: "ielts_5_6.5" },
  //     { label: "HSK 3–5", value: "hsk_3_5" },
  //     { label: "Свободная разговорная речь", value: "conversational" },
  //     { label: "Пока не определился(-лась)", value: "undecided" },
  //   ],
  // },
] as const;

type QuestionKey = (typeof QUESTIONS)[number]["key"];
type Answers = Partial<Record<QuestionKey, string>>;

export function LandingQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [phone, setPhone] = useState(KAZAKHSTAN_PHONE_START);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const done = step >= QUESTIONS.length;
  const current = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  const answeredCurrent = Boolean(answers[current.key]);

  const pick = useCallback(
    (value: string) => {
      setAnswers((a) => ({ ...a, [current.key]: value }));
    },
    [current.key]
  );

  const next = useCallback(() => {
    if (!answers[current.key]) return;
    setStep((s) => Math.min(s + 1, QUESTIONS.length));
  }, [answers, current.key]);

  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const reset = useCallback(() => {
    setStep(0);
    setAnswers({});
    setPhone(KAZAKHSTAN_PHONE_START);
    setSubmitted(false);
    setSubmitError(null);
  }, []);

  // Builds a human-readable summary from whatever was actually answered,
  // instead of hardcoding which fields exist (original code only ever
  // resolved a label for `goal` and printed raw values for the rest).
  const summary = useMemo(
    () =>
      QUESTIONS.map((question) => {
        const value = answers[question.key];
        if (!value) return null;
        return question.opts.find((o) => o.value === value)?.label ?? value;
      })
        .filter(Boolean)
        .join(" · "),
    [answers]
  );

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatKazakhstanPhone(e.target.value));
  }

  function handleSubmitPhone() {
    if (!isValidPhone(phone) || isPending) return;
    setSubmitError(null);
    startTransition(async () => {
      try {
        const result = await createLead({
          source: "quiz",
          service: answers.country ?? "education",
          phone,
          quizAnswers: answers,
        });
        if (!result.success) {
          setSubmitError(result.error ?? "Не получилось отправить заявку. Попробуйте ещё раз.");
          return;
        }
        setSubmitted(true);
      } catch {
        setSubmitError("Не получилось отправить заявку. Проверьте связь и попробуйте ещё раз.");
      }
    });
  }

  function handlePhoneKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmitPhone();
  }

  return (
    <div className="rounded-[24px] border border-ze-border bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:p-9 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-blue-50 dark:bg-white/10">
            <Compass className="h-[22px] w-[22px] text-ze-primary dark:text-[#8FD9F5]" strokeWidth={1.75} />
          </div>
          <h2 className="text-[19px] font-extrabold tracking-tight sm:text-[27px] dark:text-white">Не знаете, что выбрать?</h2>
        </div>
        <div
          className="flex-none rounded-full bg-ze-surface px-3 py-1.5 text-[12.5px] font-semibold text-ze-muted dark:bg-white/10 dark:text-white/60"
          aria-live="polite"
        >
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
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="group" aria-label={current.q}>
            {current.opts.map((opt) => {
              const active = answers[current.key] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => pick(opt.value)}
                  aria-pressed={active}
                  className={`flex items-center gap-3 rounded-2xl border-[1.5px] px-4 py-3.5 text-left text-[15px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ze-primary focus-visible:ring-offset-2 ${
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
              type="button"
              onClick={back}
              disabled={step === 0}
              className="flex items-center gap-1.5 rounded-xl border border-ze-border bg-white px-[18px] py-[13px] text-[14.5px] font-semibold text-ze-muted transition-all duration-200 hover:border-slate-300 hover:text-ze-ink disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60 dark:hover:border-white/25 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Назад
            </button>
            <button
              type="button"
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
              <CheckCircle2 className="h-[22px] w-[22px]" strokeWidth={2} />
            </div>
            <div>
              <div className="text-[17px] font-bold dark:text-white">Подобрали для вас направление</div>
              <div className="mt-0.5 text-[13.5px] text-ze-muted dark:text-white/60">{summary}</div>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <input
              value={phone}
              onChange={handlePhoneChange}
              onKeyDown={handlePhoneKeyDown}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 (___) ___ __ __"
              maxLength={18}
              aria-label="Номер телефона"
              className="min-w-0 flex-1 rounded-xl border border-ze-border bg-ze-surface px-4 py-[15px] text-[15px] text-ze-ink dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30"
            />
            <button
              type="button"
              onClick={handleSubmitPhone}
              disabled={!isValidPhone(phone) || isPending}
              className="flex-none rounded-xl bg-ze-accent px-[22px] py-[15px] text-[15px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-accent-dark disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
            >
              {isPending ? "Отправляем…" : "Получить подборку"}
            </button>
          </div>
          {submitError && (
            <p className="mt-2.5 text-[13.5px] font-medium text-red-600 dark:text-red-400" role="alert">
              {submitError}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-3.5 text-[13.5px] font-semibold text-ze-muted hover:text-ze-ink dark:text-white/50 dark:hover:text-white"
          >
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
          <p className="mt-1.5 text-[14px] text-ze-muted dark:text-white/60">Менеджер свяжется через 5 мин. Можно написать прямо сейчас:</p>
          <a
            href={waUrl(waQuizMessage(answers))}
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
