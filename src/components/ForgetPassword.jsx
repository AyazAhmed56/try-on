import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, RefreshCw } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div
      className="fp-root min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #F0FDF4 0%, #ffffff 50%, #ECFDF5 100%)",
      }}
    >
      {/* Animated blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Dot grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.035 }}
      >
        <defs>
          <pattern
            id="fp-dots"
            x="0"
            y="0"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.4" fill="#16A34A" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fp-dots)" />
      </svg>

      {/* Floating rings */}
      <div className="ring" />
      <div className="ring" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="card bg-white rounded-3xl overflow-hidden"
          style={{
            boxShadow:
              "0 8px 48px rgba(22,163,74,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid rgba(187,247,208,0.6)",
          }}
        >
          {/* Top green accent bar */}
          <div
            className="h-1.5 w-full"
            style={{
              background:
                "linear-gradient(90deg, #16A34A, #10B981, #22C55E, #10B981, #16A34A)",
              backgroundSize: "200% 100%",
              animation: "slideBar 3s linear infinite",
            }}
          />

          <div className="p-8 md:p-10">
            {!isSubmitted ? (
              <div className="form-view">
                {/* Header */}
                <div className="text-center mb-8">
                  <div
                    className="icon-wrap w-18 h-18 mx-auto mb-5 relative"
                    style={{ width: 72, height: 72 }}
                  >
                    {/* Outer ring */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "rgba(22,163,74,0.08)",
                        animation: "outerPulse 2.5s ease-in-out infinite",
                      }}
                    />
                    <div
                      className="absolute inset-2 rounded-full"
                      style={{ background: "rgba(22,163,74,0.12)" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #16A34A, #10B981)",
                          boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
                        }}
                      >
                        <Mail className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>

                  <h1
                    className="text-3xl font-bold mb-2"
                    style={{
                      background: "linear-gradient(135deg, #15803D, #059669)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Forgot Password?
                  </h1>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    No worries! Enter your email and we'll send you reset
                    instructions.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "#374151" }}
                    >
                      Email Address
                    </label>
                    <div className="input-wrap relative">
                      <Mail
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-200"
                        style={{
                          width: 18,
                          height: 18,
                          color: isFocused ? "#16A34A" : "#9CA3AF",
                        }}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="you@example.com"
                        required
                        className="w-full py-3 pr-4 bg-gray-50 rounded-xl border outline-none transition-all duration-200"
                        style={{
                          paddingLeft: 44,
                          borderColor: isFocused ? "#22C55E" : "#E5E7EB",
                          boxShadow: isFocused
                            ? "0 0 0 3px rgba(34,197,94,0.15)"
                            : "none",
                          fontSize: 14,
                          color: "#111827",
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit-btn w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-200"
                    style={{
                      background:
                        "linear-gradient(135deg, #16A34A 0%, #10B981 100%)",
                      boxShadow: "0 4px 16px rgba(22,163,74,0.30)",
                      fontSize: 15,
                    }}
                  >
                    Send Reset Link
                  </button>
                </form>

                {/* Back */}
                <div className="mt-7 text-center">
                  <Link
                    to="/login"
                    className="back-link inline-flex items-center gap-2 font-medium text-sm transition-all duration-200"
                    style={{ color: "#16A34A" }}
                  >
                    <span
                      className="back-arrow-wrap w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200"
                      style={{ borderColor: "#BBF7D0", background: "#F0FDF4" }}
                    >
                      <ArrowLeft style={{ width: 14, height: 14 }} />
                    </span>
                    Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              <div className="success-view text-center">
                {/* Success icon */}
                <div
                  className="mx-auto mb-5 relative"
                  style={{ width: 80, height: 80 }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(22,163,74,0.08)",
                      animation: "outerPulse 2.5s ease-in-out infinite",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center success-bounce"
                      style={{
                        background: "linear-gradient(135deg, #16A34A, #10B981)",
                        boxShadow: "0 4px 20px rgba(22,163,74,0.35)",
                      }}
                    >
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-500 text-sm mb-1">
                  We've sent reset instructions to
                </p>
                <p
                  className="font-semibold mb-6 text-base"
                  style={{ color: "#15803D" }}
                >
                  {email}
                </p>

                {/* Info box */}
                <div
                  className="rounded-2xl p-4 mb-7 text-left"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "#DCFCE7" }}
                    >
                      <Mail
                        style={{ width: 15, height: 15, color: "#16A34A" }}
                      />
                    </div>
                    <p
                      className="text-sm"
                      style={{ color: "#374151", lineHeight: 1.6 }}
                    >
                      Didn't receive the email? Check your spam folder or{" "}
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="font-semibold underline underline-offset-2 transition-colors"
                        style={{ color: "#16A34A" }}
                      >
                        try again
                      </button>
                    </p>
                  </div>
                </div>

                {/* Resend button */}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full py-3 mb-4 font-semibold rounded-xl border transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    borderColor: "#BBF7D0",
                    color: "#16A34A",
                    background: "#F0FDF4",
                    fontSize: 14,
                  }}
                >
                  <RefreshCw style={{ width: 15, height: 15 }} />
                  Resend Email
                </button>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 font-medium text-sm transition-colors"
                  style={{ color: "#16A34A" }}
                >
                  <ArrowLeft style={{ width: 14, height: 14 }} />
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-xs mt-5" style={{ color: "#9CA3AF" }}>
          © 2025 Try-on ·{" "}
          <Link to="/privacy" style={{ color: "#16A34A" }}>
            Privacy Policy
          </Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .fp-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(72px);
          pointer-events: none;
          animation: floatBlob 9s ease-in-out infinite;
        }
        .blob-1 {
          top: -60px; left: -60px;
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(74,222,128,0.18), transparent 70%);
          animation-duration: 10s;
        }
        .blob-2 {
          bottom: -80px; right: -60px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(16,185,129,0.14), transparent 70%);
          animation-duration: 12s;
          animation-delay: -4s;
        }
        .blob-3 {
          top: 40%; left: 50%;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(22,163,74,0.08), transparent 70%);
          animation-duration: 15s;
          animation-delay: -7s;
          transform: translateX(-50%);
        }
        @keyframes floatBlob {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(16px,-16px) scale(1.04); }
          66%      { transform: translate(-12px,12px) scale(0.97); }
        }
        .blob-3 { animation-name: floatBlob3; }
        @keyframes floatBlob3 {
          0%,100% { transform: translateX(-50%) scale(1); }
          50%      { transform: translateX(calc(-50% + 18px)) scale(1.06); }
        }

        .ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(22,163,74,0.08);
          pointer-events: none;
          animation: expandRing 6s ease-out infinite;
        }
        .ring-1 { width: 320px; height: 320px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation-delay: 0s; }
        .ring-2 { width: 520px; height: 520px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation-delay: 2s; }
        @keyframes expandRing {
          0%   { opacity: 0.4; transform: translate(-50%,-50%) scale(0.9); }
          100% { opacity: 0;   transform: translate(-50%,-50%) scale(1.1); }
        }

        .card {
          animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .form-view { animation: fadeSlide 0.35s ease both; }
        .success-view { animation: fadeSlide 0.35s ease both; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes outerPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.12); opacity: 0.6; }
        }

        .success-bounce {
          animation: successBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes successBounce {
          from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        @keyframes slideBar {
          0%   { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }

        .submit-btn:hover {
          background: linear-gradient(135deg, #15803D 0%, #059669 100%) !important;
          box-shadow: 0 6px 20px rgba(22,163,74,0.40) !important;
          transform: translateY(-1px);
        }
        .submit-btn:active { transform: translateY(0) scale(0.99); }

        .back-link:hover { color: #15803D !important; }
        .back-link:hover .back-arrow-wrap {
          background: #16A34A !important;
          border-color: #16A34A !important;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
