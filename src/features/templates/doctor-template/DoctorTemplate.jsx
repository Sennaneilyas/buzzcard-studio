import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "./components/sections/HeroSection";
import { ContactStripSection } from "./components/sections/ContactStripSection";
import { SectionHeader } from "./components/ui/SectionHeader";
import { fadeInUp } from "./utils/animations";
import { DynamicSection } from "@/components/ui/DynamicSection";

// Lazy loaded components (Below the fold)
const OfficeHoursSection = lazy(() => import("./components/sections/OfficeHoursSection").then(m => ({ default: m.OfficeHoursSection })));
const ServicesSection = lazy(() => import("./components/sections/ServicesSection").then(m => ({ default: m.ServicesSection })));
const GalleryGrid = lazy(() => import("./components/ui/GalleryGrid").then(m => ({ default: m.GalleryGrid })));
const AppointmentsSection = lazy(() => import("./components/sections/AppointmentsSection").then(m => ({ default: m.AppointmentsSection })));
const TestimonialsSection = lazy(() => import("./components/sections/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const BlogSection = lazy(() => import("./components/sections/BlogSection").then(m => ({ default: m.BlogSection })));
const ContactFormSection = lazy(() => import("./components/sections/ContactFormSection").then(m => ({ default: m.ContactFormSection })));
const NewsletterSignupSection = lazy(() => import("./components/sections/NewsletterSignupSection").then(m => ({ default: m.NewsletterSignupSection })));
const BottomAction = lazy(() => import("./components/ui/BottomAction").then(m => ({ default: m.BottomAction })));

// A lightweight skeleton to show while sections are being fetched
const SectionFallback = () => (
  <div className="w-full py-12 flex flex-col items-center justify-center opacity-60">
    <div className="w-6 h-6 border-2 border-[rgba(70,130,180,0.2)] border-t-[var(--primary-color,#4682b4)] rounded-full animate-spin" />
  </div>
);

const mockProfile = {
  fullName: "Dr. Amina El Fassi",
  title: "MBBS · MD · Cardiologue",
  experience: "14+",
  patients: "2 800+",
  satisfaction: "98%",
  phones: ["+212 6 61 23 45 67"],
  emails: ["amina.elfassi@royale.ma"],
  location: "145 Boulevard d'Anfa, Bourgogne, Casablanca",
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
  bannerUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600&h=220",
  quote: '"Prendre soin de votre cœur, avec passion et expertise."',
  about: "Plus de 14 ans d'excellence clinique en cardiologie diagnostique et soins préventifs. Diplômée de la Faculté de Médecine de Casablanca.",
  education: "Doctorat en Médecine - Faculté de Médecine et de Pharmacie de Casablanca.\nSpécialisation en Cardiologie - Hôpital Universitaire Pitié-Salpêtrière, Paris.",
  awards: "Prix d'Excellence en Recherche Cardiologique (2020).\nMembre d'honneur de la Société Marocaine de Cardiologie.",
  gallery: [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&h=300",
    "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=400&h=300",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400&h=300",
    "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400&h=300"
  ]
};

export default function DoctorTemplate({ profile: rawProfile, profileData, isEditMode }) {
  // Merge editor flat data on top of the rich mock, so user edits appear instantly.
  const profile = {
    ...mockProfile,
    ...(rawProfile || {}),
    ...(profileData || {}),
    fullName: profileData?.name || rawProfile?.fullName || mockProfile.fullName,
    title: profileData?.role || rawProfile?.title || mockProfile.title,
    about: profileData?.bio || rawProfile?.about || mockProfile.about,
    education: profileData?.education || rawProfile?.education || mockProfile.education,
    awards: profileData?.awards || rawProfile?.awards || mockProfile.awards,
    experience: profileData?.kpiExp || rawProfile?.experience || mockProfile.experience,
    patients: profileData?.kpiPatients || rawProfile?.patients || mockProfile.patients,
    satisfaction: profileData?.kpiSatisfaction || rawProfile?.satisfaction || mockProfile.satisfaction,
    badge1: profileData?.badge1 || "Cardiologie",
    badge2: profileData?.badge2 || "Soins Préventifs",
    badge3: profileData?.badge3 || "ECG",
    emails: profileData?.email ? [profileData.email] : (rawProfile?.emails || mockProfile.emails),
    phones: profileData?.phone ? [profileData.phone] : (rawProfile?.phones || mockProfile.phones),
    location: profileData?.location || rawProfile?.location || mockProfile.location,
    avatarUrl: profileData?.avatarUrl || rawProfile?.avatarUrl || mockProfile.avatarUrl,
    bannerUrl: profileData?.bannerUrl || rawProfile?.bannerUrl || mockProfile.bannerUrl,
    gallery: profileData?.gallery?.length ? profileData.gallery : (rawProfile?.gallery || mockProfile.gallery),
    socials: profileData?.socials
      ? (profileData.socialOrder || Object.keys(profileData.socials))
          .filter(platform => profileData.socials[platform])
          .map(platform => ({ platform: platform.charAt(0).toUpperCase() + platform.slice(1), href: profileData.socials[platform] }))
      : (rawProfile?.socials || mockProfile.socials),
    profileData: profileData || {} // Pass down raw editor state for arrays like services
  };
  return (
    <div className="relative flex h-[100dvh] w-full items-stretch justify-center overflow-hidden bg-[#e6edf5] font-['Inter'] antialiased selection:bg-[var(--primary-color,#4682b4)] selection:text-white sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex h-full min-h-0 w-full max-w-[440px] flex-col overflow-hidden bg-[#F8FAFC] sm:rounded-[32px] sm:border sm:border-[var(--primary-color,#4682b4)15] sm:shadow-[0px_16px_48px_0px_rgba(70,130,180,0.12),0px_2px_14px_0px_rgba(70,130,180,0.06)]"
      >
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Above the fold - Loaded synchronously */}
          <HeroSection profile={profile} isEditMode={isEditMode} />
          <ContactStripSection profile={profile} isEditMode={isEditMode} />

          {/* Below the fold - Lazy Loaded chunk by chunk */}
          <Suspense fallback={<SectionFallback />}>
            <OfficeHoursSection />
            <ServicesSection profile={profile} isEditMode={isEditMode} />
          
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="bg-[#F8FAFC] px-5 py-12 w-full"
            >
              <SectionHeader subtitle="Notre clinique" title="Galerie" />
              <div className="mt-8">
                <GalleryGrid images={profile.gallery} />
              </div>
            </motion.section>

            <AppointmentsSection />

            {/* Custom Sections from the editor */}
            {(profile.custom_sections || []).map((section) => (
              <DynamicSection key={section.id} section={section} />
            ))}

            <TestimonialsSection profile={profile} isEditMode={isEditMode} />
            <BlogSection profile={profile} isEditMode={isEditMode} />
            <ContactFormSection />
            <NewsletterSignupSection />
          </Suspense>

          {/* Footer Area */}
          <section className="bg-[#F8FAFC] px-5 py-8 text-center text-[12px] text-[rgba(70,130,180,0.55)] flex flex-col items-center">
             <p className="font-semibold text-[var(--primary-color,#4682b4)] mb-1">{profile.fullName}</p>
             <p className="mb-4 text-[11px]">Numéro d'Ordre: {profile.orderNumber || "123456"}</p>
             <div className="flex justify-center gap-4 mb-5">
               <a href="#" className="hover:text-[var(--primary-color,#4682b4)] transition-colors">Mentions légales</a>
               <a href="#" className="hover:text-[var(--primary-color,#4682b4)] transition-colors">Confidentialité</a>
             </div>

             <div className="flex flex-col items-center gap-2 border-t border-[var(--primary-color,#4682b4)15] pt-5 w-[80%] mx-auto">
               <p className="text-[10px] uppercase tracking-widest text-[rgba(70,130,180,0.6)] font-semibold">Propulsé par</p>
               <div className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                 <img src="/justlogo.png" alt="Buzzcard" className="h-4 object-contain filter grayscale" />
               </div>
             </div>
          </section>
        </main>
        
        <Suspense fallback={null}>
          <BottomAction profile={profile} isEditMode={isEditMode} />
        </Suspense>
      </motion.div>
    </div>
  );
}
