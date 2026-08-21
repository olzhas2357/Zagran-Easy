import { waUrl } from "@/lib/utils";
import { EDUCATION_PHONE } from "@/lib/constants";

interface EducationHeroProps {
  countryCount: number;
  universityCount: number;
}

export function EducationHero({ countryCount, universityCount }: EducationHeroProps) {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Международное образование
        </span>

        <h1 className="mt-4 text-[28px] font-bold text-slate-800 sm:text-[36px]">
          Образование за рубежом
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
          3200+ зачислений. Ваш путь в лучшие университеты мира начинается здесь.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
          <span>{countryCount} стран</span>
          <span className="text-slate-300">|</span>
          <span>{universityCount} вузов</span>
          <span className="text-slate-300">|</span>
          <span>RU · KZ · EN</span>
        </div>

        <a
          href={waUrl("Здравствуйте! Хочу подобрать программу обучения за рубежом.", EDUCATION_PHONE)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          Подобрать программу →
        </a>
      </div>
    </section>
  );
}
