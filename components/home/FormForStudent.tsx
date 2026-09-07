"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { GraduationCap, ArrowLeft, ArrowRight, CheckCircle2, Check, Sparkles } from "lucide-react";
import { createLead } from "@/lib/actions";
import { waUrl, isValidPhone } from "@/lib/utils";

/**
 * Field keys are unique by construction (derived from STEPS itself below),
 * so two questions can never silently overwrite the same answer.
 */
type FieldKey =
  | "name"
  | "studyFor"
  | "applicantAge"
  | "applicantCity"
  | "profession"
  | "experience"
  | "citiesReason";

type Answers = Partial<Record<FieldKey, string>>;

type Option = { label: string; value: string };

type SelectStep = {
  type: "select";
  key: FieldKey;
  question: string;
  options: Option[];
};

type ChipsOrTextStep = {
  type: "chipsOrText";
  key: FieldKey;
  question: string;
  hint?: string;
  options: Option[];
  otherValue: string; // the option value that reveals the free-text input
  placeholder: string;
};

type TextStep = {
  type: "text";
  key: FieldKey;
  question: string;
  placeholder: string;
  validate: (v: string) => boolean;
};

type NumberStep = {
  type: "number";
  key: FieldKey;
  question: string;
  placeholder: string;
  min: number;
  max: number;
};

type TextareaStep = {
  type: "textarea";
  key: FieldKey;
  question: string;
  hint?: string;
  placeholder: string;
  validate: (v: string) => boolean;
};

type IntroStep = {
  type: "intro";
  key: "caseIntro";
  title: string;
  description: string;
};

type Step = SelectStep | ChipsOrTextStep | TextStep | NumberStep | TextareaStep | IntroStep;

const isAnswerable = (step: Step): step is Exclude<Step, IntroStep> => step.type !== "intro";

const STEPS: Step[] = [
  {
    type: "text",
    key: "name",
    question: "Как вас зовут?",
    placeholder: "Имя",
    validate: (v) => v.trim().length >= 2,
  },
  {
    type: "select",
    key: "studyFor",
    question: "Для кого рассматриваете учёбу?",
    options: [
      { label: "Для себя", value: "self" },
      { label: "Для ребёнка", value: "child" },
      { label: "Для другого родственника", value: "relative" },
    ],
  },
  {
    type: "number",
    key: "applicantAge",
    question: "Сколько поступающему лет?",
    placeholder: "Возраст",
    min: 5,
    max: 60,
  },
  {
    type: "text",
    key: "applicantCity",
    question: "С какого вы (поступающий) города?",
    placeholder: "Город",
    validate: (v) => v.trim().length >= 2,
  },
  {
    type: "intro",
    key: "caseIntro",
    title: "Подбор кейса",
    description: "Осталось 3 вопроса — они помогут подобрать программу и страну под конкретную ситуацию.",
  },
  {
    type: "chipsOrText",
    key: "profession",
    question: "Какую профессию рассматриваете?",
    options: [
      { label: "IT / Инженерия", value: "it_engineering" },
      { label: "Медицина", value: "medicine" },
      { label: "Экономика / Бизнес", value: "business" },
      { label: "Творческие профессии", value: "creative" },
      { label: "Другое", value: "other" },
    ],
    otherValue: "other",
    placeholder: "Укажите профессию",
  },
  {
    type: "select",
    key: "experience",
    question: "Есть опыт по вашей профессии?",
    options: [
      { label: "Да, есть опыт", value: "has_experience" },
      { label: "Немного, менее года", value: "little_experience" },
      { label: "Нет, начинаю с нуля", value: "no_experience" },
    ],
  },
  {
    type: "textarea",
    key: "citiesReason",
    question: "Какие города рассматриваете и почему?",
    hint: "Например: климат, стоимость жизни, наличие диаспоры, конкретный вуз",
    placeholder: "Напишите город(а) и что для вас важно при выборе",
    validate: (v) => v.trim().length >= 3,
  },
];

