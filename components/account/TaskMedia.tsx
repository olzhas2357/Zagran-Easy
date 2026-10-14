import { ExternalLink, FileAudio, FileVideo } from "lucide-react";

function isVideoMedia(url: string, mediaKind?: unknown) {
  if (mediaKind === "video") return true;
  if (mediaKind === "audio") return false;

  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return /\.(mp4|webm|mov|m4v|ogv)$/.test(pathname);
  } catch {
    return /\.(mp4|webm|mov|m4v|ogv)(?:[?#]|$)/i.test(url);
  }
}

export function TaskMedia({
  url,
  mediaKind,
  className = "",
}: {
  url: string;
  mediaKind?: unknown;
  className?: string;
}) {
  const video = isVideoMedia(url, mediaKind);

  return (
    <div className={className}>
      <div className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-ze-muted">
        {video ? <FileVideo className="h-4 w-4" /> : <FileAudio className="h-4 w-4" />}
        {video ? "Видео задания" : "Аудио задания"}
      </div>
      {video ? (
        <video controls preload="metadata" src={url} className="max-h-[440px] w-full rounded-xl bg-slate-950" />
      ) : (
        <audio controls preload="metadata" src={url} className="w-full" />
      )}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ze-primary hover:underline"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Если плеер не открылся — открыть файл
      </a>
    </div>
  );
}
