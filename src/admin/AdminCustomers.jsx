import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const roleBadge = (role) => {
  const map = {
    admin: "bg-green-100 text-green-700 border-green-200",
    seller: "bg-emerald-100 text-emerald-700 border-emerald-200",
    customer: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return map[role] || "bg-gray-100 text-gray-600 border-gray-200";
};

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.error(error);
        setUsers([]);
      } else setUsers(data || []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Users
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {users.length} registered users
          </p>
        </div>
        <div className="flex items-center gap-2 bg-linear-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-md text-sm font-medium">
          <span>👤</span>
          <span>{users.length} Total</span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search by email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-sm transition"
        />
      </div>

      {/* List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-200 rounded w-2/5" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">👤</p>
            <p className="font-medium">No customers found</p>
          </div>
        ) : (
          filtered.map((u, i) => (
            <div
              key={u.id}
              className="bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 flex items-center gap-4 group"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                {(u.email?.[0] || "?").toUpperCase()}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {u.email}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ID: {u.id?.slice(0, 12)}...
                </p>
              </div>
              {/* Role Badge */}
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full border capitalize ${roleBadge(u.role)}`}
              >
                {u.role || "user"}
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

export default AdminCustomers;
