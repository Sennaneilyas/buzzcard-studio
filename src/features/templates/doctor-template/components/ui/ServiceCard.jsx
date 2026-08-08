import { motion } from "framer-motion";

export function ServiceCard({ icon: Icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white p-4 rounded-[20px] border-[0.667px] border-[rgba(70,130,180,0.18)] drop-shadow-[0px_2px_7px_rgba(70,130,180,0.1)] flex flex-col h-full group transition-all"
    >
      <div className="w-10 h-10 rounded-[12px] bg-[rgba(70,130,180,0.08)] flex items-center justify-center mb-3 text-[#4682b4] group-hover:bg-[#4682b4] group-hover:text-white transition-colors">
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>
      <h3 className="font-poppins font-semibold text-[14px] text-[#4682b4] mb-2">{title}</h3>
      <p className="text-[12px] text-[rgba(70,130,180,0.55)] leading-relaxed flex-grow">{desc}</p>
    </motion.div>
  );
}

