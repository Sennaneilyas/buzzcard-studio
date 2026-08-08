import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "../../utils/animations";

export function NewsletterSignupSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (!email) return; 
    setMessage("Merci, votre inscription a bien été prise en compte."); 
    setEmail(""); 
  };

  return (
    <motion.section 
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
      className="bg-[#4682b4] px-5 py-12 w-full flex flex-col items-center text-center relative overflow-hidden"
    >
      <img src="/img/vector-4.svg" className="absolute top-4 left-4 opacity-50 w-[180px]" alt="" />
      
      <motion.p variants={fadeInUp} className="text-[11px] font-semibold text-[#ffffffb2] tracking-[1.98px] relative z-10 mb-2">NEWSLETTER</motion.p>
      <motion.h2 variants={fadeInUp} className="font-['Pinyon_Script'] text-white text-[32px] relative z-10">Restez informé</motion.h2>
      <motion.p variants={fadeInUp} className="text-[#ffffffb2] text-[13px] mt-2 mb-6 relative z-10">Conseils santé, actualités médicales et rappels de rendez-vous.</motion.p>
      
      <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="w-full flex gap-2 relative z-10">
        <input type="email" required value={email} onChange={(e) => {setEmail(e.target.value); setMessage("");}} placeholder="Votre e-mail" className="flex-1 min-w-0 px-4 py-3 bg-[#ffffff1f] rounded-xl border-[1.33px] border-[#ffffff40] text-white placeholder:text-[#ffffff80] text-[16px] sm:text-sm outline-none" />
        <motion.button whileTap={{ scale: 0.95 }} type="submit" className="px-4 py-3 bg-white text-[#4682b4] font-semibold text-sm rounded-xl shrink-0">S'abonner</motion.button>
      </motion.form>
      {message && <p className="text-white text-xs mt-3 relative z-10">{message}</p>}
    </motion.section>
  );
}

