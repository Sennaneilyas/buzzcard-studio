import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { HotelBackground } from "./components/ui/HotelBackground";
import { HeroSection } from "./components/sections/HeroSection";
import { mockHotelProfile } from "./utils/constants";
import "./hotel-template.css";

// Lazy loaded sections (below the fold)
const AboutSection = lazy(() =>
  import("./components/sections/AboutSection").then((m) => ({
    default: m.AboutSection,
  })),
);
const AmenitiesSection = lazy(() =>
  import("./components/sections/AmenitiesSection").then((m) => ({
    default: m.AmenitiesSection,
  })),
);
const RoomsSection = lazy(() =>
  import("./components/sections/RoomsSection").then((m) => ({
    default: m.RoomsSection,
  })),
);
const GallerySection = lazy(() =>
  import("./components/sections/GallerySection").then((m) => ({
    default: m.GallerySection,
  })),
);
const ReviewsSection = lazy(() =>
  import("./components/sections/ReviewsSection").then((m) => ({
    default: m.ReviewsSection,
  })),
);
const LocationSection = lazy(() =>
  import("./components/sections/LocationSection").then((m) => ({
    default: m.LocationSection,
  })),
);
const SocialsSection = lazy(() =>
  import("./components/sections/SocialsSection").then((m) => ({
    default: m.SocialsSection,
  })),
);
const QRSection = lazy(() =>
  import("./components/sections/QRSection").then((m) => ({
    default: m.QRSection,
  })),
);
const BottomAction = lazy(() =>
  import("./components/ui/BottomAction").then((m) => ({
    default: m.BottomAction,
  })),
);

const SectionFallback = () => (
  <div className="w-full py-16 flex flex-col items-center justify-center opacity-60">
    <div className="w-6 h-6 border-2 border-[var(--hotel-cappuccino)]/30 border-t-[var(--hotel-caramel)] rounded-full animate-spin" />
  </div>
);

export default function HotelTemplate({ profile = mockHotelProfile }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="hotel-template relative w-full min-h-[100dvh] bg-[var(--hotel-ivory)] flex justify-center items-center">
        <GlobalLoader />
      </div>
    );
  }

  return (
    <div className="hotel-template relative w-full min-h-[100dvh] bg-[var(--hotel-ivory)] flex justify-center items-start sm:py-6 antialiased selection:bg-[var(--hotel-caramel)] selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] bg-white sm:rounded-[32px] sm:border sm:border-[var(--hotel-cappuccino)]/20 overflow-clip sm:shadow-[0px_20px_60px_-15px_rgba(59,42,34,0.12)] flex flex-col relative min-h-screen sm:min-h-[auto]"
      >
        <HotelBackground className="pb-3 sm:pb-4">
          <HeroSection profile={profile} />

          {profile.tagline && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-full bg-[var(--hotel-latte)] py-4 px-6 flex justify-center items-center relative z-20 shadow-sm border-b border-[var(--hotel-cappuccino)]/30"
            >
              <div className="relative inline-block text-center">
                <p className="text-[var(--hotel-mocha)] text-[15px] sm:text-[17px] italic tracking-wide relative z-10 leading-snug font-hotel-display font-bold">
                  {profile.tagline}
                </p>
                {/* Animated Underline */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 1.2, ease: "circOut" }}
                  style={{ originX: 0 }}
                  className="absolute left-0 right-0 h-[1.5px] bg-[var(--hotel-gold)] bottom-0 z-0"
                />
              </div>
            </motion.div>
          )}

          <Suspense fallback={<SectionFallback />}>
            <AboutSection profile={profile} />
            <AmenitiesSection amenities={profile.amenities} />
            <RoomsSection rooms={profile.rooms} />
            <GallerySection images={profile.gallery} />
            <ReviewsSection reviews={profile.reviews} />
            <LocationSection profile={profile} />
            <SocialsSection socials={profile.socials} />
            <QRSection profile={profile} />
          </Suspense>

          {/* Footer */}
          <section className="bg-transparent px-5 py-10 text-center flex flex-col items-center">
            <p className="text-[var(--hotel-espresso)] text-xl mb-1 font-hotel-display font-semibold">
              {profile.name}
            </p>
            <p className="text-[var(--hotel-caramel)] text-[12px] italic mb-5 font-hotel-body">
              {profile.tagline}
            </p>

            {/* Operating Hours */}
            {profile.hours && (
              <div className="w-full max-w-[280px] space-y-2 mb-6 py-4 border-t border-b border-[var(--hotel-cappuccino)]/20">
                {profile.hours.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-[12px] font-hotel-body"
                  >
                    <span className="text-[var(--hotel-mocha)] font-bold">
                      {h.label}
                    </span>
                    <span className="text-[var(--hotel-espresso)]/70">
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col items-center gap-2 pt-4 w-[80%] mx-auto">
              <p className="text-[10px] uppercase tracking-widest text-[var(--hotel-caramel)]/60 font-semibold font-hotel-body">
                Propulsé par
              </p>
              <div className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <img
                  src="/justlogo.png"
                  alt="Buzzcard"
                  className="h-4 object-contain filter sepia"
                />
              </div>
            </div>
          </section>

          <Suspense fallback={null}>
            <BottomAction profile={profile} />
          </Suspense>
        </HotelBackground>
      </motion.div>
    </div>
  );
}
