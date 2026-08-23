import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { staggerContainer, fadeInUp } from "../../utils/animations";

import EditableText from "@/components/ui/EditableText";
import { useEditorStore } from "@/features/editor/store/useEditorStore";

const defaultTestimonials = [
  { id: 1, author: "Fatima Zouiten", initials: "FZ", text: "\"Trois autres médecins avaient ignoré mes douleurs, elle a su diagnostiquer mon problème immédiatement.\"", rating: 5, date: "Patiente depuis 2021" }
];

export function TestimonialsSection({ profile, isEditMode }) {
  const setProfileData = useEditorStore((state) => state.setProfileData);
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="bg-[#F8FAFC] px-5 py-12 w-full"
    >
      <motion.div variants={fadeInUp}>
        <SectionHeader subtitle="Témoignages" title="Ce que disent nos patients" />
      </motion.div>
      <div className="mt-8 flex flex-col gap-4">
        {defaultTestimonials.map((t, idx) => {
          const currentText = profile?.profileData?.[`testimonial_${t.id}_text`] || t.text;
          const currentAuthor = profile?.profileData?.[`testimonial_${t.id}_author`] || t.author;
          const currentDate = profile?.profileData?.[`testimonial_${t.id}_date`] || t.date;
          return (
            <motion.div key={idx} variants={fadeInUp} className="bg-white p-6 rounded-[24px] border-[0.667px] border-[rgba(70,130,180,0.18)] drop-shadow-[0px_2px_7px_rgba(70,130,180,0.1)]">
              <div className="flex gap-1 mb-4 text-[var(--primary-color,#4682b4)]">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <div className="text-[var(--primary-color,#4682b4)] text-[13px] italic mb-6 leading-relaxed">
                <EditableText
                  as="p"
                  value={currentText}
                  onChange={(val) => setProfileData({ [`testimonial_${t.id}_text`]: val })}
                  isEditMode={isEditMode}
                  placeholder="Témoignage"
                  className="outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[rgba(70,130,180,0.08)] flex items-center justify-center text-[13px] font-bold text-[var(--primary-color,#4682b4)]">
                  {currentAuthor ? currentAuthor.substring(0, 2).toUpperCase() : t.initials}
                </div>
                <div>
                  <div className="font-semibold text-[var(--primary-color,#4682b4)] text-[14px]">
                    <EditableText
                      as="span"
                      value={currentAuthor}
                      onChange={(val) => setProfileData({ [`testimonial_${t.id}_author`]: val })}
                      isEditMode={isEditMode}
                      placeholder="Nom"
                      className="outline-none"
                    />
                  </div>
                  <div className="text-[12px] text-[rgba(70,130,180,0.55)]">
                    <EditableText
                      as="span"
                      value={currentDate}
                      onChange={(val) => setProfileData({ [`testimonial_${t.id}_date`]: val })}
                      isEditMode={isEditMode}
                      placeholder="Date"
                      className="outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

