function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />;
}

export default function StaffLoading() {
  return (
    <div className="flex h-dvh min-h-0 flex-col bg-[#F7F9FC] md:flex-row">
      {/* <aside className="hidden w-[228px] flex-none border-r border-ze-border bg-white p-4 md:block">
        <Skeleton className="h-8 w-44" />
        <div className="mt-8 space-y-2">
          {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-10 w-full" />)}
        </div>
      </aside> */}
      <main className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-9">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-5 w-52" />
        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28 rounded-[20px]" />)}
        </div>
        <Skeleton className="mt-9 h-6 w-40" />
        <div className="mt-3 grid gap-3.5 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-36 rounded-[20px]" />)}
        </div>
      </main>
    </div>
  );
}
