import Link from "next/link";
import { fetchAllUniversities, fetchEducationCountries, fetchReviews, fetchTours } from "@/lib/data";
import { formatDuration, formatPrice, waUrl } from "@/lib/utils";
import { SITE, STATS, ABOUT, MEDIA_REEL_ITEMS, SERVICES, HERO_COLLAGE, ACCEPTANCE_LETTER_PHOTOS, CAMPUS_LIFE_PHOTOS } from "@/lib/constants";
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
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ArrowUpRight } from 'lucide-react';

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
              Весь мир —
              <br />в одном месте
            </h1>
            <p className="mt-4 max-w-[520px] text-[15.5px] leading-relaxed text-ze-muted sm:text-[19px]">
              {SITE.description}
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
                Смотреть услуги
              </Link>
            </div>
            <div className="mt-5.5 flex items-center gap-2.5 text-[13.5px] text-ze-muted">
              <div className="flex">
                <div className="h-7 w-7 rounded-full border-2 border-white bg-[#DCE6FA]" />
                <div className="-ml-2.5 h-7 w-7 rounded-full border-2 border-white bg-[#C7D8F7]" />
                <div className="-ml-2.5 h-7 w-7 rounded-full border-2 border-white bg-[#B0C9F4]" />
              </div>
              3&nbsp;200+ клиентов уже уехали с нами
            </div>
          </div>

          {/* Плавающий фото-коллаж */}
          <div className="relative w-full min-w-0 flex-1">
            <div className="relative aspect-4/3">
              <FloatingPhoto
                src={HERO_COLLAGE[0].src}
                alt={HERO_COLLAGE[0].label}
                className="absolute left-0 top-0 h-[62%] w-[58%]"
                range={12}
                duration={4.2}
                delay={0}
              />
              <FloatingPhoto
                src={HERO_COLLAGE[1].src}
                alt={HERO_COLLAGE[1].label}
                className="absolute right-0 top-[6%] h-[45%] w-[38%]"
                range={9}
                duration={3.6}
                delay={0.4}
                rotateRange={3}
              />
              <FloatingPhoto
                src={HERO_COLLAGE[2].src}
                alt={HERO_COLLAGE[2].label}
                className="absolute bottom-0 left-[8%] h-[42%] w-[40%]"
                range={10}
                duration={4.8}
                delay={0.8}
              />
              <FloatingPhoto
                src={HERO_COLLAGE[3].src}
                alt={HERO_COLLAGE[3].label}
                className="absolute bottom-[4%] right-[2%] h-[48%] w-[42%]"
                range={11}
                duration={4}
                delay={0.2}
                rotateRange={3}
              />
              <HeroCelebration />

              <FloatingBadge
                icon="🗽"
                value="98%"
                label="одобренных виз"
                className="left-[2%] top-[2%]"
                duration={3.4}
                delay={0.3}
              />
              <FloatingBadge
                icon="🎓"
                value="389+"
                label="программ обучения"
                className="bottom-[6%] right-[4%]"
                duration={3.8}
                delay={0.9}
              />
              <FloatingBadge
                icon="✈️"
                value="3 200+"
                label="довольных клиентов"
                className="left-[30%] top-[46%] hidden sm:flex"
                duration={3.1}
                delay={1.3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Фото-лента: письма о зачислении + жизнь студентов */}
      <section className="overflow-hidden border-b border-ze-border bg-white py-8 sm:py-10">
        <div className="flex flex-col gap-3.5">
          <PhotoMarquee images={ACCEPTANCE_LETTER_PHOTOS} speed={30} direction="normal" />
          <PhotoMarquee images={CAMPUS_LIFE_PHOTOS} speed={38} direction="reverse" />
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
        {/* <div className="mt-8 sm:mt-10"> */}
          {/* <MediaReel items={MEDIA_REEL_ITEMS} /> */}
        {/* </div> */}
      </section>

      {/* Hub — модули направлений */}
