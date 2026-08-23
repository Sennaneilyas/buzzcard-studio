import { motion } from "framer-motion";
import EditableImage from "@/components/ui/EditableImage";
import EditableText from "@/components/ui/EditableText";
import { useEditorStore } from "@/features/editor/store/useEditorStore";

export function HeroSection({ profile, isEditMode }) {
  const setProfileData = useEditorStore((s) => s.setProfileData);

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
          <EditableImage
            src={profile.bannerUrl}
            alt="Salon Banner"
            isEditMode={isEditMode}
            onChange={(val) => setProfileData({ bannerUrl: val })}
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
          <div className="w-[120px] h-[120px] rounded-full p-1 bg-white shadow-xl mb-4 overflow-hidden">
            <EditableImage
              src={profile.avatarUrl}
              alt={profile.fullName}
              isEditMode={isEditMode}
              onChange={(val) => setProfileData({ avatarUrl: val })}
              className="w-full h-full rounded-full object-cover border border-[var(--primary-color, #C5A880)]/30"
            />
          </div>
          
          <EditableText
            as="h1"
            value={profile.fullName || ""}
            onChange={(val) => setProfileData({ name: val })}
            isEditMode={isEditMode}
            placeholder="Your Name"
            className="font-times text-[28px] text-[#1A1A1A] leading-tight mb-1"
          />
          <EditableText
            as="p"
            value={profile.title || ""}
            onChange={(val) => setProfileData({ role: val })}
            isEditMode={isEditMode}
            placeholder="Your Title"
            className="text-[var(--primary-color, #C5A880)] text-[13px] font-medium tracking-wide uppercase italic"
          />

          <EditableText
            as="p"
            value={profile.about || ""}
            onChange={(val) => setProfileData({ bio: val })}
            isEditMode={isEditMode}
            placeholder="Write a short bio..."
            className="text-gray-500 text-[14px] leading-relaxed mt-4 max-w-[280px]"
          />
        </motion.div>
      </div>
    </section>
  );
}

