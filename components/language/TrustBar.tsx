import { LANGUAGE_STATS } from "@/lib/language-data";

export function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-[#0B132B]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-10 sm:py-7">
        <div className="text-center text-[12.5px] font-semibold uppercase tracking-wide text-white/40 sm:text-left">
          Уже учатся с ZagranEasy
        </div>
        <div className="mt-3.5 grid grid-cols-2 gap-4 sm:mt-3 sm:flex sm:flex-wrap sm:items-center sm:gap-10">
          {LANGUAGE_STATS.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <span className="text-[20px] font-extrabold tracking-tight text-white sm:text-[22px]">
                {s.value}
              </span>
              <span className="text-[13px] font-medium text-white/50">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
