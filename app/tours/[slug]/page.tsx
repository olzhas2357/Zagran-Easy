import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchTours, fetchTour } from "@/lib/data";
import { formatDuration, formatPrice, waUrl } from "@/lib/utils";
import { TOUR_INCLUDES_ICONS } from "@/data/tours";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { FadeIn } from "@/components/ui/FadeIn";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TourItinerary } from "@/components/tours/TourItinerary";

export async function generateStaticParams() {
  const tours = await fetchTours();
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/tours/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const tour = await fetchTour(slug);
  if (!tour) return {};
  return {
    title: `${tour.title} — ZagranEasy`,
    description: tour.description,
  };
}

export default async function TourDetailPage(props: PageProps<"/tours/[slug]">) {
  const { slug } = await props.params;
  const [tour, allTours] = await Promise.all([fetchTour(slug), fetchTours()]);
  if (!tour) notFound();

  const related = allTours.filter((t) => t.slug !== tour.slug).slice(0, 2);

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-10 sm:py-8">
        <Link href="/tours" className="mb-4 inline-block text-[13.5px] font-semibold text-ze-muted hover:text-ze-primary">
          ← Все туры
        </Link>

        {/* Hero image */}
        <div className="relative aspect-16/9 overflow-hidden rounded-[22px] border border-ze-border shadow-sm sm:aspect-21/9">
          <CoverPhoto src={tour.imageUrl} alt={tour.title} />
          {tour.isHot && (
            <div className="absolute left-4 top-4 rounded-full bg-rose-500 px-3.5 py-1.5 text-[13px] font-bold text-white shadow-sm">
              🔥 Хит продаж
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-7 sm:left-8 sm:right-8">
            <div className="text-[12.5px] font-semibold uppercase tracking-wide text-white/85">
              {tour.region} · {formatDuration(tour.durationDays)} · {"⭐".repeat(tour.hotelStars)}
            </div>
            <h1 className="mt-1.5 text-[26px] font-extrabold tracking-tight sm:text-[42px]">{tour.title}</h1>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:mt-10 sm:grid-cols-[1fr_360px] sm:gap-10">
          {/* Left column */}
          <div className="min-w-0">
            <FadeIn>
              <h2 className="text-[20px] font-bold tracking-tight">Об этом туре</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ze-muted">{tour.description}</p>
            </FadeIn>

            <FadeIn delay={0.05}>
              <h2 className="mt-9 text-[20px] font-bold tracking-tight">Программа по дням</h2>
              <div className="mt-4">
                <TourItinerary tour={tour} />
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="mt-9 text-[20px] font-bold tracking-tight">Что включено</h2>
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {tour.includes.map((inc) => (
                  <div
                    key={inc}
                    className="flex items-center gap-3 rounded-xl border border-ze-border bg-white px-4 py-3.5"
                  >
                    <span className="text-[19px]">{TOUR_INCLUDES_ICONS[inc] ?? "✅"}</span>
                    <span className="text-[14px] font-medium text-ze-ink">{inc}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <h2 className="mt-9 text-[20px] font-bold tracking-tight">Основные моменты</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {tour.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full border border-ze-border bg-white px-3.5 py-2 text-[13px] font-medium text-slate-700"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Sticky sidebar */}
          <div className="min-w-0">
            <div className="sticky top-24 rounded-[20px] border border-ze-border bg-white p-6 shadow-[0_8px_26px_rgba(15,23,42,0.07)]">
              <div className="text-[13px] font-medium text-ze-muted">Стоимость тура</div>
              <div className="mt-1.5 text-[30px] font-extrabold tracking-tight text-ze-ink">
                {formatPrice(tour.priceFrom)}
              </div>
              <div className="mt-1 text-[13px] text-ze-muted">за человека, при двухместном размещении</div>

              <div className="mt-5 rounded-2xl bg-ze-primary p-4 text-white">
                <div className="text-[15px] font-bold">Рассрочка 0·0·12</div>
                <div className="mt-1 text-[13px] leading-relaxed text-white/85">
                  Без первого взноса и переплаты, оформление за 15 минут.
                </div>
              </div>

              <a
                href={waUrl(`Здравствуйте! Хочу забронировать тур: ${tour.title}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block rounded-xl bg-ze-accent px-5 py-3.5 text-center text-[15px] font-bold text-white transition-colors hover:bg-ze-accent-dark"
              >
                Забронировать тур
              </a>
              <a
                href={waUrl(`Здравствуйте! Есть вопрос по туру: ${tour.title}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 block rounded-xl border border-ze-border bg-white px-5 py-3.5 text-center text-[14.5px] font-semibold text-ze-ink transition-colors hover:border-ze-primary hover:text-ze-primary"
              >
                Задать вопрос
              </a>

              <div className="mt-5 flex items-center gap-2.5 text-[12.5px] text-ze-muted">
                <div className="flex">
                  <div className="h-6 w-6 rounded-full border-2 border-white bg-[#DCE6FA]" />
                  <div className="-ml-2 h-6 w-6 rounded-full border-2 border-white bg-[#C7D8F7]" />
                  <div className="-ml-2 h-6 w-6 rounded-full border-2 border-white bg-[#B0C9F4]" />
                </div>
                Уже забронировали 24 человека
              </div>
            </div>
          </div>
        </div>

        {/* Related tours */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-[22px] font-bold tracking-tight">Другие туры</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.map((t) => (
                <Link
                  key={t.id}
                  href={`/tours/${t.slug}`}
                  className="group overflow-hidden rounded-2xl border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_10px_26px_rgba(15,23,42,0.09)]"
                >
                  <div className="aspect-16/9 overflow-hidden">
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                      <CoverPhoto src={t.imageUrl} alt={t.title} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[12px] font-semibold text-ze-primary">
                      {t.region.toUpperCase()} · {formatDuration(t.durationDays)}
                    </div>
                    <div className="mt-1.5 text-[16px] font-bold">{t.title}</div>
                    <div className="mt-2 text-[14px] font-semibold">{formatPrice(t.priceFrom)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <SiteFooter />
      </div>
    </div>
  );
}
