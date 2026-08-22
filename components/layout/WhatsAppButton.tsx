import { waUrl } from "@/lib/utils";

export function WhatsAppButton() {
  return (
    <div className="pointer-events-none sticky bottom-0 z-50 flex justify-end px-4 pb-5 sm:px-7 sm:pb-7">
      <a
        href={waUrl("Здравствуйте! Хочу узнать подробнее об услугах ZagranEasy.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в WhatsApp"
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-ze-whatsapp shadow-[0_8px_24px_rgba(37,211,102,0.42)] transition-colors hover:bg-ze-whatsapp-dark sm:h-[62px] sm:w-[62px]"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
          <path d="M12.02 2C6.98 2 2.9 6.08 2.9 11.12c0 1.77.5 3.42 1.38 4.82L2.5 22l6.22-1.72a9.1 9.1 0 0 0 3.3.6c5.04 0 9.12-4.08 9.12-9.12S17.06 2 12.02 2Zm5.3 12.9c-.22.62-1.28 1.2-1.77 1.24-.5.05-.96.07-2.46-.55-1.8-.75-3.4-2.53-3.9-3.3-.5-.76-.98-1.72-.98-2.6 0-.86.45-1.28.62-1.46.17-.18.38-.22.5-.22.13 0 .26 0 .37.01.12.01.28-.05.44.34.16.4.56 1.37.6 1.47.05.1.08.22.01.35-.06.13-.13.21-.25.34-.12.13-.25.29-.36.39-.12.11-.24.23-.1.45.13.22.6.99 1.28 1.6.88.79 1.62 1.03 1.85 1.15.23.11.36.09.5-.05.13-.15.56-.65.71-.87.15-.22.3-.18.5-.11.2.07 1.28.6 1.5.71.22.11.37.17.42.26.05.1.05.57-.17 1.2Z" />
        </svg>
      </a>
    </div>
  );
}
