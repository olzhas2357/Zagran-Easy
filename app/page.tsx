import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  User,
  Users,
  Landmark,
  Languages,
  Stamp,
  Home as HomeIcon,
  MessageCircle,
  Calendar,
  MapPin,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HeartHandshake,
  Sparkles,
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
import { FullOurWork } from "@/components/home/FullOurWork";

const CHINA_SPRING_2027_SLUGS = [
  "south-china-university-of-technology",
  "shenzhen-university",
  "zhejiang-international-studies-university",
  "china-university-of-petroleum-east-china",
  "gdufs-south-china-business-college",
  "china-university-of-mining-and-technology",
];

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
    if (u.tuitionFrom === null) continue;
    const cur = cheapestByCountry.get(u.countryId);
    if (cur === undefined || u.tuitionFrom < cur) cheapestByCountry.set(u.countryId, u.tuitionFrom);
  }
  const universitiesBySlug = new Map(universities.map((university) => [university.slug, university]));
  const chinaSpringUniversities = CHINA_SPRING_2027_SLUGS.flatMap((slug) => {
    const university = universitiesBySlug.get(slug);
    return university ? [university] : [];
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ze-border bg-gradient-to-b from-[#F4F7FD] to-white dark:border-white/10 dark:bg-[#0B132B] dark:bg-none">
        <GradientSpots variant="hero" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-14 sm:flex-row sm:gap-14 sm:px-10 sm:py-20">
          <div className="min-w-0 flex-1">
            <h1 className="mt-4.5 text-[35px] font-extrabold leading-[1.05] tracking-tight text-balance dark:text-white sm:text-[60px]">
              Поступление за рубеж —
              <br />
              <span className="text-[#3255ad] dark:text-[#8FD9F5]">проще, чем кажется</span>
            </h1>
            <p className="mt-4 max-w-[520px] text-[15.5px] leading-relaxed text-ze-muted sm:text-[19px] dark:text-white/65">
              Помогаем выбрать университет, поступить, переехать и оставаться рядом на протяжении всего
              образовательного пути.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/quiz"
                className="rounded-2xl bg-ze-accent px-6 py-4 text-[16px] font-semibold text-white shadow-[0_8px_22px_rgba(26,86,219,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ze-accent-dark hover:shadow-[0_12px_28px_rgba(26,86,219,0.34)]"
              >
                Получить консультацию
              </Link>
              <Link
                href="/education"
                className="rounded-2xl border border-[#DDE4F0] bg-white px-[22px] py-4 text-[16px] font-semibold text-ze-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ze-primary hover:text-ze-primary hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)] dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:hover:border-white/40 dark:hover:bg-white/10"
              >
                Посмотреть университеты
              </Link>
            </div>
            <div className="mt-10.5 inline-flex items-center gap-2.5 rounded-full border border-ze-border/80 bg-white/70 py-1.5 pl-1.5 pr-4 text-[13.5px] text-ze-muted shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.06] dark:text-white/60">
              <div className="flex">
                <div className="h-8 w-8 rounded-full border-2 border-white bg-[#DCE6FA] dark:border-[#0B132B] dark:bg-[#2D4A8A]" />
                <div className="-ml-2.5 h-8 w-8 rounded-full border-2 border-white bg-[#C7D8F7] dark:border-[#0B132B] dark:bg-[#3B5FA0]" />
                <div className="-ml-2.5 h-8 w-8 rounded-full border-2 border-white bg-[#B0C9F4] dark:border-[#0B132B] dark:bg-[#4A75B8]" />
              </div>
              <span className="font-medium text-ze-ink dark:text-white">3&nbsp;200+</span>&nbsp;клиентов уже уехали с нами
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
                loading="eager"
              />

              {/* Перекрывающее фото — справа снизу */}
              <FloatingPhoto
                src="https://fzvkmnlcrdfxjnqepxrs.supabase.co/storage/v1/object/sign/images/ChatGPT%20Image%20Sep%2014,%202026,%2001_15_53%20AM.png?token=eyJraWQiOiIwY2UyMDkwNi0zZjc3LTRhYTUtYTAyYi0yMGExY2Q5ZjI5ZjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvQ2hhdEdQVCBJbWFnZSBTZXAgMTQsIDIwMjYsIDAxXzE1XzUzIEFNLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODkzMzA1OTMsImV4cCI6MTgyMDg2NjU5M30._sndREWMO2HdAhNN0_ouyacCVoCUPvQdOty_vAhHonQ"
                alt="Floating photo"
                className="absolute right-0 bottom-2 h-[60%] w-[52%] rounded-3xl object-cover shadow-xl border border-white/60 z-10"
                range={8}
                duration={4.2}
                delay={0.4}
                rotateRange={2}
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
                className="right-[2%] top-[4%] z-20 shadow-sm border border-slate-100 bg-white/80 backdrop-blur-md"
                duration={4}
                delay={0.8}
              />

            </div>
          </div>
        </div>
      </section>


      {/* О компании + реел-лента */}
      <section className="py-11 sm:py-16 dark:bg-[#0B132B]">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <FadeIn>
            <div className="max-w-[640px]">
              <div className="inline-flex items-center rounded-full border border-ze-border bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-ze-primary shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-white/15 dark:bg-white/[0.06] dark:text-[#8FD9F5]">
                {ABOUT.eyebrow}
              </div>
              <h2 className="mt-3.5 text-[25px] font-extrabold tracking-tight sm:text-[36px] dark:text-white">{ABOUT.heading}</h2>
              <p className="mt-3.5 text-[15px] leading-relaxed text-ze-muted sm:text-[16.5px] dark:text-white/65">{ABOUT.body}</p>
            </div>
          </FadeIn>
        </div>
        <div className="mt-8 sm:mt-10">
          <MediaReel items={MEDIA_REEL_ITEMS} />
        </div>
      </section>

      {/* Наши услуги */}
      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-10 dark:bg-[#0B132B]">
        <FadeIn>
          <div className="max-w-[640px]">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[12.5px] font-semibold text-ze-primary dark:border-white/15 dark:bg-white/[0.06] dark:text-[#8FD9F5]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Наши услуги
            </div>
            <h2 className="mt-3.5 text-[25px] font-extrabold tracking-tight sm:text-[36px] dark:text-white">
              Всё необходимое для вашего образования
            </h2>
            <p className="mt-3.5 text-[15px] leading-relaxed text-ze-muted sm:text-[16.5px] dark:text-white/65">
              От выбора университета до адаптации, обучения и первых шагов в карьере.
            </p>
          </div>
        </FadeIn>
        <div className="mt-7 grid grid-cols-2 gap-3.5 sm:mt-10 sm:grid-cols-4 sm:gap-5">
          {[  
          {
            id: "education",
            Icon: GraduationCap,
            title: "Образование",
            text: "Программы и возможности для получения новых знаний и квалификации",
            color: "blue",
            href: "/education",
          },
          {
            id: "language",
            Icon: Languages,
            title: "Языковое образование",
            text: "Языковые курсы, подготовка к экзаменам и обучение за рубежом",
            color: "emerald",
            href: "/languages",
          },
          {
            id: "students",
            Icon: User,
            title: "Студент",
            text: "Поступление, обучение, адаптация и развитие карьеры",
            color: "violet",
            href: "/about",
          },
          {
            id: "universities",
            Icon: Landmark,
            title: "Университеты",
            text: "Помогаем университетам находить студентов и развивать международные программы",
            color: "amber",
            href: "/education",
          },
          ].map((s, i) => {
            const colors = SERVICE_COLORS[s.color];
            const underline = colors.text.replace("text-", "bg-");
            return (
              <FadeIn key={s.id} delay={i * 0.06} className="h-full">
                <TiltCard maxTilt={6} className="h-full">
                  <Link
                    href="/education"
                    className="group flex h-full flex-col gap-3 rounded-[22px] border border-ze-border/80 bg-white p-4.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_36px_rgba(15,23,42,0.09)] sm:p-6 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none dark:hover:border-white/20"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.bg} transition-transform duration-300 group-hover:scale-105`}
                    >
                      <s.Icon className={`h-5.5 w-5.5 sm:h-6 sm:w-6 ${colors.text}`} strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="text-[14.5px] font-bold leading-snug sm:text-[17px] dark:text-white">{s.title}</div>
                      <div className={`mt-1.5 h-[3px] w-7 rounded-full ${underline}`} />
                    </div>
                    <div className="flex-1 text-[12px] leading-relaxed text-ze-muted sm:text-[13.5px] dark:text-white/60">{s.text}</div>
                    <div className={`inline-flex w-fit items-center gap-1 text-[12.5px] font-semibold ${colors.text} sm:text-[13.5px]`}>
                      Подробнее
                      <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                    </div>
                  </Link>
                </TiltCard>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* Статистика */}
      <section className="relative px-4 py-5 sm:px-10 dark:bg-[#0B132B]">
        <div className="relative mx-auto max-w-6xl">
          <GradientSpots variant="section" />
          <div className="relative grid grid-cols-1 gap-4.5 rounded-[20px] border border-[#E4EBF8] bg-[#F5F8FE] p-6 sm:grid-cols-3 sm:gap-8 sm:p-9 dark:border-white/10 dark:bg-white/[0.04]">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col gap-1 ${i > 0 ? "border-t border-[#DDE6F5] pt-4.5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0 dark:border-white/10" : ""}`}
              >
                <AnimatedCounter
                  value={s.value}
                  suffix={s.suffix}
                  className="text-[32px] font-extrabold leading-none tracking-tight text-ze-primary sm:text-[46px] dark:text-[#8FD9F5]"
                />
                <div className="text-[13.5px] font-medium text-ze-muted sm:text-[15px] dark:text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Университеты для студентов */}
      <section id="study" className="border-y border-ze-border bg-[#F8FAFC] py-11 sm:py-19 dark:border-white/10 dark:bg-[#0B132B]">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-11">
            <div className="max-w-[560px]">
              <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary dark:text-[#8FD9F5]">
                Университеты для студентов
              </div>
              <h2 className="mt-2 text-[25px] font-extrabold tracking-tight text-ze-ink sm:text-[38px] dark:text-white">
                Найдём университет, который подходит именно вам
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ze-muted sm:text-[16px] dark:text-white/65">
                Сравнивайте университеты, программы, стоимость обучения, требования и возможности поступления в
                одном месте.
              </p>
            </div>
            <Link
              href="/education"
              className="hidden flex-none text-[14.5px] font-semibold text-ze-primary sm:block dark:text-[#8FD9F5]"
            >
              Найти университет →
            </Link>
          </div>
          <div className="flex flex-wrap gap-5 sm:gap-6">
            {countries.map((c) => (
              <FadeIn key={c.id} className="w-full sm:w-[300px]">
                <Link
                  href="/education"
                  className="group block overflow-hidden rounded-[22px] border border-ze-border/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_20px_44px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                      <CoverPhoto src={c.imageUrl} alt={c.name} />
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="text-[16px] font-bold text-ze-ink dark:text-white">
                      {c.flag} {c.name}
                    </div>
                    <div className="mt-1.5 text-[13px] leading-snug text-ze-muted dark:text-white/60">
                      {universityCountByCountry.get(c.id) || 0} университетов · {c.cities.slice(0, 2).join(", ")}
                    </div>
                    {/* <div className="mt-3 inline-flex items-center rounded-lg bg-ze-primary/8 px-2.5 py-1 text-[13.5px] font-semibold text-ze-primary dark:bg-white/10 dark:text-[#8FD9F5]">
                      {formatPrice(cheapestByCountry.get(c.id) || 0)} / год
                    </div> */}
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <Link
            href="/education"
            className="mt-6 block text-center text-[14.5px] font-semibold text-ze-primary sm:hidden dark:text-[#8FD9F5]"
          >
            Найти университет →
          </Link>

          {chinaSpringUniversities.length > 0 && (
            <div className="mt-12 rounded-[28px] border border-[#F1D8C9] bg-gradient-to-br from-[#FFF8F2] via-white to-[#FFFDF8] p-5 sm:mt-16 sm:p-8 dark:border-white/10 dark:from-white/[0.06] dark:via-white/[0.03] dark:to-white/[0.05]">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-[620px]">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#F2D7C7] bg-white px-5.5 py-2.5 text-[20.5px] font-bold text-[#B54727] dark:border-white/15 dark:bg-white/[0.06] dark:text-[#FFC29D]">
                    <span aria-hidden="true">🇨🇳</span>
                    Весенний набор · 2027
                  </div>
                  <h3 className="mt-3.5 text-[24px] font-extrabold tracking-tight text-ze-ink sm:text-[32px] dark:text-white">
                    Университеты Китая — весна 2027
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-ze-muted sm:text-[15px] dark:text-white/65">
                    Подборка университетов и программ с набором на весенний семестр 2027 года.
                    Откройте карточку, чтобы посмотреть условия поступления.
                  </p>
                </div>
                <Link
                  href="/education"
                  className="inline-flex flex-none items-center gap-2 text-[14px] font-bold text-[#B54727] hover:text-[#8F321B] dark:text-[#FFC29D] dark:hover:text-white"
                >
                  Все университеты
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {chinaSpringUniversities.map((university, index) => (
                  <FadeIn key={university.id} delay={index * 0.05} className="h-full">
                    <Link
                      href={`/education/${university.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-ze-border/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#E7BBA4] hover:shadow-[0_16px_36px_rgba(86,49,28,0.12)] dark:border-white/10 dark:bg-[#101A34] dark:hover:border-white/25"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-[#F6F0EB]">
                        <CoverPhoto src={university.imageUrl} alt={university.name} />
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#A33C21] shadow-sm dark:bg-[#0B132B]/90 dark:text-[#FFC29D]">
                          Весна 2027
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <h4 className="text-[16px] font-extrabold leading-snug text-ze-ink group-hover:text-[#A33C21] dark:text-white dark:group-hover:text-[#FFC29D]">
                          {university.name}
                        </h4>
                        <div className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-ze-muted dark:text-white/60">
                          <MapPin className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
                          {university.city}
                        </div>
                        <p className="mt-3 line-clamp-2 flex-1 text-[13px] leading-relaxed text-ze-muted dark:text-white/60">
                          {university.description}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-ze-primary dark:text-[#8FD9F5]">
                          Смотреть университет
                          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                        </span>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <StudentJourney />
      {/* <TurkeyExperience /> */}

      <FullOurWork/>

      {/* Долгосрочная поддержка */}
      <section className="py-11 sm:py-19 dark:bg-[#0B132B]">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <FadeIn>
            <div className="max-w-[640px]">
              <div className="inline-flex items-center rounded-full border border-ze-border bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-ze-primary shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-white/15 dark:bg-white/[0.06] dark:text-[#8FD9F5]">
                Долгосрочная поддержка
              </div>
              <h2 className="mt-3.5 text-[25px] font-extrabold tracking-tight sm:text-[36px] dark:text-white">
                Мы не заканчиваем работу после поступления
              </h2>
              <p className="mt-3.5 text-[15px] leading-relaxed text-ze-muted sm:text-[16.5px] dark:text-white/65">
                Наша задача — помочь студенту не только поступить, но и успешно адаптироваться, учиться и строить
                карьеру.
              </p>
            </div>
          </FadeIn>
          <div className="mt-7 grid grid-cols-1 gap-3.5 sm:mt-9 sm:grid-cols-3 sm:gap-5">
            {[
              { Icon: HomeIcon, title: "Первый год", text: "Помощь с общежитием и адаптацией", color: "blue" },
              { Icon: MessageCircle, title: "Период обучения", text: "Консультации и постоянная связь", color: "emerald" },
              { Icon: Calendar, title: "5 лет", text: "Поддержка студента на протяжении образовательного пути", color: "violet" },
              // { icon: "💼", title: "Магистратура", text: "Помощь с поиском стажировки и работы" },
            ].map((c, i) => {
              const colors = SERVICE_COLORS[c.color];
              return (
                <FadeIn key={c.title} delay={i * 0.05}>
                  <div className="flex h-full flex-col gap-3 rounded-[22px] border border-ze-border/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)] sm:p-6 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none dark:hover:border-white/20">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.bg}`}>
                      <c.Icon className={`h-6 w-6 ${colors.text}`} strokeWidth={1.75} />
                    </div>
                    <div className="text-[16px] font-bold dark:text-white">{c.title}</div>
                    <div className="text-[13px] leading-relaxed text-ze-muted dark:text-white/60">{c.text}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Рассрочка */}
      <section className="px-4 sm:px-10 dark:bg-[#0B132B]">
        <div className="mx-auto max-w-6xl py-5">
          <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#1a56db] to-[#0f3d9e] p-6.5 text-white sm:p-8 lg:p-11">
            <div className="pointer-events-none absolute -right-15 -top-15 h-[220px] w-[220px] rounded-full bg-white/8 blur-[2px]" />
            <div className="pointer-events-none absolute -bottom-20 left-10 h-[200px] w-[200px] rounded-full bg-[#66ccff]/12 blur-[70px]" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/75">Рассрочка на обучение</div>
                <h2 className="mt-1 text-[24px] font-extrabold tracking-tight sm:text-[30px]">Kaspi рассрочка</h2>
              </div>
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.14)] sm:h-20 sm:w-20">
                <Image src="/Logo_of_Kaspi_bank.png" alt="Kaspi.kz" width={80} height={80} className="h-full w-full object-contain" />
              </div>
            </div>

            <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { term: "12", message: "Здравствуйте! Хочу узнать условия рассрочки 0-0-12." },
                { term: "24", message: "Здравствуйте! Хочу узнать условия рассрочки 0-0-24." },
              ].map((plan) => (
                <div key={plan.term} className="flex flex-col rounded-2xl bg-white/12 p-5 backdrop-blur-sm sm:p-6">
                  <div className="flex items-center gap-2 text-[39px] font-extrabold leading-none tracking-tight sm:text-[48px]">
                    0<span className="opacity-50">·</span>0<span className="opacity-50">·</span>{plan.term}
                  </div>
                  <p className="mt-3 max-w-[420px] text-[14px] leading-relaxed text-white/86 sm:text-[15px]">
                    Без первоначального взноса и переплаты. Оформление в офисе за 15 минут.
                  </p>
                  <a
                    href={waUrl(plan.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-[14px] font-bold text-ze-primary shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#EBF1FE]"
                  >
                    Узнать условия
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Студентам и родителям */}
      <section className="border-y border-ze-border bg-ze-surface py-11 sm:py-19 dark:border-white/10 dark:bg-[#0B132B]">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <FadeIn>
            <div className="inline-flex items-center rounded-full border border-ze-border bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-ze-primary shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-white/15 dark:bg-white/[0.06] dark:text-[#8FD9F5]">
              Для всей семьи
            </div>
            <h2 className="mt-3.5 max-w-[560px] text-[25px] font-extrabold tracking-tight sm:text-[36px] dark:text-white">
              Родители знают, что их ребёнок не один
            </h2>
          </FadeIn>
          <div className="mt-7 grid grid-cols-1 gap-4.5 sm:mt-9 sm:grid-cols-2 sm:gap-6">
            {[
              {
                title: "Студент",
                Icon: User,
                items: ["Университет", "Поступление", "Переезд", "Общежитие", "Обучение", "Карьерное развитие"],
                color: "blue",
              },
              {
                title: "Родитель",
                Icon: Users,
                items: [
                  "Информация о процессе",
                  "Связь с менеджером",
                  "Понимание этапов",
                  "Поддержка ребёнка",
                  "Долгосрочное сопровождение",
                ],
                color: "amber",
              },
            ].map((card, i) => {
              const colors = SERVICE_COLORS[card.color];
              return (
                <FadeIn key={card.title} delay={i * 0.06}>
                  <div className="h-full rounded-[22px] border border-ze-border/80 bg-white p-5.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] sm:p-7 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 flex-none items-center justify-center rounded-2xl ${colors.bg}`}>
                        <card.Icon className={`h-5.5 w-5.5 ${colors.text}`} strokeWidth={1.75} />
                      </div>
                      <div className="text-[17px] font-bold text-ze-ink dark:text-white">{card.title}</div>
                    </div>
                    <ul className="mt-5 flex flex-col gap-3">
                      {card.items.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-[14.5px] text-ze-ink dark:text-white/75">
                          <CheckCircle2 className={`h-4.5 w-4.5 flex-none ${colors.text}`} strokeWidth={2} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {card.title === "Родитель" && (
                      <Link href="/parents/login" className="mt-6 inline-flex items-center rounded-xl bg-ze-primary px-4 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-ze-primary-dark">
                        Войти в кабинет
                      </Link>
                    )}
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Почему ZagranEasy */}
      <section className="py-11 sm:py-19 dark:bg-[#0B132B]">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <FadeIn>
            <h2 className="max-w-[560px] text-[22px] font-extrabold tracking-tight sm:text-[32px] dark:text-white">
              Почему выбирают ZagranEasy
            </h2>
          </FadeIn>
          <div className="mt-7 grid grid-cols-2 gap-3.5 sm:mt-9 sm:grid-cols-4 sm:gap-5">
            {[
              { Icon: ShieldCheck, title: "Надёжно", text: "Работаем прозрачно и сопровождаем каждый этап.", color: "blue" },
              { Icon: Zap, title: "Быстро", text: "Помогаем решать вопросы оперативно.", color: "amber" },
              { Icon: CheckCircle2, title: "Удобно", text: "Все основные процессы собраны в одном месте.", color: "emerald" },
              { Icon: HeartHandshake, title: "Рядом", text: "Остаёмся на связи после поступления.", color: "violet" },
            ].map((b, i) => {
              const colors = SERVICE_COLORS[b.color];
              return (
                <FadeIn key={b.title} delay={i * 0.05}>
                  <div className="flex h-full flex-col items-center gap-2.5 rounded-[22px] border border-ze-border/70 bg-white p-4.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)] sm:items-start sm:p-6 sm:text-left dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.bg}`}>
                      <b.Icon className={`h-6 w-6 ${colors.text}`} strokeWidth={1.75} />
                    </div>
                    <div className="text-[16px] font-bold dark:text-white">{b.title}</div>
                    <div className="text-[13px] leading-relaxed text-ze-muted dark:text-white/60">{b.text}</div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Квиз */}
      <section className="border-y border-ze-border bg-ze-surface py-11 sm:py-19 dark:border-white/10 dark:bg-[#0B132B]">
        <div className="mx-auto max-w-[800px] px-4 sm:px-10">
          <LandingQuiz />
        </div>
      </section>

      {/* Отзывы */}
      <section className="py-11 sm:py-19 dark:bg-[#0B132B]">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <ReviewsCarousel reviews={reviews} />
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="px-4 pb-11 sm:px-10 sm:pb-19 dark:bg-[#0B132B]">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[28px] border border-ze-border/70 bg-gradient-to-b from-[#F4F8FE] to-white p-8 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-16 dark:border-white/10 dark:bg-white/[0.04] dark:bg-none dark:shadow-none">
              <div className="pointer-events-none absolute -left-20 -top-24 h-[280px] w-[280px] rounded-full bg-[#1a56db]/8 blur-[100px]" />
              <div className="pointer-events-none absolute -right-16 -bottom-28 h-[260px] w-[260px] rounded-full bg-[#25d366]/8 blur-[100px]" />

              <div className="relative inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[12.5px] font-semibold text-ze-primary dark:border-white/15 dark:bg-white/[0.06] dark:text-[#8FD9F5]">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                Начните сегодня
              </div>
              <h2 className="relative text-[25px] font-extrabold tracking-tight sm:text-[40px] dark:text-white">Готовы начать?</h2>
              <p className="relative max-w-[480px] text-[14.5px] leading-relaxed text-ze-muted sm:text-[16.5px] dark:text-white/65">
                Расскажите о своих целях — мы поможем определить следующий шаг.
              </p>
              <div className="relative mt-2 flex flex-wrap justify-center gap-2.5">
                <a
                  href={waUrl("Здравствуйте! Хочу получить консультацию.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-ze-primary px-7 py-4 text-[16px] font-semibold text-white shadow-[0_8px_24px_rgba(26,86,219,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ze-primary-dark hover:shadow-[0_10px_28px_rgba(26,86,219,0.32)]"
                >
                  Получить консультацию
                </a>
                <Link
                  href="/education"
                  className="rounded-2xl border border-[#DDE4F0] bg-white px-[22px] py-4 text-[16px] font-semibold text-ze-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ze-primary hover:text-ze-primary dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:hover:border-white/40"
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
