import Link from "next/link";
import {
  GraduationCap,
  User,
  Landmark,
  Stamp,
  Home as HomeIcon,
  MessageCircle,
  Calendar,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";
import { fetchAllUniversities, fetchEducationCountries, fetchReviews, fetchTours } from "@/lib/data";
import { formatDuration, formatPrice, waUrl } from "@/lib/utils";
import { STATS, ABOUT, MEDIA_REEL_ITEMS, SERVICE_COLORS, HERO_COLLAGE, ACCEPTANCE_LETTER_PHOTOS, CAMPUS_LIFE_PHOTOS } from "@/lib/constants";
import { FadeIn } from "@/components/ui/FadeIn";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { TiltCard } from "@/components/ui/TiltCard";
import { FloatingPhoto } from "@/components/ui/FloatingPhoto";
import { FloatingBadge } from "@/components/ui/FloatingBadge";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { GradientSpots } from "@/components/ui/GradientSpots";
import { PhotoMarquee } from "@/components/ui/PhotoMarquee";
import { LandingQuiz } from "@/components/home/LandingQuiz";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { HeroCelebration } from "@/components/home/HeroCelebration";
import { MediaReel } from "@/components/home/MediaReel";
import { StudentJourney } from "@/components/home/StudentJourney";
import { TurkeyExperience } from "@/components/home/TurkeyExperience";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default async function HomePage() {
  const [countries, universities, reviews, tours] = await Promise.all([
    fetchEducationCountries(),
    fetchAllUniversities(),
    fetchReviews(),
    fetchTours(),
  ]);

  const universityCountByCountry = new Map<string, number>();
  for (const u of universities) {
    universityCountByCountry.set(u.countryId, (universityCountByCountry.get(u.countryId) || 0) + 1);
  }
  const cheapestByCountry = new Map<string, number>();
  for (const u of universities) {
    const cur = cheapestByCountry.get(u.countryId);
    if (cur === undefined || u.tuitionFrom < cur) cheapestByCountry.set(u.countryId, u.tuitionFrom);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ze-border bg-gradient-to-b from-[#F4F7FD] to-white">
        <GradientSpots variant="hero" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-14 sm:flex-row sm:gap-14 sm:px-10 sm:py-20">
          <div className="min-w-0 flex-1">
            <h1 className="mt-4.5 text-[35px] font-extrabold leading-[1.05] tracking-tight text-balance sm:text-[60px]">
              Поступление за рубеж —
              <br />
              <span className="text-[#3255ad]">проще, чем кажется</span>
            </h1>
            <p className="mt-4 max-w-[520px] text-[15.5px] leading-relaxed text-ze-muted sm:text-[19px]">
              Помогаем выбрать университет, поступить, переехать и оставаться рядом на протяжении всего
              образовательного пути.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href={waUrl("Здравствуйте! Хочу получить консультацию.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-ze-accent px-6 py-4 text-[16px] font-semibold text-white shadow-[0_6px_18px_rgba(26,86,219,0.28)] transition-colors hover:bg-ze-accent-dark"
              >
                Получить консультацию
              </a>
              <Link
                href="/education"
                className="rounded-2xl border border-[#DDE4F0] bg-white px-[22px] py-4 text-[16px] font-semibold text-ze-ink transition-colors hover:border-ze-primary hover:text-ze-primary"
              >
                Посмотреть университеты
              </Link>
            </div>
            <div className="mt-10.5 flex items-center gap-1.5 text-[13.5px] text-ze-muted">
              <div className="flex">
                <div className="h-10 w-10 rounded-full border-2 border-white bg-[#DCE6FA]" />
                <div className="-ml-2.5 h-7 w-7 rounded-full border-2 border-white bg-[#C7D8F7]" />
                <div className="-ml-2.5 h-7 w-7 rounded-full border-2 border-white bg-[#B0C9F4]" />
              </div>
              3&nbsp;200+ клиентов уже уехали с нами
            </div>
          </div>

          {/* Плавающий фото-коллаж */}
          <div className="relative w-full min-w-0 flex-1">
            <div className="relative aspect-4/3 max-w-lg mx-auto">
              
              {/* Доминирующее фото — слева сверху */}
              <FloatingPhoto
                src={HERO_COLLAGE[1].src}
                alt={HERO_COLLAGE[1].label}
                className="absolute left-0 top-0 h-[72%] w-[60%] rounded-3xl object-cover shadow-lg border border-white/50"
                range={6}
                duration={5}
                delay={0}
              />

              {/* Перекрывающее фото — справа снизу */}
              <FloatingPhoto
                src={HERO_COLLAGE[3].src}
                alt={HERO_COLLAGE[3].label}
                className="absolute right-0 bottom-2 h-[60%] w-[52%] rounded-3xl object-cover shadow-xl border border-white/60 z-10"
                range={8}
                duration={4.2}
                delay={0.4}
                rotateRange={2}
              />

              <HeroCelebration />

              {/* Акцентный бейдж — слева внизу под главным фото */}
              <FloatingBadge
                icon={<Stamp className="h-4 w-4" strokeWidth={2} />}
                value="98%"
                label="одобренных виз"
                className="left-[4%] bottom-[8%] z-20 shadow-sm border border-slate-100 bg-white/80 backdrop-blur-md"
                duration={3.6}
                delay={0.3}
              />

              {/* Акцентный бейдж — справа вверху над перекрытием */}
              <FloatingBadge
                icon={<GraduationCap className="h-4 w-4" strokeWidth={2} />}
                value="389+"
                label="программ обучения"
                className="right-[2%] top-[4%] z-20 shadow-sm border border-slate-100 bg-white/80 backdrop-blur-md"
                duration={4}
                delay={0.8}
              />

            </div>
          </div>
        </div>
      </section>


      {/* О компании + реел-лента */}
      <section className="py-11 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <FadeIn>
            <div className="max-w-[640px]">
              <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">
                {ABOUT.eyebrow}
              </div>
              <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[36px]">{ABOUT.heading}</h2>
              <p className="mt-3.5 text-[15px] leading-relaxed text-ze-muted sm:text-[16.5px]">{ABOUT.body}</p>
            </div>
          </FadeIn>
        </div>
        <div className="mt-8 sm:mt-10">
          <MediaReel items={MEDIA_REEL_ITEMS} />
        </div>
      </section>

      {/* Наши услуги */}
      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-10">
        <FadeIn>
          <div className="max-w-[640px]">
            <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Наши услуги</div>
            <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[36px]">
              Всё необходимое для вашего образования
            </h2>
            <p className="mt-3.5 text-[15px] leading-relaxed text-ze-muted sm:text-[16.5px]">
              От выбора университета до адаптации, обучения и первых шагов в карьере.
            </p>
          </div>
        </FadeIn>
        <div className="mt-7 grid grid-cols-1 gap-3.5 sm:mt-9 sm:grid-cols-3 sm:gap-5">
          {[
            {
              id: "education",
              Icon: GraduationCap,
              title: "Образование",
              text: "Программы и возможности для получения новых знаний и квалификации",
              color: "emerald",
            },

            {
              id: "language",
              Icon: GraduationCap,
              title: "Языковое образование",
              text: "языковые курсы, подготовка к экзаменам и обучение за рубежом",
              color: "emerald",
            },
            {
              id: "students",
              Icon: User,
              title: "Студент",
              text: "Поступление, обучение, адаптация и развитие карьеры",
              color: "blue",
            },
            {
              id: "universities",
              Icon: Landmark,
              title: "Университеты",
              text: "Помогаем университетам находить студентов и развивать международные программы",
              color: "violet",
            },
          ].map((s, i) => {
            const colors = SERVICE_COLORS[s.color];
            return (
              <FadeIn key={s.id} delay={i * 0.06}>
                <TiltCard maxTilt={5}>
                  <Link
                    href="/education"
                    className="flex h-full flex-col gap-3 rounded-2xl border border-ze-border bg-white p-5.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-ze-primary sm:p-6.5"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.bg}`}>
                      <s.Icon className={`h-6 w-6 ${colors.text}`} strokeWidth={1.75} />
                    </div>
                    <div className="text-[17px] font-bold">{s.title}</div>
                    <div className="flex-1 text-[13.5px] leading-relaxed text-ze-muted">{s.text}</div>
                    {/* <div className={`text-[13.5px] font-semibold ${colors.text}`}>Подробнее →</div> */}
                  </Link>
                </TiltCard>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* Статистика */}
      <section className="relative px-4 py-5 sm:px-10">
        <div className="relative mx-auto max-w-6xl">
          <GradientSpots variant="section" />
          <div className="relative grid grid-cols-1 gap-4.5 rounded-[20px] border border-[#E4EBF8] bg-[#F5F8FE] p-6 sm:grid-cols-3 sm:gap-8 sm:p-9">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col gap-1 ${i > 0 ? "border-t border-[#DDE6F5] pt-4.5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0" : ""}`}
              >
                <AnimatedCounter
                  value={s.value}
                  suffix={s.suffix}
                  className="text-[32px] font-extrabold leading-none tracking-tight text-ze-primary sm:text-[46px]"
                />
                <div className="text-[13.5px] font-medium text-ze-muted sm:text-[15px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Университеты для студентов */}
      <section id="study" className="border-y border-ze-border bg-[#F8FAFC] py-11 sm:py-19">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-11">
            <div className="max-w-[560px]">
              <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">
                Университеты для студентов
              </div>
              <h2 className="mt-2 text-[25px] font-extrabold tracking-tight text-ze-ink sm:text-[38px]">
                Найдём университет, который подходит именно вам
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ze-muted sm:text-[16px]">
                Сравнивайте университеты, программы, стоимость обучения, требования и возможности поступления в
                одном месте.
              </p>
            </div>
            <Link
              href="/education"
              className="hidden flex-none text-[14.5px] font-semibold text-ze-primary sm:block"
            >
              Найти университет →
            </Link>
          </div>
          <div className="flex flex-wrap gap-5 sm:gap-6">
            {countries.map((c) => (
              <FadeIn key={c.id} className="w-full sm:w-[300px]">
                <Link
                  href="/education"
                  className="group block overflow-hidden rounded-[22px] bg-white transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.09)]"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-[22px]">
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                      <CoverPhoto src={c.imageUrl} alt={c.name} />
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="text-[16px] font-bold text-ze-ink">
                      {c.flag} {c.name}
                    </div>
                    <div className="mt-1.5 text-[13px] leading-snug text-ze-muted">
                      {universityCountByCountry.get(c.id) || 0} университетов · {c.cities.slice(0, 2).join(", ")}
                    </div>
                    <div className="mt-2.5 text-[14px] font-semibold text-ze-ink">
                      {formatPrice(cheapestByCountry.get(c.id) || 0)} / год
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <Link
            href="/education"
            className="mt-6 block text-center text-[14.5px] font-semibold text-ze-primary sm:hidden"
          >
            Найти университет →
          </Link>
        </div>
      </section>

      <StudentJourney />
      <TurkeyExperience />

      {/* Долгосрочная поддержка */}
      <section className="py-11 sm:py-19">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <FadeIn>
            <div className="max-w-[640px]">
              <h2 className="text-[25px] font-extrabold tracking-tight sm:text-[36px]">
                Мы не заканчиваем работу после поступления
              </h2>
              <p className="mt-3.5 text-[15px] leading-relaxed text-ze-muted sm:text-[16.5px]">
                Наша задача — помочь студенту не только поступить, но и успешно адаптироваться, учиться и строить
                карьеру.
              </p>
            </div>
          </FadeIn>
          <div className="mt-7 grid grid-cols-2 gap-3.5 sm:mt-9 sm:grid-cols-4 sm:gap-4.5">
            {[
              { Icon: HomeIcon, title: "Первый год", text: "Помощь с общежитием и адаптацией", color: "blue" },
              { Icon: MessageCircle, title: "Период обучения", text: "Консультации и постоянная связь", color: "emerald" },
              { Icon: Calendar, title: "5 лет", text: "Поддержка студента на протяжении образовательного пути", color: "violet" },
              // { icon: "💼", title: "Магистратура", text: "Помощь с поиском стажировки и работы" },
            ].map((c, i) => {
              const colors = SERVICE_COLORS[c.color];
              return (
                <FadeIn key={c.title} delay={i * 0.05}>
                  <div className="flex h-full flex-col gap-2.5 rounded-2xl border border-ze-border bg-white p-4.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colors.bg}`}>
                      <c.Icon className={`h-5 w-5 ${colors.text}`} strokeWidth={1.75} />
                    </div>
                    <div className="text-[15px] font-bold">{c.title}</div>
                    <div className="text-[12.5px] leading-snug text-ze-muted">{c.text}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Рассрочка */}
      <section className="px-4 sm:px-10">
        <div className="mx-auto max-w-6xl py-5">
          <div className="relative flex flex-col items-stretch gap-5.5 overflow-hidden rounded-[20px] bg-ze-primary p-6.5 text-white sm:flex-row sm:items-center sm:gap-8 sm:p-11">
            <div className="absolute -right-15 -top-15 h-[220px] w-[220px] rounded-full bg-white/7" />
            <div className="relative min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[40px] font-extrabold leading-none tracking-tight sm:text-[58px]">
                0<span className="opacity-50">·</span>0<span className="opacity-50">·</span>12
              </div>
              <div className="mt-3 max-w-[520px] text-[14.5px] leading-relaxed text-white/86 sm:text-[16px]">
                Рассрочка на обучение и туры: без первоначального взноса, без переплаты, 12 месяцев. Оформление в
                офисе за 15 минут.
              </div>
            </div>
            <a
              href={waUrl("Здравствуйте! Хочу узнать условия рассрочки 0-0-12.")}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex-none rounded-2xl bg-white px-6 py-[15px] text-center text-[15.5px] font-bold text-ze-primary hover:bg-[#EBF1FE]"
            >
              Узнать условия
            </a>
          </div>
        </div>
      </section>

      {/* Студентам и родителям */}
      <section className="border-y border-ze-border bg-ze-surface py-11 sm:py-19">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <FadeIn>
            <h2 className="max-w-[560px] text-[25px] font-extrabold tracking-tight sm:text-[36px]">
              Родители знают, что их ребёнок не один
            </h2>
          </FadeIn>
          <div className="mt-7 grid grid-cols-1 gap-4.5 sm:mt-9 sm:grid-cols-2 sm:gap-6">
            {[
              {
                title: "Студент",
                items: ["Университет", "Поступление", "Переезд", "Общежитие", "Обучение", "Карьерное развитие"],
                badge: SERVICE_COLORS.blue.badge,
                dot: "bg-blue-700",
              },
              {
                title: "Родитель",
                items: [
                  "Информация о процессе",
                  "Связь с менеджером",
                  "Понимание этапов",
                  "Поддержка ребёнка",
                  "Долгосрочное сопровождение",
                ],
                badge: SERVICE_COLORS.amber.badge,
                dot: "bg-amber-700",
              },
            ].map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-ze-border bg-white p-5.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7">
                  <div className={`inline-block rounded-lg px-3 py-1 text-[13px] font-semibold ${card.badge}`}>
                    {card.title.toUpperCase()}
                  </div>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-[14.5px] text-ze-ink">
                        <span className={`h-1.5 w-1.5 flex-none rounded-full ${card.dot}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Почему ZagranEasy */}
      <section className="py-11 sm:py-19">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4.5">
            {[
              { Icon: ShieldCheck, title: "Надёжно", text: "Работаем прозрачно и сопровождаем каждый этап.", color: "blue" },
              { Icon: Zap, title: "Быстро", text: "Помогаем решать вопросы оперативно.", color: "amber" },
              { Icon: CheckCircle2, title: "Удобно", text: "Все основные процессы собраны в одном месте.", color: "emerald" },
              { Icon: HeartHandshake, title: "Рядом", text: "Остаёмся на связи после поступления.", color: "violet" },
            ].map((b, i) => {
              const colors = SERVICE_COLORS[b.color];
              return (
                <FadeIn key={b.title} delay={i * 0.05}>
                  <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colors.bg}`}>
                      <b.Icon className={`h-5 w-5 ${colors.text}`} strokeWidth={1.75} />
                    </div>
                    <div className="text-[15px] font-bold">{b.title}</div>
                    <div className="text-[12.5px] leading-snug text-ze-muted">{b.text}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Квиз */}
      <section className="border-y border-ze-border bg-ze-surface py-11 sm:py-19">
        <div className="mx-auto max-w-[800px] px-4 sm:px-10">
          <LandingQuiz />
        </div>
      </section>

      {/* Отзывы */}
      <section className="py-11 sm:py-19">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <ReviewsCarousel reviews={reviews} />
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="px-4 pb-11 sm:px-10 sm:pb-19">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="flex flex-col items-center gap-4 rounded-[20px] border border-ze-border bg-ze-surface p-8 text-center sm:p-14">
              <h2 className="text-[25px] font-extrabold tracking-tight sm:text-[38px]">Готовы начать?</h2>
              <p className="max-w-[480px] text-[14.5px] leading-relaxed text-ze-muted sm:text-[16px]">
                Расскажите о своих целях — мы поможем определить следующий шаг.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2.5">
                <a
                  href={waUrl("Здравствуйте! Хочу получить консультацию.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-ze-primary px-6 py-4 text-[16px] font-semibold text-white transition-colors hover:bg-ze-primary-dark"
                >
                  Получить консультацию
                </a>
                <Link
                  href="/education"
                  className="rounded-2xl border border-[#DDE4F0] bg-white px-[22px] py-4 text-[16px] font-semibold text-ze-ink transition-colors hover:border-ze-primary hover:text-ze-primary"
                >
                  Посмотреть университеты
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
