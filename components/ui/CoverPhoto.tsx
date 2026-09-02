// Реальное фото, если оно есть в данных (imageUrl), иначе — плейсхолдер-паттерн.
// Плейсхолдер нужен, пока фотоматериалы не собраны для всех вузов/стран
// (см. zagraneasy-requirements.json → photos_count).

export function CoverPhoto({
  src,
  alt,
  label,
  className = "",
  loading = "lazy",
}: {
  src?: string | null;
  alt: string;
  label?: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  if (src && src.startsWith("http")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading={loading} className={`h-full w-full object-cover ${className}`} />;
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-[repeating-linear-gradient(135deg,#EEF1F6_0_10px,#E5EAF2_10px_20px)] font-mono text-[10.5px] text-slate-400 ${className}`}
    >
      {label ?? `фото — ${alt}`}
    </div>
  );
}
