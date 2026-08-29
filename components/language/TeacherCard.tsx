import type { LanguageTeacher } from "@/lib/language-data";

export function TeacherCard({ teacher }: { teacher: LanguageTeacher }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E7ECF6] bg-white shadow-[0_1px_2px_rgba(15,27,61,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,27,61,0.1)]">
      <div className="aspect-[4/5] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={teacher.photo}
          alt={teacher.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <div className="text-[16px] font-bold text-[#0F1B3D]">{teacher.name}</div>
        <div className="text-[13px] font-medium text-[#2880DE]">{teacher.role}</div>
        <div className="text-[12px] text-slate-500">{teacher.tags}</div>
        <div className="mt-1.5 flex items-center justify-between text-[12px] text-slate-500">
          <span>{teacher.experience}</span>
          <span className="font-semibold text-[#0F1B3D]">{teacher.rating}</span>
        </div>
        <div className="text-[12px] text-slate-400">{teacher.students}</div>
        <a
          href="#finder"
          className="mt-3 text-[13.5px] font-semibold text-[#2880DE] transition-colors hover:text-[#2066B2]"
        >
          Смотреть профиль →
        </a>
      </div>
    </div>
  );
}
