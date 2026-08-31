import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/admin/products", label: "Products", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-ink/10 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 border-b border-ink/10 flex items-center justify-center">
          <div className="text-xl font-bold bg-gradient-to-r from-navy to-ink bg-clip-text text-transparent">
            Admin Portal
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? "bg-navy text-white shadow-md shadow-navy/20"
                    : "text-ink/60 hover:text-navy hover:bg-ink/5"
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-ink/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
