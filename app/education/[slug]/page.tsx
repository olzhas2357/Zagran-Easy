import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAllUniversities, fetchUniversityBySlug, fetchUniversityCatalogBySlug, fetchEducationCountries } from "@/lib/data";
import { UniversitySidebar } from "@/components/education/UniversityDetail";
import { CoverPhoto } from "@/components/ui/CoverPhoto";
import { PhotoGallery } from "@/components/ui/PhotoGallery";

export async function generateStaticParams() {
  const universities = await fetchAllUniversities();
  return universities.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata(props: PageProps<"/education/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const university = await fetchUniversityBySlug(slug);
  if (!university) return {};

  return {
    title: `${university.name} — ZagranEasy`,
    description: university.description,
  };
}

export default async function UniversityPage(props: PageProps<"/education/[slug]">) {
  const { slug } = await props.params;
  const [university, countries, catalog] = await Promise.all([fetchUniversityBySlug(slug), fetchEducationCountries(), fetchUniversityCatalogBySlug(slug)]);
  if (!university) notFound();

  const country = countries.find((c) => c.id === university.countryId);
  const countryName = country?.name || "";

  const campusGallery = Array.from(new Set([university.imageUrl, ...(university.galleryImages ?? [])].filter(Boolean)));
  const dormitoryGallery = university.dormitoryImages ?? [];

  return (
    <div className="bg-ze-surface">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-10 sm:py-8">
        <Link href="/education" className="mb-4 inline-block text-[13.5px] font-semibold text-ze-muted hover:text-ze-primary">
          ← Назад в каталог
        </Link>

        <div className="aspect-16/10 overflow-hidden rounded-[18px] border border-ze-border sm:aspect-[21/7]">
          <CoverPhoto src={university.imageUrl} alt={university.name} label={`фото кампуса — ${university.name}`} />
        </div>

        <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row">
          <div className="min-w-0 w-full flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-[#EBF1FE] px-2.5 py-1.5 text-[12px] font-bold text-ze-primary">
                {country?.flag} {countryName} · {university.city}
              </span>
              {university.isPartner && (
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[12px] font-bold text-emerald-700">
                  Официальный партнёр
                </span>
              )}
              <span className="rounded-lg border border-ze-border bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slate-600">
                ★ {university.ratingStars.toFixed(1)} · {university.reviewsCount} отзывов
              </span>
            </div>

            <h1 className="mt-3.5 text-[24px] font-extrabold leading-[1.1] tracking-tight sm:text-[36px]">{university.name}</h1>

            {university.lastVerifiedAt && (
              <div className="mt-3.5 flex items-center gap-2.5 rounded-xl border border-ze-border bg-white px-3.5 py-2.5 text-[13px] text-slate-700">
                <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-emerald-50 text-[12px] font-bold text-emerald-700">
                  ✓
                </span>
                <div className="text-pretty">
                  Данные сверены{" "}
                  <b className="text-ze-ink">
                    {new Date(university.lastVerifiedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                  </b>
                  .
                </div>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <Stat label="IELTS" value={university.ieltsRequired ? "Требуется" : "Не нужен"} note="для поступления" />
              <Stat label="Дедлайн" value={university.deadlineLabel || "—"} note="ближайший набор" />
              <Stat label="Рейтинг в стране" value={university.rankingNational ? `#${university.rankingNational}` : "—"} note="национальный рейтинг" />
              <Stat label="Программ" value={String(university.programsCount)} note="бакалавриат и магистратура" />
            </div>

            {(catalog.programs.length > 0 || university.programList.length > 0) && (
              <Section title="Программы">
                <div className="flex flex-col">
                  {catalog.programs.length > 0 ? catalog.programs.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-3 border-b border-[#F1F4F9] py-3.5 last:border-0">
                      <div className="min-w-0"><div className="text-[14.5px] font-semibold">{String(p.name)}</div><div className="mt-0.5 text-[12.5px] text-ze-muted">{[p.degree_level, p.duration_months ? `${p.duration_months} мес.` : null, p.language].filter(Boolean).join(" · ")}</div></div>
                      <div className="flex-none text-[13px] font-semibold">{catalog.costs.filter((c) => c.program_id === p.id).map((c) => `${c.amount} ${c.currency || "USD"}`).join(" · ")}</div>
                    </div>
                  )) : university.programList.map((p) => (
                    <div key={p.name} className="flex items-center justify-between gap-3 border-b border-[#F1F4F9] py-3.5 last:border-0">
                      <div className="min-w-0">
                        <div className="text-[14.5px] font-semibold">{p.name}</div>
                        <div className="mt-0.5 text-[12.5px] text-ze-muted">{p.meta}</div>
                      </div>
                      <div className="flex-none text-[14.5px] font-bold">{p.price}</div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Требования к поступлению">
              <div className="flex flex-wrap gap-2">
                {(catalog.requirements.length ? catalog.requirements.map((r) => String(r.title)) : university.requirements).map((r) => (
                  <span key={r} className="rounded-lg bg-[#F4F6FA] px-3 py-1.5 text-[13px] font-medium text-slate-700">
                    {r}
                  </span>
                ))}
              </div>
            </Section>

            {campusGallery.length > 1 && (
              <Section title="Фото кампуса">
                <PhotoGallery images={campusGallery} alt={`фото кампуса — ${university.name}`} />
              </Section>
            )}

            <Section title="Презентация университета">
              {university.presentationUrl ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[12.5px] text-ze-muted">PDF{university.presentationPages ? ` · ${university.presentationPages} страниц` : ""}</div>
                  <a href={university.presentationUrl} target="_blank" rel="noopener noreferrer" className="rounded-[11px] bg-[#EBF1FE] px-4 py-2.5 text-[13.5px] font-semibold text-ze-primary hover:bg-[#DCE6FA]">
                    Открыть
                  </a>
                </div>
              ) : (
                <div className="text-[13.5px] text-ze-muted">Презентация пока не загружена — уточните у менеджера в WhatsApp.</div>
              )}
            </Section>

            {university.hasDormitory && (
              <Section title="Общежитие">
                {dormitoryGallery.length > 0 ? (
                  <PhotoGallery images={dormitoryGallery} alt={`фото общежития — ${university.name}`} />
                ) : (
                  <div className="text-[13.5px] text-ze-muted">Фото общежития пока не загружены — уточните у менеджера в WhatsApp.</div>
                )}
              </Section>
            )}

            {university.stories.length > 0 && (
              <Section title="Истории поступивших">
                <div className="flex flex-col gap-3.5">
                  {university.stories.map((s) => (
                    <div key={s.name} className="flex gap-3">
                      <div className="h-[46px] w-[46px] flex-none rounded-xl bg-[repeating-linear-gradient(135deg,#EDF0F5_0_6px,#E4E9F1_6px_12px)]" />
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold">{s.name}</div>
                        <div className="mt-0.5 text-[12px] text-ze-muted">{s.meta}</div>
                        <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-700 text-pretty">{s.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          <UniversitySidebar university={university} countryName={countryName} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[14px] border border-ze-border bg-white p-3.5">
      <div className="text-[11.5px] font-semibold uppercase tracking-wide text-ze-muted">{label}</div>
      <div className="mt-1.5 text-[18px] font-extrabold tracking-tight">{value}</div>
      <div className="mt-0.5 text-[11.5px] text-slate-400">{note}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl border border-ze-border bg-white p-4.5">
      <div className="text-[16px] font-bold">{title}</div>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}
