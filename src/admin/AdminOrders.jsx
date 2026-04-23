import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-emerald-50 text-emerald-700 border-emerald-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const statusIcon = {
  pending: "⏳",
  processing: "⚙️",
  shipped: "🚚",
  delivered: "✅",
  cancelled: "❌",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) {
        console.error(error);
        setOrders([]);
      } else setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const statuses = [
    "all",
    ...new Set(orders.map((o) => o.status).filter(Boolean)),
  ];

  const filtered = orders.filter((o) => {
    const matchStatus = filter === "all" || o.status === filter;
    const matchSearch = o.id?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            All Orders
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {orders.length} orders total
          </p>
        </div>
        <div className="flex items-center gap-2 bg-linear-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-md text-sm font-medium">
          <span>📦</span>
          <span>{orders.length} Orders</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-sm transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium border capitalize transition-all duration-200
                ${
                  filter === s
                    ? "bg-linear-to-r from-green-600 to-emerald-500 text-white border-transparent shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-200 rounded w-2/5" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="w-20 h-6 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-medium">No orders found</p>
          </div>
        ) : (
          filtered.map((o, i) => (
            <div
              key={o.id}
              className="bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 flex items-center gap-4 group"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                {statusIcon[o.status] || "📦"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  Order #{o.id?.slice(0, 16)}...
                </p>
                {o.created_at && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(o.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full border capitalize ${statusStyles[o.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}
              >
                {o.status || "unknown"}
              </span>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease both; }
      `}</style>
    </div>
  );
};

export default AdminOrders;
