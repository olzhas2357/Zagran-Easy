import { FadeIn } from "@/components/ui/FadeIn";

const TIMELINE = [
  { time: "07:30", title: "Подъём в общежитии", description: "Душ, завтрак, дорога до корпуса" },
  { time: "09:00", title: "Занятия", description: "Лекции, язык или профильные предметы" },
  { time: "12:30", title: "Обед", description: "Столовая кампуса или кафе рядом" },
  { time: "14:00", title: "Практика", description: "Лаборатория, библиотека, проектная работа" },
  { time: "17:30", title: "Свободное время", description: "Спорт, клубы, город, друзья" },
  { time: "21:00", title: "Подготовка", description: "Домашнее задание и план на следующий день" },
];

export function StudentDay() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h2 className="text-2xl font-semibold text-slate-800">Как проходит обычный день студента</h2>

      <ol className="relative mt-10 space-y-8 border-l-2 border-blue-100 pl-6">
        {TIMELINE.map((item, i) => (
          <FadeIn key={item.time} delay={i * 0.05}>
            <li className="relative">
              <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-blue-500 bg-white" />
              <span className="text-sm font-semibold text-blue-600">{item.time}</span>
              <h3 className="mt-0.5 text-sm font-medium text-slate-800">{item.title}</h3>
              <p className="mt-0.5 text-sm text-slate-500">{item.description}</p>
            </li>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}
