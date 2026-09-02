import { ArrowUpRight, MessageCircle, Check } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_PATHS, LANGUAGE_COURSES } from "@/lib/language-data";
import { waUrl } from "@/lib/utils";

// Единая сине-неоновая палитра: все три направления — оттенки синего/голубого/фиолетового,
// чтобы карточки чувствовались частью одной системы, а не тремя разными стилями.
// badgeClass — светлые тона self.text/soft читаемы только на тёмном фоне, поэтому
// для бейджа и акцентной ссылки цвет задаётся классами (light + dark:), а не inline-style.
const PATH_STYLE: Record<string, { gradient: string; glow: string; badgeClass: string; linkClass: string; label: string }> = {
  hsk: {
    gradient: "linear-gradient(135deg, #2880DE 0%, #8B7FF5 100%)",
    glow: "rgba(139,127,245,0.45)",
    badgeClass: "bg-purple-50 text-purple-700 dark:bg-white/10 dark:text-[#C9C2FF]",
    linkClass: "text-purple-700 dark:text-[#C9C2FF]",
    label: "汉",
  },
  ielts: {
    gradient: "linear-gradient(135deg, #3B93F5 0%, #123fa6 100%)",
    glow: "rgba(34,211,238,0.45)",
    badgeClass: "bg-sky-50 text-sky-700 dark:bg-white/10 dark:text-[#8FD9F5]",
    linkClass: "text-sky-700 dark:text-[#8FD9F5]",
    label: "En",
  },
  sat: {
    gradient: "linear-gradient(135deg, #3B6DF0 0%, #C026D3 100%)",
    glow: "rgba(192,38,212,0.4)",
    badgeClass: "bg-fuchsia-50 text-fuchsia-700 dark:bg-white/10 dark:text-[#E3A9F0]",
    linkClass: "text-fuchsia-700 dark:text-[#E3A9F0]",
    label: "US",
  },
};

export function LearningPaths() {
  const hsk = LANGUAGE_PATHS.find((p) => p.id === "hsk")!;
  const others = LANGUAGE_PATHS.filter((p) => p.id !== "hsk");
  const hskCourse = LANGUAGE_COURSES.find((c) => c.id === "hsk");

  return (
    <section
      id="paths"
      className="relative overflow-hidden bg-[#F5F8FF] py-14 sm:py-20 dark:bg-[#0B132B]"
    >
      <div
        className="pointer-events-none absolute -left-24 top-10 h-[360px] w-[360px] rounded-full opacity-15 blur-3xl dark:opacity-30"
        style={{ background: "radial-gradient(circle, #8B7FF5 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-[320px] w-[320px] rounded-full opacity-15 blur-3xl dark:opacity-25"
        style={{ background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <div className="flex items-end justify-between gap-6">
            <h2 className="max-w-[560px] text-[26px] font-extrabold tracking-tight text-ze-ink sm:text-[38px] dark:text-white">
              Три экзамена — одна цель: ваше поступление
            </h2>
            <p className="hidden max-w-[280px] text-right text-[13.5px] leading-relaxed text-slate-600 sm:block dark:text-white/60">
              Выберите направление в зависимости от того, куда вы планируете поступать.
            </p>
          </div>
        </FadeIn>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:mt-11 lg:grid-cols-[1.3fr_1fr]">
          {/* HSK — spotlighted because it's the primary path */}
          <FadeIn>
            <a
              href="#finder"
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] p-7 text-white shadow-[0_20px_50px_rgba(4,12,40,0.45)] transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(139,127,245,0.4)] sm:p-9"
              style={{ background: PATH_STYLE.hsk.gradient }}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-30 blur-2xl"
                style={{ background: "#8B7FF5" }}
              />
              <div className="relative flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11.5px] font-bold">
                    {hsk.country}
                  </span>
                  <div className="mt-4 text-[30px] font-extrabold tracking-tight sm:text-[40px]">{hsk.exam}</div>
                  <div className="mt-1 text-[15px] font-semibold text-white/85">{hsk.title}</div>
                </div>
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-white/15 text-[19px] font-extrabold">
                  {PATH_STYLE.hsk.label}
                </span>
              </div>

              <p className="relative mt-5 max-w-[420px] text-[14px] leading-relaxed text-white/80">
                {hsk.description}
              </p>

              <div className="relative mt-6 flex flex-wrap items-center gap-2.5 border-t border-white/15 pt-5">
                {hskCourse && (
                  <>
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold">
                      {hskCourse.level}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold">
                      {hskCourse.duration}
                    </span>
                  </>
                )}
                <span className="ml-auto inline-flex items-center gap-1.5 text-[14.5px] font-bold">
                  Подобрать курс
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
                </span>
              </div>
            </a>
          </FadeIn>

          {/* IELTS + SAT — side cards with WhatsApp action */}
          <div className="grid grid-cols-1 gap-5">
            {others.map((path, i) => {
              const style = PATH_STYLE[path.id];
              return (
                <FadeIn key={path.id} delay={0.08 + i * 0.06}>
                  <a
                    href={waUrl(`Здравствуйте! Интересует подготовка к ${path.exam}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-full items-start gap-4 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_20px_44px_var(--glow)] dark:border-white/12 dark:bg-white/[0.06] dark:backdrop-blur-sm dark:hover:border-white/25 dark:hover:bg-white/[0.09]"
                    style={{ ["--glow" as string]: style.glow }}
                  >
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 h-1"
                      style={{ background: style.gradient }}
                    />
                    <span
                      className="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-[14px] font-extrabold text-white"
                      style={{ background: style.gradient }}
                    >
                      {style.label}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[19px] font-extrabold tracking-tight text-ze-ink dark:text-white">{path.exam}</div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style.badgeClass}`}>
                          {path.country}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600 dark:text-white/65">{path.description}</p>
                      <span className={`mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold ${style.linkClass}`}>
                        <MessageCircle className="h-4 w-4" strokeWidth={2} />
                        Оставить заявку
                      </span>
                    </div>
                  </a>
                </FadeIn>
              );
            })}

            <FadeIn delay={0.2}>
              <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[12.5px] leading-relaxed text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/60">
                <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-purple-600 dark:text-[#C9C2FF]" strokeWidth={2.5} />
                Курс с расписанием и преподавателем сейчас оформлен только для HSK — по IELTS и SAT свяжемся с вами
                лично и подберём формат.
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}