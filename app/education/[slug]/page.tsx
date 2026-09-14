import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Play } from "lucide-react";
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
        <Link href="/education" className="mb-4 inline-block text-[20.5px] font-semibold text-ze-muted hover:text-ze-primary">
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

            <Section title="Описание и репутация">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(240px,0.75fr)]">
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-wide text-ze-muted">Об университете</div>
                  <p className="mt-2 whitespace-pre-line text-pretty text-[14px] leading-6 text-slate-700">
                    {university.description || "Подробное описание университета скоро появится."}
                  </p>

                  {university.advantages.length > 0 && (
                    <div className="mt-4">
                      <div className="text-[12px] font-semibold uppercase tracking-wide text-ze-muted">Почему выбирают этот вуз</div>
                      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                        {university.advantages.map((advantage) => (
                          <li key={advantage} className="flex items-start gap-2 rounded-xl bg-emerald-50/70 px-3 py-2.5 text-[13px] leading-5 text-slate-700">
                            <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">✓</span>
                            <span>{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="rounded-[14px] border border-ze-border bg-ze-surface p-3.5">
                  <div className="text-[12px] font-semibold uppercase tracking-wide text-ze-muted">Репутация</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <ReputationMetric label="В стране" value={university.rankingNational ? `#${university.rankingNational}` : "—"} />
                    <ReputationMetric label="В мире" value={university.rankingWorld ? `#${university.rankingWorld}` : "—"} />
                    <ReputationMetric label="Оценка" value={`★ ${university.ratingStars.toFixed(1)}`} />
                    <ReputationMetric label="Отзывы" value={String(university.reviewsCount)} />
                  </div>
                  {university.isPartner && (
                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[12.5px] font-semibold text-emerald-700">
                      Официальный партнёр ZagranEasy
                    </div>
                  )}
                  {university.informationSource && (
                    <div className="mt-3 text-[11.5px] leading-4 text-slate-400">Источник данных: {university.informationSource}</div>
                  )}
                  {(university.googleMapsUrl || university.youtubeUrl) && (
                    <div className="mt-3 grid gap-2">
                      {university.googleMapsUrl && (
                        <a
                          href={university.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl border border-ze-border bg-white px-3 py-2.5 text-[13px] font-semibold text-ze-ink transition-colors hover:border-ze-primary hover:text-ze-primary"
                        >
                          <MapPin className="h-4 w-4" strokeWidth={1.9} />
                          Открыть в Google Maps
                        </a>
                      )}
                      {university.youtubeUrl && (
                        <a
                          href={university.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
                        >
                          <Play className="h-4 w-4" strokeWidth={1.9} />
                          Смотреть на YouTube
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Section>

            <Section title="Презентация университета">
              {university.presentationUrl ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[12.5px] text-ze-muted">PDF{university.presentationPages ? ` · ${university.presentationPages} страниц` : ""}</div>
                  <a href={university.presentationUrl} target="_blank" rel="noopener noreferrer" className="rounded-[11px] bg-[#EBF1FE] px-4 py-2.5 text-[17.5px] font-semibold text-ze-primary hover:bg-[#DCE6FA]">
                    Открыть
                  </a>
                </div>
              ) : (
                <div className="text-[13.5px] text-ze-muted">Презентация пока не загружена — уточните у менеджера в WhatsApp.</div>
              )}
            </Section>

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

function ReputationMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2.5">
      <div className="text-[11px] text-ze-muted">{label}</div>
      <div className="mt-1 text-[17px] font-extrabold tracking-tight text-ze-ink">{value}</div>
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
