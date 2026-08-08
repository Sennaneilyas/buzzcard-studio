export function SectionHeader({ title, subtitle, align = "left" }) {
  return (
    <div className={`mb-6 ${align === "center" ? "text-center" : "text-left"}`}>
      {subtitle && (
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C5A880] mb-2 block">
          {subtitle}
        </span>
      )}
      <h2 className="font-times text-3xl text-[#1A1A1A] leading-tight">
        {title}
      </h2>
    </div>
  );
}
