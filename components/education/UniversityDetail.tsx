"use client";

import { useState, useTransition } from "react";
import type { University } from "@/lib/types";
import { formatTuitionAmount, formatMonthlyInstallment, chanceColor } from "@/lib/education-catalog";
import { useCompareList } from "@/lib/hooks/useCompareList";
import { createLead } from "@/lib/actions";
import { waUrl } from "@/lib/utils";

export function UniversitySidebar({ university, countryName }: { university: University; countryName: string }) {
  const { ids, toggle } = useCompareList();
  const inCompare = ids.includes(university.id);
  const [applied, setApplied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function apply() {
    startTransition(async () => {
      await createLead({
        source: "form",
        service: "education",
        message: `Заявка на поступление: ${university.name} (${countryName}, ${university.city})`,
      });
      setApplied(true);
    });
  }

  return (
    <div className="w-full flex-none sm:sticky sm:top-[90px] sm:w-[330px]">
      <div className="rounded-[18px] border border-ze-border bg-white p-4.5 shadow-[0_6px_24px_rgba(15,23,42,0.07)]">
        <div className="text-[12px] font-semibold text-ze-muted">Стоимость обучения</div>
        <div className="mt-1 text-[28px] font-extrabold tracking-tight">
          {formatTuitionAmount(university.tuitionFrom)}
          {university.tuitionFrom > 0 && <span className="text-[14px] font-semibold text-ze-muted"> / год</span>}
        </div>
        {university.tuitionFrom > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-[11px] bg-[#F5F8FE] px-3 py-2.5 text-[13px] text-slate-700">
            <span className="font-extrabold text-ze-primary">0·0·12</span> рассрочка {formatMonthlyInstallment(university.tuitionFrom)}
          </div>
        )}
        <div className="mt-3.5 flex flex-col gap-2">
          {applied ? (
            <div className="rounded-xl bg-emerald-50 px-3 py-3 text-center text-[13.5px] font-semibold text-emerald-700">
              Заявка принята — менеджер свяжется с вами
            </div>
          ) : (
            <button
              onClick={apply}
              disabled={isPending}
              className="rounded-xl bg-ze-accent py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-ze-accent-dark disabled:opacity-60"
            >
              {isPending ? "Отправляем…" : "Подать заявку"}
            </button>
          )}
          <button
            onClick={() => toggle(university.id)}
            className={`rounded-xl py-3 text-[14.5px] font-semibold transition-colors ${
              inCompare ? "border border-[#BFD3F7] bg-[#EBF1FE] text-ze-primary" : "border border-ze-border bg-white text-ze-ink"
            }`}
          >
            {inCompare ? "✓ Добавлен в сравнение" : "Добавить к сравнению"}
          </button>
          <a
            href={waUrl(`Здравствуйте! Есть вопрос по поступлению в ${university.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-ze-border bg-white py-3 text-center text-[14.5px] font-semibold text-ze-ink hover:border-ze-primary hover:text-ze-primary"
          >
            Задать вопрос в WhatsApp
          </a>
        </div>
        <div className="mt-4 flex flex-col gap-2.5 border-t border-[#F1F4F9] pt-3.5">
          <Fact k="Язык обучения" v={university.languages.join(", ")} />
          <Fact k="IELTS" v={university.ieltsRequired ? "Требуется 6.0" : "Не требуется"} />
          <Fact k="Общежитие" v={university.hasDormitory ? `Есть, от $${university.dormitoryCost}/мес` : "Нет, помогаем с арендой"} />
          <Fact k="Грант" v={university.hasGrant ? university.grantDetails || "Есть" : "Не предусмотрен"} />
        </div>
      </div>

      <div className="mt-3.5 rounded-[18px] bg-ze-navy p-4.5 text-white">
        <div className="text-[14px] font-bold">Ваш менеджер</div>
        <p className="mt-2 text-[13px] leading-snug text-white/60">
          Закрепляется за вами после заявки — ведёт от документов до вылета.
        </p>
        <a
          href={waUrl(`Здравствуйте! Хочу узнать про поступление в ${university.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 block rounded-[11px] bg-ze-whatsapp py-3 text-center text-[14px] font-bold text-ze-navy hover:bg-ze-whatsapp-dark"
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

export function AdmissionChanceBadge({ chance }: { chance: number }) {
  const c = chanceColor(chance);
  return <span className={`font-bold ${c.text}`}>{chance}%</span>;
}
