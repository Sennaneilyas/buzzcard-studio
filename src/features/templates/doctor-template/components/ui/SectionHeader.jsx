import { Star } from "lucide-react";

export function SectionHeader({ subtitle, title }) {
  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-[11px] font-semibold text-[rgba(70,130,180,0.55)] uppercase tracking-[1.98px] text-center mb-2">{subtitle}</p>
      <h2 className="text-[25.6px] font-poppins font-semibold text-[#4682b4] text-center">{title}</h2>
      <div className="flex gap-2 items-center justify-center mt-3">
        <div className="h-[1.5px] w-[28px] bg-[#4682b4] opacity-20 rounded-full" />
        <Star className="w-3 h-3 text-[#4682b4]" />
        <div className="h-[1.5px] w-[28px] bg-[#4682b4] opacity-20 rounded-full" />
      </div>
    </div>
  );
}

