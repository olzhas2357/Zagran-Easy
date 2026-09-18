"use client";

import { useMemo, useState, useTransition } from "react";
import {
  AlertCircle, Archive, CheckCircle2, Download, Edit3, ExternalLink, File, FileSpreadsheet,
  FileText, FolderOpen, Image as ImageIcon, Link2, Plus, Presentation, Search, Send, Star, X,
} from "lucide-react";
import {
  changeStaffResourceStatus, createStaffResourceLink, getStaffResourceAccess,
  updateStaffResource, uploadStaffResource, type StaffResourceInput,
} from "@/lib/staff-actions";
import type {
  KnowledgeArticle, Profile, StaffResource, StaffResourceCategory, StaffResourceStatus, StaffResourceType,
} from "@/lib/types";

const CATEGORIES: Record<StaffResourceCategory, string> = {
  company: "О компании", services: "Услуги", presentations: "Презентации", documents: "Документы",
  sales: "Продажи", marketing: "Маркетинг", training: "Обучение", templates: "Шаблоны", links: "Ссылки",
};
const TYPES: Record<StaffResourceType, string> = {
  document: "Документ", presentation: "Презентация", link: "Ссылка", video: "Видео", template: "Шаблон",
};
const STATUS: Record<StaffResourceStatus, { label: string; style: string }> = {
  draft: { label: "Черновик", style: "bg-slate-100 text-slate-600" },
  review: { label: "На проверке", style: "bg-amber-50 text-amber-700" },
  published: { label: "Опубликован", style: "bg-emerald-50 text-emerald-700" },
  archived: { label: "Архив", style: "bg-red-50 text-red-700" },
};
const INPUT_CLASS = "mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink outline-none focus:border-blue-400";

function ResourceIcon({ resource }: { resource: StaffResource }) {
  const cn = "h-6 w-6";
  if (resource.resourceType === "presentation") return <Presentation className={cn} />;
  if (resource.resourceType === "link" || resource.resourceType === "video") return <Link2 className={cn} />;
  if (resource.mimeType?.includes("spreadsheet") || resource.mimeType?.includes("excel")) return <FileSpreadsheet className={cn} />;
  if (resource.mimeType?.startsWith("image/")) return <ImageIcon className={cn} />;
  if (resource.resourceType === "template") return <File className={cn} />;
  return <FileText className={cn} />;
}

function formatSize(value: number | null) {
  if (!value) return null;
  if (value < 1024 * 1024) return `${Math.ceil(value / 1024)} КБ`;
  return `${(value / 1024 / 1024).toFixed(1)} МБ`;
}

