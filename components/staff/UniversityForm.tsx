"use client";

import { useState, useTransition } from "react";
import type { EducationCountry, University, UniversityProgram, AdmissionStory } from "@/lib/types";
import { createUniversity, updateUniversity } from "@/lib/staff-actions";
import { ImageListUploader, SingleFileUploader } from "@/components/staff/MediaUploader";

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function slugifyName(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => CYRILLIC_TO_LATIN[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function numOr0(s: string): number {
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function numOrNull(s: string): number | null {
  if (!s.trim()) return null;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const inputClass = "w-full rounded-lg border border-ze-border bg-white px-3 py-2.5 text-[13.5px] outline-none focus:border-ze-primary";
const textareaClass = `${inputClass} resize-none`;

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[12px] font-semibold text-ze-muted">{label}</div>
      {children}
      {hint && <div className="mt-1 text-[11.5px] text-slate-400">{hint}</div>}
    </label>
  );
}

function TagsField({ label, value, onChange, placeholder }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [text, setText] = useState(value.join(", "));
  return (
    <Field label={label} hint="через запятую">
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          );
        }}
        placeholder={placeholder}
        className={inputClass}
      />
    </Field>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ze-border bg-white p-4.5">
      <div className="text-[15px] font-bold">{title}</div>
      <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function UniversityForm({ countries, university }: { countries: EducationCountry[]; university?: University }) {
  const isEdit = Boolean(university);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(university?.name ?? "");
  const [nameLocal, setNameLocal] = useState(university?.nameLocal ?? "");
  const [slug, setSlug] = useState(university?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [countryId, setCountryId] = useState(university?.countryId ?? countries[0]?.id ?? "");
  const [city, setCity] = useState(university?.city ?? "");
  const [type, setType] = useState<"public" | "private">(university?.type ?? "public");

  const [programs, setPrograms] = useState<string[]>(university?.programs ?? []);
  const [languages, setLanguages] = useState<string[]>(university?.languages ?? []);
  const [specialties, setSpecialties] = useState<string[]>(university?.specialties ?? []);

  const [tuitionFrom, setTuitionFrom] = useState(university ? String(university.tuitionFrom) : "");
  const [tuitionTo, setTuitionTo] = useState(university ? String(university.tuitionTo) : "");
  const [hasGrant, setHasGrant] = useState(university?.hasGrant ?? false);
  const [grantDetails, setGrantDetails] = useState(university?.grantDetails ?? "");
  const [hasDormitory, setHasDormitory] = useState(university?.hasDormitory ?? false);
  const [dormitoryCost, setDormitoryCost] = useState(university ? String(university.dormitoryCost) : "");

  const [requirements, setRequirements] = useState<string[]>(university?.requirements ?? []);
  const [ieltsRequired, setIeltsRequired] = useState(university?.ieltsRequired ?? false);
  const [admissionChance, setAdmissionChance] = useState(university?.admissionChance != null ? String(university.admissionChance) : "");
  const [deadlineLabel, setDeadlineLabel] = useState(university?.deadlineLabel ?? "");
  const [deadlineDate, setDeadlineDate] = useState(university?.deadlineDate ?? "");
  const [rankingNational, setRankingNational] = useState(university?.rankingNational != null ? String(university.rankingNational) : "");
  const [rankingWorld, setRankingWorld] = useState(university?.rankingWorld != null ? String(university.rankingWorld) : "");

  const [description, setDescription] = useState(university?.description ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(university?.websiteUrl ?? "");
  const [isPartner, setIsPartner] = useState(university?.isPartner ?? false);
  const [ratingStars, setRatingStars] = useState(university ? String(university.ratingStars) : "4.5");
  const [reviewsCount, setReviewsCount] = useState(university ? String(university.reviewsCount) : "0");

  const [programList, setProgramList] = useState<UniversityProgram[]>(university?.programList ?? []);
  const [stories, setStories] = useState<AdmissionStory[]>(university?.stories ?? []);

  const [imageUrl, setImageUrl] = useState<string | null>(university?.imageUrl || null);
  const [galleryImages, setGalleryImages] = useState<string[]>(university?.galleryImages ?? []);
  const [dormitoryImages, setDormitoryImages] = useState<string[]>(university?.dormitoryImages ?? []);
  const [presentationUrl, setPresentationUrl] = useState<string | null>(university?.presentationUrl ?? null);
  const [presentationPages, setPresentationPages] = useState(university?.presentationPages != null ? String(university.presentationPages) : "");

  const [isActive, setIsActive] = useState(university?.isActive ?? true);

  function onNameChange(v: string) {
    setName(v);
    if (!slugTouched) setSlug(slugifyName(v));
  }

  function save() {
    setError(null);
    if (!name.trim() || !slug.trim() || !countryId || !city.trim()) {
      setError("Заполните название, slug, страну и город");
      return;
    }
    const input = {
      countryId,
      slug,
      name,
      nameLocal,
      city,
      type,
      programs,
      languages,
      specialties,
      tuitionFrom: numOr0(tuitionFrom),
      tuitionTo: numOr0(tuitionTo),
      hasGrant,
      grantDetails,
      hasDormitory,
      dormitoryCost: numOr0(dormitoryCost),
      requirements,
      description,
      imageUrl: imageUrl ?? "",
      galleryImages,
      dormitoryImages,
      websiteUrl,
      rankingNational: numOrNull(rankingNational),
      rankingWorld: numOrNull(rankingWorld),
      ieltsRequired,
      isPartner,
      admissionChance: numOrNull(admissionChance),
      deadlineLabel,
      deadlineDate: deadlineDate || null,
      ratingStars: numOr0(ratingStars) || 4.5,
      reviewsCount: numOr0(reviewsCount),
      presentationUrl,
      presentationPages: numOrNull(presentationPages),
      programList,
      stories,
      isActive,
    };
    startTransition(async () => {
      const res = isEdit ? await updateUniversity(university!.id, input) : await createUniversity(input);
      // Оба экшена редиректят на успехе — сюда доходим только при ошибке.
      if (res && !res.success) setError(res.error || "Не удалось сохранить университет");
    });
  }

  return (
    <div className="mt-5 flex flex-col gap-3.5">
      <Section title="Основное">
        <Field label="Название (англ./межд.)">
          <input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="Istanbul University" className={inputClass} />
        </Field>
        <Field label="Название на местном языке">
          <input value={nameLocal} onChange={(e) => setNameLocal(e.target.value)} placeholder="İstanbul Üniversitesi" className={inputClass} />
        </Field>
        <Field label="Slug (для ссылки на сайте)" hint={`zagraneasy.kz/education/${slug || "..."}`}>
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="istanbul-university"
            className={inputClass}
          />
        </Field>
        <Field label="Страна">
          <select value={countryId} onChange={(e) => setCountryId(e.target.value)} className={inputClass}>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Город">
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Стамбул" className={inputClass} />
        </Field>
        <Field label="Тип вуза">
          <select value={type} onChange={(e) => setType(e.target.value as "public" | "private")} className={inputClass}>
            <option value="public">Государственный</option>
            <option value="private">Частный</option>
          </select>
        </Field>
      </Section>

      <Section title="Языки и программы">
        <TagsField label="Уровни программ" value={programs} onChange={setPrograms} placeholder="Бакалавриат, Магистратура" />
        <TagsField label="Языки обучения" value={languages} onChange={setLanguages} placeholder="Турецкий, Английский" />
        <TagsField label="Специальности" value={specialties} onChange={setSpecialties} placeholder="Медицина, IT, Бизнес" />
      </Section>

      <Section title="Стоимость и условия">
        <Field label="Цена от, $/год">
          <input value={tuitionFrom} onChange={(e) => setTuitionFrom(e.target.value)} inputMode="decimal" className={inputClass} />
        </Field>
        <Field label="Цена до, $/год">
          <input value={tuitionTo} onChange={(e) => setTuitionTo(e.target.value)} inputMode="decimal" className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 text-[13.5px] font-semibold">
          <input type="checkbox" checked={hasGrant} onChange={(e) => setHasGrant(e.target.checked)} className="h-4 w-4" />
          Есть грант
        </label>
        {hasGrant && (
          <Field label="Детали гранта">
            <input value={grantDetails} onChange={(e) => setGrantDetails(e.target.value)} className={inputClass} />
          </Field>
        )}
        <label className="flex items-center gap-2 text-[13.5px] font-semibold">
          <input type="checkbox" checked={hasDormitory} onChange={(e) => setHasDormitory(e.target.checked)} className="h-4 w-4" />
          Есть общежитие
        </label>
        {hasDormitory && (
          <Field label="Стоимость общежития, $/мес">
            <input value={dormitoryCost} onChange={(e) => setDormitoryCost(e.target.value)} inputMode="decimal" className={inputClass} />
          </Field>
        )}
      </Section>

      <Section title="Поступление">
        <TagsField label="Требования" value={requirements} onChange={setRequirements} placeholder="Аттестат, IELTS, Загранпаспорт" />
        <label className="flex items-center gap-2 text-[13.5px] font-semibold">
          <input type="checkbox" checked={ieltsRequired} onChange={(e) => setIeltsRequired(e.target.checked)} className="h-4 w-4" />
          Требуется IELTS
        </label>
        <Field label="Шанс поступления, %">
          <input value={admissionChance} onChange={(e) => setAdmissionChance(e.target.value)} inputMode="numeric" className={inputClass} />
        </Field>
        <Field label="Дедлайн (текст)" hint="например: до 15 июля">
          <input value={deadlineLabel} onChange={(e) => setDeadlineLabel(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Дедлайн (дата)">
          <input type="date" value={deadlineDate ?? ""} onChange={(e) => setDeadlineDate(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Рейтинг в стране (число)">
          <input value={rankingNational} onChange={(e) => setRankingNational(e.target.value)} inputMode="numeric" className={inputClass} />
        </Field>
        <Field label="Мировой рейтинг (число)">
          <input value={rankingWorld} onChange={(e) => setRankingWorld(e.target.value)} inputMode="numeric" className={inputClass} />
        </Field>
      </Section>

      <Section title="Описание и репутация">
        <div className="sm:col-span-2">
          <Field label="Описание">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={textareaClass} />
          </Field>
        </div>
        <Field label="Сайт университета">
          <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://…" className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 text-[13.5px] font-semibold">
          <input type="checkbox" checked={isPartner} onChange={(e) => setIsPartner(e.target.checked)} className="h-4 w-4" />
          Официальный партнёр
        </label>
        <Field label="Рейтинг (звёзды, 0–5)">
          <input value={ratingStars} onChange={(e) => setRatingStars(e.target.value)} inputMode="decimal" className={inputClass} />
        </Field>
        <Field label="Кол-во отзывов">
          <input value={reviewsCount} onChange={(e) => setReviewsCount(e.target.value)} inputMode="numeric" className={inputClass} />
        </Field>
      </Section>

      <div className="rounded-2xl border border-ze-border bg-white p-4.5">
        <div className="flex items-center justify-between">
          <div className="text-[15px] font-bold">Программы вуза</div>
          <button
            type="button"
            onClick={() => setProgramList((v) => [...v, { name: "", meta: "", price: "" }])}
            className="rounded-lg border border-ze-border bg-[#F4F6FA] px-3 py-1.5 text-[12.5px] font-semibold text-slate-700 hover:border-slate-300"
          >
            + Добавить программу
          </button>
        </div>
        <div className="mt-3.5 flex flex-col gap-2.5">
          {programList.map((p, i) => (
            <div key={i} className="grid grid-cols-[1.4fr_1.4fr_0.8fr_36px] items-center gap-2">
              <input
                value={p.name}
                onChange={(e) => setProgramList((v) => v.map((row, idx) => (idx === i ? { ...row, name: e.target.value } : row)))}
                placeholder="Название программы"
                className={inputClass}
              />
              <input
                value={p.meta}
                onChange={(e) => setProgramList((v) => v.map((row, idx) => (idx === i ? { ...row, meta: e.target.value } : row)))}
                placeholder="Бакалавриат | 4 года | Английский"
                className={inputClass}
              />
              <input
                value={p.price}
                onChange={(e) => setProgramList((v) => v.map((row, idx) => (idx === i ? { ...row, price: e.target.value } : row)))}
                placeholder="$2 000"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setProgramList((v) => v.filter((_, idx) => idx !== i))}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-ze-border text-slate-500 hover:border-slate-300"
              >
                ✕
              </button>
            </div>
          ))}
          {programList.length === 0 && <div className="text-[13px] text-ze-muted">Программы можно добавить позже.</div>}
        </div>
      </div>

      <div className="rounded-2xl border border-ze-border bg-white p-4.5">
        <div className="flex items-center justify-between">
          <div className="text-[15px] font-bold">Истории поступивших</div>
          <button
            type="button"
            onClick={() => setStories((v) => [...v, { name: "", meta: "", text: "" }])}
            className="rounded-lg border border-ze-border bg-[#F4F6FA] px-3 py-1.5 text-[12.5px] font-semibold text-slate-700 hover:border-slate-300"
          >
            + Добавить историю
          </button>
        </div>
        <div className="mt-3.5 flex flex-col gap-3">
          {stories.map((s, i) => (
            <div key={i} className="rounded-xl border border-[#F1F4F9] p-3">
              <div className="grid grid-cols-[1fr_1fr_36px] items-center gap-2">
                <input
                  value={s.name}
                  onChange={(e) => setStories((v) => v.map((row, idx) => (idx === i ? { ...row, name: e.target.value } : row)))}
                  placeholder="Имя, город"
                  className={inputClass}
                />
                <input
                  value={s.meta}
                  onChange={(e) => setStories((v) => v.map((row, idx) => (idx === i ? { ...row, meta: e.target.value } : row)))}
                  placeholder="поступил(а) в 2026 · специальность"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setStories((v) => v.filter((_, idx) => idx !== i))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-ze-border text-slate-500 hover:border-slate-300"
                >
                  ✕
                </button>
              </div>
              <textarea
                value={s.text}
                onChange={(e) => setStories((v) => v.map((row, idx) => (idx === i ? { ...row, text: e.target.value } : row)))}
                placeholder="Текст истории поступления…"
                rows={2}
                className={`${textareaClass} mt-2`}
              />
            </div>
          ))}
          {stories.length === 0 && <div className="text-[13px] text-ze-muted">Истории можно добавить позже.</div>}
        </div>
      </div>

      <Section title="Фото и презентация">
        <div className="sm:col-span-2">
          <SingleFileUploader label="Обложка (главное фото)" value={imageUrl} onChange={setImageUrl} accept="image/*" />
        </div>
        <ImageListUploader label="Фото кампуса" value={galleryImages} onChange={setGalleryImages} />
        <ImageListUploader label="Фото общежития" value={dormitoryImages} onChange={setDormitoryImages} />
        <Field label="Ссылка на презентацию (PDF)">
          <input
            value={presentationUrl ?? ""}
            onChange={(e) => setPresentationUrl(e.target.value.trim() || null)}
            placeholder="https://…"
            className={inputClass}
          />
        </Field>
        <Field label="Страниц в презентации">
          <input value={presentationPages} onChange={(e) => setPresentationPages(e.target.value)} inputMode="numeric" className={inputClass} />
        </Field>
      </Section>

      <div className="rounded-2xl border border-ze-border bg-white p-4.5">
        <label className="flex items-center gap-2 text-[13.5px] font-semibold">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4" />
          Опубликовать (показывать на сайте)
        </label>
      </div>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-[13.5px] font-semibold text-red-600">{error}</div>}

      <div className="flex items-center gap-2.5 pb-6">
        <button
          onClick={save}
          disabled={isPending}
          className="rounded-xl bg-ze-accent px-5 py-3 text-[14.5px] font-semibold text-white hover:bg-ze-accent-dark disabled:opacity-60"
        >
          {isPending ? "Сохраняем…" : isEdit ? "Сохранить изменения" : "Создать университет"}
        </button>
      </div>
    </div>
  );
}
