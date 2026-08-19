import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { HeroSection } from "./components/sections/HeroSection";
import { QuickActions } from "./components/sections/QuickActions";
import { CoiffeurBackground } from "./components/ui/CoiffeurBackground";

// Lazy loaded components (Below the fold)
const ServicesSection = lazy(() => import("./components/sections/ServicesSection").then(m => ({ default: m.ServicesSection })));
const GallerySection = lazy(() => import("./components/sections/GallerySection").then(m => ({ default: m.GallerySection })));
const BookingSection = lazy(() => import("./components/sections/BookingSection").then(m => ({ default: m.BookingSection })));
const WorkingHours = lazy(() => import("./components/sections/WorkingHours").then(m => ({ default: m.WorkingHours })));
const DigitalCardQrSection = lazy(() => import("./components/sections/DigitalCardQrSection").then(m => ({ default: m.DigitalCardQrSection })));
const BottomAction = lazy(() => import("./components/ui/BottomAction").then(m => ({ default: m.BottomAction })));

const SectionFallback = () => (
  <div className="w-full py-12 flex flex-col items-center justify-center opacity-60">
    <div className="w-6 h-6 border-2 border-[rgba(197,168,128,0.2)] border-t-[var(--primary-color, #C5A880)] rounded-full animate-spin" />
  </div>
);

const mockProfile = {
  fullName: "Lara Miller",
  title: "Master Hair Stylist & Colorist",
  experience: "10+",
  clients: "5 000+",
  satisfaction: "4.9/5",
  phones: ["+212 6 00 11 22 33"],
  emails: ["booking@laramiller.salon"],
  location: "15 Rue de la Beauté, Guéliz, Marrakech",
  avatarUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
  bannerUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600&h=250",
  quote: '"L\'art de sublimer votre beauté naturelle avec précision et passion."',
  about: "Experte en colorimétrie et visagisme, Lara Miller transforme votre coiffure en une véritable œuvre d'art.",
  services: [
    { 
      id: 1, 
      name: "Coupe & Brushing", 
      price: "350 MAD", 
      duration: "45 min",
      href: "#booking-section",
      imgSrc: "/img/service_coupe.png",
      imgAlt: "Coupe & Brushing 3D icon",
      variant: "gold"
    },
    { 
      id: 2, 
      name: "Coloration Complète", 
      price: "800 MAD", 
      duration: "120 min",
      href: "#booking-section",
      imgSrc: "/img/service_coloration.png",
      imgAlt: "Coloration 3D icon",
      variant: "default"
    },
    { 
      id: 3, 
      name: "Balayage Signature", 
      price: "1200 MAD", 
      duration: "150 min",
      href: "#booking-section",
      imgSrc: "/img/service_balayage.png",
      imgAlt: "Balayage 3D icon",
      variant: "gray"
    },
    { 
      id: 4, 
      name: "Soin Kératine", 
      price: "1500 MAD", 
      duration: "120 min",
      href: "#booking-section",
      imgSrc: "/img/service_soin.png",
      imgAlt: "Soin Kératine 3D icon",
      variant: "blue"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1521590832167-7bfc17454f20?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80&w=800"
  ],
  hours: [
    { day: "Lundi", time: "Fermé" },
    { day: "Mardi - Vendredi", time: "10:00 - 19:30" },
    { day: "Samedi", time: "09:00 - 20:00" },
    { day: "Dimanche", time: "Sur RDV uniquement" }
  ],
  socials: [
    { platform: "Instagram", href: "https://instagram.com/laramiller" },
    { platform: "TikTok", href: "https://tiktok.com/@laramiller" }
  ]
};

export default function CoiffeurTemplate({ profile: rawProfile, profileData, isEditMode, onPreviewClick }) {
  // Merge editor flat data on top of the rich mock, so user edits appear instantly.
  const profile = {
    ...mockProfile,
    ...(rawProfile || {}),
    ...(profileData || {}),
    fullName: profileData?.name || rawProfile?.fullName || mockProfile.fullName,
    title: profileData?.role || rawProfile?.title || mockProfile.title,
    about: profileData?.bio || rawProfile?.about || mockProfile.about,
    avatarUrl: profileData?.avatarUrl || rawProfile?.avatarUrl || mockProfile.avatarUrl,
    bannerUrl: profileData?.bannerUrl || rawProfile?.bannerUrl || mockProfile.bannerUrl,
    gallery: profileData?.gallery?.length ? profileData.gallery : (rawProfile?.gallery || mockProfile.gallery),
    socials: profileData?.socials
      ? (profileData.socialOrder || Object.keys(profileData.socials))
          .filter(platform => profileData.socials[platform])
          .map(platform => ({ platform: platform.charAt(0).toUpperCase() + platform.slice(1), href: profileData.socials[platform] }))
      : (rawProfile?.socials || mockProfile.socials),
    services: rawProfile?.services || mockProfile.services,
    hours: rawProfile?.hours || mockProfile.hours,
    custom_sections: profileData?.custom_sections || rawProfile?.custom_sections || [],
  };
  // In Edit Mode, skip the loading animation so the preview renders instantly.
  const [isLoading, setIsLoading] = useState(!isEditMode);

  useEffect(() => {
    if (isEditMode) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isEditMode]);

  if (isLoading) {
    return (
      <div className="relative w-full min-h-[100dvh] bg-[#F9F9F9] flex justify-center items-center font-inter">
        <GlobalLoader />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#F9F9F9] flex justify-center items-start sm:py-6 font-inter antialiased selection:bg-[var(--primary-color, #C5A880)] selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] bg-white sm:rounded-[32px] sm:border sm:border-black/5 overflow-hidden sm:shadow-[0px_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col relative min-h-screen sm:min-h-[auto]"
      >
        <CoiffeurBackground className="pb-3 sm:pb-4">
        <HeroSection profile={profile} />
        <QuickActions profile={profile} />

        <Suspense fallback={<SectionFallback />}>
          <ServicesSection profile={profile} />
          <GallerySection images={profile.gallery} />
          <WorkingHours profile={profile} />
          <BookingSection profile={profile} />
          <DigitalCardQrSection profile={profile} />
        </Suspense>

        {/* Footer */}
        <section className="bg-transparent px-5 py-10 text-center text-[12px] text-gray-400 flex flex-col items-center">
           <p className="font-times text-[#1A1A1A] text-lg mb-1">{profile.fullName}</p>
           <div className="flex justify-center gap-4 mb-5">
             <a href="#" className="hover:text-[var(--primary-color, #C5A880)] transition-colors">Mentions légales</a>
             <a href="#" className="hover:text-[var(--primary-color, #C5A880)] transition-colors">Confidentialité</a>
           </div>
           
           <div className="flex flex-col items-center gap-2 border-t border-black/5 pt-5 w-[80%] mx-auto">
             <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Propulsé par</p>
             <div className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
               <img src="/justlogo.png" alt="Buzzcard" className="h-4 object-contain filter grayscale" />
             </div>
           </div>
        </section>
        
        <Suspense fallback={null}>
          <BottomAction profile={profile} />
        </Suspense>
        </CoiffeurBackground>
      </motion.div>
    </div>
  );
}
