export function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E7ECF6] bg-white/95 p-3 backdrop-blur-md sm:hidden">
      <a
        href="#finder"
        className="block rounded-2xl bg-[#2880DE] px-5 py-3.5 text-center text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(50,85,173,0.28)]"
      >
        Подобрать курс →
      </a>
    </div>
  );
}
