import { FadeIn } from "@/components/ui/FadeIn";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { MEDIA_REEL_ITEMS } from "@/lib/constants";
import { waUrl } from "@/lib/utils";

const INCLUDES = [
  "7 дней путешествия",
  "5 городов",
  "Завтраки",
  "Транспорт",
  "Гид",
  "Экскурсионная программа",
  "Знакомство с университетами",
  "Знакомство с будущими студентами",
] as const;

const PHOTOS = MEDIA_REEL_ITEMS.filter((i) => i.type === "photo").slice(0, 2);

export function TurkeyExperience() {
  return (
    <section className="py-11 sm:py-19 dark:bg-[#0B132B]">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <div className="overflow-hidden rounded-[20px] border border-ze-border bg-ze-surface dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex flex-col sm:flex-row">
              <div className="grid flex-1 grid-cols-2 gap-1 sm:gap-1.5">
                {PHOTOS.map((p) => (
                  <div key={p.id} className="aspect-square overflow-hidden sm:aspect-auto sm:h-full">
                    <CoverPhoto src={p.src} alt={p.label} />
                  </div>
                ))}
              </div>

              <div className="min-w-0 flex-1 p-6.5 sm:p-11">
                <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary dark:text-[#8FD9F5]">
                  Если вы выбираете Турцию
                </div>
                <h2 className="mt-2 text-[22px] font-extrabold leading-snug tracking-tight sm:text-[30px] dark:text-white">
                  Начните знакомство с Турцией ещё до учёбы — родителям дадим тур
                </h2>
                <div className="mt-4 inline-flex items-baseline gap-1.5 rounded-xl bg-white px-4 py-2.5 text-ze-primary shadow-[0_1px_2px_rgba(15,23,42,0.06)] dark:bg-white/10 dark:text-[#8FD9F5]">
                  <span className="text-[19px] font-extrabold">7 дней</span>
                  <span className="text-[13px] font-medium text-ze-muted dark:text-white/60">— 5 городов</span>
                </div>

                <ul className="mt-4.5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13.5px] text-ze-muted dark:text-white/65">
                  {INCLUDES.map((item) => (
                    <li key={item} className="flex items-start gap-1.5">
                      <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-ze-primary" />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-4.5 text-[14px] leading-relaxed text-ze-muted dark:text-white/65">
                  Это не просто туризм — это знакомство со страной и университетами перед началом учёбы.
                </p>

                <a
                  href={waUrl("Здравствуйте! Хочу узнать о программе знакомства с Турцией.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5.5 inline-block rounded-2xl bg-ze-primary px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-ze-primary-dark"
                >
                  Узнать о программе
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
