import Image from "next/image";

export function AuthLogo() {
  return (
    // Убираем bg-white, жесткие рамки и лишние паддинги. 
    // Оставляем только мягкую тень для самой иконки и центрирование.
    <div className="mx-auto flex h-14 w-36 items-center justify-center filter drop-shadow-[0_8px_16px_rgba(26,86,219,0.12)]">
      <Image
        src="/zagraneasy-logo.png"
        alt="ZagranEasy"
        width={1080}
        height={650}
        priority
        className="h-full w-full object-contain"
      />
    </div>
  );
}
