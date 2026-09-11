import { FadeIn } from "@/components/ui/FadeIn";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { MEDIA_REEL_ITEMS } from "@/lib/constants";
import { waUrl } from "@/lib/utils";

const INCLUDES = [
  "Языковой курс",
  "Подбор университета",
  "Подбор образовательной программы",
  "Подготовка документов",
  "Перевод документов",
  "Подача документов",
  "Визовая поддержка",
  "Помощь перед выездом",
  "Поддержка после приезда",
] as const;

const PHOTOS = MEDIA_REEL_ITEMS.filter((i) => i.type === "photo").slice(0, 2);

// const PROGRAM_PRICE = 1_200_000;
// const SUPPORT_PRICE = 850_000;
// const EXTRA_PRICE = 150_000;
// const DISCOUNT = 100_000;

// const TOTAL = PROGRAM_PRICE + SUPPORT_PRICE + EXTRA_PRICE - DISCOUNT;
const TOTAL = 1_790_000;
const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU").format(price);

export function FullOurWork() {
  return (
    <section className="py-11 sm:py-20 dark:bg-[#0B132B]">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <div className="overflow-hidden rounded-[24px] border border-ze-border bg-ze-surface dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex flex-col lg:flex-row">
              {/* Photos */}
              <div className="grid grid-cols-2 gap-1 lg:w-[42%] lg:shrink-0">
                {PHOTOS.map((p) => (
                  <div
                    key={p.id}
                    className="aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[620px]"
                  >
                    <CoverPhoto src={p.src} alt={p.label} />
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 p-6 sm:p-9 lg:p-11">
                {/* Label */}
                <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-ze-primary dark:text-[#8FD9F5]">
                  Полное сопровождение
                </div>

                {/* Heading */}
                <h2 className="mt-2.5 text-[25px] font-extrabold leading-[1.15] tracking-tight text-ze-text sm:text-[32px] dark:text-white">
                  Поступление в Турцию / Италию
                  <br />
                  без лишних забот
                </h2>

                <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ze-muted dark:text-white/60">
                  Мы сопровождаем вас на каждом этапе — от выбора университета
                  до поступления и переезда.
                </p>

                {/* Package */}
                <div className="mt-6 rounded-2xl border border-ze-border bg-white/70 p-4 sm:p-5 dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[16px] font-bold text-ze-text dark:text-white">
                        Пакет «Полное сопровождение»
                      </div>
                      <div className="mt-1 text-[12px] text-ze-muted dark:text-white/50">
                        Всё необходимое для поступления
                      </div>
                    </div>

                    {/* <div className="shrink-0 text-right">
                      <div className="text-[18px] font-extrabold text-ze-primary dark:text-[#8FD9F5]">
                        {formatPrice(TOTAL)} ₸
                      </div>
                    </div> */}
                  </div>

                  {/* Includes */}
                  <ul className="mt-5 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
                    {INCLUDES.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[13px] leading-snug text-ze-muted dark:text-white/65"
                      >
                        <span className="mt-[5px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-ze-primary/10 text-ze-primary">
                          <svg
                            viewBox="0 0 12 12"
                            className="h-2.5 w-2.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="m2.5 6 2.2 2.2L9.5 3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="mt-5 rounded-2xl bg-ze-primary/[0.06] p-4 sm:p-5 dark:bg-white/[0.05]">
                  <div className="space-y-2.5 text-[13.5px]">
                    {/* <div className="flex items-center justify-between gap-4">
                      <span className="text-ze-muted dark:text-white/60">
                        Стоимость программы
                      </span>
                      <span className="font-semibold text-ze-text dark:text-white">
                        {formatPrice(PROGRAM_PRICE)} ₸
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-ze-muted dark:text-white/60">
                        Полное сопровождение
                      </span>
                      <span className="font-semibold text-ze-text dark:text-white">
                        {formatPrice(SUPPORT_PRICE)} ₸
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-ze-muted dark:text-white/60">
                        Дополнительные расходы
                      </span>
                      <span className="font-semibold text-ze-text dark:text-white">
                        {formatPrice(EXTRA_PRICE)} ₸
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-ze-muted dark:text-white/60">
                        Скидка
                      </span>
                      <span className="font-semibold text-ze-primary dark:text-[#8FD9F5]">
                        − {formatPrice(DISCOUNT)} ₸
                      </span>
                    </div> */}
                  </div> 

                  <div className="my-1 h-px bg-ze-border dark:bg-white/10" />

                  {/* Total */}
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      {/* <div className="text-[12px] font-medium text-ze-muted dark:text-white/50">
                        Итоговая стоимость
                      </div> */}
                      <div className="mt-0.5 text-[35px] font-extrabold tracking-tight text-ze-text dark:text-white sm:text-[29px]">
                        {formatPrice(TOTAL)} ₸
                      </div>
                    </div>

                    <div className="rounded-full bg-ze-primary/10 px-3 py-1.5 text-[11px] font-bold text-ze-primary dark:bg-[#8FD9F5]/10 dark:text-[#8FD9F5]">
                      Всё включено
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={waUrl(
                      "Здравствуйте! Хочу узнать подробнее о полном сопровождении поступления в Турцию и получить расчёт стоимости."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl bg-ze-primary px-6 py-3.5 text-[14px] font-bold text-white transition-all hover:bg-ze-primary-dark hover:shadow-lg active:scale-[0.98]"
                  >
                    Получить расчёт стоимости
                  </a>

                  <span className="text-center text-[11px] leading-relaxed text-ze-muted sm:text-left dark:text-white/45">
                    Финальная стоимость зависит
                    <br className="hidden sm:block" />
                    от выбранной программы
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}