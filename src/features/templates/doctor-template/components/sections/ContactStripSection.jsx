import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactRow } from "../ui/ContactRow";
import { staggerContainer, fadeInUp } from "../../utils/animations";

export function ContactStripSection({ profile }) {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="bg-[#f0f5fa] px-5 py-8 w-full flex flex-col gap-3"
    >
      <motion.div variants={fadeInUp}>
        <ContactRow icon={Mail} label="E-mail" value={profile.emails[0]} actionLabel="Écrire" href={`mailto:${profile.emails[0]}`} />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <ContactRow icon={Phone} label="Téléphone" value={profile.phones[0]} actionLabel="Appeler" href={`tel:${profile.phones[0]}`} />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <ContactRow icon={MapPin} label="Localisation" value={profile.location} actionLabel="Carte" href={`https://maps.google.com/?q=${profile.location}`} />
      </motion.div>
    </motion.section>
  );
}
