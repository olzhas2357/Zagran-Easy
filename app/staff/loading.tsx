function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />;
}

export default function StaffRouteLoading() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#F7F9FC] md:flex-row">
      <aside className="hidden w-[228px] flex-none border-r border-ze-border bg-white p-4 md:block">
        <Bar className="h-8 w-44" />
        <div className="mt-8 space-y-2">{Array.from({ length: 5 }, (_, i) => <Bar key={i} className="h-10 w-full" />)}</div>
      </aside>
      <main className="min-w-0 flex-1 p-5 sm:p-9">
        <Bar className="h-8 w-64" />
        <Bar className="mt-2 h-5 w-52" />
        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Bar key={i} className="h-28 rounded-[20px]" />)}</div>
        <Bar className="mt-9 h-6 w-40" />
      </main>
    </div>
  );
}
