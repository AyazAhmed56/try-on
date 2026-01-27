import React, { useState } from "react";
import { ShoppingBag, Store, ArrowRight } from "lucide-react";
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

    // 1️⃣ Get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("User not authenticated");
      setLoading(false);
      return;
    }

    // 2️⃣ Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    // 3️⃣ Insert profile ONLY if not exists
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

    // 4️⃣ Redirect based on role
    if (selectedRole === "customer") {
      navigate("/customer/profile");
    } else {
      navigate("/seller/profile");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              I am a ...
            </h1>
            <p className="text-gray-600 text-lg">
              Choose your role to get started with Try-on
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Customer Card */}
            <button
              onClick={() => setSelectedRole("customer")}
              onMouseEnter={() => setIsHoveringCustomer(true)}
              onMouseLeave={() => setIsHoveringCustomer(false)}
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                selectedRole === "customer"
                  ? "border-purple-500 bg-linear-to-br from-purple-50 to-pink-50 shadow-xl scale-105"
                  : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg hover:scale-105"
              }`}
            >
              {/* Icon Container */}
              <div
                className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedRole === "customer" || isHoveringCustomer
                    ? "bg-linear-to-br from-purple-500 to-pink-500 shadow-lg"
                    : "bg-linear-to-br from-purple-100 to-pink-100"
                }`}
              >
                <ShoppingBag
                  className={`w-10 h-10 transition-all duration-300 ${
                    selectedRole === "customer" || isHoveringCustomer
                      ? "text-white"
                      : "text-purple-600"
                  }`}
                />
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Customer
              </h2>
              <p className="text-gray-600 mb-6">
                Browse and try on outfits virtually before making a purchase
              </p>

              {/* Features List */}
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                  Virtual try-on experience
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                  Browse latest collections
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                  Save favorite items
                </li>
              </ul>

              {/* Selected Indicator */}
              {selectedRole === "customer" && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center animate-scale-in">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>

            {/* Seller Card */}
            <button
              onClick={() => setSelectedRole("seller")}
              onMouseEnter={() => setIsHoveringSeller(true)}
              onMouseLeave={() => setIsHoveringSeller(false)}
              className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                selectedRole === "seller"
                  ? "border-pink-500 bg-linear-to-br from-pink-50 to-purple-50 shadow-xl scale-105"
                  : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-lg hover:scale-105"
              }`}
            >
              {/* Icon Container */}
              <div
                className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedRole === "seller" || isHoveringSeller
                    ? "bg-linear-to-br from-pink-500 to-purple-500 shadow-lg"
                    : "bg-linear-to-br from-pink-100 to-purple-100"
                }`}
              >
                <Store
                  className={`w-10 h-10 transition-all duration-300 ${
                    selectedRole === "seller" || isHoveringSeller
                      ? "text-white"
                      : "text-pink-600"
                  }`}
                />
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Seller</h2>
              <p className="text-gray-600 mb-6">
                Showcase your products with virtual try-on technology
              </p>

              {/* Features List */}
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                  Upload product catalog
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                  Manage inventory
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                  Track analytics
                </li>
              </ul>

              {/* Selected Indicator */}
              {selectedRole === "seller" && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center animate-scale-in">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>
          </div>

          {/* Continue Button */}
          {selectedRole && (
            <div className="mt-10 text-center animate-fade-in">
              <button
                onClick={handleContinue}
                disabled={loading}
                className="group px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                {loading
                  ? "Saving..."
                  : `Continue as ${
                      selectedRole === "customer" ? "Customer" : "Seller"
                    }`}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 2s;
        }
        .delay-2000 {
          animation-delay: 3s;
        }
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Role;
