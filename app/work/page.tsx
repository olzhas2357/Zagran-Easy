import type { Metadata } from "next";
import { fetchWorkCountries } from "@/lib/data";
import { waUrl } from "@/lib/utils";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { FadeIn } from "@/components/ui/FadeIn";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PAGE_META } from "@/lib/navigation";

export const metadata: Metadata = {
  title: PAGE_META["/work"].title,
  description: PAGE_META["/work"].description,
  openGraph: {
    title: PAGE_META["/work"].title,
    description: PAGE_META["/work"].description,
    url: "https://zagraneasy.kz/work",
  },
};

const CAREER_STEPS = [
  { num: 1, title: "Адаптация резюме", desc: "Переводим и оформляем резюме под стандарты страны найма." },
  { num: 2, title: "Подбор вакансий", desc: "Присылаем 5–10 актуальных вакансий под вашу специальность." },
  { num: 3, title: "Рабочий контракт и виза", desc: "Оформляем приглашение, рабочую визу и разрешение на работу." },
  { num: 4, title: "Перелёт и заселение", desc: "Помогаем с билетами и первым жильём на новом месте." },
  { num: 5, title: "Сопровождение на месте", desc: "Локальный куратор на связи первые 3 месяца работы." },
];

const POST_ADMISSION = [
  { icon: "🏡", title: "Локальная адаптация", desc: "Помогаем открыть счёт, оформить SIM-карту, найти жильё и разобраться с транспортом в первую неделю." },
  { icon: "💼", title: "Подработка и стажировки", desc: "Подбираем part-time вакансии и стажировки, совместимые с учебной визой и расписанием." },
  { icon: "🤝", title: "Комьюнити студентов", desc: "Подключаем к чату выпускников ZagranEasy в вашем городе — для поддержки и нетворкинга." },
];

export default async function WorkPage() {
  const countries = await fetchWorkCountries();

  return (
    <div className="bg-gradient-to-b from-[#F3F7FE] to-white">
      {/* Hero */}
      <div className="border-b border-ze-border">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-10 sm:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE4F0] bg-white py-1.5 pl-1.5 pr-3 text-[12.5px] font-medium text-slate-700">
            <span className="rounded-full bg-violet-500 px-1.5 py-0.5 text-[11px] font-bold text-white">💼</span>
            Не бросаем после выезда
          </div>
          <h1 className="mt-4 max-w-[760px] text-[28px] font-extrabold leading-[1.04] tracking-tight text-balance sm:text-[46px]">
            Работа за рубежом и поддержка после переезда
          </h1>
          <p className="mt-3.5 max-w-[600px] text-[14.5px] leading-relaxed text-ze-muted sm:text-[17px]">
            Трудоустройство, рабочая виза, контракт — и полное сопровождение уже на месте: от адаптации до
            карьерного роста.
          </p>
        </div>
      </div>

      {/* Post-Admission Support — critical highlight */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-10 sm:py-19">
        <FadeIn>
          <div className="text-[13px] font-semibold uppercase tracking-wide text-emerald-600">
            Мы рядом и после зачисления
          </div>
          <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[36px]">
            Поддержка после поступления и переезда
          </h2>
          <p className="mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-ze-muted sm:text-[16px]">
            Работа с клиентом не заканчивается визой. Мы сопровождаем на месте: помогаем адаптироваться, найти
            подработку и построить карьеру в новой стране.
          </p>
        </FadeIn>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {POST_ADMISSION.map((p) => (
            <FadeIn key={p.title}>
              <div className="h-full rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white text-[23px] shadow-sm">
                  {p.icon}
                </div>
                <div className="mt-4 text-[17px] font-bold text-emerald-900">{p.title}</div>
                <div className="mt-2 text-[14px] leading-relaxed text-emerald-800/80">{p.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Career track */}
      <div className="border-y border-ze-border bg-ze-surface py-14 sm:py-19">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Карьерный трек</div>
          <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[36px]">
            От резюме до первой зарплаты
          </h2>
          <div className="mt-9 flex flex-col gap-3.5">
            {CAREER_STEPS.map((s) => (
              <FadeIn key={s.num}>
                <div className="flex items-center gap-4.5 rounded-2xl border border-ze-border bg-white p-5">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#EBF1FE] text-[15px] font-bold text-ze-primary">
                    {s.num}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[15.5px] font-bold text-ze-ink">{s.title}</div>
                    <div className="mt-0.5 text-[13.5px] text-ze-muted">{s.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Countries / salary / vacancy grid */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-10 sm:py-19">
        <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Страны найма</div>
        <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[36px]">
          Зарплаты и вакансии по странам
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {countries.map((c) => (
            <FadeIn key={c.id}>
              <div className="overflow-hidden rounded-2xl border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="aspect-16/10">
                  <CoverPhoto src={c.imageUrl} alt={c.name} />
                </div>
                <div className="p-5">
                  <div className="text-[18px] font-bold">
                    {c.flag} {c.name}
                  </div>
                  <div className="mt-1.5 text-[13.5px] leading-snug text-ze-muted">{c.description}</div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.industries.map((ind) => (
                      <span
                        key={ind}
                        className="rounded-full bg-[#F1F5FB] px-2.5 py-1 text-[11.5px] font-medium text-slate-600"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl bg-violet-50 px-3.5 py-2.5 text-center text-[15px] font-bold text-violet-700">
                    {c.salaryRange} / мес.
                  </div>
                  <a
                    href={waUrl(`Здравствуйте! Интересует работа в стране: ${c.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block rounded-xl bg-ze-accent px-4 py-3 text-center text-[13.5px] font-semibold text-white hover:bg-ze-accent-dark"
                  >
                    Узнать вакансии
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 sm:px-10">
        <div className="mx-auto max-w-6xl pb-16">
          <div className="relative flex flex-col items-stretch gap-5.5 overflow-hidden rounded-[20px] bg-ze-primary p-6.5 text-white sm:flex-row sm:items-center sm:gap-8 sm:p-11">
            <div className="absolute -right-15 -top-15 h-[220px] w-[220px] rounded-full bg-white/7" />
            <div className="relative min-w-0 flex-1">
              <div className="text-[22px] font-extrabold tracking-tight sm:text-[30px]">
                Готовы к трудоустройству за рубежом?
              </div>
              <div className="mt-2 max-w-[520px] text-[14.5px] leading-relaxed text-white/86 sm:text-[16px]">
                Пришлите резюме — подберём вакансии и оценим шансы бесплатно.
              </div>
            </div>
            <a
              href={waUrl("Здравствуйте! Хочу узнать про работу за рубежом.")}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex-none rounded-2xl bg-white px-6 py-[15px] text-center text-[15.5px] font-bold text-ze-primary hover:bg-[#EBF1FE]"
            >
              Отправить резюме
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
