import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { staggerContainer, fadeInUp } from "../../utils/animations";

export function ContactFormSection() {
  const [formValues, setFormValues] = useState({ fullName: "", email: "", phone: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    setIsSubmitted(false);
  };
  
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    setIsSubmitted(true); 
    setFormValues({ fullName: "", email: "", phone: "", message: "" }); 
  };
  
  const inputClass = "w-full px-4 py-3 bg-white rounded-xl border-[1.33px] border-[var(--primary-color, #4682b4)2e] text-[var(--primary-color, #4682b4)] text-[16px] sm:text-sm placeholder:text-[var(--primary-color, #4682b4)80] focus:border-[var(--primary-color, #4682b4)] outline-none transition-all";
  
  return (
    <motion.section 
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
      className="bg-white px-5 py-12 w-full flex flex-col items-center"
    >
      <motion.div variants={fadeInUp} className="w-full">
        <SectionHeader subtitle="NOUS ÉCRIRE" title="Nous Contacter" />
      </motion.div>
      <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3.5 p-6 bg-[#f0f5fa] rounded-[20px] border-[0.67px] border-[var(--primary-color, #4682b4)2e] w-full">
        <input name="fullName" type="text" required value={formValues.fullName} onChange={handleChange} placeholder="Nom complet" className={inputClass} />
        <input name="email" type="email" required value={formValues.email} onChange={handleChange} placeholder="Adresse e-mail" className={inputClass} />
        <input name="phone" type="tel" value={formValues.phone} onChange={handleChange} placeholder="Téléphone (optionnel)" className={inputClass} />
        <div className="w-full">
          <textarea name="message" required maxLength={500} value={formValues.message} onChange={handleChange} placeholder="Votre message…" className={`${inputClass} resize-none h-[111px]`} />
          <p className="text-right text-[var(--primary-color, #4682b4)8c] text-[11px] mt-1">{formValues.message.length}/500</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} type="submit" className="w-full py-3.5 bg-[var(--primary-color, #4682b4)] text-white rounded-xl font-semibold text-sm mt-2">
          {isSubmitted ? "Envoyé ✓" : "Envoyer →"}
        </motion.button>
      </motion.form>
    </motion.section>
  );
}

