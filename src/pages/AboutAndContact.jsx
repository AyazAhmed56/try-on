import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Users,
  Shirt,
  Zap,
  Shield,
  ArrowRight,
  Leaf,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutAndContact() {
  const [activePage, setActivePage] = useState("about");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "customer",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        userType: "customer",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "12px 16px",
    border: `1px solid ${focusedField === field ? "#22C55E" : "#E5E7EB"}`,
    borderRadius: 12,
    outline: "none",
    fontSize: 14,
    color: "#111827",
    background: "#F9FAFB",
    boxShadow:
      focusedField === field ? "0 0 0 3px rgba(34,197,94,0.15)" : "none",
    transition: "all 0.2s ease",
  });

  return (
    <div
      className="ac-root min-h-screen"
      style={{
        background:
          "linear-gradient(160deg,#F0FDF4 0%,#ffffff 45%,#ECFDF5 100%)",
      }}
    >
      {/* Background blobs */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.025 }}
        >
          <defs>
            <pattern
              id="ac-dots"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.4" fill="#16A34A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ac-dots)" />
        </svg>
      </div>

      {/* ── NAVBAR ── */}
      <nav
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b"
        style={{
          borderColor: "rgba(187,247,208,0.6)",
          boxShadow: "0 1px 16px rgba(22,163,74,0.07)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              style={{ textDecoration: "none" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                style={{
                  background: "linear-gradient(135deg,#16A34A,#10B981)",
                  boxShadow: "0 2px 10px rgba(22,163,74,0.30)",
                }}
              >
                <Leaf style={{ width: 18, height: 18, color: "#fff" }} />
              </div>
              <span
                className="font-bold text-xl"
                style={{
                  background: "linear-gradient(135deg,#15803D,#059669)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Try-on
              </span>
            </Link>

            {/* Tab switcher */}
            <div
              className="flex gap-1 rounded-xl p-1"
              style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
            >
              {["about", "contact"].map((page) => (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className="tab-btn px-6 py-2 rounded-lg font-medium text-sm capitalize transition-all duration-200"
                  style={{
                    background: activePage === page ? "#16A34A" : "transparent",
                    color: activePage === page ? "#fff" : "#374151",
                    boxShadow:
                      activePage === page
                        ? "0 2px 8px rgba(22,163,74,0.30)"
                        : "none",
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════ ABOUT PAGE ══════════════ */}
      {activePage === "about" && (
        <div
          className="about-view relative max-w-6xl mx-auto px-4 py-14"
          style={{ zIndex: 1 }}
        >
          {/* Hero */}
          <div className="text-center mb-16">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                color: "#15803D",
              }}
            >
              <Leaf style={{ width: 13, height: 13 }} /> Our Story
            </span>
            <h1
              className="font-bold mb-4"
              style={{
                fontSize: "clamp(36px,6vw,56px)",
                background: "linear-gradient(135deg,#15803D,#059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              About Try-on
            </h1>
            <p
              style={{
                fontSize: 18,
                color: "#6B7280",
                maxWidth: 640,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Revolutionizing online shopping with virtual try-on technology
              that bridges the gap between sellers and customers
            </p>
          </div>

          {/* Mission card */}
          <div
            className="mission-card bg-white rounded-3xl p-8 mb-10 relative overflow-hidden"
            style={{
              boxShadow: "0 4px 32px rgba(22,163,74,0.09)",
              border: "1px solid rgba(187,247,208,0.7)",
            }}
          >
            {/* Accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{
                background:
                  "linear-gradient(90deg,#16A34A,#10B981,#4ADE80,#10B981,#16A34A)",
                backgroundSize: "200% 100%",
                animation: "slideBar 3s linear infinite",
              }}
            />
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-1"
                style={{
                  background: "linear-gradient(135deg,#DCFCE7,#BBF7D0)",
                }}
              >
                <Leaf style={{ width: 22, height: 22, color: "#16A34A" }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Our Mission
                </h2>
                <p style={{ fontSize: 16, color: "#4B5563", lineHeight: 1.8 }}>
                  At Try-on, we believe online shopping should be as confident
                  as in-store experiences. Our platform empowers customers to
                  virtually try on products before purchasing, while helping
                  sellers reduce returns and increase customer satisfaction.
                  We're building the future of e-commerce, one virtual fitting
                  room at a time.
                </p>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              {
                icon: Users,
                title: "For Customers",
                iconBg: "#DCFCE7",
                iconCol: "#16A34A",
                cardBg: "linear-gradient(135deg,#F0FDF4,#ECFDF5)",
                border: "#BBF7D0",
                text: "Try on clothes virtually using our advanced AR technology. See how items look on you before buying, ensuring perfect fit and style every time. Shop with confidence from the comfort of your home.",
              },
              {
                icon: Shirt,
                title: "For Sellers",
                iconBg: "#D1FAE5",
                iconCol: "#059669",
                cardBg: "linear-gradient(135deg,#ECFDF5,#F0FDF4)",
                border: "#A7F3D0",
                text: "Reduce return rates and increase conversion with virtual try-on. Provide customers with an immersive shopping experience that builds trust and drives sales. Showcase your products like never before.",
              },
              {
                icon: Zap,
                title: "Instant Results",
                iconBg: "#FEF9C3",
                iconCol: "#CA8A04",
                cardBg: "linear-gradient(135deg,#FEFCE8,#FEF9C3)",
                border: "#FDE68A",
                text: "Our real-time rendering technology provides instant virtual try-on experiences. No waiting, no complicated setup. Just upload your photo and start trying on products immediately.",
              },
              {
                icon: Shield,
                title: "Privacy First",
                iconBg: "#DBEAFE",
                iconCol: "#2563EB",
                cardBg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
                border: "#BFDBFE",
                text: "Your privacy is our priority. All virtual try-on sessions are processed securely, and we never store your photos without permission. Shop safely with complete peace of mind.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="feature-card rounded-2xl p-7 transition-all duration-300"
                style={{
                  background: f.cardBg,
                  border: `1px solid ${f.border}`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.iconBg }}
                >
                  <f.icon style={{ width: 22, height: 22, color: f.iconCol }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7 }}>
                  {f.text}
                </p>
              </div>
            ))}
          </div>

          {/* Stats banner */}
          <div
            className="stats-banner rounded-3xl p-10 text-white relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg,#15803D 0%,#16A34A 50%,#059669 100%)",
              boxShadow: "0 8px 40px rgba(22,163,74,0.30)",
            }}
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 border border-white/10" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-white/5 border border-white/10" />
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",
                animation: "slideBar 2.5s linear infinite",
              }}
            />
            <div className="relative grid md:grid-cols-3 gap-8 text-center">
              {[
                { value: "500K+", label: "Active Users" },
                { value: "50K+", label: "Partner Sellers" },
                { value: "40%", label: "Reduced Returns" },
              ].map((s, i) => (
                <div key={i} className="stat-item">
                  <div
                    className="font-bold mb-1"
                    style={{ fontSize: 44, lineHeight: 1.1 }}
                  >
                    {s.value}
                  </div>
                  <div style={{ color: "#BBF7D0", fontSize: 15 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ CONTACT PAGE ══════════════ */}
      {activePage === "contact" && (
        <div
          className="contact-view relative max-w-6xl mx-auto px-4 py-14"
          style={{ zIndex: 1 }}
        >
          {/* Hero */}
          <div className="text-center mb-12">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                color: "#15803D",
              }}
            >
              <Mail style={{ width: 13, height: 13 }} /> We're here to help
            </span>
            <h1
              className="font-bold mb-3"
              style={{
                fontSize: "clamp(36px,6vw,56px)",
                background: "linear-gradient(135deg,#15803D,#059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Get In Touch
            </h1>
            <p
              style={{
                fontSize: 17,
                color: "#6B7280",
                maxWidth: 520,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Whether you're a customer or a seller, we'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Contact info */}
            <div className="space-y-6">
              <div
                className="bg-white rounded-3xl p-8"
                style={{
                  boxShadow: "0 4px 28px rgba(22,163,74,0.08)",
                  border: "1px solid rgba(187,247,208,0.6)",
                }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-7">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      icon: Mail,
                      bg: "#DCFCE7",
                      col: "#16A34A",
                      title: "Email",
                      lines: ["support@tryon.com", "sellers@tryon.com"],
                    },
                    {
                      icon: Phone,
                      bg: "#DBEAFE",
                      col: "#2563EB",
                      title: "Phone",
                      lines: ["+1 (555) 123-4567", "Mon-Fri, 9AM-6PM EST"],
                    },
                    {
                      icon: MapPin,
                      bg: "#D1FAE5",
                      col: "#059669",
                      title: "Address",
                      lines: ["123 Fashion Street", "New York, NY 10001"],
                    },
                    {
                      icon: Clock,
                      bg: "#FEF9C3",
                      col: "#CA8A04",
                      title: "Business Hours",
                      lines: [
                        "Monday – Friday: 9AM – 6PM",
                        "Saturday – Sunday: Closed",
                      ],
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="contact-info-row flex items-start gap-4 group"
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                        style={{ background: item.bg }}
                      >
                        <item.icon
                          style={{ width: 20, height: 20, color: item.col }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                          {item.title}
                        </h3>
                        {item.lines.map((l, j) => (
                          <p
                            key={j}
                            style={{
                              fontSize: 13,
                              color: j === 1 ? "#9CA3AF" : "#4B5563",
                            }}
                          >
                            {l}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick support card */}
              <div
                className="rounded-3xl p-7 text-white relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg,#15803D,#059669)",
                  boxShadow: "0 4px 24px rgba(22,163,74,0.25)",
                }}
              >
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 border border-white/10" />
                <div className="relative">
                  <h3 className="text-lg font-bold mb-2">Quick Support</h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#DCFCE7",
                      marginBottom: 16,
                      lineHeight: 1.6,
                    }}
                  >
                    For immediate assistance, check out our Help Center with
                    FAQs for both customers and sellers.
                  </p>
                  <button
                    className="inline-flex items-center gap-2 font-semibold rounded-xl px-5 py-2.5 transition-all duration-200"
                    style={{
                      background: "#fff",
                      color: "#16A34A",
                      fontSize: 14,
                    }}
                  >
                    Visit Help Center{" "}
                    <ArrowRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Contact form */}
            <div
              className="bg-white rounded-3xl p-8"
              style={{
                boxShadow: "0 4px 28px rgba(22,163,74,0.08)",
                border: "1px solid rgba(187,247,208,0.6)",
              }}
            >
              {/* Top shimmer bar */}
              <div
                className="h-1 rounded-full mb-7 -mt-1"
                style={{
                  background:
                    "linear-gradient(90deg,#16A34A,#10B981,#4ADE80,#10B981,#16A34A)",
                  backgroundSize: "200% 100%",
                  animation: "slideBar 3s linear infinite",
                }}
              />

              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              {submitted ? (
                <div className="flex flex-col items-center text-center py-8 success-appear">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: "linear-gradient(135deg,#16A34A,#10B981)",
                      boxShadow: "0 4px 20px rgba(22,163,74,0.35)",
                    }}
                  >
                    <CheckCircle
                      style={{ width: 36, height: 36, color: "#fff" }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Message Sent!
                  </h3>
                  <p style={{ color: "#6B7280", fontSize: 15 }}>
                    We'll get back to you within 24 hours.
                  </p>
                  <div
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5"
                    style={{
                      background: "#F0FDF4",
                      border: "1px solid #BBF7D0",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#22C55E",
                        display: "inline-block",
                        animation: "pulseDot 1.8s ease-in-out infinite",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#15803D",
                      }}
                    >
                      Response expected within 24h
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    {
                      label: "Full Name",
                      name: "name",
                      type: "text",
                      placeholder: "John Doe",
                    },
                    {
                      label: "Email Address",
                      name: "email",
                      type: "email",
                      placeholder: "john@example.com",
                    },
                    {
                      label: "Subject",
                      name: "subject",
                      type: "text",
                      placeholder: "How can we help?",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#374151",
                          marginBottom: 7,
                        }}
                      >
                        {field.label} *
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder={field.placeholder}
                        style={inputStyle(field.name)}
                      />
                    </div>
                  ))}

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
                      I am a *
                    </label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("userType")}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle("userType")}
                    >
                      <option value="customer">Customer</option>
                      <option value="seller">Seller</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

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
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      style={{ ...inputStyle("message"), resize: "none" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn w-full flex items-center justify-center gap-2 py-3.5 text-white font-semibold rounded-xl transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg,#16A34A,#10B981)",
                      boxShadow: "0 4px 14px rgba(22,163,74,0.30)",
                      fontSize: 15,
                    }}
                  >
                    <Send style={{ width: 17, height: 17 }} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer
        className="relative mt-20"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(135deg,#052E16 0%,#14532D 50%,#052E16 100%)",
        }}
      >
        {/* shimmer top */}
        <div
          className="h-0.5"
          style={{
            background:
              "linear-gradient(90deg,transparent,#22C55E,#10B981,#4ADE80,#10B981,#22C55E,transparent)",
            backgroundSize: "300% 100%",
            animation: "slideBar 3s linear infinite",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                <Leaf style={{ width: 16, height: 16, color: "#4ADE80" }} />
              </div>
              <span className="font-bold text-white">Try-on</span>
            </div>
            <p style={{ color: "rgba(187,247,208,0.55)", fontSize: 13 }}>
              © 2025 Try-on. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ac-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .blob { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
        .blob-tl { top:-60px; left:-60px; width:460px; height:460px;
          background:radial-gradient(circle,rgba(74,222,128,0.18),transparent 70%);
          animation:acBlob 11s ease-in-out infinite; }
        .blob-br { bottom:-80px; right:-80px; width:500px; height:500px;
          background:radial-gradient(circle,rgba(16,185,129,0.14),transparent 70%);
          animation:acBlob 13s ease-in-out infinite; animation-delay:-5s; }
        @keyframes acBlob { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(16px,-16px)scale(1.04)} }

        /* Page view fade in */
        .about-view   { animation: pageIn 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        .contact-view { animation: pageIn 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes pageIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        /* Feature cards hover */
        .feature-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(22,163,74,0.10); }
        .mission-card:hover  { box-shadow:0 8px 36px rgba(22,163,74,0.12) !important; }
        .stat-item { animation: statPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .stat-item:nth-child(1) { animation-delay: 0.1s; }
        .stat-item:nth-child(2) { animation-delay: 0.2s; }
        .stat-item:nth-child(3) { animation-delay: 0.3s; }
        @keyframes statPop { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }

        /* Contact info row hover */
        .contact-info-row:hover > div:first-child { transform: scale(1.08); }

        /* Submit button */
        .submit-btn:hover  { transform:translateY(-2px); box-shadow:0 8px 24px rgba(22,163,74,0.38) !important; }
        .submit-btn:active { transform:scale(0.98); }

        /* Tab buttons */
        .tab-btn:hover { background: rgba(22,163,74,0.08) !important; }

        /* Success animation */
        .success-appear { animation: successIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes successIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }

        /* Pulsing dot */
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* Shimmer bar */
        @keyframes slideBar { 0%{background-position:100% 0} 100%{background-position:-100% 0} }
      `}</style>
    </div>
  );
}
