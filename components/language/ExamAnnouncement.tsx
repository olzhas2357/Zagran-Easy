import {
  AlertTriangle,
  CalendarDays,
  Check,
  ExternalLink,
  FileText,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { waUrl } from "@/lib/utils";

const EXAM_PRICES = [
  ["HSK 1", "8 000 ₸"],
  ["HSK 2", "11 000 ₸"],
  ["HSK 3", "13 000 ₸"],
  ["HSK 4", "15 000 ₸"],
  ["HSK 5", "20 000 ₸"],
  ["HSK 6", "30 000 ₸"],
  ["HSKK 初级", "10 000 ₸"],
  ["HSKK 中级", "13 000 ₸"],
  ["HSKK 高级", "19 000 ₸"],
] as const;

const EXAM_DATES = [
  {
    examDate: "13 декабря 2026",
    pbtDeadline: "16 ноября 2026",
    ibtDeadline: "3 декабря 2026",
  },
  {
    examDate: "9 января 2027",
    pbtDeadline: "13 декабря 2026",
    ibtDeadline: "30 декабря 2026",
  },
  {
    examDate: "14 марта 2027",
    pbtDeadline: "15 февраля 2027",
    ibtDeadline: "4 марта 2027",
  },
  {
    examDate: "10 апреля 2027",
    pbtDeadline: "14 марта 2027",
    ibtDeadline: "31 марта 2027",
  },
  {
    examDate: "16 мая 2027",
    pbtDeadline: "19 апреля 2027",
    ibtDeadline: "6 мая 2027",
  },
] as const;

const REQUIRED_DOCUMENTS = [
  "Фото 3×4 (портрет)",
  "Электронный формат паспорта (страница с данными)",
  "Контактный номер телефона",
  "Электронная почта",
  "Уровень HSK и HSKK, который вы планируете сдавать",
];

const TEST_CENTERS = [
  {
    name: "Институт Конфуция КазНУ имени аль-Фараби",
    address: "Алматы, улица Карасай батыра, 95а",
    href: "https://www.instagram.com/conf.kaznu/",
    linkLabel: "Страница института",
  },
  {
    name: "Казахский университет международных отношений и мировых языков имени Абылай хана",
    address: "Алматы, улица Муратбаева, 200",
  },
  {
    name: "Институт Конфуция при Евразийском национальном университете им. Л.Н. Гумилева",
    address: "Астана, пр. Бауыржана Момышулы, 19а",
  },

  {
    name: "Институт Конфуция при Карагандинском техническом университете",
    address: "Караганда, пр. Нурсултана Назарбаева, 56/1",
  },
  {
    name: "Shakarim University",
    address: "Семей, ул. Кашаганова, 2",
  },
  {
    name: "Института Конфуция при АРУ им. К. Жубанова",
    address: "Актобе, пр. Алии Молдагуловой, 34",
  },
] as const;

export function ExamAnnouncement() {
  return (
    <section className="relative overflow-hidden bg-[#F5F8FF] py-16 sm:py-20 lg:py-24 dark:bg-[#0B132B]">
      {/* background decoration */}
      <div className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-[#EDF4FF] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-[#2563EB] dark:border-white/10 dark:bg-white/[0.06] dark:text-[#8DDDF5]">
              <CalendarDays className="h-4 w-4" />
              Международный экзамен
            </div>

            <h2 className="mt-5 text-[36px] font-black leading-[1.03] tracking-[-0.035em] text-[#101828] sm:text-[48px] lg:text-[58px] dark:text-white">
              Регистрация на
              <br />
              <span className="text-[#2563EB] dark:text-[#67D5F5]">
                HSK и HSKK
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-[16px] leading-7 text-[#52637A] sm:text-[18px] dark:text-white/65">
              Зарегистрируйтесь на международный экзамен по китайскому
              языку. Мы поможем подготовить необходимые документы и
              пройти регистрацию.
            </p>
          </div>

          {/* Main content */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* LEFT — prices */}
            <div className="rounded-[28px] border border-[#E3EAF5] bg-white p-5 shadow-[0_20px_60px_rgba(35,70,120,0.08)] sm:p-7 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-none">
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#70829A] dark:text-white/50">
                    Даты экзаменов HSK и HSKK
                  </p>

                  <p className="mt-1 text-[20px] font-black tracking-tight text-[#101828] dark:text-white sm:text-[25px]">
                    Декабрь 2026 — май 2027
                  </p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-[#EEF5FF] px-4 py-3 text-[14px] font-bold text-[#2563EB] dark:bg-blue-400/10 dark:text-[#8DDDF5]">
                  <CalendarDays className="h-4 w-4" />
                  5 экзаменационных сессий
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[20px] border border-[#E3EAF5] dark:border-white/10">
                <div className="hidden grid-cols-[1.15fr_1fr_1fr] gap-4 bg-[#F3F7FD] px-5 py-3 sm:grid dark:bg-white/[0.06]">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#70829A] dark:text-white/50">
                    Дата экзамена
                  </p>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#70829A] dark:text-white/50">
                    PBT · бумажный
                  </p>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#70829A] dark:text-white/50">
                    iBT · компьютерный
                  </p>
                </div>
                {EXAM_DATES.map(({ examDate, pbtDeadline, ibtDeadline }) => (
                  <div
                    key={examDate}
                    className="grid gap-3 border-t border-[#E8EEF7] bg-white p-4 first:border-t-0 sm:grid-cols-[1.15fr_1fr_1fr] sm:items-center sm:gap-4 sm:px-5 dark:border-white/10 dark:bg-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#EEF5FF] text-[#2586D8] dark:bg-blue-400/10 dark:text-[#8DDDF5]">
                        <CalendarDays className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8090A5] sm:hidden dark:text-white/45">
                          Экзамен
                        </p>
                        <p className="mt-0.5 text-[14px] font-extrabold text-[#172033] dark:text-white">
                          {examDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAFD] px-3 py-2.5 sm:bg-transparent sm:px-0 sm:py-0 dark:bg-white/[0.04] sm:dark:bg-transparent">
                      <p className="text-[11px] font-bold text-[#70829A] sm:hidden dark:text-white/50">
                        PBT · бумажный
                      </p>
                      <p className="text-[13px] font-bold text-[#405269] dark:text-white/75">
                        {pbtDeadline}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAFD] px-3 py-2.5 sm:bg-transparent sm:px-0 sm:py-0 dark:bg-white/[0.04] sm:dark:bg-transparent">
                      <p className="text-[11px] font-bold text-[#70829A] sm:hidden dark:text-white/50">
                        iBT · компьютерный
                      </p>
                      <p className="text-[13px] font-bold text-[#405269] dark:text-white/75">
                        {ibtDeadline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-start gap-2.5 rounded-[14px] bg-[#EEF5FF] px-4 py-3 dark:bg-blue-400/[0.07]">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-[#2586D8] dark:text-[#8DDDF5]" />
                <p className="text-[12px] leading-5 text-[#52637A] dark:text-white/60">
                  Дедлайн зависит от формата. Уточните доступность экзамена и
                  свободные места в выбранном центре перед регистрацией.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-[20px] font-extrabold tracking-tight text-[#101828] dark:text-white">
                  Стоимость экзаменов
                </h3>

                <p className="mt-1 text-[14px] text-[#70829A] dark:text-white/50">
                  Выберите необходимый уровень экзамена
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {EXAM_PRICES.map(([exam, price]) => (
                    <div
                      key={exam}
                      className="group flex items-center justify-between gap-4 rounded-[16px] border border-[#E8EEF7] bg-[#F8FAFD] px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B8D9F8] hover:bg-[#F0F7FF] hover:shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
                    >
                      <span className="text-[14px] font-bold text-[#172033] dark:text-white">
                        {exam}
                      </span>

                      <span className="whitespace-nowrap text-[14px] font-extrabold text-[#2586D8] dark:text-[#8DDDF5]">
                        {price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-[18px] border border-[#F8DFAC] bg-[#FFF9EC] p-4 dark:border-amber-300/15 dark:bg-amber-300/[0.07]">
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-300/10">
                  <AlertTriangle className="h-4.5 w-4.5 text-amber-600 dark:text-amber-300" />
                </div>

                <p className="text-[13.5px] leading-6 text-[#755A20] dark:text-amber-100/80">
                  Для уровней <strong>HSK 3, 4, 5 и 6</strong> сдача
                  устного экзамена HSKK обязательна. Регистрация только
                  на письменный экзамен для этих уровней не принимается.
                </p>
              </div>
            </div>

            {/* RIGHT — registration */}
          <div className="flex flex-col self-start rounded-[28px] border border-[#DCE8F7] bg-gradient-to-b from-[#EFF7FF] to-[#EAF8FC] p-5 shadow-[0_20px_60px_rgba(35,70,120,0.07)] sm:p-7 dark:border-white/10 dark:from-[#152A3A] dark:to-[#18384A] dark:shadow-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#2586D8] shadow-sm dark:bg-white/10 dark:text-[#8DDDF5]">
                <FileText className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-[24px] font-black tracking-tight text-[#101828] dark:text-white">
                Для регистрации нужны
              </h3>

              <p className="mt-2 text-[14px] leading-6 text-[#61748A] dark:text-white/55">
                Подготовьте документы заранее — это ускорит процесс
                регистрации.
              </p>

              <ul className="mt-6 space-y-4">
                {REQUIRED_DOCUMENTS.map((document) => (
                  <li
                    key={document}
                    className="flex items-start gap-3 text-[14px] leading-6 text-[#405269] dark:text-white/75"
                  >
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white text-[#2586D8] shadow-sm dark:bg-white/10 dark:text-[#8DDDF5]">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>

                    {document}
                  </li>
                ))}
              </ul>

              {/* deadline */}
              {/* <div className="mt-7 rounded-[20px] bg-white p-5 shadow-[0_8px_30px_rgba(60,100,140,0.08)] dark:bg-white/[0.07] dark:shadow-none">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#6A7D94] dark:text-white/45">
                  Срок регистрации
                </p>

                <div className="mt-1 flex items-end justify-between gap-3">
                  <p className="text-[20px] font-black tracking-tight text-[#101828] dark:text-white sm:text-[25px]">
                    Уточните у центра
                  </p>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600 dark:bg-blue-400/10 dark:text-blue-300">
                    Перед записью
                  </span>
                </div>
              </div> */}

              {/* CTA */}
              <a
                href={waUrl("Здравствуйте! Подскажите, пожалуйста, актуальные даты и порядок регистрации на экзамен HSK/HSKK в Казахстане.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-[54px] items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#2586E6] to-[#26C7DD] px-6 text-[15px] font-extrabold text-white shadow-[0_12px_30px_rgba(37,134,230,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(37,134,230,0.3)]"
              >
                <MessageCircle className="h-5 w-5" />
                Зарегистрироваться
                <span aria-hidden>→</span>
              </a>

              <p className="mt-3 text-center text-[11px] font-medium text-[#718399] dark:text-white/40">
                Поможем с регистрацией и ответим на вопросы
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-[#E3EAF5] bg-white p-5 shadow-[0_20px_60px_rgba(35,70,120,0.06)] sm:p-7 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-none">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-[#EEF5FF] text-[#2586D8] dark:bg-blue-400/10 dark:text-[#8DDDF5]">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[20px] font-extrabold tracking-tight text-[#101828] dark:text-white">
                  Где можно сдать HSK в Казахстане
                </h3>
                <p className="mt-1 text-[14px] leading-6 text-[#70829A] dark:text-white/55">
                  По предоставленной информации, экзамен можно сдать в Алматы:
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {TEST_CENTERS.map((center) => (
                <div
                  key={center.name}
                  className="rounded-[18px] border border-[#E8EEF7] bg-[#F8FAFD] p-4 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <h4 className="text-[15px] font-bold leading-6 text-[#172033] dark:text-white">
                    {center.name}
                  </h4>
                  <p className="mt-2 flex items-start gap-2 text-[14px] leading-6 text-[#52637A] dark:text-white/65">
                    <MapPin className="mt-1 h-4 w-4 flex-none text-[#2586D8] dark:text-[#8DDDF5]" />
                    {center.address}
                  </p>
                  {"href" in center && (
                    <a
                      href={center.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#2586D8] hover:underline dark:text-[#8DDDF5]"
                    >
                      {center.linkLabel}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-4 text-[13px] leading-6 text-[#70829A] dark:text-white/50">
              Перед регистрацией уточните в выбранном центре доступные даты,
              уровни экзамена, формат сдачи и актуальный адрес проведения.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}