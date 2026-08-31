import { GraduationCap, BookOpenCheck, PenSquare, ArrowUpRight, MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { LANGUAGE_PATHS } from "@/lib/language-data";
import { waUrl } from "@/lib/utils";

const PATH_STYLE: Record<string, { Icon: typeof GraduationCap; bg: string; text: string; ring: string }> = {
  hsk: { Icon: PenSquare, bg: "bg-[#FDF2E9]", text: "text-[#C2610A]", ring: "group-hover:border-[#F3C08C]" },
  ielts: { Icon: BookOpenCheck, bg: "bg-[#EAF1FF]", text: "text-[#2880DE]", ring: "group-hover:border-[#A9C7F5]" },
  sat: { Icon: GraduationCap, bg: "bg-[#EEF9F2]", text: "text-[#1E8E4E]", ring: "group-hover:border-[#A8DDBB]" },
};

export function LearningPaths() {
  return (
    <section id="paths" className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <div className="max-w-[640px]">
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-[#2880DE]">Направления</div>
            <h2 className="mt-2 text-[26px] font-extrabold tracking-tight text-[#0F1B3D] sm:text-[38px]">
              Три экзамена — одна цель: ваше поступление
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-500 sm:text-[16px]">
              Выберите направление подготовки в зависимости от того, куда вы планируете поступать.
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-11 sm:grid-cols-3">
          {LANGUAGE_PATHS.map((path, i) => {
            const style = PATH_STYLE[path.id];
            const href = path.hasCourse ? "#finder" : waUrl(`Здравствуйте! Интересует подготовка к ${path.exam}.`);
            const external = !path.hasCourse;

            return (
              <FadeIn key={path.id} delay={i * 0.07}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={`group relative flex h-full flex-col gap-4 overflow-hidden rounded-[24px] border border-[#E7ECF6] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,27,61,0.1)] sm:p-7 ${style.ring}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.bg}`}>
                      <style.Icon className={`h-6 w-6 ${style.text}`} strokeWidth={1.75} />
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${style.bg} ${style.text}`}>
                      {path.country}
                    </span>
                  </div>

                  <div>
                    <div className="text-[22px] font-extrabold tracking-tight text-[#0F1B3D]">{path.exam}</div>
                    <div className="mt-0.5 text-[14.5px] font-semibold text-slate-700">{path.title}</div>
                  </div>

                  <p className="flex-1 text-[13.5px] leading-relaxed text-slate-500">{path.description}</p>

                  <span className={`inline-flex w-fit items-center gap-1.5 text-[13.5px] font-semibold ${style.text}`}>
                    {path.hasCourse ? (
                      <>
                        Подобрать курс
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.25} />
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-4 w-4" strokeWidth={2} />
                        Оставить заявку
                      </>
                    )}
                  </span>
                </a>
              </FadeIn>
            );
          })}
        </div>

        <p className="mt-5 text-[13px] text-slate-400">
          Курс с расписанием и преподавателем пока оформлен только для IELTS — по HSK и SAT свяжемся с вами лично и
          подберём формат.
        </p>
      </div>
    </section>
  );
}
