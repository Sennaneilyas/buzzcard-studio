import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionWrapper } from "../ui/SectionWrapper";
import { fadeInUp, staggerContainer } from "../../utils/animations";

export function LocationSection({ profile }) {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(profile.location || "")}`;
  const rawPhone = profile.phones?.[0] || "";
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, "");

  const contactPills = [
    {
      icon: Phone,
      label: "Téléphone",
      value: rawPhone || "Non renseigné",
      href: `tel:${rawPhone}`,
      target: "_self",
    },
    {
      icon: SiWhatsapp,
      label: "WhatsApp",
      value: rawPhone ? "Discussion directe" : "Non disponible",
      href: `https://api.whatsapp.com/send?phone=${cleanPhone}`,
      target: "_blank",
      iconClass: "text-[#25D366]",
    },
    {
      icon: Mail,
      label: "Email",
      value: profile.emails?.[0] || "Non renseigné",
      href: `mailto:${profile.emails?.[0]}`,
      target: "_self",
    },
    {
      icon: MapPin,
      label: "Adresse",
      value: profile.location || "Non renseignée",
      href: mapUrl,
      target: "_blank",
    },
  ];

  return (
    <SectionWrapper>
      <SectionHeader subtitle="Nous Trouver" title="Contact & Accès" />

      {/* Main Reference-Style Container Card */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-6 bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 border border-[var(--hotel-cappuccino)]/25 shadow-[0_10px_35px_-10px_rgba(59,42,34,0.06)]"
      >
        {/* Card Header with Title & Arrow Action */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--hotel-espresso)] font-hotel-display tracking-tight">
              Coordonnées & Accès
            </h3>
            <p className="text-[11px] sm:text-[12px] text-[var(--hotel-caramel)] font-hotel-body">
              Disponibles 24/7 pour vos réservations
            </p>
          </div>

          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Ouvrir dans Maps"
            className="w-9 h-9 rounded-full bg-[var(--hotel-latte)] hover:bg-[var(--hotel-espresso)] hover:text-white text-[var(--hotel-mocha)] flex items-center justify-center transition-all duration-300 shadow-sm group"
          >
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* 2x2 Grid of Pill-Shaped Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {contactPills.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -2, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                href={item.href}
                target={item.target}
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 px-4 py-3 rounded-full bg-white border border-[var(--hotel-cappuccino)]/25 hover:border-[var(--hotel-caramel)] hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                {/* Circular Icon Container */}
                <div className="w-10 h-10 rounded-full bg-[var(--hotel-latte)]/80 flex items-center justify-center text-[var(--hotel-mocha)] group-hover:bg-[var(--hotel-espresso)] group-hover:text-[var(--hotel-latte)] transition-colors duration-300 shrink-0 shadow-sm">
                  <Icon className={`w-4 h-4 ${item.iconClass || ""}`} strokeWidth={1.75} />
                </div>

                {/* Info Text (Title & Value) */}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-[var(--hotel-espresso)] font-hotel-body leading-tight">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-[var(--hotel-mocha)]/75 truncate font-hotel-body mt-0.5">
                    {item.value}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
