import { FadeIn } from "@/components/ui/FadeIn";
import { waUrl } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section className="px-4 pb-14 sm:px-10 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[28px] bg-[#2880DE] px-6 py-12 text-center text-white sm:px-14 sm:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-[240px] w-[240px] rounded-full bg-white/8" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-[220px] w-[220px] rounded-full bg-white/6" />
            <h2 className="relative text-[26px] font-extrabold tracking-tight sm:text-[42px]">
              Готовы начать учить язык?
            </h2>
            <p className="relative mx-auto mt-3.5 max-w-[480px] text-[14.5px] leading-relaxed text-white/85 sm:text-[16.5px]">
              Выберите курс, найдите своего преподавателя и сделайте первый шаг к обучению за рубежом.
            </p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <a
                href={waUrl("Здравствуйте! Хочу подобрать языковой курс.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-white px-7 py-4 text-[15.5px] font-semibold text-[#2880DE] transition-colors hover:bg-[#EEF2FB]"
              >
                Подобрать курс →
              </a>
              <a
                href="#teachers"
                className="rounded-2xl border border-white/40 px-7 py-4 text-[15.5px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Посмотреть преподавателей
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
