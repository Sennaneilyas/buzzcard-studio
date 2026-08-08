import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { staggerContainer, fadeInUp } from "../../utils/animations";

const blogPosts = [
  { category: "Cardiologie", date: "1 août 2026", title: "Comprendre la Fibrillation Auriculaire", excerpt: "La FA touche plus de 33 millions de personnes dans le monde. Quels sont les signes..." },
  { category: "Prévention", date: "18 juillet 2026", title: "Santé Cardiaque Après 40 Ans", excerpt: "Des modifications du mode de vie qui, selon les études, peuvent prolonger..." }
];

export function BlogSection() {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="bg-white px-5 py-12 w-full"
    >
      <motion.div variants={fadeInUp}>
        <SectionHeader subtitle="Actualités santé" title="Le Blog" />
      </motion.div>
      <div className="mt-8 flex flex-col gap-4">
        {blogPosts.map((post, idx) => (
          <motion.div key={idx} variants={fadeInUp} whileHover={{ y: -2 }} className="bg-white p-5 rounded-[20px] border-[0.667px] border-[#4682b4] drop-shadow-[0px_2px_7px_rgba(70,130,180,0.1)] cursor-pointer group transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-[#4682b4] text-[11px] bg-[rgba(70,130,180,0.08)] px-2.5 py-1 rounded-full">{post.category}</span>
              <span className="text-[11px] text-[rgba(70,130,180,0.55)]">{post.date}</span>
            </div>
            <h3 className="font-['Poppins'] font-semibold text-[15px] text-[#4682b4] mb-2 leading-snug group-hover:opacity-80 transition-opacity">{post.title}</h3>
            <p className="text-[13px] text-[rgba(70,130,180,0.55)] mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
            <button className="text-[13px] font-semibold text-[#4682b4] flex items-center gap-1 group-hover:gap-2 transition-all">
              Lire la suite <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
