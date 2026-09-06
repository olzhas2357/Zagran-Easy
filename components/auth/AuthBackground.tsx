export function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10"
      style={{
        background: "linear-gradient(135deg, #EAF2FF 0%, #F3F8FF 28%, #FAFCFF 52%, #EAF9FB 100%)",
      }}
    >
      <div className="pointer-events-none absolute -left-28 top-[-8%] h-[380px] w-[380px] rounded-full bg-[#CFE2FF]/60 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-[-12%] h-[340px] w-[340px] rounded-full bg-[#BFEFF7]/60 blur-[100px]" />
      <div className="relative w-full max-w-[380px]">{children}</div>
    </div>
  );
}
