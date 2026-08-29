import { FadeIn } from "@/components/ui/FadeIn";
import { TEACHER_HIGHLIGHT } from "@/lib/language-data";

export function TeacherHighlight() {
  return (
    <section className="border-y border-[#E7ECF6] bg-[#F8FAFD] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-14">
          <FadeIn className="w-full flex-1">
            <div className="mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-[28px] border border-[#E7ECF6] shadow-[0_20px_50px_rgba(15,27,61,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={TEACHER_HIGHLIGHT.photo}
                alt={TEACHER_HIGHLIGHT.name}
                className="h-full w-full object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="flex-1">
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-[#2880DE]">
              Познакомьтесь с вашим преподавателем
            </div>
            <h2 className="mt-2 text-[26px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[34px]">
              {TEACHER_HIGHLIGHT.name}
            </h2>
            <p className="mt-3 max-w-[440px] text-[15px] leading-relaxed text-slate-600 sm:text-[16.5px]">
              {TEACHER_HIGHLIGHT.quote}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[TEACHER_HIGHLIGHT.experience, TEACHER_HIGHLIGHT.students, TEACHER_HIGHLIGHT.score].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#DDE4F5] bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#0F1B3D]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href="#finder"
              className="mt-7 inline-block rounded-2xl bg-[#2880DE] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(50,85,173,0.24)] transition-colors hover:bg-[#2066B2]"
            >
              Смотреть профиль →
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
