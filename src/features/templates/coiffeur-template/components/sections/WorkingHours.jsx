import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { fadeInUp, staggerContainer } from "../../utils/animations";

export function WorkingHours({ profile }) {
  if (!profile?.hours || profile.hours.length === 0) return null;

  return (
    <section className="px-6 py-12 bg-transparent">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
      >
        <SectionHeader subtitle="Disponibilité" title="Horaires d'Ouverture" />
        
        <motion.div 
          variants={staggerContainer}
          className="mt-8 bg-white rounded-[20px] p-6 shadow-sm border border-black/5"
        >
          <div className="flex flex-col gap-4">
            {profile.hours.map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className={`flex justify-between items-center pb-4 ${index !== profile.hours.length - 1 ? 'border-b border-black/5' : ''}`}
              >
                <span className="font-times text-[#1A1A1A] text-[17px]">
                  {item.day}
                </span>
                <span className={`text-[13px] font-medium ${item.time === 'Fermé' ? 'text-[#e74c3c]' : 'text-gray-500'}`}>
                  {item.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
