function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />;
}

export default function TeacherRouteLoading() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#F7F9FC] md:flex-row">
      <aside className="hidden w-[248px] flex-none border-r border-ze-border bg-white p-4 md:block">
        <Bar className="h-8 w-44" />
        <div className="mt-8 space-y-2">{Array.from({ length: 7 }, (_, i) => <Bar key={i} className="h-10 w-full" />)}</div>
      </aside>
      <main className="min-w-0 flex-1 p-5 sm:p-8">
        <Bar className="h-8 w-72" />
        <Bar className="mt-2 h-5 w-48" />
        <Bar className="mt-8 h-36 w-full rounded-[24px]" />
        <Bar className="mt-8 h-24 w-full rounded-[20px]" />
      </main>
    </div>
  );
}
