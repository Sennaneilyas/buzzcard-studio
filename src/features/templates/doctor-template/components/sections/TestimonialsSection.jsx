import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { staggerContainer, fadeInUp } from "../../utils/animations";

const testimonials = [
  { author: "Fatima Zouiten", initials: "FZ", text: "\"Trois autres médecins avaient ignoré mes douleurs, elle a su diagnostiquer mon problème immédiatement.\"", rating: 5, date: "Patiente depuis 2021" }
];

export function TestimonialsSection() {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="bg-[#f0f5fa] px-5 py-12 w-full"
    >
      <motion.div variants={fadeInUp}>
        <SectionHeader subtitle="Témoignages" title="Ce que disent nos patients" />
      </motion.div>
      <div className="mt-8 flex flex-col gap-4">
        {testimonials.map((t, idx) => (
          <motion.div key={idx} variants={fadeInUp} className="bg-white p-6 rounded-[24px] border-[0.667px] border-[rgba(70,130,180,0.18)] drop-shadow-[0px_2px_7px_rgba(70,130,180,0.1)]">
            <div className="flex gap-1 mb-4 text-[#4682b4]">
              {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-[#4682b4] text-[13px] italic mb-6 leading-relaxed">
              {t.text}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[rgba(70,130,180,0.08)] flex items-center justify-center text-[13px] font-bold text-[#4682b4]">
                {t.initials}
              </div>
              <div>
                <p className="font-semibold text-[#4682b4] text-[14px]">{t.author}</p>
                <p className="text-[12px] text-[rgba(70,130,180,0.55)]">{t.date}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
