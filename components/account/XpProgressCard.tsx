import { Flame, Sparkles, Trophy } from "lucide-react";
import type { StudentGamification } from "@/lib/student-data";

export function XpProgressCard({ progress }: { progress: StudentGamification }) {
  const span = Math.max(1, progress.nextLevelXp - progress.levelStartXp);
  const percent = Math.min(100, Math.max(0, ((progress.xp - progress.levelStartXp) / span) * 100));

  return (
    <section className="overflow-hidden rounded-[20px] bg-[#11244B] p-5 text-white shadow-[0_18px_45px_rgba(17,36,75,0.18)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-blue-200">
            <Sparkles className="h-4 w-4" /> Ваш прогресс
          </div>
          <div className="mt-2 text-[27px] font-extrabold tracking-tight">Уровень {progress.level}</div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          <Trophy className="h-5 w-5 text-amber-300" />
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3 text-[13px]">
        <span className="font-bold">{progress.xp.toLocaleString("ru-RU")} XP</span>
        <span className="text-white/55">до {progress.nextLevelXp.toLocaleString("ru-RU")} XP</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-[#5CA7FF] to-[#8FD9F5] transition-[width]" style={{ width: `${percent}%` }} />
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-[13px] font-semibold text-white/75">
        <Flame className="h-4.5 w-4.5 text-orange-400" fill="currentColor" />
        {progress.streakDays > 0 ? `${progress.streakDays} дней подряд` : "Начните серию занятий сегодня"}
      </div>
    </section>
  );
}
