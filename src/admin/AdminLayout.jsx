import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabase";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/admin/products", label: "Products", icon: "👗" },
  { to: "/admin/orders", label: "Orders", icon: "📦" },
  { to: "/admin/users", label: "Users", icon: "👤" },
  { to: "/admin/sellers", label: "Sellers", icon: "🏪" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-linear-to-b from-green-950 via-green-900 to-green-950 text-white flex flex-col shadow-2xl">
        {/* Logo */}
        <div className="px-6 py-7 border-b border-green-700/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white leading-none">
                Admin Panel
              </h2>
              <p className="text-green-400 text-xs mt-0.5">
                Management Console
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${
                    active
                      ? "bg-linear-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-900/40"
                      : "text-green-200 hover:bg-green-800/50 hover:text-white"
                  }`}
              >
                <span
                  className={`text-base transition-transform duration-200 ${!active && "group-hover:scale-110"}`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full opacity-80"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-green-700/40">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-red-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-green-600 font-medium">Admin</span>
            <span>/</span>
            <span className="capitalize text-gray-700 font-medium">
              {location.pathname.split("/").pop()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
