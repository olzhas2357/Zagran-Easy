import { MapPin, Globe } from "lucide-react";
import type { University } from "@/lib/types";
import { waUrl, formatPrice } from "@/lib/utils";
import { EDUCATION_PHONE } from "@/lib/constants";

interface UniversityCardProps {
  university: University;
  countryName: string;
}

export function UniversityCard({ university, countryName }: UniversityCardProps) {
  const waText = `Здравствуйте! Интересует ${university.name}, ${countryName}. Хочу узнать подробнее.`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
      <div
        className="aspect-video bg-cover bg-center bg-gradient-to-br from-blue-100 to-blue-200"
        style={university.imageUrl ? { backgroundImage: `url(${university.imageUrl})` } : undefined}
      />

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <span
            className={
              university.type === "public"
                ? "rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                : "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700"
            }
          >
            {university.type === "public" ? "Гос." : "Частный"}
          </span>
          {university.hasGrant && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              Грант
            </span>
          )}
        </div>

        <h3 className="mt-3 text-base font-semibold text-slate-800">{university.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {university.city}
        </p>

        {university.programs.length > 0 && (
          <p className="mt-3 text-sm text-slate-600">{university.programs.join(" · ")}</p>
        )}
        {university.languages.length > 0 && (
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <Globe className="h-3.5 w-3.5" />
            {university.languages.join(", ")}
          </p>
        )}

        <div className="mt-4">
          {university.tuitionFrom === 0 ? (
            <p className="text-sm font-bold text-green-600">БЕСПЛАТНО</p>
          ) : (
            <p className="text-sm font-semibold text-blue-600">
              {formatPrice(university.tuitionFrom)} / год
            </p>
          )}
          {university.hasGrant && university.tuitionFrom > 0 && (
            <p className="text-sm text-green-600">или бесплатно по гранту</p>
          )}
        </div>

        <a
          href={waUrl(waText, EDUCATION_PHONE)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Подробнее → WhatsApp
        </a>
      </div>
    </div>
  );
}
