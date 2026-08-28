import { CoverPhoto } from "./CoverPhoto";

interface MarqueeImage {
  src: string;
  alt: string;
}

// Лёгкая CSS-анимация (без JS/rAF) для плотных фото-лент: письма о зачислении,
// кампусы, фото туров. Дублируем список x2 для бесшовной бесконечной прокрутки.
// direction="reverse" — лента едет вправо, для второго ряда в противоход первому.
export function PhotoMarquee({
  images,
  speed = 34,
  direction = "normal",
  tileClassName = "aspect-3/4 w-[130px] sm:w-[160px]",
}: {
  images: MarqueeImage[];
  speed?: number;
  direction?: "normal" | "reverse";
  tileClassName?: string;
}) {
  const doubled = [...images, ...images];

  return (
    <div className="animate-marquee-paused relative overflow-hidden">
      <div
        className="flex w-max flex-none gap-3.5"
        style={{
          animationName: "marquee-scroll",
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: direction === "reverse" ? "reverse" : "normal",
        }}
      >
        {doubled.map((img, i) => (
          <div
            key={i}
            className={`flex-none overflow-hidden rounded-2xl border border-ze-border shadow-[0_4px_16px_rgba(15,23,42,0.06)] ${tileClassName}`}
            aria-hidden={i >= images.length}
          >
            <CoverPhoto src={img.src} alt={img.alt} />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent sm:w-20" />
    </div>
  );
}