<section className="mx-auto max-w-6xl px-4 pt-8 sm:px-10">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {SERVICES.map((s, i) => (
          <FadeIn key={s.id} delay={i * 0.05}>
            <TiltCard maxTilt={6}>
              <Link
                href={s.href}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-ze-border bg-white p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-ze-primary/40 hover:shadow-[0_12px_24px_-8px_rgba(15,23,42,0.08)] sm:p-5"
              >
                {/* Фоновый мягкий свечение-акцент при ховере */}
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-ze-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div>
                  {/* Верхний блок: Иконка и Стрелка-индикатор */}
                  <div className="mb-3.5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#EBF1FE] to-[#E2EBFF] text-[22px] text-ze-primary transition-transform duration-300 group-hover:scale-105">
                      {s.icon}
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-ze-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ze-primary group-hover:opacity-100" />
                  </div>

                  {/* Заголовок */}
                  <h3 className="text-[15px] font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-ze-primary sm:text-[16px]">
                    {s.title}
                  </h3>

                  {/* Подзаголовок */}
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ze-muted">
                    {s.subtitle}
                  </p>
                </div>
              </Link>
            </TiltCard>
          </FadeIn>
        ))}
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

      {/* Обучение */}
      <section id="study" className="border-y border-ze-border bg-ze-surface py-11 sm:py-19">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <div className="mb-5.5 flex items-end justify-between gap-4 sm:mb-8">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Обучение</div>
              <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[38px]">Куда поступить в 2026</h2>
            </div>
            <Link href="/education" className="hidden flex-none text-[14.5px] font-semibold sm:block">
              Все направления →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4.5">
            {countries.map((c) => (
              <FadeIn key={c.id}>
                <TiltCard maxTilt={5}>
                  <Link
                    href="/education"
                    className="block overflow-hidden rounded-2xl border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                  >
                    <div className="aspect-4/3 overflow-hidden">
                      <div className="h-full w-full transition-transform duration-500 hover:scale-110">
                        <CoverPhoto src={c.imageUrl} alt={c.name} />
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[16px] font-bold">
                          {c.flag} {c.name}
                        </div>
                      </div>
                      <div className="mt-1.5 text-[13px] leading-snug text-ze-muted">
                        {universityCountByCountry.get(c.id) || 0} университетов · {c.cities.slice(0, 2).join(", ")}
                      </div>
                      <div className="mt-2.5 text-[14px] font-semibold">
                        {formatPrice(cheapestByCountry.get(c.id) || 0)} / год
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Туры */}
      {/* <section id="tours" className="py-11 sm:py-19">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Туры</div>
          <h2 className="mb-7 mt-2 text-[25px] font-extrabold tracking-tight sm:mb-9 sm:text-[38px]">
            Отдых, собранный под вас
          </h2>
          <div className="flex flex-col gap-9 sm:gap-14">
            {tours.map((t, i) => (
              <FadeIn key={t.id}>
                <div className={`flex flex-col items-center gap-4.5 sm:gap-12 ${i % 2 === 1 ? "sm:flex-row-reverse" : "sm:flex-row"}`}>
                  <div className="w-full min-w-0 flex-1">
                    <Link
                      href={`/tours/${t.slug}`}
                      className="group block aspect-16/10 overflow-hidden rounded-[18px] border border-ze-border"
                    >
                      <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.05]">
                        <CoverPhoto src={t.imageUrl} alt={t.title} />
                      </div>
                    </Link>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-[12px] font-semibold ${t.isHot ? "text-emerald-600" : "text-ze-primary"}`}>
                      {t.region.toUpperCase()} · {formatDuration(t.durationDays)}
                    </div>
                    <h3 className="mt-2 text-[20px] font-bold tracking-tight sm:text-[27px]">{t.title}</h3>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-ze-muted sm:text-[16px]">{t.description}</p>
                    <div className="mt-4 flex items-center gap-3.5">
                      <div className="text-[18px] font-bold">{formatPrice(t.priceFrom)}</div>
                      <Link
                        href={`/tours/${t.slug}`}
                        className="rounded-[11px] bg-[#EBF1FE] px-4.5 py-2.5 text-[14px] font-semibold text-ze-primary hover:bg-[#DCE6FA]"
                      >
                        Подобрать тур
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section> */}

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

      <SiteFooter />
    </>
  );
}
