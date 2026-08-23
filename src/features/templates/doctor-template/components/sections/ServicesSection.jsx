import { motion } from "framer-motion";
import { HeartPulse, Brain, Stethoscope, Pill, Microscope, Dna } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { ServiceCard } from "../ui/ServiceCard";
import { staggerContainer, fadeInUp } from "../../utils/animations";

import { useEditorStore } from "@/features/editor/store/useEditorStore";

const defaultServices = [
  { id: 1, icon: HeartPulse, title: "Cardiologie", desc: "Diagnostics cardiaques avancés et ECG." },
  { id: 2, icon: Brain, title: "Médecine Interne", desc: "Évaluation des affections multi-systémiques." },
  { id: 3, icon: Stethoscope, title: "Soins Préventifs", desc: "Bilans, vaccinations et conseils." },
  { id: 4, icon: Pill, title: "Pharmacothérapie", desc: "Plans médicamenteux personnalisés." },
  { id: 5, icon: Microscope, title: "Diagnostics Labo", desc: "Bilan biologique complet." },
  { id: 6, icon: Dna, title: "Santé Génomique", desc: "Conseil en risque génétique." }
];

export function ServicesSection({ profile, isEditMode }) {
  const setProfileData = useEditorStore((state) => state.setProfileData);
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="bg-transparent px-5 py-12 w-full"
    >
      <motion.div variants={fadeInUp}>
        <SectionHeader subtitle="Ce que nous offrons" title="Nos Services" />
      </motion.div>
      <div className="grid grid-cols-2 gap-3 mt-8">
        {defaultServices.map((srv, idx) => {
          const currentTitle = profile?.profileData?.[`service_${srv.id}_title`] || srv.title;
          const currentDesc = profile?.profileData?.[`service_${srv.id}_desc`] || srv.desc;
          return (
            <motion.div key={idx} variants={fadeInUp}>
              <ServiceCard 
                icon={srv.icon}
                title={currentTitle}
                desc={currentDesc}
                isEditMode={isEditMode}
                onTitleChange={(val) => setProfileData({ [`service_${srv.id}_title`]: val })}
                onDescChange={(val) => setProfileData({ [`service_${srv.id}_desc`]: val })}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
