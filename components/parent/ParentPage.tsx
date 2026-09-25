import type { LucideIcon } from "lucide-react";
import { ArrowRight, Inbox } from "lucide-react";
import Link from "next/link";

export function ParentPage({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children: React.ReactNode }) {
  return <div className="mx-auto max-w-[1180px] p-4 sm:p-7 lg:p-9"><div className="mb-7"><div className="text-xs font-bold uppercase tracking-[.16em] text-amber-700">{eyebrow || "Кабинет родителя"}</div><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ze-ink sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-ze-muted sm:text-base">{description}</p>}</div>{children}</div>;
}

export function ParentEmptyState({ icon: Icon = Inbox, title, text, href, action }: { icon?: LucideIcon; title: string; text: string; href?: string; action?: string }) {
  return <div className="rounded-[22px] border border-dashed border-[#D7DEE8] bg-white px-6 py-14 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><Icon className="h-7 w-7" strokeWidth={1.7} /></span><h2 className="mt-4 text-lg font-extrabold text-ze-ink">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ze-muted">{text}</p>{href && action && <Link href={href} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-3 text-sm font-bold text-white hover:bg-ze-primary-dark">{action}<ArrowRight className="h-4 w-4" /></Link>}</div>;
}

export function ParentMetric({ label, value, detail, tone = "blue" }: { label: string; value: string; detail: string; tone?: "blue" | "amber" | "green" }) {
  const tones = { blue: "bg-blue-50 text-ze-primary", amber: "bg-amber-50 text-amber-700", green: "bg-emerald-50 text-emerald-700" };
  return <div className="rounded-[20px] border border-ze-border bg-white p-5"><div className="text-xs font-semibold text-ze-muted">{label}</div><div className="mt-3 text-3xl font-extrabold tracking-tight text-ze-ink">{value}</div><div className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{detail}</div></div>;
}