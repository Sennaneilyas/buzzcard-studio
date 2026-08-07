import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, Mail, MapPin, HeartPulse, Brain, Stethoscope, Pill,
  Microscope, Dna, ArrowRight, UserRoundPlus, Calendar,
  Clock, Star, Check
} from "lucide-react";

// Mock Data
const mockProfile = {
  fullName: "Dr. Amina El Fassi",
  title: "MBBS · MD · Cardiologue",
  experience: "14+",
  patients: "2 800+",
  satisfaction: "98%",
  phones: ["+212 6 61 23 45 67"],
  emails: ["amina.elfassi@clinique-royale.ma"],
  location: "Casablanca, Maroc",
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
  gallery: [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&h=300",
    "https://images.unsplash.com/photo-1538108149393-cebb47acdd4e?auto=format&fit=crop&q=80&w=400&h=300",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400&h=300"
  ]
};

const services = [
  { icon: HeartPulse, title: "Cardiologie", desc: "Diagnostics cardiaques avancés et ECG." },
  { icon: Brain, title: "Médecine Interne", desc: "Évaluation des affections multi-systémiques." },
  { icon: Stethoscope, title: "Soins Préventifs", desc: "Bilans, vaccinations et conseils." },
  { icon: Pill, title: "Pharmacothérapie", desc: "Plans médicamenteux personnalisés." },
  { icon: Microscope, title: "Diagnostics Labo", desc: "Bilan biologique complet." },
  { icon: Dna, title: "Santé Génomique", desc: "Conseil en risque génétique." }
];

const testimonials = [
  { author: "Fatima Zouiten", initials: "FZ", text: "\"Trois autres médecins avaient ignoré mes douleurs, elle a su diagnostiquer mon problème immédiatement.\"", rating: 5, date: "Patiente depuis 2021" }
];

const blogPosts = [
  { category: "Cardiologie", date: "1 août 2026", title: "Comprendre la Fibrillation Auriculaire", excerpt: "La FA touche plus de 33 millions de personnes dans le monde. Quels sont les signes..." },
  { category: "Prévention", date: "18 juillet 2026", title: "Santé Cardiaque Après 40 Ans", excerpt: "Des modifications du mode de vie qui, selon les études, peuvent prolonger..." }
];

