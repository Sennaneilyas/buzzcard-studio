import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Navigation } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { fadeInUp, staggerContainer } from "../../utils/animations";

export function LocationSection({ profile }) {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(profile.location)}`;

  const contactItems = [
    {
      icon: Phone,
      label: "Téléphone",
      value: profile.phones?.[0],
      href: `tel:${profile.phones?.[0]}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: profile.emails?.[0],
      href: `mailto:${profile.emails?.[0]}`,
    },
    {
      icon: MapPin,
      label: "Adresse",
      value: profile.location,
      href: mapUrl,
    },
  ];

  return (
    <section className="px-6 py-14 bg-transparent hotel-lazy-section">
      <SectionHeader subtitle="Nous Trouver" title="Contact & Accès" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-6 space-y-3"
      >
        {contactItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.a
              key={i}
              variants={fadeInUp}
              href={item.href}
              target={item.icon === MapPin ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-[18px] bg-white border border-[#D6BFA6]/15 hover:border-[#B08968]/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-[#F3E9D7] flex items-center justify-center text-[#7A553A] group-hover:bg-[#3B2A22] group-hover:text-[#F3E9D7] transition-all duration-300 shrink-0">
                <Icon className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#B08968] mb-1"
                  style={{ fontFamily: "var(--hotel-font-body)" }}
                >
                  {item.label}
                </p>
                <p className="text-[13px] text-[#3B2A22] leading-relaxed"
                  style={{ fontFamily: "var(--hotel-font-body)" }}
                >
                  {item.value}
                </p>
              </div>
            </motion.a>
          );
        })}
      </motion.div>

      {/* Quick Actions Row */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex items-center justify-center gap-3 mt-8"
      >
        <a
          href={`tel:${profile.phones?.[0]}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#3B2A22] text-[#F3E9D7] rounded-full text-[12px] font-bold hover:bg-[#7A553A] transition-colors"
          style={{ fontFamily: "var(--hotel-font-body)" }}
        >
          <Phone className="w-3.5 h-3.5" />
          Appeler
        </a>
        <a
          href={`https://api.whatsapp.com/send?phone=${profile.phones?.[0]?.replace(/[^0-9+]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-full text-[12px] font-bold hover:bg-[#20bd5a] transition-colors"
          style={{ fontFamily: "var(--hotel-font-body)" }}
        >
          WhatsApp
        </a>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F3E9D7] text-[#3B2A22] border border-[#D6BFA6]/30 rounded-full text-[12px] font-bold hover:bg-[#D6BFA6]/30 transition-colors"
          style={{ fontFamily: "var(--hotel-font-body)" }}
        >
          <Navigation className="w-3.5 h-3.5" />
          Itinéraire
        </a>
      </motion.div>
    </section>
  );
}
