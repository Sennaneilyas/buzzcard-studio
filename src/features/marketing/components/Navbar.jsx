import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useAuthStore, useProfile } from "@/features/auth";
import { supabase } from "@/lib/supabase";
import { LogOut, ChevronDown, Mail, UserCircle } from "lucide-react";


const NAV_LINKS = [
  { label: "Our Products", href: "#products" },
  { label: "Templates", href: "#templates" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userPhotoUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    profile?.avatar_url;

  const rawDisplayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    profile?.full_name ||
    (user?.email ? user.email.split("@")[0] : "User");

  const displayName = rawDisplayName.split(" ")[0];

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
        className={`top-0 inset-x-0 z-[120] pointer-events-none ${scrolled ? "fixed" : "absolute"}`}
      >
        {/* ── Outer wrapper — full-width → centered pill on scroll ── */}
        <div
          className={`
            mx-auto flex items-center justify-between pointer-events-auto
            will-change-[max-width,margin,padding,border-radius,background,box-shadow]
            transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${scrolled
              ? "max-w-3xl mt-4 px-3 py-2 rounded-full bg-white/75 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,35,102,0.12)] border border-white/50"
              : "max-w-7xl mt-0 px-6 py-5 lg:px-10 bg-transparent border border-transparent"
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
            {user ? (
              <div className="flex items-center gap-3 relative" ref={profileRef}>
                {/* User Profile Pill */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="
                    flex items-center gap-2 rounded-full
                    px-2 py-1 bg-ink/[0.05] hover:bg-ink/[0.08] backdrop-blur-md border border-ink/[0.06] transition-colors
                  "
                >
                  {userPhotoUrl ? (
                    <img
                      src={userPhotoUrl}
                      alt="Account"
                      className="size-7 rounded-full object-cover ring-1 ring-white/50"
                    />
                  ) : (
                    <div className="flex size-7 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-ink/80 truncate max-w-[120px] capitalize">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-ink/50 mr-1" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-ink/5 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-ink/5 bg-ink/[0.02]">
                        <div className="flex items-center gap-3 mb-2">
                          {userPhotoUrl ? (
                            <img
                              src={userPhotoUrl}
                              alt="Account"
                              className="size-10 rounded-full object-cover ring-2 ring-mint/50"
                            />
                          ) : (
                            <div className="flex size-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-navy truncate">
                              {rawDisplayName}
                            </span>
                            <span className="text-xs text-ink/50 flex items-center gap-1 mt-0.5 truncate">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate">{user?.email}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2 flex flex-col gap-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-ink/80 rounded-xl hover:bg-ink/5 transition-colors"
                        >
                          <UserCircle className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/auth?mode=login"
                  className={`
                    font-medium text-ink/60 rounded-full
                    transition-all duration-300 hover:text-ink
                    ${scrolled ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}
                  `}
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
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
                </Link>
              </>
            )}
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
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="
                        block text-center px-4 py-3 text-sm font-medium text-ink/80
                        rounded-xl border border-ink/10
                        transition-colors duration-200
                        hover:border-navy/20 hover:text-ink
                      "
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="
                        block w-full text-center px-5 py-3 text-sm font-semibold
                        text-red-600 rounded-xl border border-red-200
                        transition-all duration-300
                        hover:bg-red-50 hover:text-red-700
                      "
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth?mode=login"
                      onClick={() => setMobileOpen(false)}
                      className="
                        block text-center px-4 py-3 text-sm font-medium text-ink/70
                        rounded-xl border border-ink/10
                        transition-colors duration-200
                        hover:border-navy/20 hover:text-ink
                      "
                    >
                      Log in
                    </Link>
                    <Link
                      to="/auth?mode=signup"
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
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
