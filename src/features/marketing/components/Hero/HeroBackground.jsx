export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#e0f2fe] via-[#f0fdf4] to-[#f8fafc]">
      {/* Premium CSS Mesh Gradient Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-mint/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#cbd5e1]/40 blur-[120px]" />
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-sky-200/30 blur-[100px]" />
      
      {/* Subtle texture grain */}
      <div className="hero-bg-grain pointer-events-none absolute inset-0 z-10 mix-blend-multiply opacity-15" />
    </div>
  );
}
