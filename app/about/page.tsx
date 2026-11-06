import type { Metadata } from "next";
import { SITE, STATS, ABOUT, HERO_COLLAGE, MEDIA_REEL_ITEMS } from "@/lib/constants";
import { waUrl } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PAGE_META } from "@/lib/navigation";
import { ArrowUpRight, GraduationCap, MapPin, MessageCircle, Phone, Stamp, Clock3, } from "lucide-react";
import { FloatingPhoto } from "@/components/ui/FloatingPhoto";
import { FloatingBadge } from "@/components/ui/FloatingBadge";
import { HeroCelebration } from "@/components/home/HeroCelebration";
import { MediaReel } from "@/components/home/MediaReel";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { reviews } from "@/data/content";

export const metadata: Metadata = {
  title: PAGE_META["/about"]?.title ?? "О нас",
  description: PAGE_META["/about"]?.description ?? "Описание по умолчанию",
  openGraph: {
    title: PAGE_META["/about"]?.title ?? "О нас",
  },
};

const TEAM = [
{ name: "Нурбол Нуркасымов", role: "Основатель, руководитель", initials: "НН" },
{ name: "Ая Ауелбекова", role: "Руководитель проекта", initials: "АА" },
{ name: "Гаухар Шидерина", role: "Учитель китайского языка", initials: "ГШ" },
{ name: "Озанам Алойсиус", role: "Учитель английского языка", initials: "ОА" },
{ name: "Гулназ Суртаева", role: "РОП Руководитель отдела продаж", initials: "ГС" },
{ name: "Жанар Чанваева", role: "Профессиональный консультант", initials: "ЖЧ" },

];

const RESULTS_PHOTOS = [
  {
    src: "https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto/f_auto/v1776645536/1_hab3dq.png",
    alt: "Письмо о зачислении студента ZagranEasy",
  },
  {
    src: "https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto/f_auto/v1776645537/3_yhwkk8.png",
    alt: "Зачисление в зарубежный университет",
  },
  {
    src: "https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto/f_auto/v1776645537/2_eroghg.png",
    alt: "Результат поступления через ZagranEasy",
  },
  {
    src: "https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto/f_auto/v1776645537/4_ddrmbj.png",
    alt: "Официальное приглашение университета",
  },
  {
    src: "https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto/f_auto/v1776645538/6_hlaqwa.png",
    alt: "Поступление студента через ZagranEasy",   
  },
  {
    src: "https://res.cloudinary.com/dwq9aesrb/image/upload/q_auto/f_auto/v1776645538/5_s0r8hf.png",
    alt: "Результат поступления через ZagranEasy",
  }
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
            className="right-[2%] top-[1%] z-20 shadow-sm border border-slate-100 bg-white/80 backdrop-blur-md"
            duration={4}
            delay={0.8}
          />

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
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[1000px] -translate-x-1/2 rounded-full bg-blue-500/[0.035] blur-3xl dark:bg-blue-400/[0.05]" />
      <div className="relative mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-10 sm:py-24">
      {/* Локальные стили — дополнительный файл CSS не нужен */}
      <style>{`
        @keyframes resultsInfiniteScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 12px));
          }
        }

        .results-track {
          animation: resultsInfiniteScroll 35s linear infinite;
          will-change: transform;
        }

        .results-gallery:hover .results-track {
          animation-play-state: paused;
        }

        @media (max-width: 640px) {
          .results-track {
            animation-duration: 23s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .results-track {
            animation-play-state: paused;
          }
        }
      `}</style>

      {/* Декоративный фон */}
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[420px] w-[90%] -translate-x-1/2 rounded-full-full bg bg-gradient-to-r from-blue-100/60 via-sky-50/80 to-indigo-100/60 blur-3xl dark:from-blue-900/20 dark:via-sky-900/10 dark:to-indigo-900/20" />

      <FadeIn>
        {/* Заголовок */}
        <div className="mx-auto max-w-3xl text text text text text text balance text-pretty text-center">
          <div className="inline-flex items items items-center justify-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-4 py-2 text text-[text-[-pretty text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700 shadow-sm backdrop-blur dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-pretty dark:text-pretty dark:text-pretty dark:text-blue-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
            </span>

            Результаты наших студентов
          </div>

          <h2 className="mt-5 text-balance text--pretty text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            Поступления, которыми
            <span className="block bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              мы гордимся
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
            Реальные письма о зачислении студентов ZagranEasy в зарубежные
            университеты. За каждым документом — цель, подготовка и большая
            совместная работа.
          </p>
        </div>

        {/* Бесконечная галерея */}
        <div className="results-gallery relative mt-12 overflow-hidden sm:mt-16">
          {/* Плавное исчезновение карточек по краям */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-32 dark:from-[#0B132B] dark:via-[#0B132B]/80" />

          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-32 dark:from-[#0B132B] dark:via-[#0B132B]/80" />

          <div className="results-track flex w-max gap-4 py-6 sm:gap-6">
            {[...RESULTS_PHOTOS, ...RESULTS_PHOTOS].map((photo, index) => (
              <div
                key={`${photo.src}-${index}`}
                className="group relative h-[310px] w-[220px] shrink-0 cursor-pointer overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-2 shadow-[0_15px_45px_rgba(15,23,42,0.10)] transition-all duration-500 hover:-translate-y-3 hover:rotate-0 hover:shadow-[0_25px_70px_rgba(37,99,235,0.22)] sm:h-[430px] sm:w-[305px] dark:border-white/10 dark:bg-white/5"
              >
                <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-slate-100 dark:bg-slate-900">
                  <img
                    src={photo.src}
                    alt={
                      photo.alt ??
                      `Результат поступления студента ZagranEasy ${index + 1}`
                    }
                    loading={index < RESULTS_PHOTOS.length ? "eager" : "lazy"}
                    draggable={false}
                    className="h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />

                  {/* Мягкое затемнение */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-white/5 opacity-80 transition-opacity duration-300 group-hover:opacity-60" />

                  {/* Номер результата */}
                  <div className="absolute right-3 top-3 flex h-9 min-w-9 items-center justify-center rounded-full border border-white/30 bg-slate-950/40 px-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                    {String((index % RESULTS_PHOTOS.length) + 1).padStart(
                      2,
                      "0",
                    )}
                  </div>

                  {/* Подпись карточки */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <div className="translate-y-1 transition-transform duration-300 group-hover:translate-y-0">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-100">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-4 w-4"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>

                        Успешное поступление
                      </div>

                      <p className="mt-2 text-sm font-bold text-white sm:text-base">
                        Официальное письмо о зачислении
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Нижнее уведомление */}
        <div className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-5 py-3 text-center text-xs font-medium text-emerald-800 shadow-sm backdrop-blur sm:text-sm dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>

          Документы представлены с разрешения студентов
        </div>

        {/* Подсказка */}
        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          Наведите курсор на галерею, чтобы остановить движение
        </p>
      </FadeIn>
    </div>          
        </section>

      {/* Contact block */}
      {/* <div className="mx-auto max-w-6xl px-4 py-14 sm:px-10 sm:py-19">
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
      </div> */}

      <SiteFooter />
    </div>
  );
}
