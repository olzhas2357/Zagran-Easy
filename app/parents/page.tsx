import { ArrowRight, Baby, CalendarDays, ClipboardList, MessageCircle } from "lucide-react";
import Link from "next/link";
import { getParentChildren, requireParent } from "@/lib/parent-data";
import { ParentEmptyState, ParentMetric, ParentPage } from "@/components/parent/ParentPage";

export default async function ParentsPage() {
  const parent = await requireParent();
  const children = await getParentChildren();
  const count = children.data?.length ?? 0;
  const firstName = parent.fullName.split(/\s+/)[0];

  return <ParentPage eyebrow="Личный кабинет" title={`Здравствуйте, ${firstName}`} description="Здесь собрана главная информация об обучении вашего ребёнка.">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><ParentMetric label="Дети в кабинете" value={children.error ? "—" : String(count)} detail={children.error ? "Ошибка загрузки" : count ? "Профили подключены" : "Нужно добавить"} tone="amber" /><ParentMetric label="Ближайшие занятия" value="0" detail="Нет событий" /><ParentMetric label="Домашние задания" value="0" detail="Всё спокойно" tone="green" /><ParentMetric label="К оплате" value="—" detail="Нет счетов" tone="amber" /></div>
    <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <div className="rounded-[22px] border border-ze-border bg-white p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-[.14em] text-amber-700">Начало работы</div><h2 className="mt-2 text-xl font-extrabold">{count ? "Профили детей подключены" : "Добавьте ребёнка в кабинет"}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-ze-muted">Откройте раздел детей, чтобы посмотреть подключённые профили и учебные данные.</p></div><span className="hidden h-12 w-12 flex-none items-center justify-center rounded-2xl bg-amber-50 text-amber-700 sm:flex"><Baby className="h-6 w-6" /></span></div><Link href="/parents/children" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-3 text-sm font-bold text-white hover:bg-ze-primary-dark">Открыть раздел детей<ArrowRight className="h-4 w-4" /></Link></div>
      <div className="rounded-[22px] border border-ze-border bg-white p-5 sm:p-7"><h2 className="text-lg font-extrabold">Быстрые действия</h2><div className="mt-4 grid gap-2.5">{[["/parents/schedule", "Расписание", CalendarDays], ["/parents/homework", "Домашние задания", ClipboardList], ["/parents/messages", "Связаться с командой", MessageCircle]].map(([href, label, Icon]) => <Link key={String(href)} href={String(href)} className="flex items-center gap-3 rounded-xl border border-ze-border px-3.5 py-3 text-sm font-semibold transition hover:border-amber-200 hover:bg-amber-50/40"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-ze-muted"><Icon className="h-4.5 w-4.5" /></span><span className="flex-1">{String(label)}</span><ArrowRight className="h-4 w-4 text-slate-300" /></Link>)}</div></div>
    </section>
    <div className="mt-6"><ParentEmptyState icon={CalendarDays} title="Последние события появятся здесь" text="Новости обучения и изменения расписания появятся после подключения раздела событий." href="/parents/children" action="Мои дети" /></div>
  </ParentPage>;
}