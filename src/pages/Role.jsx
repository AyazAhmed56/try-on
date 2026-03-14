import React, { useState } from "react";
import { ShoppingBag, Store, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const Role = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isHoveringCustomer, setIsHoveringCustomer] = useState(false);
  const [isHoveringSeller, setIsHoveringSeller] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selectedRole) return;

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("User not authenticated");
      setLoading(false);
      return;
    }

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        role: selectedRole,
        email: user.email,
        name: user.email.split("@")[0],
      });

      if (insertError) {
        alert(insertError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);

    if (selectedRole === "customer") {
      navigate("/customer/profile");
    } else {
      navigate("/seller/profile");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(22,163,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.04) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 w-125 h-125 bg-green-100 rounded-full blur-3xl opacity-60 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-125 h-125 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-pulse [animation-delay:2s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-50 rounded-full blur-2xl opacity-40 animate-pulse [animation-delay:4s]" />

      <div
        className="relative w-full max-w-4xl animate-[fadeInUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
        style={{ animation: "fadeInUp 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {/* Main Card */}
        <div className="bg-white border border-green-100 rounded-3xl shadow-[0_8px_48px_rgba(22,163,74,0.10)] p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
              I am a{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #16a34a, #059669)",
                }}
              >
                ...
              </span>
            </h1>
            <p className="text-gray-500 text-base">
              Choose your role to get started with Try-on
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
            {/* Customer Card */}
            <button
              onClick={() => setSelectedRole("customer")}
              onMouseEnter={() => setIsHoveringCustomer(true)}
              onMouseLeave={() => setIsHoveringCustomer(false)}
              className={`group relative p-8 rounded-2xl border-2 text-left transition-all duration-300 ${
                selectedRole === "customer"
                  ? "border-green-500 bg-green-50/60 shadow-xl scale-[1.03]"
                  : "border-gray-200 bg-white hover:border-green-300 hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 mb-5 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                  selectedRole === "customer" || isHoveringCustomer
                    ? "shadow-green-200"
                    : ""
                }`}
                style={{
                  background:
                    selectedRole === "customer" || isHoveringCustomer
                      ? "linear-gradient(135deg, #16a34a, #059669)"
                      : "linear-gradient(135deg, #dcfce7, #d1fae5)",
                }}
              >
                <ShoppingBag
                  className={`w-8 h-8 transition-colors duration-300 ${
                    selectedRole === "customer" || isHoveringCustomer
                      ? "text-white"
                      : "text-green-600"
                  }`}
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">Customer</h2>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                Browse and try on outfits virtually before making a purchase
              </p>

              <ul className="text-sm text-gray-500 space-y-2">
                {[
                  "Virtual try-on experience",
                  "Browse latest collections",
                  "Save favorite items",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Selected badge */}
              {selectedRole === "customer" && (
                <div
                  className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #16a34a, #059669)",
                    animation: "scaleIn 0.25s ease-out both",
                  }}
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              )}
            </button>

            {/* Seller Card */}
            <button
              onClick={() => setSelectedRole("seller")}
              onMouseEnter={() => setIsHoveringSeller(true)}
              onMouseLeave={() => setIsHoveringSeller(false)}
              className={`group relative p-8 rounded-2xl border-2 text-left transition-all duration-300 ${
                selectedRole === "seller"
                  ? "border-emerald-500 bg-emerald-50/60 shadow-xl scale-[1.03]"
                  : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 mb-5 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                  selectedRole === "seller" || isHoveringSeller
                    ? "shadow-emerald-200"
                    : ""
                }`}
                style={{
                  background:
                    selectedRole === "seller" || isHoveringSeller
                      ? "linear-gradient(135deg, #059669, #16a34a)"
                      : "linear-gradient(135deg, #d1fae5, #dcfce7)",
                }}
              >
                <Store
                  className={`w-8 h-8 transition-colors duration-300 ${
                    selectedRole === "seller" || isHoveringSeller
                      ? "text-white"
                      : "text-emerald-600"
                  }`}
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">Seller</h2>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                Showcase your products with virtual try-on technology
              </p>

              <ul className="text-sm text-gray-500 space-y-2">
                {[
                  "Upload product catalog",
                  "Manage inventory",
                  "Track analytics",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Selected badge */}
              {selectedRole === "seller" && (
                <div
                  className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #059669, #16a34a)",
                    animation: "scaleIn 0.25s ease-out both",
                  }}
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          </div>

          {/* Continue Button */}
          {selectedRole && (
            <div
              className="mt-10 flex justify-center"
              style={{ animation: "fadeInUp 0.35s ease-out both" }}
            >
              <button
                onClick={handleContinue}
                disabled={loading}
                className="group relative flex items-center gap-2.5 px-8 py-3.5 text-white text-sm font-semibold rounded-xl shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                }}
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-xl" />
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    Continue as{" "}
                    {selectedRole === "customer" ? "Customer" : "Seller"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Role;