const QUESTION_STEPS = STEPS.filter(isAnswerable);

function buildWhatsAppMessage(answers: Answers): string {
  const studyForLabel = (STEPS.find((s) => s.key === "studyFor") as SelectStep | undefined)?.options.find(
    (o) => o.value === answers.studyFor
  )?.label;
  const experienceLabel = (STEPS.find((s) => s.key === "experience") as SelectStep | undefined)?.options.find(
    (o) => o.value === answers.experience
  )?.label;
  const professionOptions = (STEPS.find((s) => s.key === "profession") as ChipsOrTextStep | undefined)?.options;
  const professionLabel =
    answers.profession && professionOptions?.find((o) => o.value === answers.profession)?.label;

  const lines = [
    "Здравствуйте! Заполнил(а) анкету на сайте.",
    answers.name && `Имя: ${answers.name}`,
    studyForLabel && `Учёба для: ${studyForLabel}`,
    answers.applicantAge && `Возраст поступающего: ${answers.applicantAge}`,
    answers.applicantCity && `Город: ${answers.applicantCity}`,
    // profession is either a chip label or free text typed into "Другое"
    (professionLabel && professionLabel !== "Другое" ? professionLabel : answers.profession) &&
      `Профессия: ${professionLabel && professionLabel !== "Другое" ? professionLabel : answers.profession}`,
    experienceLabel && `Опыт: ${experienceLabel}`,
    answers.citiesReason && `Города и почему: ${answers.citiesReason}`,
  ].filter(Boolean);

  return lines.join("\n");
}

