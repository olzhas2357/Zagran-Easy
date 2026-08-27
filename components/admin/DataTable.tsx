export interface Column<T> {
  key: string;
  title: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  getRowId: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  total,
  page,
  limit,
  onPageChange,
  onRowClick,
  loading,
  getRowId,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13.5px]">
          <thead className="bg-slate-50 text-[11.5px] font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3" style={{ width: col.width }}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  Загрузка…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  Ничего не найдено
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={getRowId(row)}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? "cursor-pointer hover:bg-slate-50" : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-800">
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[13px] text-slate-500">
          <span>
            Страница {page} из {totalPages} · {total} всего
          </span>
          <div className="flex gap-1">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 font-semibold disabled:opacity-40"
            >
              ←
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 font-semibold disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
