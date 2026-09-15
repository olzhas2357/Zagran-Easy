function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-700/70 ${className}`} />;
}

export default function AdminLoading() {
  return (
    <div className="flex h-dvh min-h-0 flex-col bg-slate-50 md:flex-row">
      {/* <aside className="hidden w-[248px] flex-none bg-slate-900 p-4 md:block">
        <Skeleton className="h-8 w-44" />
        <div className="mt-8 space-y-2">
          {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-10 w-full" />)}
        </div>
      </aside> */}
      <main className="min-w-0 flex-1 p-6">
        <Skeleton className="h-7 w-40 bg-slate-200" />
        <Skeleton className="mt-2 h-5 w-52 bg-slate-200" />
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28 bg-slate-200" />)}
        </div>
        <Skeleton className="mt-7 h-52 w-full bg-slate-200" />
        <Skeleton className="mt-6 h-52 w-full bg-slate-200" />
      </main>
    </div>
  );
}
