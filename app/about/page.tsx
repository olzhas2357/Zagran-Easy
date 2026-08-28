import type { Metadata } from "next";
import { SITE, STATS, ABOUT } from "@/lib/constants";
import { waUrl } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PAGE_META } from "@/lib/navigation";

export const metadata: Metadata = {
  title: PAGE_META["/about"].title,
  description: PAGE_META["/about"].description,
  openGraph: {
    title: PAGE_META["/about"].title,
    description: PAGE_META["/about"].description,
    url: "https://zagraneasy.kz/about",
  },
};

const TEAM = [
  { name: "Асель Нурланова", role: "Основатель, руководитель", initials: "АН" },
  { name: "Данияр Сериков", role: "Руководитель отдела образования", initials: "ДС" },
  { name: "Мадина Ахметова", role: "Визовый специалист", initials: "МА" },
  { name: "Ержан Болатов", role: "Менеджер по работе за рубежом", initials: "ЕБ" },
  { name: "Алия Тулегенова", role: "Менеджер по недвижимости", initials: "АТ" },
  { name: "Санжар Есенов", role: "Менеджер по турам", initials: "СЕ" },
];

const ACCEPTANCE_LETTERS = [
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80",
  "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=900&q=80",
  "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=900&q=80",
];

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-[#F3F7FE] to-white">
      {/* Hero */}
      <div className="border-b border-ze-border">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-10 sm:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE4F0] bg-white py-1.5 pl-1.5 pr-3 text-[12.5px] font-medium text-slate-700">
            ТОО «ZAGRANEASY» · Алматы
          </div>
          <h1 className="mt-4 max-w-[760px] text-[28px] font-extrabold leading-[1.04] tracking-tight text-balance sm:text-[46px]">
            {ABOUT.heading}
          </h1>
          <p className="mt-3.5 max-w-[640px] text-[14.5px] leading-relaxed text-ze-muted sm:text-[17px]">
            {ABOUT.body}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-8 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4.5 rounded-[20px] border border-[#E4EBF8] bg-[#F5F8FE] p-6 sm:grid-cols-3 sm:gap-8 sm:p-9">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col gap-1 ${
                  i > 0 ? "border-t border-[#DDE6F5] pt-4.5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0" : ""
                }`}
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
      </div>

      {/* Team */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-10 sm:py-19">
        <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Команда</div>
        <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[36px]">Люди, которые вас ведут</h2>
        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4.5">
          {TEAM.map((t) => (
            <FadeIn key={t.name}>
              <div className="rounded-2xl border border-ze-border bg-white p-5 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF1FE] text-[19px] font-bold text-ze-primary">
                  {t.initials}
                </div>
                <div className="mt-3 text-[14.5px] font-bold text-ze-ink">{t.name}</div>
                <div className="mt-0.5 text-[12.5px] text-ze-muted">{t.role}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Acceptance letters gallery */}
      <div className="border-y border-ze-border bg-ze-surface py-14 sm:py-19">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Результаты</div>
          <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[36px]">
            Реальные письма о зачислении
          </h2>
          <p className="mt-3 max-w-[600px] text-[14.5px] leading-relaxed text-ze-muted sm:text-[16px]">
            Часть подтверждённых зачислений наших клиентов в университеты-партнёры.
          </p>
          <div className="mt-8 max-w-[720px]">
            <FadeIn>
              <PhotoGallery images={ACCEPTANCE_LETTERS} alt="Письмо о зачислении" />
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Contact block */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-10 sm:py-19">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
          <FadeIn>
            <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Контакты</div>
            <div className="mt-3 text-[20px] font-bold text-ze-ink">{SITE.phone}</div>
            <div className="mt-2 text-[14.5px] leading-relaxed text-ze-muted">{SITE.address}</div>
            <div className="mt-1 text-[14.5px] text-ze-muted">Пн–Сб, 10:00–19:00</div>
            <a href={`mailto:${SITE.email}`} className="mt-1 block text-[14.5px] text-ze-primary hover:underline">
              {SITE.email}
            </a>
          </FadeIn>
          <FadeIn delay={0.06}>
            <div className="rounded-2xl border border-ze-border bg-white p-6">
              <div className="text-[16px] font-bold">Хотите узнать больше?</div>
              <div className="mt-1.5 text-[13.5px] text-ze-muted">
                Напишите нам — ответим в течение 15 минут в рабочее время.
              </div>
              <a
                href={waUrl("Здравствуйте! Хочу узнать больше о ZagranEasy.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-xl bg-ze-whatsapp px-5 py-3.5 text-center text-[14.5px] font-bold text-white hover:bg-ze-whatsapp-dark"
              >
                Написать в WhatsApp
              </a>
            </div>
          </FadeIn>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
