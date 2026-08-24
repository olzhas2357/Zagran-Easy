import { Play } from "lucide-react";
import type { MEDIA_REEL_ITEMS } from "@/lib/constants";

type MediaReelItem = (typeof MEDIA_REEL_ITEMS)[number];

// Плейсхолдер-тайл для реел-ленты — та же диагональная штриховка, что и в CoverPhoto,
// пока фотоматериалы не собраны (см. zagraneasy-requirements.json → photos_count).
export function MediaReelTile({ item, index, src }: { item: MediaReelItem; index: number; src?: string }) {
  return (
    <div className="relative aspect-9/16 w-[150px] flex-none overflow-hidden rounded-2xl border border-ze-border sm:w-[180px]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={item.label} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-[repeating-linear-gradient(135deg,#EEF1F6_0_10px,#E5EAF2_10px_20px)] px-3 text-center font-mono text-[10.5px] text-slate-400">
          <span>#{String(index + 1).padStart(2, "0")}</span>
          <span>{item.label}</span>
        </div>
      )}
      {item.type === "video" && (
        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 backdrop-blur">
          <Play className="h-3 w-3 fill-ze-ink text-ze-ink" strokeWidth={0} />
        </div>
      )}
    </div>
  );
}
