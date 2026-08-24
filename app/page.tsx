import Link from "next/link";
import { fetchAllUniversities, fetchEducationCountries, fetchReviews } from "@/lib/data";
import { formatPrice, waUrl } from "@/lib/utils";
import { SITE, STATS, ABOUT, MEDIA_REEL_ITEMS } from "@/lib/constants";
import { FadeIn } from "@/components/ui/FadeIn";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { LandingQuiz } from "@/components/home/LandingQuiz";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { HeroPlane } from "@/components/home/HeroPlane";
import { MediaReel } from "@/components/home/MediaReel";

export default async function HomePage() {
  const [countries, universities, reviews] = await Promise.all([
    fetchEducationCountries(),
    fetchAllUniversities(),
    fetchReviews(),
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
      <section className="relative border-b border-ze-border bg-gradient-to-b from-[#F4F7FD] to-white">
        <HeroPlane />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-14 sm:flex-row sm:gap-14 sm:px-10 sm:py-20">
          <div className="min-w-0 flex-1">
            {/* <div className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE4F0] bg-white py-1.5 pl-2 pr-3 text-[13px] font-medium text-slate-700 shadow-sm">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EBF1FE] text-[10px]">
                📍
              </span>
              {SITE.address}
            </div> */}
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
          <div className="w-full min-w-0 flex-1">
            <div className="group relative aspect-4/3 overflow-hidden rounded-[20px] border border-ze-border bg-slate-100 shadow-sm">
              <img
                src="https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto:eco,f_auto/v1776028170/a4te_opwrjk.png"
                alt="Hustwork project preview"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />

              {/* subtle overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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

      {/*
        Hub — модули направлений. Пока на сайте активно только "Обучение" —
        см. zagraneasy-requirements.json (main_services). Раздел вернём,
        когда запустятся туры/работа/виза/недвижимость.

      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-10">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5 sm:gap-4">
          {SERVICES.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="flex flex-col gap-2.5 rounded-2xl border border-ze-border bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-ze-primary hover:shadow-[0_8px_22px_rgba(26,86,219,0.12)] sm:p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#EBF1FE] text-[21px]">
                {s.icon}
              </div>
              <div className="text-[15.5px] font-semibold">{s.title}</div>
              <div className="text-[12.5px] leading-snug text-ze-muted">{s.subtitle}</div>
            </Link>
          ))}
        </div>
      </section>
      */}

      {/* Статистика */}
      <section className="px-4 py-5 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4.5 rounded-[20px] border border-[#E4EBF8] bg-[#F5F8FE] p-6 sm:grid-cols-3 sm:gap-8 sm:p-9">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col gap-1 ${i > 0 ? "border-t border-[#DDE6F5] pt-4.5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0" : ""}`}
              >
                <div className="text-[32px] font-extrabold leading-none tracking-tight text-ze-primary sm:text-[46px]">
                  {s.value.toLocaleString("ru-RU")}
                  {s.suffix}
                </div>
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
                <Link
                  href="/education"
                  className="block overflow-hidden rounded-2xl border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_10px_26px_rgba(15,23,42,0.09)]"
                >
                  <div className="aspect-4/3">
                    <CoverPhoto src={c.imageUrl} alt={c.name} />
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/*
        Туры — временно скрыты с сайта вместе с остальными направлениями,
        см. lib/navigation.ts. Данные и логика остаются в data/tours.ts —
        секцию вернём, когда туры станут приоритетом.

      <section id="tours" className="py-11 sm:py-19">
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
                    <div className="flex aspect-16/10 items-center justify-center rounded-[18px] bg-[repeating-linear-gradient(135deg,#EEF1F6_0_10px,#E5EAF2_10px_20px)] font-mono text-[10.5px] text-slate-400">
                      фото — {t.title}
                    </div>
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
      </section>
      */}

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
    </>
  );
}
