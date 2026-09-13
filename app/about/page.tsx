import type { Metadata } from "next";
import { SITE, STATS, ABOUT, HERO_COLLAGE, MEDIA_REEL_ITEMS } from "@/lib/constants";
import { waUrl } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PAGE_META } from "@/lib/navigation";
import { GraduationCap, Stamp } from "lucide-react";
import { FloatingPhoto } from "@/components/ui/FloatingPhoto";
import { FloatingBadge } from "@/components/ui/FloatingBadge";
import { HeroCelebration } from "@/components/home/HeroCelebration";
import { MediaReel } from "@/components/home/MediaReel";

export const metadata: Metadata = {
  title: PAGE_META["/about"]?.title ?? "О нас",
  description: PAGE_META["/about"]?.description ?? "Описание по умолчанию",
  openGraph: {
    title: PAGE_META["/about"]?.title ?? "О нас",
  },
};

const TEAM = [
  { name: "Нурбол Нуркасымов", role: "Основатель, руководитель", initials: "АН" },
  { name: "Олжас Қошқарбай", role: "Руководитель отдела образования", initials: "ОҚ" },
  // { name: "Мадина Ахметова", role: "Визовый специалист", initials: "МА" },
  { name: "Досжан Ысмаилов", role: "Менеджер по работе за рубежом", initials: "ДЫ" },
  { name: "Елдар", role: "Менеджер по работе за рубежом", initials: "Е" },
  { name: "Анель", role: "Менеджер по работе за рубежом", initials: "А" },
  
  // { name: "Алия Тулегенова", role: "Менеджер по недвижимости", initials: "АТ" },
  // { name: "Санжар Есенов", role: "Менеджер по турам", initials: "СЕ" },
];

const ACCEPTANCE_LETTERS = [
  "https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto/f_auto/v1776645536/1_hab3dq.png",
  "https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto/f_auto/v1776645537/3_yhwkk8.png",
  "https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto/f_auto/v1776645537/2_eroghg.png",
  "https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto/f_auto/v1776645537/4_ddrmbj.png",
  "https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto/f_auto/v1776645538/6_hlaqwa.png",
  "https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto/f_auto/v1776645538/5_s0r8hf.png",
];

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-[#F3F7FE] to-white">
      {/* Hero */}
      <div className="border-b border-ze-border">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-10 sm:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE4F0] bg-white py-1.5 pl-1.5 pr-3 text-[12.5px] font-medium text-slate-700">
            ИП «ZAGRANEASY» · Алматы
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

        <div className="relative w-full min-w-0 flex-1">
            <div className="relative aspect-4/3 max-w-lg mx-auto">
              
              {/* Доминирующее фото — слева сверху */}
{/* Большое фото — слева сверху */}
          {/* Фото 1 — верх слева */}
        <FloatingPhoto
          src={HERO_COLLAGE[0].src}
          alt={HERO_COLLAGE[0].label}
          className="
            absolute left-0 top-0
            h-[46%] w-[48%]
            rounded-3xl object-cover
            border border-white/50 shadow-lg
          "
          range={6}
          duration={5}
          delay={0}
          rotateRange={1.5}
          loading="eager"
        />

        {/* Фото 2 — верх справа */}
        <FloatingPhoto
          src={HERO_COLLAGE[1].src}
          alt={HERO_COLLAGE[1].label}
          className="
            absolute right-0 top-0
            h-[46%] w-[48%]
            rounded-3xl object-cover
            border border-white/50 shadow-lg
          "
          range={7}
          duration={5}
          delay={0.2}
          rotateRange={-1.5}
          loading="eager"
        />

        {/* Фото 3 — низ слева */}
        <FloatingPhoto
          src={HERO_COLLAGE[2].src}
          alt={HERO_COLLAGE[2].label}
          className="
            absolute left-0 bottom-0
            h-[46%] w-[48%]
            rounded-3xl object-cover
            border border-white/50 shadow-lg
          "
          range={8}
          duration={4.5}
          delay={0.4}
          rotateRange={-1.5}
          loading="eager"
        />

        {/* Фото 4 — низ справа */}
        <FloatingPhoto
          src={HERO_COLLAGE[3].src}
          alt={HERO_COLLAGE[3].label}
          className="
            absolute right-0 bottom-0
            h-[46%] w-[48%]
            rounded-3xl object-cover
            border border-white/50 shadow-lg
          "
          range={9}
          duration={4.2}
          delay={0.6}
          rotateRange={1.5}
          loading="eager"
        />
              <HeroCelebration />

              {/* Акцентный бейдж — слева внизу под главным фото */}
              {/* <FloatingBadge
                icon={<Stamp className="h-4 w-4" strokeWidth={2} />}
                value="98%"
                label="одобренных виз"
                className="left-[4%] bottom-[8%] z-20 shadow-sm border border-slate-100 bg-white/80 backdrop-blur-md"
                duration={3.6}
                delay={0.3}
              /> */}

              {/* Акцентный бейдж — справа вверху над перекрытием
              <FloatingBadge
                icon={<GraduationCap className="h-4 w-4" strokeWidth={2} />}
                value="389+"
                label="программ обучения"
                className="right-[2%] top-[1%] z-20 shadow-sm border border-slate-100 bg-white/80 backdrop-blur-md"
                duration={4}
                delay={0.8}
              /> */}

            </div>
          </div>


        <div className="mt-8 sm:mt-10">
          <MediaReel items={MEDIA_REEL_ITEMS} />
        </div>
{/* Acceptance letters gallery */}
    <section
      id="results"
      className="relative overflow-hidden border-y border-ze-border bg-ze-surface py-16 sm:py-24"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-blue-500/[0.035] blur-3xl dark:bg-blue-400/[0.05]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-10">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600 dark:border-blue-400/20 dark:bg-blue-400/[0.08] dark:text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Наши результаты
            </div>

            <h2 className="mt-5 text-[28px] font-black tracking-[-0.04em] text-ze-ink sm:text-[42px] dark:text-white">
              Официальные зачисления
              <br className="hidden sm:block" />
              <span className="text-ze-primary"> и сертификаты</span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ze-muted sm:text-[16px] dark:text-white/55">
              Подлинные письма о зачислении наших студентов
              в зарубежные университеты. Каждый результат —
              подтверждение проделанной работы.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mx-auto mt-12 max-w-5xl sm:mt-16">
            <PhotoGallery
              images={ACCEPTANCE_LETTERS}
              alt="Письмо о зачислении студента"
              variant="documents"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-10 flex items-center justify-center gap-2 text-center text-[12px] text-ze-muted dark:text-white/40">
            <svg
              className="h-4 w-4 text-emerald-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Документы представлены с разрешения студентов
          </div>
        </FadeIn>
      </div>
    </section>

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
