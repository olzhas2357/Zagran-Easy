import { FadeIn } from "@/components/ui/FadeIn";

const STEPS = [
  { n: "01", title: "Консультация", text: "Определяем цели, интересы и подходящие варианты обучения." },
  { n: "02", title: "Выбор университета", text: "Подбираем университет и программу под цели студента." },
  { n: "03", title: "Поступление", text: "Помогаем подготовить документы и пройти процесс поступления." },
  { n: "04", title: "Переезд", text: "Помогаем подготовиться к переезду и первым дням в новой стране." },
  { n: "05", title: "Заселение", text: "Помогаем с размещением в общежитии в первый год." },
  { n: "06", title: "Адаптация", text: "Помогаем студенту освоиться и решить первые организационные вопросы." },
  { n: "07", title: "Поддержка во время обучения", text: "Остаёмся на связи и помогаем на протяжении всего обучения." },
  { n: "08", title: "Поддержка", text: "Во время обучения помогаем найти дополнительный заработок." },
] as const;

export function StudentJourney() {
  return (
    <section className="py-11 sm:py-19">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <div className="max-w-[640px]">
            <h2 className="text-[25px] font-extrabold tracking-tight sm:text-[36px]">
              Полное сопровождение студента
            </h2>
            <p className="mt-3.5 text-[15px] leading-relaxed text-ze-muted sm:text-[16.5px]">
              Мы рядом на каждом этапе — от первой консультации до первых шагов в карьере.
            </p>
          </div>
        </FadeIn>

        {/* Мобильная версия — вертикальная линия */}
        <div className="mt-8 flex flex-col gap-6 sm:hidden">
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.04}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ze-primary text-[13px] font-bold text-white">
                    {s.n}
                  </div>
                  {i < STEPS.length - 1 && <div className="mt-1 w-px flex-1 bg-ze-border" />}
                </div>
                <div className="pb-2">
                  <div className="text-[15px] font-semibold">{s.title}</div>
                  <div className="mt-1 text-[13.5px] leading-snug text-ze-muted">{s.text}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Десктоп — горизонтальная линия, 4 колонки x 2 ряда */}
        <div className="mt-10 hidden sm:grid sm:grid-cols-4 sm:gap-x-6 sm:gap-y-10">
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={(i % 4) * 0.06}>
              <div className="relative pt-5">
                <div
                  className={`absolute left-0 right-0 top-0 h-px ${i % 4 === 0 ? "left-4" : ""} ${
                    i % 4 === 3 ? "right-4" : ""
                  } bg-ze-border`}
                />
                <div className="absolute -top-[15px] left-0 flex h-8 w-8 items-center justify-center rounded-full bg-ze-primary text-[12px] font-bold text-white">
                  {s.n}
                </div>
                <div className="mt-3 text-[15px] font-semibold">{s.title}</div>
                <div className="mt-1.5 text-[13px] leading-snug text-ze-muted">{s.text}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
