import type { Metadata } from "next";
import { fetchProperties, getRealEstateRegions } from "@/lib/data";
import { formatArea, waUrl } from "@/lib/utils";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { FadeIn } from "@/components/ui/FadeIn";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PAGE_META } from "@/lib/navigation";

export const metadata: Metadata = {
  title: PAGE_META["/realestate"].title,
  description: PAGE_META["/realestate"].description,
  openGraph: {
    title: PAGE_META["/realestate"].title,
    description: PAGE_META["/realestate"].description,
    url: "https://zagraneasy.kz/realestate",
  },
};

export default async function RealEstatePage() {
  const [properties, regions] = await Promise.all([fetchProperties(), Promise.resolve(getRealEstateRegions())]);

  return (
    <div className="bg-gradient-to-b from-[#F3F7FE] to-white">
      {/* Hero */}
      <div className="border-b border-ze-border">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-10 sm:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE4F0] bg-white py-1.5 pl-1.5 pr-3 text-[12.5px] font-medium text-slate-700">
            <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[11px] font-bold text-white">🏠</span>
            ВНЖ через покупку недвижимости
          </div>
          <h1 className="mt-4 max-w-[760px] text-[28px] font-extrabold leading-[1.04] tracking-tight text-balance sm:text-[46px]">
            Недвижимость за рубежом с юридическим сопровождением
          </h1>
          <p className="mt-3.5 max-w-[600px] text-[14.5px] leading-relaxed text-ze-muted sm:text-[17px]">
            Турция, Кипр, ОАЭ. Виллы, апартаменты и инвестиционные объекты — с полным юридическим сопровождением
            сделки от подбора до подписания.
          </p>
        </div>
      </div>

      {/* Bento grid — regions */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-10 sm:py-16">
        <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Направления</div>
        <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[36px]">Регионы для инвестиций</h2>

        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:grid-rows-2 sm:gap-4">
          {regions.map((r, i) => (
            <FadeIn
              key={r.name}
              className={i === 0 ? "col-span-2 row-span-2" : "col-span-1"}
            >
              <div
                className={`group relative h-full overflow-hidden rounded-2xl border border-ze-border ${
                  i === 0 ? "aspect-square sm:aspect-auto" : "aspect-square"
                }`}
              >
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.06]">
                  <CoverPhoto src={r.imageUrl} alt={r.name} />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5 text-white sm:p-4.5">
                  <div className={`font-extrabold tracking-tight ${i === 0 ? "text-[24px] sm:text-[30px]" : "text-[15px] sm:text-[18px]"}`}>
                    {r.name}
                  </div>
                  <div className={`mt-1 text-white/85 ${i === 0 ? "text-[13.5px]" : "text-[11.5px] leading-snug"}`}>
                    {r.desc}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Property listings */}
      <div className="border-y border-ze-border bg-ze-surface py-14 sm:py-19">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Объекты</div>
          <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[36px]">Актуальные предложения</h2>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {properties.map((p) => (
              <FadeIn key={p.id}>
                <div className="overflow-hidden rounded-2xl border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <div className="relative aspect-16/10">
                    <CoverPhoto src={p.imageUrl} alt={p.title} />
                    {p.isHotDeal && (
                      <div className="absolute left-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-[11.5px] font-bold text-white shadow-sm">
                        🔥 Горячее предложение
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-[17px] font-bold">{p.title}</div>
                    <div className="mt-1 text-[13.5px] text-ze-muted">{p.location}</div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-[#F1F5FB] px-2.5 py-1 text-[12px] font-medium text-slate-600">
                        {p.rooms} комн.
                      </span>
                      <span className="rounded-full bg-[#F1F5FB] px-2.5 py-1 text-[12px] font-medium text-slate-600">
                        {formatArea(p.areaSqm)}
                      </span>
                      {p.features.map((f) => (
                        <span
                          key={f}
                          className="rounded-full bg-[#F1F5FB] px-2.5 py-1 text-[12px] font-medium text-slate-600"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="text-[19px] font-bold">${p.priceUsd.toLocaleString("ru-RU")}</div>
                      <a
                        href={waUrl(`Здравствуйте! Интересует объект: ${p.title} (${p.location})`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-ze-accent px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-ze-accent-dark"
                      >
                        Узнать подробнее
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 sm:px-10">
        <div className="mx-auto max-w-6xl py-14">
          <div className="relative flex flex-col items-stretch gap-5.5 overflow-hidden rounded-[20px] bg-ze-primary p-6.5 text-white sm:flex-row sm:items-center sm:gap-8 sm:p-11">
            <div className="absolute -right-15 -top-15 h-[220px] w-[220px] rounded-full bg-white/7" />
            <div className="relative min-w-0 flex-1">
              <div className="text-[22px] font-extrabold tracking-tight sm:text-[30px]">
                Подберём объект под ваш бюджет
              </div>
              <div className="mt-2 max-w-[520px] text-[14.5px] leading-relaxed text-white/86 sm:text-[16px]">
                Юридическая проверка, сопровождение сделки и помощь с ВНЖ — под ключ.
              </div>
            </div>
            <a
              href={waUrl("Здравствуйте! Хочу подобрать недвижимость за рубежом.")}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex-none rounded-2xl bg-white px-6 py-[15px] text-center text-[15.5px] font-bold text-ze-primary hover:bg-[#EBF1FE]"
            >
              Подобрать объект
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
