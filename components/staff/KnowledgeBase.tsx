"use client";

import { useMemo, useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Edit3, FileText, Info, Plus, Search, Send, X } from "lucide-react";
import { changeKnowledgeArticleStatus, createKnowledgeArticle, updateKnowledgeArticle } from "@/lib/staff-actions";
import type { KnowledgeArticle, KnowledgeArticleStatus, Profile } from "@/lib/types";

export const KNOWLEDGE_SECTIONS = ["Информация о компании", "Услуги ZagranEasy", "Языковые курсы", "Страны", "Университеты", "Программы", "Стоимость", "Гранты", "Общежития", "Визовые требования", "Этапы поступления", "Документы", "Рассрочка и платежи", "Скрипты продаж", "Ответы на возражения", "Часто задаваемые вопросы", "Внутренние инструкции менеджеров"];
const STATUS: Record<KnowledgeArticleStatus, { label: string; style: string }> = {
  draft: { label: "Черновик", style: "bg-slate-100 text-slate-600" },
  review: { label: "На проверке", style: "bg-amber-50 text-amber-700" },
  published: { label: "Опубликовано в AI", style: "bg-emerald-50 text-emerald-700" },
  archived: { label: "Архив", style: "bg-red-50 text-red-700" },
};
const CONTENT_TEMPLATE = `Короткий ответ:

Подробности:
• Что входит:
• Что не входит:
• Стоимость и условия оплаты:
• Сроки:
• Какие документы нужны:

Что должен сделать менеджер:
1.
2.

Важно / исключения:`;

