import { motion } from "framer-motion";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Templates", href: "#templates" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Careers", href: "#careers" },
  ],
  Support: [
    { label: "Help Center", href: "#help" },
    { label: "Contact", href: "#contact" },
    { label: "Privacy", href: "#privacy" },
  ],
};

/**
 * Footer — Contact section + site-wide footer with links.
 */
export default function Footer() {
  return (
    <>
      {/* ── Contact / CTA band ── */}
      <section className="py-24 md:py-32 px-6" id="contact">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="
              relative rounded-[2rem] overflow-hidden
              bg-gradient-to-br from-navy via-navy/95 to-navy/90
              p-10 md:p-16 text-center
            "
          >
            {/* Ambient decorations */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-mint/8 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-mint/5 blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to make your{" "}
                <span className="text-mint">first impression</span> count?
              </h2>
              <p className="mt-4 text-white/50 text-lg max-w-md mx-auto">
                Join hundreds of professionals already using BuzzCard to grow
                their network.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#get-started"
                  className="
                    group inline-flex items-center gap-2
                    px-8 py-4 text-base font-semibold text-ink bg-mint rounded-2xl
                    transition-all duration-300
                    hover:shadow-[0_0_40px_rgba(0,230,118,0.4)]
                    hover:scale-[1.04] active:scale-[0.97]
                  "
                  id="footer-cta"
                >
                  Get Started Free
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="mailto:hello@buzzcard.ma"
                  className="
                    inline-flex items-center gap-2
                    px-6 py-4 text-base font-medium text-white/60
                    border border-white/10 rounded-2xl
                    transition-all duration-300
                    hover:border-white/20 hover:text-white/80
                  "
                >
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-ink/[0.06] bg-white" id="site-footer">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Brand column */}
            <div className="md:col-span-2">
              <a href="/" className="inline-block mb-4">
                <img
                  src="/logoHB.svg"
                  alt="BuzzCard Studio"
                  className="h-8 w-auto"
                />
              </a>
              <p className="text-ink/40 text-sm leading-relaxed max-w-xs mb-6">
                Digital business cards powered by NFC technology. Designed and
                built in Morocco 🇲🇦
              </p>
              <div className="flex items-center gap-2 text-ink/30 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                Casablanca, Morocco
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <h4 className="text-xs font-semibold text-ink/30 uppercase tracking-widest mb-4">
                  {group}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-ink/50 hover:text-ink transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-ink/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-ink/30">
              © {new Date().getFullYear()} BuzzCard Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#terms"
                className="text-xs text-ink/30 hover:text-ink/50 transition-colors"
              >
                Terms
              </a>
              <a
                href="#privacy"
                className="text-xs text-ink/30 hover:text-ink/50 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#cookies"
                className="text-xs text-ink/30 hover:text-ink/50 transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
