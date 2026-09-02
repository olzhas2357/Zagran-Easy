export function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0B132B]/95 p-3 backdrop-blur-md sm:hidden">
      <a
        href="#finder"
        className="block rounded-2xl bg-gradient-to-r from-[#2880DE] to-[#22D3EE] px-5 py-3.5 text-center text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(34,211,238,0.3)]"
      >
        Подобрать курс →
      </a>
    </div>
  );
}
