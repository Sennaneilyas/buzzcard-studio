import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "./components/sections/HeroSection";
import { QuickActions } from "./components/sections/QuickActions";
import { CoiffeurBackground } from "./components/ui/CoiffeurBackground";
import DynamicSection from "@/components/ui/DynamicSection";
import { configuredSocials, editorContactValues } from "@/features/templates/shared/profileActions";

// Lazy loaded components (Below the fold)
const ServicesSection = lazy(() => import("./components/sections/ServicesSection").then(m => ({ default: m.ServicesSection })));
const GallerySection = lazy(() => import("./components/sections/GallerySection").then(m => ({ default: m.GallerySection })));
const BookingSection = lazy(() => import("./components/sections/BookingSection").then(m => ({ default: m.BookingSection })));
const WorkingHours = lazy(() => import("./components/sections/WorkingHours").then(m => ({ default: m.WorkingHours })));
const BottomAction = lazy(() => import("./components/ui/BottomAction").then(m => ({ default: m.BottomAction })));

const SectionFallback = () => (
  <div className="w-full py-12 flex flex-col items-center justify-center opacity-60">
    <div className="w-6 h-6 border-2 border-[rgba(197,168,128,0.2)] border-t-[var(--primary-color, #C5A880)] rounded-full animate-spin" />
  </div>
);

const mockProfile = {
  fullName: "Amine El Idrissi",
  title: "Coiffeur-visagiste & Fondateur · Atelier Amine",
  experience: "12+",
  clients: "3 800+",
  satisfaction: "4.9/5",
  phones: ["+212 6 68 34 21 90"],
  emails: ["bonjour@atelieramine.ma"],
  location: "34 Rue Ibn Aïcha, Guéliz, Marrakech",
  avatarUrl:
    "https://images.unsplash.com/photo-1771594836619-56c7dbd96405?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  bannerUrl:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600&h=250",
  quote: '"Le style se joue dans les détails."',
  about:
    "Coiffeur-visagiste à Marrakech, Amine imagine des coupes et des couleurs sur mesure, adaptées au visage, au style et au quotidien de chaque client.",
  services: [
    {
      id: 1,
      name: "Coupe & Brushing",
      price: "350 MAD",
      duration: "45 min",
      href: "#booking-section",
      imgSrc: "/img/service_coupe.png",
      imgAlt: "Coupe & Brushing 3D icon",
      variant: "gold",
    },
    {
      id: 2,
      name: "Coloration Complète",
      price: "800 MAD",
      duration: "120 min",
      href: "#booking-section",
      imgSrc: "/img/service_coloration.png",
      imgAlt: "Coloration 3D icon",
      variant: "default",
    },
    {
      id: 3,
      name: "Balayage Signature",
      price: "1200 MAD",
      duration: "150 min",
      href: "#booking-section",
      imgSrc: "/img/service_balayage.png",
      imgAlt: "Balayage 3D icon",
      variant: "gray",
    },
    {
      id: 4,
      name: "Soin Kératine",
      price: "1500 MAD",
      duration: "120 min",
      href: "#booking-section",
      imgSrc: "/img/service_soin.png",
      imgAlt: "Soin Kératine 3D icon",
      variant: "blue",
    },
  ],
  gallery: [
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1675034743339-0b0747047727?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1493775379751-a6c3940f3cbc?auto=format&fit=crop&q=80&w=800",
  ],
  hours: [
    { day: "Lundi", time: "Fermé" },
    { day: "Mardi - Vendredi", time: "10:00 - 19:30" },
    { day: "Samedi", time: "09:00 - 20:00" },
    { day: "Dimanche", time: "Sur RDV uniquement" },
  ],
  socials: [
    {
      platform: "Instagram",
      href: "https://instagram.com/atelieramine.marrakech",
    },
    { platform: "TikTok", href: "https://tiktok.com/@atelieramine.marrakech" },
  ],
};

export default function CoiffeurTemplate({
  profile: rawProfile,
  profileData,
  isEditMode,
  lockProfileIdentity = false,
}) {
  // Merge editor flat data on top of the rich mock, so user edits appear instantly.
  const profile = {
    ...mockProfile,
    ...(rawProfile || {}),
    ...(profileData || {}),
    fullName: profileData?.name || rawProfile?.fullName || mockProfile.fullName,
    title: profileData?.role || rawProfile?.title || mockProfile.title,
    about: profileData?.bio || rawProfile?.about || mockProfile.about,
    ...editorContactValues(profileData, rawProfile || mockProfile),
    location: profileData?.location || rawProfile?.location || mockProfile.location,
    avatarUrl: profileData?.avatarUrl || rawProfile?.avatarUrl || mockProfile.avatarUrl,
    bannerUrl: profileData?.bannerUrl || rawProfile?.bannerUrl || mockProfile.bannerUrl,
    gallery: profileData?.gallery?.length ? profileData.gallery : (rawProfile?.gallery || mockProfile.gallery),
    socials: profileData?.socials
      ? configuredSocials(profileData.socials, profileData.socialOrder)
      : (rawProfile?.socials || mockProfile.socials),
    services: rawProfile?.services || mockProfile.services,
    hours: rawProfile?.hours || mockProfile.hours,
    custom_sections: profileData?.custom_sections || rawProfile?.custom_sections || [],
  };
  return (
    <div className="relative flex h-[100dvh] w-full items-stretch justify-center overflow-hidden bg-[#F9F9F9] font-inter antialiased selection:bg-[var(--primary-color,#C5A880)] selection:text-white sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex h-full min-h-0 w-full max-w-[440px] flex-col overflow-hidden bg-white sm:rounded-[32px] sm:border sm:border-black/5 sm:shadow-[0px_20px_60px_-15px_rgba(0,0,0,0.1)]"
      >
        <CoiffeurBackground className="h-full min-h-0">
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <HeroSection
              profile={profile}
              isEditMode={isEditMode}
              lockProfileIdentity={lockProfileIdentity}
            />
            <QuickActions profile={profile} />

            <Suspense fallback={<SectionFallback />}>
              <ServicesSection profile={profile} />
              {(profile.custom_sections || []).map((section) => (
                <DynamicSection key={section.id} section={section} />
              ))}
              <GallerySection images={profile.gallery} />
              <WorkingHours profile={profile} />
              <BookingSection profile={profile} />
            </Suspense>

            {/* Footer */}
            <section className="bg-transparent px-5 py-10 text-center text-[12px] text-gray-400 flex flex-col items-center">
              <p className="font-times text-[#1A1A1A] text-lg mb-1">{profile.fullName}</p>
              <div className="flex justify-center gap-4 mb-5">
                <a href="#" className="hover:text-[var(--primary-color,#C5A880)] transition-colors">Mentions légales</a>
                <a href="#" className="hover:text-[var(--primary-color,#C5A880)] transition-colors">Confidentialité</a>
              </div>

              <div className="flex flex-col items-center gap-2 border-t border-black/5 pt-5 w-[80%] mx-auto">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Propulsé par</p>
                <div className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src="/justlogo.png" alt="Buzzcard" className="h-4 object-contain filter grayscale" />
                </div>
              </div>
            </section>
          </main>

          <Suspense fallback={null}>
            <BottomAction profile={profile} isEditMode={isEditMode} />
          </Suspense>
        </CoiffeurBackground>
      </motion.div>
    </div>
  );
}