export function FormStudent() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [otherProfession, setOtherProfession] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const done = step >= STEPS.length;
  const current = STEPS[Math.min(step, STEPS.length - 1)];

  const answeredCurrent = useMemo(() => {
    if (current.type === "intro") return true;
    const value = answers[current.key];
    switch (current.type) {
      case "select":
        return Boolean(value);
      case "chipsOrText":
        if (!value) return false;
        if (value === current.otherValue) return otherProfession.trim().length >= 2;
        return true;
      case "text":
        return value !== undefined && current.validate(value);
      case "number": {
        if (!value) return false;
        const n = Number(value);
        return Number.isFinite(n) && n >= current.min && n <= current.max;
      }
      case "textarea":
        return value !== undefined && current.validate(value);
      default:
        return false;
    }
  }, [current, answers, otherProfession]);

  const setAnswer = useCallback((key: FieldKey, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  }, []);

  function pickChipsOrText(opt: Option) {
    if (current.type !== "chipsOrText") return;
    if (opt.value === current.otherValue) {
      setAnswer(current.key, opt.value);
    } else {
      setOtherProfession("");
      setAnswer(current.key, opt.value);
    }
  }

  function handleOtherProfessionChange(v: string) {
    setOtherProfession(v);
    if (current.type === "chipsOrText") setAnswer(current.key, current.otherValue);
  }

  const next = useCallback(() => {
    if (!answeredCurrent) return;
    // resolve "Другое" chip into the actual typed profession before moving on
    if (current.type === "chipsOrText" && answers[current.key] === current.otherValue) {
      setAnswers((a) => ({ ...a, [current.key]: current.otherValue }));
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  }, [answeredCurrent, current, answers]);

  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const reset = useCallback(() => {
    setStep(0);
    setAnswers({});
    setOtherProfession("");
    setPhone("");
    setSubmitted(false);
    setSubmitError(null);
  }, []);

  const summary = useMemo(
    () =>
      QUESTION_STEPS.map((s) => {
        const value = answers[s.key];
        if (!value) return null;
        if (s.type === "select" || s.type === "chipsOrText") {
          const label = s.options.find((o) => o.value === value)?.label;
          if (s.type === "chipsOrText" && value === s.otherValue) {
            return otherProfession.trim() || null;
          }
          return label ?? value;
        }
        return value;
      })
        .filter(Boolean)
        .join(" · "),
    [answers, otherProfession]
  );

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(e.target.value.replace(/[^\d+]/g, "").slice(0, 16));
  }

  function handleSubmitPhone() {
    if (!isValidPhone(phone) || isPending) return;
    setSubmitError(null);
    // profession sent to the backend as typed text when "Другое" was picked
    const finalAnswers: Answers = {
      ...answers,
      profession: answers.profession === "other" ? otherProfession.trim() : answers.profession,
    };
    startTransition(async () => {
      try {
        const result = await createLead({
          source: "quiz",
          service: finalAnswers.profession ?? "education",
          phone,
          quizAnswers: { ...finalAnswers, formType: "student_form" },
        });
        if (!result.success) {
          setSubmitError(result.error ?? "Не получилось отправить анкету. Попробуйте ещё раз.");
          return;
        }
        setSubmitted(true);
      } catch {
        setSubmitError("Не получилось отправить анкету. Проверьте связь и попробуйте ещё раз.");
      }
    });
  }

  function handlePhoneKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmitPhone();
  }

  const questionIndex = QUESTION_STEPS.findIndex((s) => s.key === current.key);

  return (
    <div className="rounded-[24px] border border-ze-border bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:p-9 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-blue-50 dark:bg-white/10">
            <GraduationCap className="h-[22px] w-[22px] text-ze-primary dark:text-[#8FD9F5]" strokeWidth={1.75} />
          </div>
          <h2 className="text-[19px] font-extrabold tracking-tight sm:text-[27px] dark:text-white">Анкета абитуриента</h2>
        </div>
        <div
          className="flex-none rounded-full bg-ze-surface px-3 py-1.5 text-[12.5px] font-semibold text-ze-muted dark:bg-white/10 dark:text-white/60"
          aria-live="polite"
        >
          {done ? "Готово" : `Шаг ${questionIndex + 1} из ${QUESTION_STEPS.length}`}
        </div>
      </div>

      <div className="mt-5 flex gap-1.5">
        {QUESTION_STEPS.map((s, i) => (
          <div key={s.key} className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEF1F6] dark:bg-white/10">
            <div
              className={`h-full rounded-full bg-ze-primary transition-all duration-500 ease-out dark:bg-[#8FD9F5] ${
                i < questionIndex || done ? "w-full" : i === questionIndex ? "w-1/2" : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      {!done && current.type === "intro" && (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-ze-border/70 bg-ze-surface p-5 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-50 text-ze-primary dark:bg-white/10 dark:text-[#8FD9F5]">
            <Sparkles className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <div className="text-[17px] font-bold dark:text-white">{current.title}</div>
            <p className="mt-1 text-[14px] text-ze-muted dark:text-white/60">{current.description}</p>
          </div>
          <button
            type="button"
            onClick={next}
            className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-ze-primary px-[22px] py-[13px] text-[14.5px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-primary-dark"
          >
            Продолжить
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      )}

      {!done && current.type !== "intro" && (
        <div className="mt-6">
          <div className="text-[17px] font-bold tracking-tight sm:text-[20px] dark:text-white">{current.question}</div>
          {"hint" in current && current.hint && (
            <p className="mt-1 text-[13.5px] text-ze-muted dark:text-white/50">{current.hint}</p>
          )}

          <div className="mt-4">
            {current.type === "select" && (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="group" aria-label={current.question}>
                {current.options.map((opt) => {
                  const active = answers[current.key] === opt.value;
                  return (
                    <OptionButton key={opt.value} label={opt.label} active={active} onClick={() => setAnswer(current.key, opt.value)} />
                  );
                })}
              </div>
            )}

            {current.type === "chipsOrText" && (
              <div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="group" aria-label={current.question}>
                  {current.options.map((opt) => {
                    const active = answers[current.key] === opt.value;
                    return <OptionButton key={opt.value} label={opt.label} active={active} onClick={() => pickChipsOrText(opt)} />;
                  })}
                </div>
                {answers[current.key] === current.otherValue && (
                  <input
                    autoFocus
                    value={otherProfession}
                    onChange={(e) => handleOtherProfessionChange(e.target.value)}
                    placeholder={current.placeholder}
                    className="mt-3 w-full rounded-xl border border-ze-border bg-ze-surface px-4 py-[13px] text-[15px] text-ze-ink dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30"
                  />
                )}
              </div>
            )}

            {current.type === "text" && (
              <input
                value={answers[current.key] ?? ""}
                onChange={(e) => setAnswer(current.key, e.target.value)}
                placeholder={current.placeholder}
                aria-label={current.question}
                className="w-full rounded-xl border border-ze-border bg-ze-surface px-4 py-[13px] text-[15px] text-ze-ink dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30"
              />
            )}

            {current.type === "number" && (
              <input
                type="number"
                inputMode="numeric"
                min={current.min}
                max={current.max}
                value={answers[current.key] ?? ""}
                onChange={(e) => setAnswer(current.key, e.target.value)}
                placeholder={current.placeholder}
                aria-label={current.question}
                className="w-full rounded-xl border border-ze-border bg-ze-surface px-4 py-[13px] text-[15px] text-ze-ink dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30"
              />
            )}

            {current.type === "textarea" && (
              <textarea
                value={answers[current.key] ?? ""}
                onChange={(e) => setAnswer(current.key, e.target.value)}
                placeholder={current.placeholder}
                aria-label={current.question}
                rows={3}
                className="w-full resize-none rounded-xl border border-ze-border bg-ze-surface px-4 py-[13px] text-[15px] text-ze-ink dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30"
              />
            )}
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
              {questionIndex === QUESTION_STEPS.length - 1 ? "Показать варианты" : "Далее"}
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
              <div className="text-[17px] font-bold dark:text-white">Анкета заполнена</div>
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
              aria-label="Номер телефона"
              className="min-w-0 flex-1 rounded-xl border border-ze-border bg-ze-surface px-4 py-[15px] text-[15px] text-ze-ink dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30"
            />
            <button
              type="button"
              onClick={handleSubmitPhone}
              disabled={!isValidPhone(phone) || isPending}
              className="flex-none rounded-xl bg-ze-accent px-[22px] py-[15px] text-[15px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-accent-dark disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
            >
              {isPending ? "Отправляем…" : "Отправить анкету"}
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
            Заполнить заново
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-6 rounded-2xl border border-ze-border/70 bg-ze-surface p-6 text-center dark:border-white/10 dark:bg-white/[0.04]">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#E9F9F1] text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="mt-3 text-[16px] font-bold dark:text-white">Анкета принята</div>
          <p className="mt-1.5 text-[14px] text-ze-muted dark:text-white/60">Менеджер свяжется через 5 мин. Можно написать прямо сейчас:</p>
          <a
            href={waUrl(buildWhatsAppMessage({ ...answers, profession: answers.profession === "other" ? otherProfession.trim() : answers.profession }))}
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

function OptionButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-3 rounded-2xl border-[1.5px] px-4 py-3.5 text-left text-[15px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ze-primary focus-visible:ring-offset-2 ${
        active
          ? "border-ze-primary bg-[#F3F7FF] text-ze-primary shadow-[0_4px_14px_rgba(26,86,219,0.12)] dark:border-[#8FD9F5] dark:bg-white/10 dark:text-[#8FD9F5] dark:shadow-none"
          : "border-ze-border bg-white text-ze-ink hover:-translate-y-0.5 hover:border-[#B9C8E8] hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:border-white/25 dark:hover:shadow-none"
      }`}
    >
      <span className="flex-1">{label}</span>
      <span
        className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-[1.5px] transition-colors ${
          active ? "border-ze-primary bg-ze-primary dark:border-[#8FD9F5] dark:bg-[#8FD9F5]" : "border-[#D3DBE7] bg-white dark:border-white/25 dark:bg-transparent"
        }`}
      >
        {active && <Check className="h-3 w-3 text-white dark:text-[#0B132B]" strokeWidth={3} />}
      </span>
    </button>
  );
}