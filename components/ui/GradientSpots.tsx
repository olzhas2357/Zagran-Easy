// Декоративные размытые цветные пятна на фоне — статичный CSS (без JS),
// добавляют глубину в духе Kaspi/modern SaaS без отвлечения от контента.
export function GradientSpots({ variant = "hero" }: { variant?: "hero" | "section" }) {
  if (variant === "hero") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[340px] w-[340px] rounded-full bg-[#1a56db]/10 blur-[90px]" />
        <div className="absolute -right-20 top-10 h-[280px] w-[280px] rounded-full bg-[#25d366]/10 blur-[90px]" />
        <div className="absolute bottom-[-120px] left-1/3 h-[260px] w-[260px] rounded-full bg-[#f59e0b]/8 blur-[100px]" />
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-[-10%] top-0 h-[300px] w-[300px] rounded-full bg-[#1a56db]/8 blur-[100px]" />
    </div>
  );
}
