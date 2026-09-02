const PHRASES = [
  "Ты всё сможешь",
  "Твоя цель ближе, чем кажется",
  "Начни сегодня",
  "HSK · IELTS · SAT",
  "Результат начинается здесь",
  "Не останавливайся",
  "Dream it. Learn it. Achieve it.",
];

// Лёгкая CSS-анимация без JS (тот же keyframe, что и PhotoMarquee) —
// используется вместо статичной полосы, чтобы страница не выглядела "белой" в этом месте.
export function MotivationMarquee() {
  const doubled = [...PHRASES, ...PHRASES];

  return (
    <section className="relative overflow-hidden bg-[#0B132B] py-8 sm:py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(90deg, rgba(40,128,222,0.35) 0%, rgba(34,211,238,0.28) 40%, rgba(139,127,245,0.32) 75%, rgba(40,128,222,0.35) 100%)",
        }}
      />
      <div className="animate-marquee-paused relative">
        <div
          className="flex w-max flex-none items-center gap-3"
          style={{
            animationName: "marquee-scroll",
            animationDuration: "28s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          {doubled.map((phrase, i) => (
            <div key={i} className="flex flex-none items-center gap-3" aria-hidden={i >= PHRASES.length}>
              <span className="whitespace-nowrap text-[16px] font-bold text-white sm:text-[19px]">{phrase}</span>
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#22D3EE] shadow-[0_0_10px_2px_rgba(34,211,238,0.7)]" />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0B132B] to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0B132B] to-transparent sm:w-32" />
    </section>
  );
}
