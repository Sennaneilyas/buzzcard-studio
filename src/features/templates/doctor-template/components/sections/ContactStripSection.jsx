import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactRow } from "../ui/ContactRow";
import { staggerContainer, fadeInUp } from "../../utils/animations";
import { useEditorStore } from "@/features/editor/store/useEditorStore";

export function ContactStripSection({ profile, isEditMode }) {
  const setProfileData = useEditorStore((state) => state.setProfileData);
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="bg-[#F8FAFC] px-5 py-8 w-full flex flex-col gap-3"
    >
      <motion.div variants={fadeInUp}>
        <ContactRow 
          icon={Mail} 
          label="E-mail" 
          value={profile.emails?.[0] || ""} 
          actionLabel="Écrire" 
          href={`mailto:${profile.emails?.[0] || ""}`} 
          isEditMode={isEditMode}
          onChange={(val) => setProfileData({ email: val })}
        />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <ContactRow 
          icon={Phone} 
          label="Téléphone" 
          value={profile.phones?.[0] || ""} 
          actionLabel="Appeler" 
          href={`tel:${profile.phones?.[0] || ""}`} 
          isEditMode={isEditMode}
          onChange={(val) => setProfileData({ phone: val })}
        />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <ContactRow 
          icon={MapPin} 
          label="Localisation" 
          value={profile.location || ""} 
          actionLabel="Carte" 
          href={`https://maps.google.com/?q=${profile.location || ""}`} 
          isEditMode={isEditMode}
          onChange={(val) => setProfileData({ location: val })}
        />
      </motion.div>
    </motion.section>
  );
}
