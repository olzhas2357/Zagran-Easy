function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />;
}

export default function AdminRouteLoading() {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 md:flex-row">
      <aside className="hidden w-[248px] flex-none bg-slate-900 p-4 md:block"><Bar className="h-8 w-44 bg-slate-700" /></aside>
      <main className="min-w-0 flex-1 p-6">
        <Bar className="h-7 w-40" />
        <Bar className="mt-2 h-5 w-52" />
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Bar key={i} className="h-28" />)}</div>
        <Bar className="mt-7 h-52 w-full" />
      </main>
    </div>
  );
}
