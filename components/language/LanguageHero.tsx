import { Star, Users2, Laptop } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

export function LanguageHero() {
  return (
    <section className="relative overflow-hidden bg-[#F5F8FF] dark:bg-[#0B132B]">
      <div
        className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl dark:opacity-25"
        style={{ background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-[360px] w-[360px] rounded-full opacity-15 blur-3xl dark:opacity-20"
        style={{ background: "radial-gradient(circle, #8B7FF5 0%, transparent 70%)" }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-4 py-12 sm:flex-row sm:gap-14 sm:px-10 sm:py-20">
        <div className="min-w-0 flex-1">
          <FadeIn>
            <div className="flex flex-wrap items-center gap-1.5">
              {["HSK", "IELTS"].map((exam) => (
                <span
                  key={exam}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[12.5px] font-bold text-blue-700 dark:border-white/15 dark:bg-white/[0.06] dark:text-[#8FD9F5]"
                >
                  {exam}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-[32px] font-extrabold leading-[1.08] tracking-tight text-balance text-ze-ink sm:text-[54px] dark:text-white">
              Подготовьтесь к HSK, IELTS с преподавателем, который поможет достичь результата
            </h1>
            <p className="mt-4 max-w-[540px] text-[15px] leading-relaxed text-slate-600 sm:text-[17.5px] dark:text-white/65">
              Практические занятия, сильные преподаватели и программа, созданная для тех, кто готовится к
              поступлению в университеты Китая, Турция и других стран.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#paths"
                className="rounded-2xl bg-gradient-to-r from-[#2880DE] to-[#22D3EE] px-6 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(34,211,238,0.28)] transition-all hover:shadow-[0_0_0_6px_rgba(34,211,238,0.18)]"
              >
                Выбрать направление →
              </a>
              <a
                href="#teachers"
                className="rounded-2xl border border-slate-200 px-[22px] py-4 text-[16px] font-semibold text-ze-ink transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/5"
              >
                Посмотреть преподавателей
              </a>
            </div>
            <p className="mt-6 text-[13px] font-medium text-slate-500 dark:text-white/45">
              Онлайн · Индивидуально и в группе · Для начинающих и продолжающих
            </p>
          </FadeIn>
        </div>

        <div className="relative w-full min-w-0 flex-1">
          <FadeIn delay={0.1}>
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[28px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:border-white/10 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://fzvkmnlcrdfxjnqepxrs.supabase.co/storage/v1/object/sign/images/fd23b150-a5a9-4737-8e00-ebbe4d86e54f.png?token=eyJraWQiOiIwY2UyMDkwNi0zZjc3LTRhYTUtYTAyYi0yMGExY2Q5ZjI5ZjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvZmQyM2IxNTAtYTVhOS00NzM3LThlMDAtZWJiZTRkODZlNTRmLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODk2NTA3NTEsImV4cCI6MTgyMTE4Njc1MX0.2HUhTSuLR3WY81Q0DXpLnFAOaUmrPFzmdrzjw_S2u8E"
                alt="Преподаватель ZagranEasy на онлайн-занятии"
                className="h-full w-full object-cover"
              />

              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.1)] backdrop-blur-md dark:border-white/15 dark:bg-[#0B132B]/80 dark:shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
                <Users2 className="h-4 w-4 text-[#2880DE]" strokeWidth={2} />
                <span className="text-[13px] font-bold text-ze-ink dark:text-white">500+ студентов</span>
              </div>

              <div className="absolute right-4 top-20 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.1)] backdrop-blur-md dark:border-white/15 dark:bg-[#0B132B]/80 dark:shadow-[0_8px_20px_rgba(0,0,0,0.35)] sm:top-24">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={0} />
                <span className="text-[13px] font-bold text-ze-ink dark:text-white">4.9 ★ рейтинг</span>
              </div>

              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.1)] backdrop-blur-md dark:border-white/15 dark:bg-[#0B132B]/80 dark:shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
                <Laptop className="h-4 w-4 text-[#2880DE]" strokeWidth={2} />
                <span className="text-[13px] font-bold text-ze-ink dark:text-white">Онлайн-занятия</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
