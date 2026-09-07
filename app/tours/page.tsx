import type { Metadata } from "next";
import Link from "next/link";
import { fetchTours } from "@/lib/data";
import { formatDuration, formatPrice, waUrl } from "@/lib/utils";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { FadeIn } from "@/components/ui/FadeIn";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PAGE_META } from "@/lib/navigation";

export const metadata: Metadata = {
  title: PAGE_META["/tours"]?.title ?? "Туры",
  description: PAGE_META["/tours"]?.description ?? "",
  openGraph: {
    title: PAGE_META["/tours"]?.title ?? "Туры",
    description: PAGE_META["/tours"]?.description ?? "",
    url: "https://zagraneasy.kz/tours",
  },
};

export default async function ToursPage() {
  const tours = await fetchTours();

  return (
    <div className="bg-gradient-to-b from-[#F3F7FE] to-white">
      {/* Hero */}
      <div className="border-b border-ze-border">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-10 sm:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE4F0] bg-white py-1.5 pl-1.5 pr-3 text-[12.5px] font-medium text-slate-700">
            <span className="rounded-full bg-sky-500 px-1.5 py-0.5 text-[11px] font-bold text-white">0·0·12</span>
            Рассрочка на любой тур без переплаты
          </div>
          <h1 className="mt-4 max-w-[760px] text-[28px] font-extrabold leading-[1.04] tracking-tight text-balance sm:text-[46px]">
            Авторские туры по всему миру
          </h1>
          <p className="mt-3.5 max-w-[600px] text-[14.5px] leading-relaxed text-ze-muted sm:text-[17px]">
            Перелёт, отель 4–5*, трансфер, гид и страховка — уже включены. Вам остаётся только собрать чемодан.
          </p>
        </div>
      </div>

      {/* Zigzag tour cards */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-10 sm:py-16">
        <div className="flex flex-col gap-12 sm:gap-20">
          {tours.map((t, i) => (
            <FadeIn key={t.id}>
              <div
                className={`flex flex-col items-center gap-6 sm:gap-12 ${
                  i % 2 === 1 ? "sm:flex-row-reverse" : "sm:flex-row"
                }`}
              >
                <div className="w-full min-w-0 flex-1">
                  <Link
                    href={`/tours/${t.slug}`}
                    className="group relative block aspect-16/10 overflow-hidden rounded-[20px] border border-ze-border shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
                  >
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.06]">
                      <CoverPhoto src={t.imageUrl} alt={t.title} />
                    </div>
                    {t.isHot && (
                      <div className="absolute left-3.5 top-3.5 rounded-full bg-rose-500 px-3 py-1 text-[12px] font-bold text-white shadow-sm">
                        🔥 Хит продаж
                      </div>
                    )}
                    <div className="absolute bottom-3.5 right-3.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[13px] font-bold text-ze-ink shadow-sm">
                      {formatPrice(t.priceFrom)}
                    </div>
                  </Link>
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-[12px] font-semibold ${t.isHot ? "text-emerald-600" : "text-ze-primary"}`}>
                    {t.region.toUpperCase()} · {formatDuration(t.durationDays)} · {"⭐".repeat(t.hotelStars)}
                  </div>
                  <h2 className="mt-2 text-[22px] font-bold tracking-tight sm:text-[29px]">{t.title}</h2>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ze-muted sm:text-[16px]">
                    {t.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.highlights.slice(0, 4).map((h) => (
                      <span
                        key={h}
                        className="rounded-full border border-ze-border bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3.5">
                    <div className="text-[19px] font-bold">{formatPrice(t.priceFrom)}</div>
                    <Link
                      href={`/tours/${t.slug}`}
                      className="rounded-xl bg-ze-accent px-5 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-ze-accent-dark"
                    >
                      Смотреть маршрут
                    </Link>
                    <a
                      href={waUrl(`Здравствуйте! Интересует тур: ${t.title}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-ze-border bg-white px-5 py-3 text-[14.5px] font-semibold text-ze-ink transition-colors hover:border-ze-primary hover:text-ze-primary"
                    >
                      Спросить в WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Installment banner */}
      <div className="px-4 sm:px-10">
        <div className="mx-auto max-w-6xl pb-14">
          <div className="relative flex flex-col items-stretch gap-5.5 overflow-hidden rounded-[20px] bg-ze-primary p-6.5 text-white sm:flex-row sm:items-center sm:gap-8 sm:p-11">
            <div className="absolute -right-15 -top-15 h-[220px] w-[220px] rounded-full bg-white/7" />
            <div className="relative min-w-0 flex-1">
              <div className="text-[22px] font-extrabold tracking-tight sm:text-[30px]">
                Не нашли подходящий тур?
              </div>
              <div className="mt-2 max-w-[520px] text-[14.5px] leading-relaxed text-white/86 sm:text-[16px]">
                Соберём индивидуальный маршрут под ваш бюджет и даты — бесплатно, за 24 часа.
              </div>
            </div>
            <a
              href={waUrl("Здравствуйте! Хочу собрать индивидуальный тур.")}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex-none rounded-2xl bg-white px-6 py-[15px] text-center text-[15.5px] font-bold text-ze-primary hover:bg-[#EBF1FE]"
            >
              Собрать маршрут
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
