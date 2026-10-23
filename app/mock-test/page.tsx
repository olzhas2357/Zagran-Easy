import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, FileCheck2 } from "lucide-react";
import { getMockTests } from "@/lib/mock-test-data";

export const metadata: Metadata = {
  title: "Mock test IELTS и HSK — проверьте готовность к экзамену | ZagranEasy",
  description: "Бесплатный пробный тест IELTS и HSK без регистрации. Узнайте примерный уровень и получите рекомендации.",
  alternates: { canonical: "/mock-test" },
};

const EXAMS = [
  { id: "ielts", label: "IELTS" },
  { id: "hsk", label: "HSK" },
];

export default async function PublicMockTestsPage() {
  const tests = await getMockTests();

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto max-w-4xl px-4 py-9 sm:px-10 sm:py-14">
        <h1 className="text-[28px] font-extrabold tracking-tight text-ze-ink sm:text-[40px]">Проверьте готовность к экзамену</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ze-muted">
          Пробные тесты IELTS и HSK — без регистрации и оплаты. Результат ориентировочный, а не официальный балл экзамена.
        </p>

        {EXAMS.map((exam) => {
          const items = tests.filter((t) => t.examType.toLowerCase() === exam.id);
          return (
            <div key={exam.id} className="mt-7">
              <h2 className="mb-3 text-[16px] font-bold text-ze-ink">{exam.label}</h2>
              {items.length > 0 ? (
                <div className="divide-y divide-ze-border overflow-hidden rounded-[20px] border border-ze-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  {items.map((t) => (
                    <Link key={t.id} href={`/mock-test/${t.id}`} className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50">
                      <FileCheck2 className="h-5 w-5 flex-none text-ze-primary" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px] font-bold text-ze-ink">{t.title}</span>
                        {t.description && <span className="mt-0.5 block truncate text-[12.5px] text-ze-muted">{t.description}</span>}
                      </span>
                      {t.durationMinutes && (
                        <span className="flex flex-none items-center gap-1 text-[12.5px] font-semibold text-ze-muted">
                          <Clock3 className="h-3.5 w-3.5" /> {t.durationMinutes} мин
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-[20px] border border-dashed border-ze-border bg-white px-5 py-6 text-[13.5px] text-ze-muted">Тесты {exam.label} скоро появятся.</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
