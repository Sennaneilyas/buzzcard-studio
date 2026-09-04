import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

const NAV_SECTIONS = [
  {
    label: "Overview",
    links: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Store",
    links: [
      { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { to: "/admin/products", label: "Products", icon: Package },
    ],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex font-sans">
      <aside className="w-64 bg-white border-r border-ink/10 flex flex-col fixed inset-y-0 left-0 z-50">
        
        {/* Logo */}
        <div className="px-6 pt-8 pb-6">
          <img
            src="/logoHB.svg"
            alt="BuzzCard"
            className="h-6 w-auto object-contain mb-1"
          />
          <p className="text-[9px] font-black text-ink/30 uppercase tracking-[0.3em]">
            Admin Studio
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto pt-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              {/* Section label */}
              <p className="px-3 mb-3 text-[10px] font-black text-ink/30 uppercase tracking-[0.2em]">
                {section.label}
              </p>

              {/* Links */}
              <div className="space-y-1 relative">
                {section.links.map((link) => {
                  const isActive = location.pathname.startsWith(link.to);
                  
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold outline-none group z-10"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-admin-nav"
                          className="absolute inset-0 bg-ink rounded-lg z-0"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <link.icon 
                        className={`w-4 h-4 shrink-0 relative z-10 transition-colors duration-200 ${
                          isActive ? "text-white" : "text-ink/40 group-hover:text-ink/80"
                        }`} 
                      />
                      <span 
                        className={`relative z-10 transition-colors duration-200 ${
                          isActive ? "text-white" : "text-ink/60 group-hover:text-ink"
                        }`}
                      >
                        {link.label}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer — Sign out */}
        <div className="p-4 border-t border-ink/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-ink/50 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
