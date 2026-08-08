import { motion } from "framer-motion";
import { HeartPulse, Brain, Stethoscope, Pill, Microscope, Dna } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { ServiceCard } from "../ui/ServiceCard";
import { staggerContainer, fadeInUp } from "../../utils/animations";

const services = [
  { icon: HeartPulse, title: "Cardiologie", desc: "Diagnostics cardiaques avancés et ECG." },
  { icon: Brain, title: "Médecine Interne", desc: "Évaluation des affections multi-systémiques." },
  { icon: Stethoscope, title: "Soins Préventifs", desc: "Bilans, vaccinations et conseils." },
  { icon: Pill, title: "Pharmacothérapie", desc: "Plans médicamenteux personnalisés." },
  { icon: Microscope, title: "Diagnostics Labo", desc: "Bilan biologique complet." },
  { icon: Dna, title: "Santé Génomique", desc: "Conseil en risque génétique." }
];

export function ServicesSection() {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="bg-white px-5 py-12 w-full"
    >
      <motion.div variants={fadeInUp}>
        <SectionHeader subtitle="Ce que nous offrons" title="Nos Services" />
      </motion.div>
      <div className="grid grid-cols-2 gap-3 mt-8">
        {services.map((srv, idx) => (
          <motion.div key={idx} variants={fadeInUp}>
            <ServiceCard {...srv} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