export default function DoctorTemplate({ profile = mockProfile }) {
  return (
    <div className="relative w-full max-w-[390px] mx-auto min-h-[100dvh] overflow-x-hidden bg-[#fafafa] flex flex-col font-sans text-neutral-900 pb-[120px]">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-br from-blue-50/80 to-purple-50/80 pointer-events-none rounded-b-[40px] z-0" />
      
      <div className="relative z-10 flex-1 flex flex-col gap-8">
        
        {/* Hero Section */}
        <section className="px-5 pt-12 pb-6 flex flex-col items-center">
          <div className="w-[110px] h-[110px] rounded-[30px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden mb-6 border-4 border-white">
            <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-1 text-neutral-900">{profile.fullName}</h1>
          <p className="text-sm font-medium text-blue-600 mb-6 text-center">{profile.title}</p>
          
          {/* Action Buttons */}
          <div className="flex w-full gap-3 mb-8">
            <button className="flex-1 bg-neutral-900 text-white font-semibold py-3.5 px-4 rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-neutral-800 transition-colors">
              Prendre RDV
            </button>
            <button className="flex-1 bg-white text-neutral-900 font-semibold py-3.5 px-4 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-neutral-100 hover:bg-neutral-50 transition-colors">
              Voir Profil
            </button>
          </div>
          
          {/* Stats Row */}
          <div className="flex w-full justify-between px-2">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-neutral-900">{profile.experience}</span>
              <span className="text-xs text-neutral-500 font-medium mt-1">Ans Exp.</span>
            </div>
            <div className="w-px h-8 bg-neutral-200 mt-2" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-neutral-900">{profile.patients}</span>
              <span className="text-xs text-neutral-500 font-medium mt-1">Patients</span>
            </div>
            <div className="w-px h-8 bg-neutral-200 mt-2" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-neutral-900">{profile.satisfaction}</span>
              <span className="text-xs text-neutral-500 font-medium mt-1">Satisfaction</span>
            </div>
          </div>
        </section>

        {/* Contact Strip */}
        <section className="px-5">
          <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col gap-5">
            <ContactRow icon={Mail} label="E-mail" value={profile.emails[0]} actionLabel="Écrire" href={`mailto:${profile.emails[0]}`} />
            <div className="w-full h-px bg-neutral-100" />
            <ContactRow icon={Phone} label="Téléphone" value={profile.phones[0]} actionLabel="Appeler" href={`tel:${profile.phones[0]}`} />
            <div className="w-full h-px bg-neutral-100" />
            <ContactRow icon={MapPin} label="Localisation" value={profile.location} actionLabel="Carte" href={`https://maps.google.com/?q=${profile.location}`} />
          </div>
        </section>

        {/* Services Section */}
        <section className="px-5 pt-4">
          <SectionHeader subtitle="Ce que nous offrons" title="Nos Services" />
          <div className="grid grid-cols-2 gap-3 mt-6">
            {services.map((srv, idx) => (
              <ServiceCard key={idx} {...srv} />
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section className="px-5 pt-4">
          <SectionHeader subtitle="Notre clinique" title="Galerie" />
          <div className="mt-6">
            <GalleryCarousel images={profile.gallery} />
          </div>
        </section>
        
        {/* Appointments Block */}
        <section className="px-5 pt-4">
          <SectionHeader subtitle="Planifier" title="Prendre Rendez-vous" />
          <div className="mt-6 bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" strokeWidth={3} />
            </div>
            <h3 className="font-bold text-lg mb-1">Rendez-vous confirmé !</h3>
            <p className="text-neutral-500 text-sm mb-1 flex items-center gap-1"><Calendar className="w-4 h-4"/> samedi 29 août</p>
            <p className="text-neutral-500 text-sm mb-6 flex items-center gap-1"><Clock className="w-4 h-4"/> 10:00 – 11:00</p>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Nouveau rendez-vous</button>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-5 pt-4">
          <SectionHeader subtitle="Témoignages" title="Ce que disent nos patients" />
          <div className="mt-6 flex flex-col gap-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-neutral-100">
                <div className="flex gap-1 mb-4 text-yellow-400">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-neutral-700 text-sm italic mb-6 leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-600">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.author}</p>
                    <p className="text-xs text-neutral-400">{t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section className="px-5 pt-4">
          <SectionHeader subtitle="Actualités santé" title="Le Blog" />
          <div className="mt-6 flex flex-col gap-4">
            {blogPosts.map((post, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-neutral-100">
                <div className="flex items-center gap-3 text-xs mb-3">
                  <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{post.category}</span>
                  <span className="text-neutral-400">{post.date}</span>
                </div>
                <h3 className="font-bold text-base mb-2 leading-snug">{post.title}</h3>
                <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{post.excerpt}</p>
                <button className="text-sm font-semibold text-neutral-900 flex items-center gap-1 hover:gap-2 transition-all">
                  Lire la suite <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Area */}
        <section className="px-5 pt-8 pb-8 text-center text-xs text-neutral-400">
           <p className="font-bold text-neutral-600 mb-1">{profile.fullName}</p>
           <p className="mb-4">© 2026 · Casablanca, Maroc</p>
           <div className="flex justify-center gap-4">
             <a href="#" className="hover:text-neutral-600 transition-colors">Mentions légales</a>
             <a href="#" className="hover:text-neutral-600 transition-colors">Politique de confidentialité</a>
           </div>
        </section>
      </div>

      {/* Floating Action / Bottom Bar */}
      <BottomAction profile={profile} />
    </div>
  );
}

function SectionHeader({ subtitle, title }) {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">{subtitle}</p>
      <h2 className="text-[22px] font-bold text-neutral-900">{title}</h2>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, actionLabel, href }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-[12px] bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100 text-neutral-700">
          <Icon className="w-5 h-5" />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-neutral-400 mb-0.5">{label}</p>
          <p className="text-sm font-medium text-neutral-900 truncate">{value}</p>
        </div>
      </div>
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="self-start sm:self-auto px-4 py-2 bg-neutral-50 text-neutral-900 text-xs font-semibold rounded-xl hover:bg-neutral-100 transition-colors whitespace-nowrap"
      >
        {actionLabel}
      </a>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white p-5 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100 hover:border-neutral-200 transition-colors flex flex-col h-full group">
      <div className="w-10 h-10 rounded-[14px] bg-neutral-50 flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-50 transition-colors">
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>
      <h3 className="font-bold text-sm mb-2">{title}</h3>
      <p className="text-xs text-neutral-500 leading-relaxed flex-grow">{desc}</p>
    </div>
  );
}

function GalleryCarousel({ images }) {
  const [active, setActive] = useState(0);

  return (
    <div className="relative w-full h-[220px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-[280px] h-[200px]">
          <AnimatePresence>
            {images.map((src, index) => (
              <motion.div
                key={src}
                className="absolute inset-0 origin-bottom"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: index === active ? 1 : 0,
                  scale: index === active ? 1 : 0.9,
                  zIndex: index === active ? 10 : 0,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <img
                  src={src}
                  alt={`Galerie ${index + 1}`}
                  className="w-full h-full rounded-[24px] object-cover object-center shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-[6px] h-[6px] rounded-full transition-all ${i === active ? "bg-neutral-900 w-4" : "bg-neutral-300"}`}
          />
        ))}
      </div>
    </div>
  );
}

function BottomAction({ profile }) {
  const handleSaveContact = useCallback(() => {
    const { fullName, phones, emails } = profile;
    const vcard = [
      "BEGIN:VCARD", "VERSION:3.0",
      `FN:${fullName ?? ""}`,
      ...(phones || []).map((p) => `TEL:${p}`),
      ...(emails || []).map((e) => `EMAIL:${e}`),
      "END:VCARD",
    ].filter(Boolean).join("\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: `${fullName ?? "contact"}.vcf` });
    a.click();
    URL.revokeObjectURL(url);
  }, [profile]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex justify-center pointer-events-none">
      <div className="w-full max-w-[390px] mx-auto pointer-events-auto">
        <div className="bg-white/80 backdrop-blur-xl p-3 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white flex gap-2 items-center">
          <button
            onClick={handleSaveContact}
            className="flex-1 h-[48px] bg-neutral-900 text-white rounded-[16px] flex items-center justify-center gap-2 font-semibold text-sm hover:bg-neutral-800 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          >
            <UserRoundPlus className="w-4 h-4" />
            Enregistrer Contact
          </button>
        </div>
      </div>
    </div>
  );
}
