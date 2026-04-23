import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("outfits").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = (products || []).filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.seller_id?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            All Products
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {products.length} products listed
          </p>
        </div>
        <div className="flex items-center gap-2 bg-linear-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-md text-sm font-medium">
          <span>👗</span>
          <span>{products.length} Products</span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search products or seller..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-sm transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Head */}
        <div className="grid grid-cols-3 bg-linear-to-r from-green-50 to-emerald-50 border-b border-gray-100 px-5 py-3">
          <span className="text-xs font-semibold text-green-700 uppercase tracking-widest">
            Product Name
          </span>
          <span className="text-xs font-semibold text-green-700 uppercase tracking-widest">
            Price
          </span>
          <span className="text-xs font-semibold text-green-700 uppercase tracking-widest">
            Seller ID
          </span>
        </div>

        {/* Table Body */}
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-3 px-5 py-4 border-b border-gray-50 animate-pulse"
            >
              <div className="h-3.5 bg-gray-200 rounded w-3/4" />
              <div className="h-3.5 bg-gray-100 rounded w-1/3" />
              <div className="h-3.5 bg-gray-100 rounded w-1/2" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">👗</p>
            <p className="font-medium">No products found</p>
          </div>
        ) : (
          filtered.map((p, i) => (
            <div
              key={p.id}
              className={`grid grid-cols-3 px-5 py-4 border-b border-gray-50 hover:bg-green-50/40 transition-colors duration-150 group ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-200 to-emerald-200 flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition-transform">
                  👗
                </div>
                <span className="text-sm font-semibold text-gray-800 truncate">
                  {p.name || "—"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold text-green-700">
                  {p.price != null
                    ? `₹${Number(p.price).toLocaleString("en-IN")}`
                    : "—"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-lg truncate max-w-xs">
                  {p.seller_id?.slice(0, 16)}...
                </span>
              </div>
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

export default AdminProducts;
