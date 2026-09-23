import { AlertTriangle, CalendarDays, Check, FileText, MessageCircle } from "lucide-react";
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

const REQUIRED_DOCUMENTS = [
  "Фото 3×4 (портрет)",
  "Электронный формат паспорта (страница с данными)",
  "Контактный номер телефона",
  "Электронная почта",
  "Уровень HSK и HSKK, который вы планируете сдавать",
];

export function ExamAnnouncement() {
  return (
    <section className="bg-[#F5F8FF] py-10 sm:py-14 dark:bg-[#0B132B]">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <FadeIn>
          <div className="overflow-hidden rounded-[24px] border border-[#CBEAF8] bg-white shadow-[0_12px_40px_rgba(74,157,196,0.12)] dark:border-white/10 dark:bg-white/[0.05] dark:shadow-none">
            <div className="bg-[#EAF7FD] px-5 py-6 text-[#174B63] sm:px-8 sm:py-7 dark:bg-[#18384A] dark:text-white">
              <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#4A9DC4] dark:text-[#A8E2F5]">
                <CalendarDays className="h-4 w-4" />
                Международный экзамен
              </div>
              <h2 className="mt-2 text-[25px] font-extrabold tracking-tight sm:text-[34px]">Регистрация на HSK и HSKK</h2>
              <p className="mt-2 text-[15px] font-semibold text-[#427B91] dark:text-white/80">Дата экзамена: 16.05.2026</p>
            </div>

            <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <h3 className="text-[17px] font-extrabold text-ze-ink dark:text-white">Стоимость экзаменов</h3>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {EXAM_PRICES.map(([exam, price]) => (
                    <div key={exam} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-3 dark:bg-white/[0.06]">
                      <span className="text-[14px] font-semibold text-ze-ink dark:text-white">{exam}</span>
                      <span className="whitespace-nowrap text-[14px] font-bold text-[#3D8DAF] dark:text-[#A8E2F5]">{price}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-300/20 dark:bg-amber-400/10">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-600 dark:text-amber-300" />
                  <p className="text-[13.5px] leading-relaxed text-amber-950 dark:text-amber-100">
                    Для уровней HSK 3, 4, 5 и 6 сдача устного экзамена HSKK обязательна. Регистрация только на письменный экзамен для этих уровней не принимается.
                  </p>
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="flex items-center gap-2 text-[17px] font-extrabold text-ze-ink dark:text-white">
                  <FileText className="h-5 w-5 text-[#4A9DC4] dark:text-[#A8E2F5]" />
                  Для регистрации нужны
                </h3>
                <ul className="mt-4 space-y-3">
                  {REQUIRED_DOCUMENTS.map((document) => (
                    <li key={document} className="flex items-start gap-2.5 text-[14px] leading-snug text-slate-600 dark:text-white/70">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-500" strokeWidth={2.5} />
                      {document}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl bg-[#EBF1FE] p-4 dark:bg-white/[0.08]">
                  <p className="text-[13px] font-bold uppercase tracking-wide text-[#3D8DAF] dark:text-[#A8E2F5]">Крайний срок регистрации</p>
                  <p className="mt-1 text-[18px] font-extrabold text-ze-ink dark:text-white">до 17 апреля</p>
                </div>

                <a
                  href={waUrl("Здравствуйте! Хочу зарегистрироваться на экзамен HSK/HSKK 16.05.2026.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-ze-whatsapp px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-ze-whatsapp-dark"
                >
                  <MessageCircle className="h-4 w-4" />
                  Уточнить детали в WhatsApp
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}