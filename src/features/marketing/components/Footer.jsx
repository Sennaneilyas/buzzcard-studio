import React from "react";
import { motion } from "framer-motion";

const FOOTER_COLUMNS = [
  {
    title: "Navigate",
    links: [
      { label: "Home", href: "#landing-page" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Products", href: "#products" },
      { label: "Pricing", href: "#pricing" },
      { label: "Testimonials", href: "#work" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Book a Call", href: "mailto:hello@buzzcard.ma" },
      { label: "Twitter / X", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Templates", href: "#" },
      { label: "Blog", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Support", href: "mailto:support@buzzcard.ma" },
    ],
  },
];

/**
 * Footer — Premium dark card layout inspired by studio aesthetic.
 */
export default function Footer() {
  return (
    <div className="px-2 pb-2 sm:px-3 sm:pb-3 lg:px-4 lg:pb-4 relative z-20">
      <footer
        className="
          bg-foreground rounded-[1.5rem] sm:rounded-[2rem] text-white
          pt-20 sm:pt-28 pb-10 px-6 sm:px-12 md:px-16
          overflow-hidden relative shadow-2xl border border-white/5
        "
        id="contact"
      >
        {/* Ambient subtle glow in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-white/[0.03] blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Top Center Logo Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="w-10 h-10 mx-auto mb-8 flex items-center justify-center"
          >
            <img
              src="/justlogo.png"
              alt="BuzzCard Logo"
              className="w-full h-full object-contain brightness-0 invert opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
          </motion.div>

          {/* Main Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-[1.15]">
              You deserve a card that{" "}
              <span className="text-white/35 font-normal">works as hard</span>{" "}
              as you do.
            </h2>
            <p className="mt-5 text-white/50 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              Book a free intro call and let's talk about what your brand needs next.
            </p>

            <div className="mt-8">
              <a
                href="#get-started"
                className="
                  inline-flex items-center justify-center
                  px-7 py-3.5 rounded-full
                  bg-white/15 hover:bg-white/25 active:scale-[0.98]
                  text-white text-sm font-medium
                  transition-all duration-300
                  backdrop-blur-md border border-white/10
                  shadow-[0_4px_20px_rgba(0,0,0,0.3)]
                "
                id="footer-cta"
              >
                Start Your Project
              </a>
            </div>
          </motion.div>

          {/* 4-Column Links Grid */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-24 sm:mt-32 text-left"
          >
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm sm:text-base font-semibold text-white mb-4 tracking-wide">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-white/40 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Bottom Divider & Copyright */}
          <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <div>
              © {new Date().getFullYear()} BuzzCard Studio. All rights reserved.
            </div>
            <div>
              Designed and built in Morocco 🇲🇦
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
