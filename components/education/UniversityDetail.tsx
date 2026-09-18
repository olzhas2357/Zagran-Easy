"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { University } from "@/lib/types";
import { formatTuitionAmount } from "@/lib/education-catalog";
import { useCompareList } from "@/lib/hooks/useCompareList";
import { createLead } from "@/lib/actions";
import { waUrl } from "@/lib/utils";

export function UniversitySidebar({ university, countryName }: { university: University; countryName: string }) {
  const { ids, toggle, max } = useCompareList();
  const inCompare = ids.includes(university.id);
  const [applied, setApplied] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function apply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApplicationError(null);
    startTransition(async () => {
      const result = await createLead({
        source: "form",
        service: "education",
        name,
        phone,
        message: `Заявка на поступление: ${university.name} (${countryName}, ${university.city})`,
      });
      if (!result.success) {
        setApplicationError(result.error || "Не удалось отправить заявку");
        return;
      }
      setApplied(true);
      setApplicationOpen(false);
    });
  }

  function toggleCompare() {
    if (!inCompare && ids.length >= max) {
      setCompareError(`Можно сравнить не более ${max} университетов. Сначала уберите один из списка.`);
      return;
    }
    setCompareError(null);
    toggle(university.id);
  }

  return (
    <div className="w-full flex-none sm:sticky sm:top-[90px] sm:w-[330px]">
      <div className="rounded-[18px] border border-ze-border bg-white p-4.5 shadow-[0_6px_24px_rgba(15,23,42,0.07)]">
        <div className="text-[12px] font-semibold text-ze-muted">Стоимость обучения</div>
        <div className="mt-1 text-[28px] font-extrabold tracking-tight">
          {formatTuitionAmount(university.tuitionFrom, university.tuitionCurrency)}
          {university.tuitionFrom > 0 && <span className="text-[14px] font-semibold text-ze-muted"> / год</span>}
        </div>
        {/* {university.tuitionFrom > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-[11px] bg-[#F5F8FE] px-3 py-2.5 text-[13px] text-slate-700">
            <span className="font-extrabold text-ze-primary">0·0·12</span> рассрочка {formatMonthlyInstallment(university.tuitionFrom, university.tuitionCurrency)}
          </div>
        )} */}
        <div className="mt-3.5 flex flex-col gap-2">
          {applied ? (
            <div className="rounded-xl bg-emerald-50 px-3 py-3 text-center text-[13.5px] font-semibold text-emerald-700">
              Заявка принята — менеджер свяжется с вами
            </div>
          ) : (
            <button
              onClick={() => setApplicationOpen((value) => !value)}
              disabled={isPending}
              className="rounded-xl bg-ze-accent py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-ze-accent-dark disabled:opacity-60"
            >
              Подать заявку
            </button>
          )}
          {applicationOpen && !applied && (
            <form onSubmit={apply} className="rounded-xl border border-ze-border bg-ze-surface p-3">
              <div className="text-[13px] font-bold text-ze-ink">Оставьте контакты</div>
              <p className="mt-1 text-[12px] leading-4 text-ze-muted">Менеджер свяжется с вами и расскажет об условиях поступления.</p>
              <div className="mt-3 grid gap-2">
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ваше имя"
                  autoComplete="name"
                  className="rounded-xl border border-ze-border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-ze-primary"
                />
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+7 700 000 00 00"
                  autoComplete="tel"
                  className="rounded-xl border border-ze-border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-ze-primary"
                />
                <button type="submit" disabled={isPending} className="rounded-xl bg-ze-primary px-3 py-2.5 text-[13px] font-bold text-white disabled:opacity-60">
                  {isPending ? "Отправляем…" : "Отправить заявку"}
                </button>
              </div>
              {applicationError && <div className="mt-2 text-[12px] text-red-600">{applicationError}</div>}
            </form>
          )}
          <button
            onClick={toggleCompare}
            className={`rounded-xl py-3 text-[14.5px] font-semibold transition-colors ${
              inCompare ? "border border-[#BFD3F7] bg-[#EBF1FE] text-ze-primary" : "border border-ze-border bg-white text-ze-ink"
            }`}
          >
            {inCompare ? "✓ Добавлен в сравнение" : "Добавить к сравнению"}
          </button>
          {inCompare && (
            <Link href="/education/compare" className="text-center text-[13px] font-semibold text-ze-primary hover:underline">
              Перейти к сравнению ({ids.length})
            </Link>
          )}
          {compareError && <div className="rounded-lg bg-amber-50 px-3 py-2 text-[12px] leading-4 text-amber-700">{compareError}</div>}
        </div>
        <div className="mt-4 flex flex-col gap-2.5 border-t border-[#F1F4F9] pt-3.5">
          <Fact k="Язык обучения" v={university.languages.join(", ")} />
          <Fact k="IELTS" v={university.ieltsRequired ? "Требуется 6.0" : "Не требуется"} />
          <Fact k="Общежитие" v={university.hasDormitory ? `Есть, от ${formatTuitionAmount(university.dormitoryCost, university.dormitoryCurrency)}/мес` : "Нет, помогаем с арендой"} />
          <Fact k="Грант" v={university.hasGrant ? university.grantDetails || "Есть" : "Не предусмотрен"} />
        </div>
      </div>

     <div className="mt-3.5 rounded-[18px] border border-ze-border bg-white p-4.5 text-ze-navy shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div className="text-[14px] font-bold">Ваш менеджер</div>

        <p className="mt-2 text-[13px] leading-snug text-ze-navy/60">
          Закрепляется за вами после заявки — ведёт от документов до вылета.
        </p>

       <a
          href={waUrl(`Здравствуйте! Хочу узнать про поступление в ${university.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 block rounded-[11px] border border-[#BFE8CE] bg-[#F3FBF6] py-3 text-center text-[14px] font-bold text-[#168A45] transition-all duration-200 hover:border-[#9DDDB5] hover:bg-[#E8F8EE] hover:text-[#11783B]"
        >
          Написать в WhatsApp
        </a>
      </div>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-2.5 text-[13px]">
      <span className="text-ze-muted">{k}</span>
      <span className="text-right font-semibold">{v}</span>
    </div>
  );
}
