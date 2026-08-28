import { lazy, Suspense, useRef } from "react";
import { motion } from "framer-motion";
import { HotelBackground } from "./components/ui/HotelBackground";
import { HeroSection } from "./components/sections/HeroSection";
import { mockHotelProfile } from "./utils/constants";
import EditableText from "@/components/ui/EditableText";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
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
const DynamicSection = lazy(() =>
  import("./components/sections/DynamicSection").then((m) => ({
    default: m.DynamicSection,
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

const HOTEL_SOCIAL_LABELS = {
  airbnb: "Airbnb",
  booking: "Booking",
  facebook: "Facebook",
  googlemaps: "GoogleMaps",
  instagram: "Instagram",
  tripadvisor: "TripAdvisor",
};

const normalizeSocialPlatform = (platform = "") => {
  const key = platform.toLowerCase().replace(/[^a-z0-9]/g, "");
  return HOTEL_SOCIAL_LABELS[key] || platform;
};

export default function HotelTemplate({ profile: rawProfile, profileData, isEditMode, onPreviewClick }) {
  const setProfileData = useEditorStore((s) => s.setProfileData);
  const scrollContainerRef = useRef(null);
  // In Edit Mode, the Editor sends a flat `profileData` from Zustand.
  // We deep-merge it on top of the rich mock so:
  //   - User edits (name, bio, avatarUrl, bannerUrl, gallery, socials) override instantly.
  //   - Hotel-specific content (rooms, amenities, reviews) keeps the mock values.
  const profile = {
    ...mockHotelProfile,
    ...(rawProfile || {}),
    ...(profileData || {}),
    // Map editor flat-field names → hotel template field names
    name: (profileData?.name || rawProfile?.name || mockHotelProfile.name),
    about: (profileData?.bio || rawProfile?.about || mockHotelProfile.about),
    phones: profileData?.phone
      ? [profileData.phone]
      : (rawProfile?.phones || mockHotelProfile.phones),
    emails: profileData?.email
      ? [profileData.email]
      : (rawProfile?.emails || mockHotelProfile.emails),
    location: profileData?.location || rawProfile?.location || mockHotelProfile.location,
    website: profileData?.website || rawProfile?.website || mockHotelProfile.website,
    avatarUrl: (profileData?.avatarUrl || rawProfile?.avatarUrl || mockHotelProfile.avatarUrl),
    bannerUrl: (profileData?.bannerUrl || rawProfile?.bannerUrl || mockHotelProfile.bannerUrl),
    gallery: (profileData?.gallery?.length ? profileData.gallery : rawProfile?.gallery || mockHotelProfile.gallery),
    tagline: (profileData?.role || rawProfile?.tagline || mockHotelProfile.tagline),
    // Socials: if editor has socials object, map it into the hotel's socials array format
    socials: profileData?.socials
      ? (profileData.socialOrder || Object.keys(profileData.socials))
          .filter(platform => profileData.socials[platform])
          .map(platform => ({
            platform: normalizeSocialPlatform(platform),
            href: profileData.socials[platform],
          }))
      : (rawProfile?.socials || mockHotelProfile.socials),
    // Keep hotel-specific fields from mock
    rooms: rawProfile?.rooms || mockHotelProfile.rooms,
    amenities: rawProfile?.amenities || mockHotelProfile.amenities,
    reviews: rawProfile?.reviews || mockHotelProfile.reviews,
    hours: rawProfile?.hours || mockHotelProfile.hours,
    custom_sections: profileData?.custom_sections || rawProfile?.custom_sections || [],
  };
  return (
    <div className="hotel-template relative flex h-[100dvh] w-full items-stretch justify-center overflow-hidden bg-[var(--hotel-ivory)] antialiased selection:bg-[var(--hotel-caramel)] selection:text-white sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex h-full min-h-0 w-full max-w-[440px] flex-col overflow-hidden bg-white sm:rounded-[32px] sm:border sm:border-[var(--hotel-cappuccino)]/20 sm:shadow-[0px_20px_60px_-15px_rgba(59,42,34,0.12)]"
      >
        <HotelBackground className="h-full min-h-0">
          <main
            ref={scrollContainerRef}
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="relative z-10">
              <HeroSection
                profile={profile}
                isEditMode={isEditMode}
                scrollContainerRef={scrollContainerRef}
              />
            </div>

            {profile.tagline && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="w-full bg-[var(--hotel-latte)] py-4 px-6 flex justify-center items-center relative z-20 shadow-sm border-b border-[var(--hotel-cappuccino)]/30"
              >
                <div className="relative inline-block text-center">
                  <EditableText
                    as="p"
                    value={profile.tagline || ""}
                    onChange={(val) => setProfileData({ role: val })}
                    isEditMode={isEditMode}
                    placeholder="Hotel Tagline"
                    className="text-[var(--hotel-mocha)] text-[15px] sm:text-[17px] italic tracking-wide relative z-10 leading-snug font-hotel-display font-bold"
                  />
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
              <div onClick={() => isEditMode && onPreviewClick && onPreviewClick("profile")} className={isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-[var(--hotel-gold)] hover:ring-inset' : ''}>
                <AboutSection profile={profile} />
              </div>
              <AmenitiesSection amenities={profile.amenities} />
              <RoomsSection rooms={profile.rooms} />
              <div onClick={() => isEditMode && onPreviewClick && onPreviewClick("gallery")} className={isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-[var(--hotel-gold)] hover:ring-inset' : ''}>
                <GallerySection images={profile.gallery} />
              </div>
              <ReviewsSection reviews={profile.reviews} />
              <LocationSection profile={profile} />
              <div onClick={() => isEditMode && onPreviewClick && onPreviewClick("links")} className={isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-[var(--hotel-gold)] hover:ring-inset' : ''}>
                <SocialsSection socials={profile.socials} />
              </div>

              {(profile.custom_sections || []).map((section) => (
                <DynamicSection key={section.id} section={section} />
              ))}
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
          </main>

          <Suspense fallback={null}>
            <BottomAction profile={profile} isEditMode={isEditMode} />
          </Suspense>
        </HotelBackground>
      </motion.div>
    </div>
  );
}
