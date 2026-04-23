import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  const fetchSellers = async () => {
    const { data: sellersData, error } = await supabase
      .from("seller_profiles")
      .select("*");
    if (error) {
      console.error(error);
      setSellers([]);
      setLoading(false);
      return;
    }

    const users = await Promise.all(
      (sellersData || []).map(async (s) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", s.user_id)
          .single();
        return { ...s, email: profile?.email };
      }),
    );

    setSellers(users);
    setLoading(false);
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const approveSeller = async (id) => {
    setApproving(id);
    await supabase
      .from("seller_profiles")
      .update({ approved: true })
      .eq("user_id", id);
    await fetchSellers();
    setApproving(null);
  };

  const pending = sellers.filter((s) => !s.approved);
  const approved = sellers.filter((s) => s.approved);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Seller Approval
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {pending.length} pending · {approved.length} approved
          </p>
        </div>
        <div className="flex gap-2">
          {pending.length > 0 && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-xl text-sm font-medium">
              <span>⏳</span>
              <span>{pending.length} Pending</span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-linear-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-md text-sm font-medium">
            <span>✅</span>
            <span>{approved.length} Approved</span>
          </div>
        </div>
      </div>

      {/* Pending Section */}
      {pending.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">
              Awaiting Approval
            </h2>
          </div>
          <div className="space-y-2">
            {pending.map((s, i) => (
              <div
                key={s.user_id}
                className="bg-white rounded-xl border border-yellow-100 px-5 py-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4 group"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-200 to-orange-200 flex items-center justify-center text-sm font-bold text-yellow-700 group-hover:scale-105 transition-transform">
                  {(s.email?.[0] || "?").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {s.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ID: {s.user_id?.slice(0, 16)}...
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 font-medium mr-2">
                  Pending
                </span>
                <button
                  onClick={() => approveSeller(s.user_id)}
                  disabled={approving === s.user_id}
                  className="flex items-center gap-2 bg-linear-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {approving === s.user_id ? (
                    <>
                      <svg
                        className="animate-spin w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      <span>Approving...</span>
                    </>
                  ) : (
                    <>
                      <span>✅</span>
                      <span>Approve</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Section */}
      {approved.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">
              Approved Sellers
            </h2>
          </div>
          <div className="space-y-2">
            {approved.map((s, i) => (
              <div
                key={s.user_id}
                className="bg-white rounded-xl border border-green-100 px-5 py-4 shadow-sm flex items-center gap-4 opacity-80"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-200 to-emerald-200 flex items-center justify-center text-sm font-bold text-green-700">
                  {(s.email?.[0] || "?").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {s.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ID: {s.user_id?.slice(0, 16)}...
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 font-medium flex items-center gap-1">
                  <span>✅</span> Approved
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && sellers.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <p className="text-4xl mb-3">🏪</p>
          <p className="font-medium">No sellers found</p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease both; }
      `}</style>
    </div>
  );
};

export default AdminSellers;
