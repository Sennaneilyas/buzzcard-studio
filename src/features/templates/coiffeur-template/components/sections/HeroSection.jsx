import { motion } from "framer-motion";

export function HeroSection({ profile }) {
  return (
    <section className="relative w-full bg-transparent">
      {/* Banner */}
      <div className="relative w-full h-[220px] sm:h-[240px] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={profile.bannerUrl} 
            alt="Salon Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white" />
        </motion.div>
      </div>

      {/* Avatar & Info */}
      <div className="px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-[120px] h-[120px] rounded-full p-1 bg-white shadow-xl mb-4">
            <img 
              src={profile.avatarUrl} 
              alt={profile.fullName}
              className="w-full h-full rounded-full object-cover border border-[var(--primary-color, #C5A880)]/30"
            />
          </div>
          
          <h1 className="font-times text-[28px] text-[#1A1A1A] leading-tight mb-1">
            {profile.fullName}
          </h1>
          <p className="text-[var(--primary-color, #C5A880)] text-[13px] font-medium tracking-wide uppercase italic">
            {profile.title}
          </p>

          <p className="text-gray-500 text-[14px] leading-relaxed mt-4 max-w-[280px]">
            {profile.about}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
