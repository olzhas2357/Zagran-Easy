import { Star, Users2, Laptop } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

export function LanguageHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F3F6FD] to-white">
      <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-4 py-12 sm:flex-row sm:gap-14 sm:px-10 sm:py-20">
        <div className="min-w-0 flex-1">
          <FadeIn>
            <div className="flex flex-wrap items-center gap-1.5">
              {["HSK", "IELTS", "SAT"].map((exam) => (
                <span
                  key={exam}
                  className="rounded-full border border-[#DDE4F5] bg-white px-3 py-1 text-[12.5px] font-bold text-[#2880DE]"
                >
                  {exam}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-[32px] font-extrabold leading-[1.08] tracking-tight text-balance text-[#0F1B3D] sm:text-[54px]">
              Подготовьтесь к HSK, IELTS или SAT с преподавателем, который поможет достичь результата
            </h1>
            <p className="mt-4 max-w-[540px] text-[15px] leading-relaxed text-slate-600 sm:text-[17.5px]">
              Практические занятия, сильные преподаватели и программа, созданная для тех, кто готовится к
              поступлению в университеты Китая, Турция и других стран.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#paths"
                className="rounded-2xl bg-[#2880DE] px-6 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(50,85,173,0.28)] transition-colors hover:bg-[#2066B2]"
              >
                Выбрать направление →
              </a>
              <a
                href="#teachers"
                className="rounded-2xl border border-[#D9E0F0] bg-white px-[22px] py-4 text-[16px] font-semibold text-[#0F1B3D] transition-colors hover:border-[#2880DE] hover:text-[#2880DE]"
              >
                Посмотреть преподавателей
              </a>
            </div>
            <p className="mt-6 text-[13px] font-medium text-slate-500">
              Онлайн · Индивидуально и в группе · Для начинающих и продолжающих
            </p>
          </FadeIn>
        </div>

        <div className="relative w-full min-w-0 flex-1">
          <FadeIn delay={0.1}>
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[28px] border border-[#E7ECF6] shadow-[0_24px_60px_rgba(15,27,61,0.12)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto:eco,f_auto/v1776028170/a4te_opwrjk.png"
                alt="Преподаватель ZagranEasy на онлайн-занятии"
                className="h-full w-full object-cover"
              />

              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,27,61,0.12)] backdrop-blur-md">
                <Users2 className="h-4 w-4 text-[#2880DE]" strokeWidth={2} />
                <span className="text-[13px] font-bold text-[#0F1B3D]">500+ студентов</span>
              </div>

              <div className="absolute right-4 top-20 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,27,61,0.12)] backdrop-blur-md sm:top-24">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={0} />
                <span className="text-[13px] font-bold text-[#0F1B3D]">4.9 ★ рейтинг</span>
              </div>

              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,27,61,0.12)] backdrop-blur-md">
                <Laptop className="h-4 w-4 text-[#2880DE]" strokeWidth={2} />
                <span className="text-[13px] font-bold text-[#0F1B3D]">Онлайн-занятия</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
