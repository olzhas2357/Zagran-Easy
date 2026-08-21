import type { EducationCountry } from "@/lib/types";
import { CountryCard } from "./CountryCard";
import { FadeIn } from "@/components/ui/FadeIn";

interface CountryGridProps {
  countries: EducationCountry[];
}

export function CountryGrid({ countries }: CountryGridProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-semibold text-slate-800">Выберите страну обучения</h2>
      <p className="mt-2 text-slate-500">
        Нажмите на страну, чтобы увидеть университеты, требования и стоимость.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country, i) => (
          <FadeIn key={country.id} delay={i * 0.05}>
            <CountryCard country={country} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
