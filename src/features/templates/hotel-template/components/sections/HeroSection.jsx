import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import EditableImage from "@/components/ui/EditableImage";
import EditableText from "@/components/ui/EditableText";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import { PROFILE_MEDIA_CATEGORIES } from "@/features/editor/media/profileMedia";

export function HeroSection({
  profile,
  isEditMode,
  lockProfileIdentity = false,
  scrollContainerRef,
}) {
  const setProfileData = useEditorStore((s) => s.setProfileData);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.8]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[220px] w-full aspect-[3/2] overflow-hidden"
    >
      {/* Parallax Background Image */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 w-full h-[130%]"
      >
        <EditableImage
          src={profile.bannerUrl || ""}
          alt={profile.name}
          isEditMode={isEditMode}
          category={PROFILE_MEDIA_CATEGORIES.COVER}
          onChange={(val) => setProfileData({ bannerUrl: val })}
          containerClassName="absolute inset-0 h-full w-full"
        />
      </motion.div>

      {/* Gradient Overlay (Top to Bottom) */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-[var(--hotel-espresso)]/45 via-transparent to-transparent"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[var(--hotel-espresso)]/90 via-[var(--hotel-espresso)]/55 to-transparent" />

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-6 pb-7 sm:pb-9">
        {/* Avatar / Logo */}
        {profile.avatarUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.5,
              type: "spring",
              stiffness: 200,
            }}
            className="mb-2.5"
          >
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[var(--hotel-cappuccino)]/30 bg-white shadow-xl sm:h-20 sm:w-20">
              <EditableImage
                src={profile.avatarUrl || ""}
                alt={`${profile.name} Logo`}
                isEditMode={isEditMode && !lockProfileIdentity}
                category={PROFILE_MEDIA_CATEGORIES.AVATAR}
                onChange={(val) => setProfileData({ avatarUrl: val })}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Star Rating */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-2 flex items-center gap-1.5"
        >
          {Array.from({ length: profile.stars || 5 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.5 + i * 0.1,
                type: "spring",
                stiffness: 300,
              }}
              className="hotel-star text-lg sm:text-xl"
            >
              ★
            </motion.span>
          ))}
        </motion.div>

        <EditableText
          as="h1"
          value={profile.name || ""}
          onChange={(val) => setProfileData({ name: val })}
          isEditMode={isEditMode && !lockProfileIdentity}
          placeholder="Hotel Name"
          className="w-full px-4 text-center font-hotel-display font-semibold leading-tight text-[var(--hotel-ivory)]"
          style={{
            fontSize: "clamp(1.55rem, 5.5vw, 2.2rem)",
            textShadow: "0 2px 14px rgba(0, 0, 0, 0.55)",
            wordBreak: "break-word",
          }}
        />
      </div>
    </section>
  );
}
