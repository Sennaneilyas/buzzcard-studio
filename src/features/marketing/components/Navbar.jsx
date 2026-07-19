import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";


const NAV_LINKS = [
  { label: "Pricing", href: "#pricing" },
  { label: "Templates", href: "#templates" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#pricing");

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50"
      >
        {/* ── Outer wrapper — full-width → centered pill on scroll ── */}
        <div
          className={`
            mx-auto flex items-center justify-between
            will-change-[max-width,margin,padding,border-radius,background,box-shadow]
            transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${scrolled
              ? "max-w-3xl mt-4 px-3 py-2 rounded-full bg-white/70 backdrop-blur-2xl shadow-[0_2px_20px_rgba(0,35,102,0.08)] border border-ink/[0.06]"
              : "max-w-7xl mt-0 px-6 py-5 lg:px-10 bg-transparent"
            }
          `}
          id="main-nav"
        >
          {/* ── Logo ── */}
          <a href="/" className="flex items-center shrink-0 group" id="nav-logo">
            <img
              src="/logoHB.svg"
              alt="BuzzCard Studio"
              className={`
                w-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${scrolled ? "h-6" : "h-8"}
              `}
            />
          </a>

          {/* ── Desktop links pill ── */}
          <LayoutGroup>
          <div
            className={`
              hidden md:flex items-center
              rounded-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
              ${scrolled
                ? "gap-0.5 px-1 py-1 bg-ink/[0.04]"
                : "gap-0.5 px-1.5 py-1.5 bg-ink/[0.05] backdrop-blur-md border border-ink/[0.06]"
              }
            `}
            id="nav-links-desktop"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink(link.href);
                  document
                    .querySelector(link.href)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`
                  relative px-4 py-1.5 text-sm font-medium rounded-full
                  transition-colors duration-200 z-[1]
                  ${activeLink === link.href
                    ? "text-ink"
                    : "text-ink/60 hover:text-ink hover:bg-ink/[0.04]"
                  }
                `}
              >
                {/* Sliding pill indicator */}
                {activeLink === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-mint"
                    style={{ zIndex: -1 }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                {link.label}
              </a>
            ))}
          </div>
          </LayoutGroup>

          {/* ── Desktop CTAs ── */}
          <div
            className={`
              hidden md:flex items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
              ${scrolled ? "gap-2" : "gap-3"}
            `}
            id="nav-cta-desktop"
          >
            <a
              href="#login"
              className={`
                font-medium text-ink/60 rounded-full
                transition-all duration-300 hover:text-ink
                ${scrolled ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}
              `}
            >
              Log in
            </a>
            <a
              href="#get-started"
              className={`
                font-semibold text-ink rounded-full
                border border-ink/40
                transition-all duration-300
                hover:bg-mint hover:text-ink hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]
                hover:scale-[1.03] active:scale-[0.97]
                ${scrolled ? "px-4 py-1.5 text-xs" : "px-5 py-2.5 text-sm"}
              `}
              id="nav-cta-button"
            >
              Get started
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="relative z-50 flex md:hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ink/5"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            id="nav-mobile-toggle"
          >
            <div className="flex flex-col gap-[5px] w-5">
              <motion.span
                animate={
                  mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }
                }
                className="block h-[2px] w-full bg-ink rounded-full origin-center"
                transition={{ duration: 0.3 }}
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { opacity: 0, x: -8 }
                    : { opacity: 1, x: 0 }
                }
                className="block h-[2px] w-full bg-ink rounded-full"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={
                  mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }
                }
                className="block h-[2px] w-full bg-ink rounded-full origin-center"
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        </div>
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
                bg-cloud/95 backdrop-blur-xl
                shadow-[-8px_0_30px_rgba(0,35,102,0.08)]
                flex flex-col pt-24 px-6 pb-8
                md:hidden
              "
              id="nav-mobile-panel"
            >
              <LayoutGroup id="mobile-nav">
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
                      onClick={() => {
                        setActiveLink(link.href);
                        setMobileOpen(false);
                      }}
                      className={`
                        relative block px-4 py-3 text-base font-medium
                        rounded-xl transition-colors duration-200 overflow-hidden
                        ${activeLink === link.href
                          ? "text-ink"
                          : "text-ink/70 hover:text-ink hover:bg-ink/5"
                        }
                      `}
                    >
                      {activeLink === link.href && (
                        <motion.span
                          layoutId="mobile-nav-pill"
                          className="absolute inset-0 rounded-xl bg-mint"
                          style={{ zIndex: -1 }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              </LayoutGroup>

              <div className="mt-auto flex flex-col gap-3">
                <a
                  href="#login"
                  onClick={() => setMobileOpen(false)}
                  className="
                    block text-center px-4 py-3 text-sm font-medium text-ink/70
                    rounded-xl border border-ink/10
                    transition-colors duration-200
                    hover:border-navy/20 hover:text-ink
                  "
                >
                  Log in
                </a>
                <a
                  href="#get-started"
                  onClick={() => setMobileOpen(false)}
                  className="
                    block text-center px-5 py-3 text-sm font-semibold
                    text-mint rounded-xl border border-mint/40
                    transition-all duration-300
                    hover:bg-mint hover:text-ink
                    hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]
                  "
                  id="nav-mobile-cta"
                >
                  Get started
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
