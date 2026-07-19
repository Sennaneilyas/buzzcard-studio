import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Navbar — BuzzCard Studio landing page navigation.
 *
 * Features:
 * - Glassmorphism background on scroll
 * - Smooth reveal animation on mount
 * - Mobile hamburger with animated slide-in menu
 * - Active link highlighting
 * - CTA button with accent glow
 */

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed top-0 inset-x-0 z-50
          transition-all duration-300 ease-out
          ${scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,35,102,0.08)]"
            : "bg-transparent"
          }
        `}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10"
          id="main-nav"
        >
          {/* ── Logo ── */}
          <a href="/" className="flex items-center gap-2.5 group" id="nav-logo">
            {/* Logo mark */}
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-navy overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-mint/30" />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="relative z-10 h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  fill="currentColor"
                  className="text-mint"
                />
              </svg>
            </span>
            {/* Word mark */}
            <span className="text-xl font-bold tracking-tight text-ink">
              Buzz<span className="text-navy">Card</span>
            </span>
          </a>

          {/* ── Desktop links ── */}
          <ul className="hidden md:flex items-center gap-1" id="nav-links-desktop">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="
                    relative px-4 py-2 text-sm font-medium text-ink/70
                    rounded-lg transition-colors duration-200
                    hover:text-navy hover:bg-navy/5
                  "
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center gap-3" id="nav-cta-desktop">
            <a
              href="#login"
              className="px-4 py-2 text-sm font-medium text-ink/70 rounded-lg transition-colors duration-200 hover:text-navy"
            >
              Log in
            </a>
            <a
              href="#get-started"
              className="
                group/btn relative px-5 py-2.5 text-sm font-semibold text-ink
                bg-mint rounded-xl
                transition-all duration-300
                hover:shadow-[0_0_20px_rgba(0,230,118,0.4)]
                hover:scale-[1.03]
                active:scale-[0.98]
              "
              id="nav-cta-button"
            >
              Get Your Card
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="relative z-50 flex md:hidden h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-navy/5"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            id="nav-mobile-toggle"
          >
            <div className="flex flex-col gap-[5px] w-5">
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="block h-[2px] w-full bg-ink rounded-full origin-center"
                transition={{ duration: 0.3 }}
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                className="block h-[2px] w-full bg-ink rounded-full"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="block h-[2px] w-full bg-ink rounded-full origin-center"
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        </nav>
      </motion.header>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm md:hidden"
              id="nav-mobile-backdrop"
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="
                fixed top-0 right-0 z-40 h-full w-[min(85vw,360px)]
                bg-white shadow-[-8px_0_30px_rgba(0,35,102,0.08)]
                flex flex-col pt-24 px-6 pb-8
                md:hidden
              "
              id="nav-mobile-panel"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.35 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="
                        block px-4 py-3 text-base font-medium text-ink/80
                        rounded-xl transition-colors duration-200
                        hover:text-navy hover:bg-navy/5
                      "
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-3">
                <a
                  href="#login"
                  onClick={() => setMobileOpen(false)}
                  className="
                    block text-center px-4 py-3 text-sm font-medium text-ink/70
                    rounded-xl border border-ink/10
                    transition-colors duration-200 hover:border-navy/20 hover:text-navy
                  "
                >
                  Log in
                </a>
                <a
                  href="#get-started"
                  onClick={() => setMobileOpen(false)}
                  className="
                    block text-center px-5 py-3 text-sm font-semibold text-ink
                    bg-mint rounded-xl
                    transition-all duration-300
                    hover:shadow-[0_0_20px_rgba(0,230,118,0.4)]
                  "
                  id="nav-mobile-cta"
                >
                  Get Your Card
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
