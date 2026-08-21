import { FadeIn } from "@/components/ui/FadeIn";

const STEPS = [
  { title: "Диагностика", description: "Возраст, образование, оценки, язык, бюджет и цель" },
  { title: "Стратегия", description: "Страна, уровень, язык обучения, грант или платное" },
  { title: "Подбор", description: "3–5 университетов с объяснением плюсов и рисков" },
  { title: "Документы", description: "Переводы, апостиль, анкеты, мотивационное письмо" },
  { title: "Подача", description: "Контроль заявки, сборов, дедлайнов" },
  { title: "Решение", description: "Admission Letter, условия гранта, оплата" },
  { title: "Виза и выезд", description: "Визовый пакет, билеты, подготовка" },
  { title: "Адаптация", description: "Заселение, регистрация, кампус, первые недели" },
];

export function EnrollmentSteps() {
  return (
    <section className="bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold text-slate-800">Путь поступления без неизвестности</h2>
        <p className="mt-2 text-slate-500">
          Каждый этап объяснён так, чтобы родитель и студент понимали что происходит.
        </p>

        {/* Mobile / tablet: vertical stepper */}
        <ol className="relative mt-10 space-y-8 border-l-2 border-blue-100 pl-6 lg:hidden">
          {STEPS.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.1}>
              <li className="relative">
                <span className="absolute -left-[31px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="text-sm font-semibold text-slate-800">
                  Шаг {i + 1}: {step.title}
                </h3>
                <p className="mt-1 text-[13px] text-slate-500">{step.description}</p>
              </li>
            </FadeIn>
          ))}
        </ol>

        {/* Desktop: horizontal stepper */}
        <div className="mt-10 hidden lg:flex lg:items-start">
          {STEPS.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.1} className="flex flex-1 items-start">
              <div className="flex flex-col items-center px-2 text-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-800">{step.title}</h3>
                <p className="mt-1 text-[13px] text-slate-500">{step.description}</p>
              </div>
              {i < STEPS.length - 1 && <div className="mt-4 h-0.5 flex-1 bg-blue-100" />}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
