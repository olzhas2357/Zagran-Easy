function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />;
}

export default function TeacherLoading() {
  return (
    <div className="flex h-dvh min-h-0 flex-col bg-[#F7F9FC] md:flex-row">
      {/* <aside className="hidden w-[248px] flex-none border-r border-ze-border bg-white p-4 md:block">
        <Skeleton className="h-8 w-44" />
        <div className="mt-8 space-y-2">
          {Array.from({ length: 7 }, (_, index) => <Skeleton key={index} className="h-10 w-full" />)}
        </div>
      </aside> */}
      <main className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-8">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-2 h-5 w-48" />
        <Skeleton className="mt-8 h-36 w-full rounded-[24px]" />
        <Skeleton className="mt-8 h-24 w-full rounded-[20px]" />
        <Skeleton className="mt-8 h-48 w-full rounded-[20px]" />
      </main>
    </div>
  );
}