export function KnowledgeBase({ articles, profile }: { articles: KnowledgeArticle[]; profile: Profile }) {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("all");
  const [status, setStatus] = useState<KnowledgeArticleStatus | "all">("all");
  const [editing, setEditing] = useState<KnowledgeArticle | "new" | null>(null);
  const [selected, setSelected] = useState<KnowledgeArticle | null>(null);
  const [guideOpen, setGuideOpen] = useState(true);
  const [notice, setNotice] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const shown = useMemo(() => articles.filter((a) => (section === "all" || a.section === section) && (status === "all" || a.status === status) && `${a.title} ${a.content}`.toLowerCase().includes(query.toLowerCase())), [articles, query, section, status]);

  function changeStatus(id: string, next: KnowledgeArticleStatus) {
    setNotice(null);
    startTransition(async () => {
      const result = await changeKnowledgeArticleStatus(id, next);
      setNotice(result.success
        ? { type: "ok", text: next === "review" ? "Статья отправлена администратору на проверку." : "Статья опубликована и уже доступна AI-помощнику." }
        : { type: "error", text: result.error || "Не удалось изменить статус" });
    });
  }

  return <div className="mt-6">
    <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
      <button onClick={() => setGuideOpen((v) => !v)} className="flex w-full items-center justify-between text-left">
        <span className="flex items-center gap-2 text-sm font-extrabold text-slate-800"><Info className="h-4 w-4 text-ze-primary" />Как материал попадает в AI-помощник</span>
        {guideOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {guideOpen && <div className="mt-4 grid gap-4 text-xs leading-5 text-slate-700 lg:grid-cols-2">
        <div><div className="font-bold">Процесс публикации</div><ol className="mt-1 list-decimal space-y-1 pl-4"><li>Менеджер создаёт черновик и указывает источник.</li><li>Нажимает «На проверку».</li><li>Администратор проверяет факты и нажимает «Опубликовать».</li><li>Опубликованная статья сразу используется AI — загружать JSON и перезапускать сервер не нужно.</li></ol></div>
        <div><div className="font-bold">Как писать правильно</div><ul className="mt-1 list-disc space-y-1 pl-4"><li>Один материал — один конкретный вопрос.</li><li>Пишите точные условия, суммы, сроки и исключения.</li><li>Добавляйте готовый ответ клиенту и действие менеджера.</li><li>Для изменяемых данных ставьте дату следующей проверки.</li><li>Не публикуйте догадки и информацию без источника.</li></ul></div>
      </div>}
    </section>

    {notice && <div className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${notice.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{notice.type === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}{notice.text}</div>}

    <div className="mt-4 grid gap-3 rounded-2xl border border-ze-border bg-white p-4 lg:grid-cols-[1fr_240px_180px_auto]">
      <label className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-ze-muted" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по базе знаний" className="w-full rounded-xl border border-ze-border py-2 pl-9 pr-3 text-sm" /></label>
      <select value={section} onChange={(e) => setSection(e.target.value)} className="rounded-xl border border-ze-border px-3 py-2 text-sm"><option value="all">Все разделы</option>{KNOWLEDGE_SECTIONS.map((s) => <option key={s}>{s}</option>)}</select>
      <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="rounded-xl border border-ze-border px-3 py-2 text-sm"><option value="all">Все статусы</option>{Object.entries(STATUS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select>
      <button onClick={() => setEditing("new")} className="flex items-center justify-center gap-2 rounded-xl bg-ze-primary px-4 py-2 text-sm font-bold text-white"><Plus className="h-4 w-4" />Добавить знание</button>
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-2">{shown.map((article) => {
      const canEdit = profile.role === "admin" || article.authorId === profile.id;
      return <article key={article.id} className="rounded-2xl border border-ze-border bg-white p-5">
        <div className="flex items-start justify-between gap-3"><div><div className="text-[11px] font-bold uppercase tracking-wide text-ze-primary">{article.section}</div><button onClick={() => setSelected(article)} className="mt-1 text-left text-[16px] font-bold hover:text-ze-primary">{article.title}</button></div><span className={`whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-bold ${STATUS[article.status].style}`}>{STATUS[article.status].label}</span></div>
        <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-[13px] leading-5 text-ze-muted">{article.content}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11.5px] text-ze-muted"><span>v{article.version} · {article.language.toUpperCase()} · {article.authorName || "Автор"}</span><div className="flex gap-3">{canEdit && <button disabled={pending} onClick={() => setEditing(article)} className="flex items-center gap-1 font-bold text-ze-primary"><Edit3 className="h-3.5 w-3.5" />Изменить</button>}{article.status === "draft" && canEdit && <button disabled={pending} onClick={() => changeStatus(article.id, "review")} className="flex items-center gap-1 font-bold text-amber-700"><Send className="h-3.5 w-3.5" />На проверку</button>}{profile.role === "admin" && article.status === "review" && <button disabled={pending} onClick={() => changeStatus(article.id, "published")} className="flex items-center gap-1 font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Опубликовать</button>}</div></div>
      </article>;
    })}{shown.length === 0 && <div className="rounded-2xl border border-dashed border-ze-border bg-white p-12 text-center text-sm text-ze-muted xl:col-span-2">Статьи не найдены.</div>}</div>

    {editing && <ArticleModal article={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}
    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"><article className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6"><div className="flex items-start justify-between gap-3"><div><div className="text-xs font-bold text-ze-primary">{selected.section}</div><h2 className="mt-1 text-2xl font-extrabold">{selected.title}</h2></div><button onClick={() => setSelected(null)}><X className="h-5 w-5" /></button></div><div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">{selected.content}</div>{selected.source && <div className="mt-6 rounded-xl bg-slate-50 p-3 text-xs text-ze-muted">Источник: {selected.source}</div>}</article></div>}
  </div>;
}

function ArticleModal({ article, onClose }: { article?: KnowledgeArticle; onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  function submit(form: FormData) {
    startTransition(async () => {
      const roles = form.getAll("roles").map(String);
      const input = { title: String(form.get("title")), section: String(form.get("section")), content: String(form.get("content")), language: String(form.get("language")), source: String(form.get("source")), nextReviewAt: String(form.get("nextReviewAt")) || null, allowedRoles: roles.length ? roles : ["admin", "manager"] };
      const result = article ? await updateKnowledgeArticle(article.id, input) : await createKnowledgeArticle(input);
      if (result.success) onClose(); else setError(result.error || "Ошибка сохранения");
    });
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"><form action={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-xl font-extrabold"><FileText className="h-5 w-5 text-ze-primary" />{article ? "Изменить статью" : "Новое знание"}</h2><button type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>
    {article?.status === "published" && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">После изменения материал станет черновиком и должен снова пройти проверку. Старая опубликованная версия перестанет использоваться AI.</p>}
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="text-xs font-semibold text-ze-muted sm:col-span-2">Вопрос или точный заголовок<input name="title" required defaultValue={article?.title} placeholder="Например: Что входит в полное сопровождение?" className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink" /><span className="mt-1 block font-normal">Формулируйте так, как этот вопрос задаёт менеджер или клиент.</span></label>
      <label className="text-xs font-semibold text-ze-muted">Раздел<select name="section" defaultValue={article?.section} className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink">{KNOWLEDGE_SECTIONS.map((s) => <option key={s}>{s}</option>)}</select></label>
      <label className="text-xs font-semibold text-ze-muted">Язык<select name="language" defaultValue={article?.language || "ru"} className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink"><option value="ru">Русский</option><option value="kk">Қазақша</option><option value="en">English</option></select></label>
      <label className="text-xs font-semibold text-ze-muted sm:col-span-2">Проверенный ответ<textarea name="content" required minLength={80} rows={14} defaultValue={article?.content || CONTENT_TEMPLATE} className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm leading-6 text-ze-ink" /><span className="mt-1 block font-normal">Не оставляйте пустые пункты шаблона — удалите ненужные или заполните их.</span></label>
      <label className="text-xs font-semibold text-ze-muted">Источник<input name="source" required defaultValue={article?.source || ""} placeholder="Ссылка, документ или ФИО ответственного" className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink" /></label>
      <label className="text-xs font-semibold text-ze-muted">Следующая проверка<input name="nextReviewAt" type="date" defaultValue={article?.nextReviewAt?.slice(0, 10)} className="mt-1.5 w-full rounded-xl border border-ze-border px-3 py-2.5 text-sm text-ze-ink" /></label>
      <fieldset className="sm:col-span-2"><legend className="text-xs font-semibold text-ze-muted">Кому доступно</legend><div className="mt-2 flex gap-5 text-sm"><label><input type="checkbox" name="roles" value="admin" defaultChecked={article ? article.allowedRoles.includes("admin") : true} className="mr-2" />Администратор</label><label><input type="checkbox" name="roles" value="manager" defaultChecked={article ? article.allowedRoles.includes("manager") : true} className="mr-2" />Менеджер и AI</label></div></fieldset>
    </div>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<button disabled={pending} className="mt-5 w-full rounded-xl bg-ze-primary py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Сохраняем…" : article ? "Сохранить новую версию" : "Сохранить черновик"}</button></form></div>;
}
