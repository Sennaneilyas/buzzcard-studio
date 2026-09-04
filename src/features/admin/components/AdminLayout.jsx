import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">

      <aside className="w-56 bg-white border-r border-black/[0.06] flex flex-col fixed inset-y-0 left-0 z-50">

        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-black/[0.05]">
          <img
            src="/logoHB.svg"
            alt="BuzzCard"
            className="h-6 w-auto object-contain"
          />
          <p className="mt-1.5 text-[10px] font-medium text-black/25 uppercase tracking-widest">
            Admin
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-4 space-y-5 overflow-y-auto">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              {/* Section label */}
              <p className="px-2 mb-1.5 text-[11px] font-medium text-black/30 uppercase tracking-widest">
                {section.label}
              </p>

              {/* Links */}
              <div className="space-y-0.5">
                {section.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-black text-white"
                          : "text-black/55 hover:text-black hover:bg-black/[0.05]"
                      }`
                    }
                  >
                    <link.icon className="w-4 h-4 shrink-0" />
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer — Sign out */}
        <div className="px-3 pb-5 border-t border-black/[0.06] pt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium text-black/40 hover:text-black/70 hover:bg-black/[0.04] transition-all duration-150"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="flex-1 ml-56 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
