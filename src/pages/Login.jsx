import React, { useState } from "react";
import { Leaf, Mail, Lock, Eye, EyeOff, X, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setLoading(false);

    if (!profile) {
      navigate("/role");
    } else if (profile.role === "admin") {
      navigate("/admin/dashboard");
    } else if (profile.role === "seller") {
      const { data: seller } = await supabase
        .from("seller_profiles")
        .select("approved")
        .eq("user_id", user.id)
        .single();

      if (!seller) {
        navigate("/seller/profile"); // first time
      } else if (!seller.approved) {
        navigate("/seller/pending");
      } else {
        navigate("/seller/dashboard");
      }
    } else if (profile.role === "customer") {
      navigate("/customer/dashboard");
    } else {
      navigate("/");
    }
  };

  const inp = (name) => ({
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(null),
    style: {
      width: "100%",
      padding: "12px 16px 12px 44px",
      border: `1px solid ${focusedField === name ? "#22C55E" : "#E5E7EB"}`,
      borderRadius: 12,
      outline: "none",
      fontSize: 14,
      color: "#111827",
      background: "#F9FAFB",
      boxShadow:
        focusedField === name ? "0 0 0 3px rgba(34,197,94,0.15)" : "none",
      transition: "all 0.2s ease",
    },
  });

  return (
    <div
      className="login-root min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,#F0FDF4 0%,#ffffff 50%,#ECFDF5 100%)",
      }}
    >
      {/* Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Dot grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.03 }}
      >
        <defs>
          <pattern
            id="login-dots"
            x="0"
            y="0"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.4" fill="#16A34A" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#login-dots)" />
      </svg>

      {/* Floating rings */}
      <div className="ring" />
      <div className="ring" />

      <div className="relative w-full max-w-md">
        {/* Close button */}
        <button
          onClick={() => navigate("/")}
          className="close-btn absolute -top-12 right-0 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200"
          aria-label="Close login"
          style={{ border: "1px solid #E5E7EB" }}
        >
          <X style={{ width: 16, height: 16, color: "#6B7280" }} />
        </button>

        {/* Card */}
        <div
          className="card bg-white rounded-3xl overflow-hidden"
          style={{
            boxShadow:
              "0 8px 48px rgba(22,163,74,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid rgba(187,247,208,0.7)",
          }}
        >
          {/* Top shimmer bar */}
          <div
            className="h-1.5"
            style={{
              background:
                "linear-gradient(90deg,#16A34A,#10B981,#22C55E,#10B981,#16A34A)",
              backgroundSize: "200% 100%",
              animation: "shimBar 3s linear infinite",
            }}
          />

          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              {/* Animated logo mark */}
              <div
                className="logo-mark w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative"
                style={{
                  background: "linear-gradient(135deg,#16A34A,#10B981)",
                  boxShadow: "0 6px 24px rgba(22,163,74,0.35)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    animation: "logoGlow 2.5s ease-in-out infinite",
                  }}
                />
                <Leaf
                  style={{
                    width: 28,
                    height: 28,
                    color: "#fff",
                    animation: "leafSway 4s ease-in-out infinite",
                  }}
                />
              </div>

              <h1
                className="font-bold text-center mb-1"
                style={{
                  fontSize: 28,
                  background: "linear-gradient(135deg,#15803D,#059669)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Welcome to Try-on
              </h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 7,
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 16,
                      height: 16,
                      color: focusedField === "email" ? "#16A34A" : "#9CA3AF",
                      transition: "color 0.2s",
                    }}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    {...inp("email")}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 7,
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 16,
                      height: 16,
                      color:
                        focusedField === "password" ? "#16A34A" : "#9CA3AF",
                      transition: "color 0.2s",
                    }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    {...inp("password")}
                    style={{ ...inp("password").style, paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9CA3AF",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {showPassword ? (
                      <EyeOff style={{ width: 16, height: 16 }} />
                    ) : (
                      <Eye style={{ width: 16, height: 16 }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div style={{ textAlign: "right" }}>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#16A34A",
                    textDecoration: "none",
                  }}
                  className="forgot-link"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="submit-btn w-full flex items-center justify-center gap-2 py-3.5 text-white font-semibold rounded-xl transition-all duration-200"
                style={{
                  background: loading
                    ? "linear-gradient(135deg,#86EFAC,#6EE7B7)"
                    : "linear-gradient(135deg,#16A34A,#10B981)",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 16px rgba(22,163,74,0.32)",
                  fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                  border: "none",
                }}
              >
                {loading ? (
                  <>
                    <span className="spin-ring" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight style={{ width: 17, height: 17 }} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 1,
                    background: "#F0FDF4",
                    border: "none",
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    padding: "0 14px",
                    background: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#9CA3AF",
                    letterSpacing: "0.05em",
                  }}
                >
                  OR
                </span>
              </div>
            </div>

            {/* Sign up */}
            <div
              style={{ textAlign: "center", fontSize: 14, color: "#6B7280" }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="signup-link"
                style={{
                  color: "#16A34A",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#9CA3AF",
            marginTop: 20,
          }}
        >
          © 2025 Try-on ·{" "}
          <Link
            to="/privacy"
            style={{ color: "#16A34A", textDecoration: "none" }}
          >
            Privacy Policy
          </Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .login-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .blob-1 { top:-70px; left:-70px; width:380px; height:380px;
          background:radial-gradient(circle,rgba(74,222,128,0.18),transparent 70%);
          animation:lBlob 10s ease-in-out infinite; }
        .blob-2 { bottom:-80px; right:-60px; width:420px; height:420px;
          background:radial-gradient(circle,rgba(16,185,129,0.14),transparent 70%);
          animation:lBlob 12s ease-in-out infinite; animation-delay:-4s; }
        .blob-3 { top:40%; left:50%; width:260px; height:260px;
          background:radial-gradient(circle,rgba(22,163,74,0.08),transparent 70%);
          animation:lBlob3 14s ease-in-out infinite; animation-delay:-7s; }
        @keyframes lBlob  { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(16px,-16px)scale(1.04)} }
        @keyframes lBlob3 { 0%,100%{transform:translateX(-50%)scale(1)} 50%{transform:translateX(calc(-50% + 16px))scale(1.06)} }

        .ring {
          position:absolute; border-radius:50%;
          border:1px solid rgba(22,163,74,0.07);
          pointer-events:none;
          animation:ringExpand 7s ease-out infinite;
        }
        .ring-1 { width:320px;height:320px;top:50%;left:50%;transform:translate(-50%,-50%);animation-delay:0s; }
        .ring-2 { width:540px;height:540px;top:50%;left:50%;transform:translate(-50%,-50%);animation-delay:2.5s; }
        @keyframes ringExpand {
          0%   { opacity:0.4; transform:translate(-50%,-50%)scale(0.88); }
          100% { opacity:0;   transform:translate(-50%,-50%)scale(1.08); }
        }

        .card { animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes cardIn { from{opacity:0;transform:translateY(24px)scale(0.98)} to{opacity:1;transform:translateY(0)scale(1)} }

        .logo-mark { animation: logoIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
        @keyframes logoIn { from{opacity:0;transform:scale(0.6)rotate(-15deg)} to{opacity:1;transform:scale(1)rotate(0)} }

        @keyframes logoGlow { 0%,100%{opacity:0.08} 50%{opacity:0.18} }
        @keyframes leafSway { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(12deg)} }
        @keyframes shimBar  { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

        .close-btn:hover { background:#F0FDF4 !important; border-color:#BBF7D0 !important; transform:scale(1.08); }

        .forgot-link:hover { color:#15803D !important; text-decoration:underline; }
        .signup-link:hover  { color:#15803D !important; text-decoration:underline; }

        .submit-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          filter:brightness(1.07);
          box-shadow:0 8px 24px rgba(22,163,74,0.38) !important;
        }
        .submit-btn:active:not(:disabled) { transform:scale(0.99); }

        @keyframes spin { to{transform:rotate(360deg)} }
        .spin-ring {
          display:inline-block; width:17px; height:17px;
          border-radius:50%;
          border:2px solid rgba(255,255,255,0.35);
          border-top-color:#fff;
          animation:spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
