import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import {
  ShoppingBag,
  Store,
  ArrowRight,
  TrendingUp,
  Heart,
  Shield,
  Zap,
  Check,
  Leaf,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UnifiedHomePage = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (mounted) {
          setUserRole(null);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (!error && mounted) setUserRole(data?.role || null);
      if (mounted) setLoading(false);
    };
    loadUserRole();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div
        className="hp-root min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #F0FDF4, #fff, #ECFDF5)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#16A34A,#10B981)",
              animation: "spin 1.2s linear infinite",
            }}
          >
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <p style={{ color: "#16A34A", fontWeight: 600, fontSize: 15 }}>
            Loading…
          </p>
        </div>
      </div>
    );

  return (
    <div
      className="hp-root min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, #F0FDF4 0%, #ffffff 45%, #ECFDF5 100%)",
      }}
    >
      {/* Fixed background blobs */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
        <div className="blob blob-c" />
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.025 }}
        >
          <defs>
            <pattern
              id="hp-dots"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.4" fill="#16A34A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hp-dots)" />
        </svg>
      </div>

      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="relative flex flex-col items-center px-4 pt-20 pb-16"
        style={{ zIndex: 1 }}
      >
        {/* ── BANNER IMAGE ── */}
        <div className="banner-wrap w-full max-w-6xl mx-auto mt-4 mb-10">
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              boxShadow:
                "0 8px 48px rgba(22,163,74,0.18), 0 2px 12px rgba(0,0,0,0.08)",
              border: "1px solid rgba(187,247,208,0.5)",
            }}
          >
            <img
              src="/banner.jpg"
              alt="Try-on Virtual Fitting Experience"
              className="banner-img w-full object-cover"
              style={{ display: "block", maxHeight: 420 }}
            />
            {/* fade-out gradient at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-24"
              style={{
                background:
                  "linear-gradient(to top, rgba(240,253,244,0.7), transparent)",
              }}
            />
          </div>
        </div>

        {/* ── LOGO ── */}
        <div className="hero-brand text-center mb-10">
          <div className="mx-auto mb-6">
            <img
              src="/logo.jpg"
              alt="Try-on Logo"
              className="logo-img mx-auto object-contain hover:scale-105 transition-transform duration-300"
              style={{
                maxWidth: 280,
                width: "100%",
                height: "auto",
                filter: "drop-shadow(0 4px 16px rgba(22,163,74,0.18))",
              }}
            />
          </div>

          <p
            style={{
              fontSize: 16,
              color: "#6B7280",
              maxWidth: 560,
              margin: "0 auto 28px",
              lineHeight: 1.7,
            }}
          >
            Experience the future of fashion with AI-powered virtual try-on
            technology. See how outfits look on you before making a purchase!
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {["AI-Powered", "Secure & Private", "50K+ Users"].map((b, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium"
                style={{
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  color: "#15803D",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22C55E",
                    display: "inline-block",
                  }}
                />
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* ── CUSTOMER logged in ── */}
        {userRole === "customer" && (
          <div className="role-card-wrap w-full max-w-md mx-auto">
            <div
              className="role-card bg-white rounded-3xl p-8 mb-8"
              style={{
                boxShadow: "0 8px 40px rgba(22,163,74,0.12)",
                border: "1px solid rgba(187,247,208,0.7)",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#DCFCE7,#BBF7D0)",
                }}
              >
                <ShoppingBag
                  style={{ width: 28, height: 28, color: "#16A34A" }}
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                Welcome Back, Customer!
              </h3>
              <p
                style={{
                  color: "#6B7280",
                  marginBottom: 24,
                  textAlign: "center",
                }}
              >
                Continue your shopping journey
              </p>
              <Link
                to="/customer/dashboard"
                className="cta-btn flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-full"
                style={{
                  background: "linear-gradient(135deg,#16A34A,#10B981)",
                  boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
                  textDecoration: "none",
                }}
              >
                Go to Shopping <ArrowRight style={{ width: 18, height: 18 }} />
              </Link>
            </div>
          </div>
        )}

        {/* ── SELLER logged in ── */}
        {userRole === "seller" && (
          <div className="role-card-wrap w-full max-w-md mx-auto">
            <div
              className="role-card bg-white rounded-3xl p-8 mb-8"
              style={{
                boxShadow: "0 8px 40px rgba(22,163,74,0.12)",
                border: "1px solid rgba(187,247,208,0.7)",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#BBF7D0,#DCFCE7)",
                }}
              >
                <Store style={{ width: 28, height: 28, color: "#059669" }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                Welcome Back, Seller!
              </h3>
              <p
                style={{
                  color: "#6B7280",
                  marginBottom: 24,
                  textAlign: "center",
                }}
              >
                Manage your store and products
              </p>
              <Link
                to="/seller/dashboard"
                className="cta-btn flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-full"
                style={{
                  background: "linear-gradient(135deg,#059669,#16A34A)",
                  boxShadow: "0 4px 16px rgba(5,150,105,0.35)",
                  textDecoration: "none",
                }}
              >
                Go to Dashboard <ArrowRight style={{ width: 18, height: 18 }} />
              </Link>
            </div>
          </div>
        )}

        {/* ── GUEST ── */}
        {!userRole && (
          <div className="guest-cards grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto mb-4">
            {/* Customer card */}
            <div
              className="choice-card group bg-white rounded-3xl p-8 text-left transition-all duration-300"
              style={{
                boxShadow: "0 4px 24px rgba(22,163,74,0.09)",
                border: "1px solid rgba(187,247,208,0.6)",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#DCFCE7,#BBF7D0)",
                }}
              >
                <ShoppingBag
                  style={{ width: 28, height: 28, color: "#16A34A" }}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                I'm a Customer
              </h3>
              <p
                style={{
                  color: "#6B7280",
                  textAlign: "center",
                  marginBottom: 20,
                  fontSize: 14,
                }}
              >
                Browse products and try them virtually before purchasing
              </p>
              <ul className="space-y-2.5 mb-7">
                {[
                  "Virtual try-on experience",
                  "Browse latest collections",
                  "Wishlist & favorites",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "#DCFCE7" }}
                    >
                      <Check
                        style={{ width: 11, height: 11, color: "#16A34A" }}
                      />
                    </span>
                    <span style={{ fontSize: 14, color: "#374151" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className="cta-btn block text-center py-3.5 text-white font-semibold rounded-full"
                style={{
                  background: "linear-gradient(135deg,#16A34A,#10B981)",
                  boxShadow: "0 4px 14px rgba(22,163,74,0.30)",
                  textDecoration: "none",
                }}
              >
                Start Shopping
              </Link>
            </div>

            {/* Seller card */}
            <div
              className="choice-card group bg-white rounded-3xl p-8 text-left transition-all duration-300"
              style={{
                boxShadow: "0 4px 24px rgba(5,150,105,0.09)",
                border: "1px solid rgba(167,243,208,0.6)",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#BBF7D0,#A7F3D0)",
                }}
              >
                <Store
                  style={{ width: 28, height: 28, color: "#059669" }}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                I'm a Seller
              </h3>
              <p
                style={{
                  color: "#6B7280",
                  textAlign: "center",
                  marginBottom: 20,
                  fontSize: 14,
                }}
              >
                Showcase your products with virtual try-on technology
              </p>
              <ul className="space-y-2.5 mb-7">
                {[
                  "Upload product catalog",
                  "Manage inventory",
                  "Track analytics",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "#D1FAE5" }}
                    >
                      <Check
                        style={{ width: 11, height: 11, color: "#059669" }}
                      />
                    </span>
                    <span style={{ fontSize: 14, color: "#374151" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className="cta-btn block text-center py-3.5 text-white font-semibold rounded-full"
                style={{
                  background: "linear-gradient(135deg,#059669,#10B981)",
                  boxShadow: "0 4px 14px rgba(5,150,105,0.30)",
                  textDecoration: "none",
                }}
              >
                Start Selling
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="relative py-24 px-4" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                color: "#15803D",
              }}
            >
              <Zap style={{ width: 14, height: 14 }} /> Why Choose Us
            </span>
            <h2
              className="font-bold"
              style={{
                fontSize: "clamp(32px,5vw,48px)",
                background: "linear-gradient(135deg,#15803D,#059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Why Choose Try-on?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "AI-Powered",
                desc: "Advanced AI technology for realistic virtual try-on experience",
                grad: ["#DCFCE7", "#BBF7D0"],
                iconCol: "#16A34A",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your data is encrypted and protected with industry-leading security",
                grad: ["#D1FAE5", "#A7F3D0"],
                iconCol: "#059669",
              },
              {
                icon: TrendingUp,
                title: "Growing Marketplace",
                desc: "Join thousands of sellers and millions of satisfied customers",
                grad: ["#ECFDF5", "#DCFCE7"],
                iconCol: "#10B981",
              },
              {
                icon: Heart,
                title: "Customer Focused",
                desc: "Built with love for the best shopping experience",
                grad: ["#F0FDF4", "#DCFCE7"],
                iconCol: "#16A34A",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="feature-card bg-white rounded-2xl p-6 transition-all duration-300"
                style={{
                  boxShadow: "0 2px 16px rgba(22,163,74,0.07)",
                  border: "1px solid rgba(187,247,208,0.5)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: `linear-gradient(135deg,${f.grad[0]},${f.grad[1]})`,
                  }}
                >
                  <f.icon style={{ width: 26, height: 26, color: f.iconCol }} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .hp-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* Blobs */
        .blob { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
        .blob-tl { top:-60px; left:-60px; width:480px; height:480px;
          background:radial-gradient(circle,rgba(74,222,128,0.20),transparent 70%);
          animation:blobFloat 12s ease-in-out infinite; }
        .blob-br { bottom:-80px; right:-80px; width:520px; height:520px;
          background:radial-gradient(circle,rgba(16,185,129,0.16),transparent 70%);
          animation:blobFloat 14s ease-in-out infinite; animation-delay:-5s; }
        .blob-c  { top:40%; left:50%; transform:translateX(-50%); width:360px; height:360px;
          background:radial-gradient(circle,rgba(22,163,74,0.09),transparent 70%);
          animation:blobCenter 16s ease-in-out infinite; animation-delay:-9s; }
        @keyframes blobFloat  { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(20px,-20px)scale(1.05)} }
        @keyframes blobCenter { 0%,100%{transform:translateX(-50%)scale(1)} 50%{transform:translateX(calc(-50% + 20px))scale(1.06)} }

        /* Loading spinner */
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Banner entrance */
        .banner-wrap { animation: heroIn 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .banner-img  { animation: imgReveal 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        @keyframes imgReveal { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }

        /* Hero brand */
        .hero-brand { animation: heroIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        @keyframes heroIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .role-card-wrap { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .guest-cards    { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        /* Card hovers */
        .choice-card:hover  { transform:translateY(-4px); box-shadow:0 12px 40px rgba(22,163,74,0.14) !important; }
        .feature-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(22,163,74,0.12) !important; }
        .role-card:hover    { transform:translateY(-3px); box-shadow:0 12px 40px rgba(22,163,74,0.16) !important; }

        /* CTA buttons */
        .cta-btn { transition: all 0.2s ease; }
        .cta-btn:hover  { transform:translateY(-2px); filter:brightness(1.07); box-shadow:0 8px 24px rgba(22,163,74,0.40) !important; }
        .cta-btn:active { transform:scale(0.98); }

        /* Responsive */
        @media (max-width: 640px) {
          .banner-img { max-height: 220px; object-position: center; }
          .logo-img   { max-width: 200px !important; }
        }
      `}</style>
    </div>
  );
};

export default UnifiedHomePage;
