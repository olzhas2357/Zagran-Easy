import { FadeIn } from "@/components/ui/FadeIn";
import { waUrl } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section className="bg-[#F5F8FF] px-4 pb-14 pt-10 sm:px-10 sm:pb-20 sm:pt-14 dark:bg-[#0B132B]">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[28px] px-6 py-12 text-center text-white sm:px-14 sm:py-16" style={{ background: "linear-gradient(135deg, #123fa6 0%, #0B3B8C 40%, #0E7FAE 75%, #123fa6 100%)" }}>
            <div className="pointer-events-none absolute -right-16 -top-16 h-[240px] w-[240px] rounded-full bg-[#22D3EE]/25 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-[220px] w-[220px] rounded-full bg-[#8B7FF5]/20 blur-2xl" />
            <h2 className="relative text-[26px] font-extrabold tracking-tight sm:text-[42px]">
              Готовы начать учить язык?
            </h2>
            <p className="relative mx-auto mt-3.5 max-w-[480px] text-[14.5px] leading-relaxed text-white/85 sm:text-[16.5px]">
              Выберите курс, найдите своего преподавателя и сделайте первый шаг к обучению за рубежом.
            </p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <a
                href={waUrl("Здравствуйте! Хочу подобрать языковой курс и записаться на пробный урок.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-white px-7 py-4 text-[15.5px] font-semibold text-[#2880DE] shadow-[0_0_0_0_rgba(34,211,238,0)] transition-all hover:bg-[#EEF2FB] hover:shadow-[0_0_0_6px_rgba(34,211,238,0.22)]"
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
