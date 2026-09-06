import type { Metadata } from "next";
import { getVisaSteps, getVisaServices } from "@/lib/data";
import { waUrl } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { VisaTimeline } from "@/components/visa/VisaTimeline";
import { PAGE_META } from "@/lib/navigation";

export const metadata: Metadata = {
  title: PAGE_META["/visa-usa"]?.title ?? "Виза в США",
  description: PAGE_META["/visa-usa"]?.description ?? "Оформление визы в США",
  openGraph: {
    title: PAGE_META["/visa-usa"]?.title ?? "Виза в США",
    description: PAGE_META["/visa-usa"]?.description ?? "Оформление визы в США",
    url: "https://zagraneasy.kz/visa-usa",
  },
};

export default function VisaUsaPage() {
  const steps = getVisaSteps();
  const services = getVisaServices();

  return (
    <div className="bg-gradient-to-b from-[#F3F7FE] to-white">
      {/* Hero */}
      <div className="border-b border-ze-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-12 sm:flex-row sm:gap-14 sm:px-10 sm:py-18">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE4F0] bg-white py-1.5 pl-1.5 pr-3 text-[12.5px] font-medium text-slate-700">
              <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[11px] font-bold text-white">🗽 USA</span>
              Полное сопровождение визы
            </div>
            <h1 className="mt-4 text-[30px] font-extrabold leading-[1.05] tracking-tight text-balance sm:text-[50px]">
              Виза в США
              <br />с 98% одобрений
            </h1>
            <p className="mt-3.5 max-w-[520px] text-[14.5px] leading-relaxed text-ze-muted sm:text-[17px]">
              Готовим анкету DS-160, тренируем на реальных вопросах консула и записываем на собеседование в
              удобную дату. Ведём клиента от первой консультации до штампа в паспорте.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href={waUrl("Здравствуйте! Хочу получить визу в США.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-ze-accent px-6 py-4 text-[16px] font-semibold text-white shadow-[0_6px_18px_rgba(26,86,219,0.28)] transition-colors hover:bg-ze-accent-dark"
              >
                Начать оформление
              </a>
            </div>
          </div>
          <div className="w-full min-w-0 flex-1">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="col-span-2 rounded-[20px] border border-[#E4EBF8] bg-[#F5F8FE] p-6 text-center sm:p-9">
                <div className="text-[46px] font-extrabold leading-none tracking-tight text-ze-primary sm:text-[60px]">
                  98%
                </div>
                <div className="mt-1.5 text-[14px] font-medium text-ze-muted">одобренных виз с ZagranEasy</div>
              </div>
              <div className="rounded-2xl border border-ze-border bg-white p-5 text-center">
                <div className="text-[26px] font-extrabold text-ze-ink">$185</div>
                <div className="mt-1 text-[12.5px] text-ze-muted">консульский сбор</div>
              </div>
              <div className="rounded-2xl border border-ze-border bg-white p-5 text-center">
                <div className="text-[26px] font-extrabold text-ze-ink">7</div>
                <div className="mt-1 text-[12.5px] text-ze-muted">шагов до визы</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-10 sm:py-19">
        <FadeIn>
          <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Процесс</div>
          <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[36px]">Путь к визе за 7 шагов</h2>
        </FadeIn>
        <div className="mt-9">
          <VisaTimeline steps={steps} />
        </div>
      </div>

      {/* DS-160 & interview prep modules */}
      <div className="border-y border-ze-border bg-ze-surface py-14 sm:py-19">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Что входит</div>
          <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[36px]">Модули подготовки</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {services.map((s) => (
              <FadeIn key={s.title}>
                <div className="h-full rounded-2xl border border-ze-border bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#EBF1FE] text-[23px]">
                    {s.icon}
                  </div>
                  <div className="mt-4 text-[17px] font-bold">{s.title}</div>
                  <div className="mt-2 text-[14px] leading-relaxed text-ze-muted">{s.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Interview prep highlight */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-10 sm:py-19">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-14">
          <FadeIn>
            <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">DS-160</div>
            <h3 className="mt-2 text-[22px] font-bold tracking-tight sm:text-[28px]">
              Анкета без единой ошибки
            </h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ze-muted sm:text-[16px]">
              Одна опечатка в DS-160 может привести к отказу. Мы заполняем анкету вместе с вами, проверяем каждое
              поле дважды и готовим пакет подтверждающих документов под ваш профиль — учёбу, работу или туризм.
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="text-[13px] font-semibold uppercase tracking-wide text-ze-primary">Собеседование</div>
            <h3 className="mt-2 text-[22px] font-bold tracking-tight sm:text-[28px]">
              Симуляция реального интервью
            </h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ze-muted sm:text-[16px]">
              Проводим тренировочное собеседование с вопросами, которые реально задают консулы в Алматы. Разбираем
              ответы, работаем над уверенностью и языком тела — до полной готовности.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 sm:px-10">
        <div className="mx-auto max-w-6xl pb-16">
          <div className="relative flex flex-col items-stretch gap-5.5 overflow-hidden rounded-[20px] bg-ze-primary p-6.5 text-white sm:flex-row sm:items-center sm:gap-8 sm:p-11">
            <div className="absolute -right-15 -top-15 h-[220px] w-[220px] rounded-full bg-white/7" />
            <div className="relative min-w-0 flex-1">
              <div className="text-[22px] font-extrabold tracking-tight sm:text-[30px]">
                Запишитесь на первую консультацию
              </div>
              <div className="mt-2 max-w-[520px] text-[14.5px] leading-relaxed text-white/86 sm:text-[16px]">
                Оценим ваши шансы, распишем сроки и стоимость — бесплатно, за 15 минут в WhatsApp.
              </div>
            </div>
            <a
              href={waUrl("Здравствуйте! Хочу консультацию по визе в США.")}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex-none rounded-2xl bg-white px-6 py-[15px] text-center text-[15.5px] font-bold text-ze-primary hover:bg-[#EBF1FE]"
            >
              Записаться
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
