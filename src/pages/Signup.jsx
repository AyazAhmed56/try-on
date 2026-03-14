import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, X, UserPlus, Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created! Please login.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(22,163,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.04) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-125 h-125 bg-green-100 rounded-full blur-3xl opacity-60 animate-blob" />
      <div className="absolute -bottom-32 -right-32 w-125 h-125 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-green-50 rounded-full blur-2xl opacity-40 animate-blob animation-delay-4000" />

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute -top-14 right-0 flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 transition-colors duration-200 group"
          aria-label="Close"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          <span className="font-medium">Close</span>
        </button>

        {/* Card */}
        <div className="bg-white border border-green-100 rounded-3xl shadow-[0_8px_40px_rgba(22,163,74,0.10)] p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-200 mb-5">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1.5">
              Create your account
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Join Try-on and start your virtual try-on journey
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSignup}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200"
                  style={{ width: "18px", height: "18px" }}
                />
                <input
                  type="email"
                  name="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200"
                  style={{ width: "18px", height: "18px" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full pl-10 pr-11 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff style={{ width: "18px", height: "18px" }} />
                  ) : (
                    <Eye style={{ width: "18px", height: "18px" }} />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 pt-1">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600 cursor-pointer"
                />
              </div>
              <label
                htmlFor="terms"
                className="text-sm text-gray-500 leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-green-600 hover:text-green-700 font-semibold underline underline-offset-2"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-green-600 hover:text-green-700 font-semibold underline underline-offset-2"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3 rounded-xl font-semibold text-sm text-white overflow-hidden group transition-all duration-200 shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 active:scale-[0.98] disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg, #16a34a, #059669)",
              }}
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-xl" />
              <span className="relative flex items-center justify-center gap-2">
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
                    Creating account…
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-xs text-gray-400 font-medium tracking-widest uppercase">
                or
              </span>
            </div>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              Sign in →
            </Link>
          </p>
        </div>

        {/* Subtle brand footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Protected by industry-standard encryption
        </p>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.97); }
        }
        .animate-blob { animation: blob 10s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
};

export default Signup;