export function StaffResources({ resources, articles, profile }: { resources: StaffResource[]; articles: KnowledgeArticle[]; profile: Profile }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<StaffResourceCategory | "all">("all");
  const [status, setStatus] = useState<StaffResourceStatus | "all">("all");
  const [editing, setEditing] = useState<StaffResource | "new" | null>(null);
  const [notice, setNotice] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const shown = useMemo(() => resources.filter((resource) => {
    const haystack = `${resource.title} ${resource.description} ${resource.service || ""}`.toLowerCase();
    return (category === "all" || resource.category === category)
      && (status === "all" || resource.status === status)
      && haystack.includes(query.trim().toLowerCase());
  }), [resources, query, category, status]);
  const featured = shown.filter((resource) => resource.isFeatured && resource.status === "published");

  function openResource(resource: StaffResource) {
    setNotice(null);
    const popup = window.open("", "_blank");
    if (popup) {
      popup.document.title = "Открываем материал…";
      popup.document.body.textContent = "Открываем защищённый материал…";
      popup.opener = null;
    }
    startTransition(async () => {
      const result = await getStaffResourceAccess(resource.id);
      if (!result.success) {
        popup?.close();
        return setNotice({ type: "error", text: result.error });
      }
      if (popup) popup.location.href = result.url;
      else window.location.assign(result.url);
    });
  }

  function setResourceStatus(resource: StaffResource, next: StaffResourceStatus) {
    setNotice(null);
    startTransition(async () => {
      const result = await changeStaffResourceStatus(resource.id, next);
      setNotice(result.success
        ? { type: "ok", text: next === "published" ? "Материал опубликован для менеджеров и добавлен в контекст AI." : "Статус материала обновлён." }
        : { type: "error", text: result.error || "Не удалось изменить статус" });
    });
  }

  return <div className="mt-6">
    <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm leading-6 text-slate-700">
      <div className="flex items-start gap-3"><FolderOpen className="mt-0.5 h-5 w-5 flex-none text-ze-primary" /><div><div className="font-extrabold text-slate-900">Как пользоваться разделом</div><p className="mt-1">Администратор загружает файл или ссылку, пишет понятное описание и публикует. Менеджер сразу может открыть материал. AI получает название и описание опубликованного материала, но не раскрывает приватную ссылку клиенту.</p></div></div>
    </section>

    {notice && <div className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${notice.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{notice.type === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}{notice.text}</div>}

    {featured.length > 0 && <section className="mt-6"><div className="mb-3 flex items-center gap-2 text-sm font-extrabold"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />Важное для консультаций</div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{featured.map((resource) => <ResourceCard key={`featured-${resource.id}`} resource={resource} profile={profile} pending={pending} onOpen={openResource} onEdit={setEditing} onStatus={setResourceStatus} featured />)}</div></section>}

    <div className="mt-6 grid gap-3 rounded-2xl border border-ze-border bg-white p-4 lg:grid-cols-[1fr_210px_180px_auto]">
      <label className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-ze-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Название, услуга или содержание" className="w-full rounded-xl border border-ze-border py-2 pl-9 pr-3 text-sm" /></label>
      <select value={category} onChange={(event) => setCategory(event.target.value as typeof category)} className="rounded-xl border border-ze-border px-3 py-2 text-sm"><option value="all">Все разделы</option>{Object.entries(CATEGORIES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
      {profile.role === "admin" ? <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="rounded-xl border border-ze-border px-3 py-2 text-sm"><option value="all">Все статусы</option>{Object.entries(STATUS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select> : <div />}
      {profile.role === "admin" && <button onClick={() => setEditing("new")} className="flex items-center justify-center gap-2 rounded-xl bg-ze-primary px-4 py-2 text-sm font-bold text-white"><Plus className="h-4 w-4" />Добавить материал</button>}
    </div>

    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{shown.map((resource) => <ResourceCard key={resource.id} resource={resource} profile={profile} pending={pending} onOpen={openResource} onEdit={setEditing} onStatus={setResourceStatus} />)}{shown.length === 0 && <div className="rounded-2xl border border-dashed border-ze-border bg-white p-12 text-center text-sm text-ze-muted md:col-span-2 xl:col-span-3">Материалы не найдены.</div>}</div>
    {editing && <ResourceModal resource={editing === "new" ? undefined : editing} articles={articles.filter((article) => article.status === "published")} onClose={() => setEditing(null)} />}
  </div>;
}

function ResourceCard({ resource, profile, pending, onOpen, onEdit, onStatus, featured = false }: { resource: StaffResource; profile: Profile; pending: boolean; onOpen: (resource: StaffResource) => void; onEdit: (resource: StaffResource) => void; onStatus: (resource: StaffResource, status: StaffResourceStatus) => void; featured?: boolean }) {
  const reviewExpired = resource.nextReviewAt && new Date(resource.nextReviewAt).valueOf() < Date.now();
  return <article className={`rounded-2xl border bg-white p-5 ${featured ? "border-amber-200 shadow-sm" : "border-ze-border"}`}>
    <div className="flex items-start justify-between gap-3"><span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-blue-50 text-ze-primary"><ResourceIcon resource={resource} /></span><div className="flex flex-wrap justify-end gap-1.5">{resource.isFeatured && <span title="Важный материал" className="rounded-lg bg-amber-50 p-1.5 text-amber-600"><Star className="h-3.5 w-3.5 fill-current" /></span>}<span className={`rounded-lg px-2 py-1 text-[11px] font-bold ${STATUS[resource.status].style}`}>{STATUS[resource.status].label}</span></div></div>
    <div className="mt-4 text-[11px] font-bold uppercase tracking-wide text-ze-primary">{CATEGORIES[resource.category]}{resource.service ? ` · ${resource.service}` : ""}</div>
    <h2 className="mt-1 text-[16px] font-extrabold leading-6">{resource.title}</h2>
    <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-ze-muted">{resource.description}</p>
    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-ze-muted"><span className="rounded-md bg-slate-50 px-2 py-1">{TYPES[resource.resourceType]}</span>{resource.originalName && <span className="max-w-full truncate rounded-md bg-slate-50 px-2 py-1">{resource.originalName}</span>}{formatSize(resource.sizeBytes) && <span className="rounded-md bg-slate-50 px-2 py-1">{formatSize(resource.sizeBytes)}</span>}</div>
    {reviewExpired && <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600"><AlertCircle className="h-3.5 w-3.5" />Требуется актуализация</div>}
    {resource.knowledgeArticleTitle && <div className="mt-3 text-xs text-ze-muted">Связано со знанием: <span className="font-semibold text-slate-700">{resource.knowledgeArticleTitle}</span></div>}
    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
      <button disabled={pending} onClick={() => onOpen(resource)} className="flex items-center gap-1.5 text-xs font-bold text-ze-primary disabled:opacity-50">{resource.resourceType === "link" || resource.resourceType === "video" ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}Открыть</button>
      {profile.role === "admin" && <button disabled={pending} onClick={() => onEdit(resource)} className="flex items-center gap-1.5 text-xs font-bold text-slate-600"><Edit3 className="h-3.5 w-3.5" />Изменить</button>}
      {profile.role === "admin" && resource.status === "draft" && <button disabled={pending} onClick={() => onStatus(resource, "review")} className="ml-auto flex items-center gap-1 text-xs font-bold text-amber-700"><Send className="h-3.5 w-3.5" />На проверку</button>}
      {profile.role === "admin" && resource.status === "review" && <button disabled={pending} onClick={() => onStatus(resource, "published")} className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Опубликовать</button>}
      {profile.role === "admin" && resource.status === "published" && <button disabled={pending} onClick={() => onStatus(resource, "archived")} className="ml-auto flex items-center gap-1 text-xs font-bold text-red-600"><Archive className="h-3.5 w-3.5" />В архив</button>}
    </div>
  </article>;
}

function ResourceModal({ resource, articles, onClose }: { resource?: StaffResource; articles: KnowledgeArticle[]; onClose: () => void }) {
  const [source, setSource] = useState<"file" | "link">(resource?.resourceType === "link" || resource?.resourceType === "video" ? "link" : "file");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function submit(form: FormData) {
    setError("");
    startTransition(async () => {
      const roles = form.getAll("allowed_roles").map(String);
      const input: StaffResourceInput = {
        title: String(form.get("title") || ""), description: String(form.get("description") || ""),
        category: String(form.get("category")) as StaffResourceCategory,
        service: String(form.get("service") || ""), resourceType: String(form.get("resource_type")) as StaffResourceType,
        knowledgeArticleId: String(form.get("knowledge_article_id") || "") || null,
        nextReviewAt: String(form.get("next_review_at") || "") || null,
        isFeatured: form.get("is_featured") === "true", allowedRoles: roles.length ? roles : ["admin", "manager"],
      };
      let result: { success: boolean; error?: string };
      if (resource) result = await updateStaffResource(resource.id, input);
      else if (source === "link") result = await createStaffResourceLink({ ...input, externalUrl: String(form.get("external_url") || "") });
      else {
        form.set("allowed_roles", JSON.stringify(input.allowedRoles));
        if (!input.knowledgeArticleId) form.delete("knowledge_article_id");
        if (!input.nextReviewAt) form.delete("next_review_at");
        result = await uploadStaffResource(form);
      }
      if (result.success) onClose(); else setError(result.error || "Не удалось сохранить материал");
    });
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"><form action={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6">
    <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-extrabold">{resource ? "Изменить материал" : "Новый материал"}</h2><button type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>
    {resource?.status === "published" && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">После изменения материал станет черновиком и потребует повторной публикации.</p>}
    {!resource && <div className="mt-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => setSource("file")} className={`rounded-lg px-3 py-2 text-sm font-bold ${source === "file" ? "bg-white text-ze-primary shadow-sm" : "text-ze-muted"}`}>Загрузить файл</button><button type="button" onClick={() => setSource("link")} className={`rounded-lg px-3 py-2 text-sm font-bold ${source === "link" ? "bg-white text-ze-primary shadow-sm" : "text-ze-muted"}`}>Добавить ссылку</button></div>}
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <Field label="Название" wide><input name="title" required defaultValue={resource?.title} placeholder="Например: Презентация полного сопровождения" className={INPUT_CLASS} /></Field>
      <Field label="Описание для менеджера" hint="Что внутри, когда использовать и кому отправлять" wide><textarea name="description" required minLength={40} rows={4} defaultValue={resource?.description} className={INPUT_CLASS} /></Field>
      <Field label="Раздел"><select name="category" defaultValue={resource?.category || (source === "link" ? "links" : "documents")} className={INPUT_CLASS}>{Object.entries(CATEGORIES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></Field>
      <Field label="Тип"><select name="resource_type" defaultValue={resource?.resourceType || (source === "link" ? "link" : "document")} className={INPUT_CLASS}>{Object.entries(TYPES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></Field>
      <Field label="Услуга"><input name="service" defaultValue={resource?.service || ""} placeholder="Например: Поступление в Китай" className={INPUT_CLASS} /></Field>
      <Field label="Проверить до"><input name="next_review_at" type="date" defaultValue={resource?.nextReviewAt?.slice(0, 10)} className={INPUT_CLASS} /></Field>
      {!resource && source === "file" && <Field label="Файл до 15 МБ" wide><input name="file" type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg" className={`${INPUT_CLASS} file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:font-bold file:text-ze-primary`} /></Field>}
      {!resource && source === "link" && <Field label="Ссылка" wide><input name="external_url" type="url" required placeholder="https://..." className={INPUT_CLASS} /></Field>}
      <Field label="Связанная статья базы знаний" wide><select name="knowledge_article_id" defaultValue={resource?.knowledgeArticleId || ""} className={INPUT_CLASS}><option value="">Не связывать</option>{articles.map((article) => <option key={article.id} value={article.id}>{article.title}</option>)}</select></Field>
      <fieldset className="sm:col-span-2"><legend className="text-xs font-semibold text-ze-muted">Доступ</legend><div className="mt-2 flex flex-wrap gap-5 text-sm"><label><input type="checkbox" name="allowed_roles" value="admin" defaultChecked={resource ? resource.allowedRoles.includes("admin") : true} className="mr-2" />Администратор</label><label><input type="checkbox" name="allowed_roles" value="manager" defaultChecked={resource ? resource.allowedRoles.includes("manager") : true} className="mr-2" />Менеджер и AI</label><label><input type="checkbox" name="is_featured" value="true" defaultChecked={resource?.isFeatured} className="mr-2" />Показывать в важном</label></div></fieldset>
    </div>
    {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button disabled={pending} className="mt-5 w-full rounded-xl bg-ze-primary py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Сохраняем…" : resource ? "Сохранить новую версию" : "Сохранить черновик"}</button>
  </form></div>;
}

function Field({ label, hint, wide, children }: { label: string; hint?: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`text-xs font-semibold text-ze-muted ${wide ? "sm:col-span-2" : ""}`}>{label}{children}{hint && <span className="mt-1 block font-normal">{hint}</span>}</label>;
}
