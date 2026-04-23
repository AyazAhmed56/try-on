import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const statCards = [
  {
    key: "orders",
    label: "Total Orders",
    icon: "📦",
    color: "from-green-500 to-emerald-400",
    bg: "bg-green-50",
    border: "border-green-100",
    text: "text-green-700",
  },
  {
    key: "users",
    label: "Total Users",
    icon: "👤",
    color: "from-green-600 to-green-400",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    text: "text-emerald-700",
  },
  {
    key: "products",
    label: "Products",
    icon: "👗",
    color: "from-emerald-500 to-green-400",
    bg: "bg-green-50",
    border: "border-green-100",
    text: "text-green-700",
  },
  {
    key: "sellers",
    label: "Active Sellers",
    icon: "🏪",
    color: "from-green-700 to-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    text: "text-emerald-700",
  },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    orders: 0,
    users: 0,
    products: 0,
    sellers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: orders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });
      const { count: users } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      const { count: products } = await supabase
        .from("outfits")
        .select("*", { count: "exact", head: true });
      const { count: sellers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "seller");
      setStats({ orders, users, products, sellers });
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => (
          <div
            key={card.key}
            className={`bg-white rounded-2xl border ${card.border} p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-11 h-11 rounded-xl bg-linear-to-br ${card.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="text-lg">{card.icon}</span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                <span className="text-green-600 text-xs font-medium">
                  ↑ Live
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mb-1">
                {card.label}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? (
                  <span className="inline-block w-12 h-8 bg-gray-100 rounded-lg animate-pulse" />
                ) : (
                  (stats[card.key] ?? 0)
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Summary Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Overview
        </h2>
        <div className="space-y-3">
          {statCards.map((card) => (
            <div key={card.key} className="flex items-center gap-4">
              <span className="text-base w-6 text-center">{card.icon}</span>
              <span className="text-sm text-gray-600 flex-1">{card.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full bg-linear-to-r ${card.color} transition-all duration-1000`}
                  style={{
                    width: loading
                      ? "0%"
                      : `${Math.min(((stats[card.key] ?? 0) / 100) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-800 w-8 text-right">
                {stats[card.key] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease both; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
