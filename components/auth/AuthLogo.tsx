import Image from "next/image";

export function AuthLogo() {
  return (
    // Убираем bg-white, жесткие рамки и лишние паддинги. 
    // Оставляем только мягкую тень для самой иконки и центрирование.
    <div className="mx-auto flex h-12 w-12 items-center justify-center filter drop-shadow-[0_8px_16px_rgba(26,86,219,0.12)]">
      <Image 
        src="/logo-icon.png" 
        alt="ZagranEasy" 
        width={669} 
        height={477} 
        priority 
        className="h-auto w-full object-contain" 
      />
    </div>
  );
}
