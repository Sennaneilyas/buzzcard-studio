import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { fadeInUp, staggerContainer } from "../../utils/animations";
import { ServiceCard } from "../ui/ServiceCard";

export function ServicesSection({ profile }) {
  if (!profile?.services || profile.services.length === 0) return null;

  return (
    <section className="px-6 py-12 bg-transparent">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
      >
        <SectionHeader subtitle="Expertise" title="Nos Services" />
        
        <motion.div 
          variants={staggerContainer}
          className="mt-8 grid grid-cols-2 gap-4"
        >
          {profile.services.map((service, index) => (
            <ServiceCard
              key={service.id || index}
              title={service.name}
              href={service.href || "#"}
              imgSrc={service.imgSrc}
              imgAlt={service.imgAlt || "Service"}
              variant={service.variant || "default"}
              price={service.price}
              duration={service.duration}
              className="min-h-[160px]"
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
