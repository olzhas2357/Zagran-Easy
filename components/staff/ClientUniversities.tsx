"use client";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ClientUniversity } from "@/lib/types";
import { updateClientUniversity } from "@/lib/staff-actions";

export function ClientUniversities({ clientId, items }: { clientId: string; items: ClientUniversity[] }) {
  const router = useRouter(); const [pending, startTransition] = useTransition();
  function patch(id: string, input: Record<string, unknown>) { startTransition(async () => { await updateClientUniversity(clientId, id, input); router.refresh(); }); }
  return <section className="rounded-[20px] border border-ze-border bg-white p-5">
    <div className="flex items-center justify-between"><h2 className="text-[16px] font-bold">Подбор университетов</h2><Link href={`/education?clientId=${clientId}`} className="text-[13px] font-semibold text-ze-primary">Добавить</Link></div>
    <div className="mt-4 flex flex-col gap-3">{items.length === 0 && <p className="text-[13px] text-ze-muted">В подборе пока нет университетов.</p>}
      {items.map((item) => <div key={item.id} className="rounded-xl border border-ze-border p-4">
        <div className="flex flex-wrap justify-between gap-3"><div><Link href={`/education/${item.slug}`} className="font-bold hover:text-ze-primary">{item.name}</Link><p className="text-[12.5px] text-ze-muted">{item.city} · приоритет {item.priority}</p></div>
          <select disabled={pending} value={item.status} onChange={(e) => patch(item.id, { status: e.target.value })} className="rounded-lg border border-ze-border px-2 py-1.5 text-[12px]"><option value="shortlisted">В подборе</option><option value="recommended">Рекомендован</option><option value="approved">Одобрен клиентом</option><option value="applying">Готовим подачу</option><option value="submitted">Подано</option><option value="accepted">Принят</option><option value="rejected">Отказ</option><option value="excluded">Исключён</option></select></div>
        <div className="mt-3 flex flex-wrap gap-3"><label className="text-[12px]">Приоритет <input type="number" min={1} max={99} defaultValue={item.priority} onBlur={(e) => patch(item.id, { priority: Number(e.target.value) })} className="ml-1 w-16 rounded border border-ze-border px-2 py-1" /></label><label className="flex items-center gap-1.5 text-[12px]"><input type="checkbox" checked={item.visibleToStudent} onChange={(e) => patch(item.id, { visible_to_student: e.target.checked })} />Показывать ученику</label></div>
      </div>)}
    </div>
  </section>;
}
