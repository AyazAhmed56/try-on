import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Cookie,
  Shield,
  Settings,
  Info,
  CheckCircle,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";

const cookieTypes = [
  {
    icon: Shield,
    title: "Essential Cookies",
    description:
      "These cookies are necessary for the website to function properly. They enable basic features like page navigation, secure areas access, and authentication.",
    examples: "Session cookies, security cookies, load balancing cookies",
    duration: "Session-based (deleted when you close your browser)",
    badge: "Always Active",
    scheme: {
      bg: "#F0FDF4",
      border: "#BBF7D0",
      iconColor: "#16A34A",
      badgeBg: "#DCFCE7",
      badgeText: "#15803D",
      durationColor: "#15803D",
    },
  },
  {
    icon: Settings,
    title: "Performance Cookies",
    description:
      "These cookies help us understand how visitors interact with our platform by collecting and reporting information anonymously.",
    examples: "Google Analytics, page load times, error tracking",
    duration: "Up to 2 years",
    badge: "Analytics",
    scheme: {
      bg: "#EFF6FF",
      border: "#BFDBFE",
      iconColor: "#2563EB",
      badgeBg: "#DBEAFE",
      badgeText: "#1D4ED8",
      durationColor: "#1D4ED8",
    },
  },
  {
    icon: CheckCircle,
    title: "Functionality Cookies",
    description:
      "These cookies allow the website to remember choices you make and provide enhanced, personalized features.",
    examples: "Language preferences, user settings, recently viewed items",
    duration: "Up to 1 year",
    badge: "Personalization",
    scheme: {
      bg: "#ECFDF5",
      border: "#A7F3D0",
      iconColor: "#059669",
      badgeBg: "#D1FAE5",
      badgeText: "#065F46",
      durationColor: "#065F46",
    },
  },
  {
    icon: Cookie,
    title: "Targeting / Advertising",
    description:
      "These cookies are used to deliver advertisements more relevant to you and your interests. They also help measure the effectiveness of advertising campaigns.",
    examples: "Facebook Pixel, Google Ads, retargeting cookies",
    duration: "Up to 2 years",
    badge: "Marketing",
    scheme: {
      bg: "#FFF7ED",
      border: "#FED7AA",
      iconColor: "#EA580C",
      badgeBg: "#FFEDD5",
      badgeText: "#9A3412",
      durationColor: "#9A3412",
    },
  },
];

const CookiePolicy = () => {
  return (
    <div
      className="cp-root min-h-screen py-12 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #F0FDF4 0%, #ffffff 50%, #ECFDF5 100%)",
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
            id="cp-dots"
            x="0"
            y="0"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.4" fill="#16A34A" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cp-dots)" />
      </svg>

      <div className="relative max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="back-btn inline-flex items-center gap-2 font-medium mb-8 transition-all group"
          style={{ color: "#16A34A", textDecoration: "none" }}
        >
          <span
            className="w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 group-hover:bg-green-600 group-hover:border-green-600"
            style={{
              background: "#fff",
              borderColor: "#BBF7D0",
              boxShadow: "0 1px 4px rgba(22,163,74,0.10)",
            }}
          >
            <ArrowLeft
              style={{ width: 14, height: 14 }}
              className="group-hover:text-white transition-colors"
            />
          </span>
          Back to Home
        </Link>

        {/* Main Card */}
        <div
          className="main-card bg-white rounded-3xl overflow-hidden"
          style={{
            boxShadow:
              "0 8px 48px rgba(22,163,74,0.10), 0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid rgba(187,247,208,0.7)",
          }}
        >
          {/* Header Banner */}
          <div
            className="relative overflow-hidden px-8 md:px-12 py-10"
            style={{
              background:
                "linear-gradient(135deg, #15803D 0%, #16A34A 50%, #059669 100%)",
            }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full border border-white/10 bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full border border-white/10 bg-white/5" />
            <div className="absolute top-6 right-40 w-20 h-20 rounded-full bg-emerald-400/20" />

            <div className="relative flex items-center gap-4">
              <div
                className="icon-badge w-14 h-14 rounded-2xl flex items-center justify-center border border-white/20"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                }}
              >
                <Cookie className="w-7 h-7 text-white" />
              </div>
              <div>
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 mb-2"
                  style={{
                    background: "rgba(74,222,128,0.20)",
                    border: "1px solid rgba(74,222,128,0.30)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-green-300"
                    style={{ animation: "pulseDot 1.8s ease-in-out infinite" }}
                  />
                  <span
                    style={{
                      color: "#DCFCE7",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                    }}
                  >
                    Legal Document
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Cookie Policy
                </h1>
                <p style={{ color: "#BBF7D0", fontSize: 13, marginTop: 4 }}>
                  Last updated: January 27, 2026
                </p>
              </div>
            </div>

            {/* Cookie type count strip */}
            <div className="relative mt-7 grid grid-cols-4 gap-3">
              {["Essential", "Performance", "Functional", "Advertising"].map(
                (t, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-3 py-2 text-center"
                    style={{
                      background: "rgba(255,255,255,0.10)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div
                      style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}
                    >
                      {["✓", "2yr", "1yr", "2yr"][i]}
                    </div>
                    <div
                      style={{ color: "#BBF7D0", fontSize: 11, marginTop: 2 }}
                    >
                      {t}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 md:px-12 py-10 space-y-8">
            {/* 1. What Are Cookies */}
            <section className="section-card">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="sec-icon w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <Info style={{ width: 18, height: 18, color: "#16A34A" }} />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#16A34A",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    01
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    What Are Cookies?
                  </h2>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files that are placed on your computer or
                mobile device when you visit a website. They are widely used to
                make websites work more efficiently and provide information to
                website owners. Cookies help us understand how you use our
                platform and improve your experience.
              </p>
            </section>

            {/* 2. How We Use Cookies */}
            <section className="section-card">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="sec-icon w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <Settings
                    style={{ width: 18, height: 18, color: "#16A34A" }}
                  />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#16A34A",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    02
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    How We Use Cookies
                  </h2>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Try-on uses cookies for various purposes to enhance your
                experience on our virtual outfit trial platform:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "To remember your login information and preferences",
                  "To understand how you navigate through our website",
                  "To improve our virtual try-on technology and services",
                  "To provide personalized product recommendations",
                  "To analyze site performance and user behavior",
                  "To prevent fraud and ensure platform security",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                    style={{
                      background: "#F0FDF4",
                      border: "1px solid #DCFCE7",
                    }}
                  >
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "#22C55E" }}
                    />
                    <span style={{ fontSize: 13, color: "#374151" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Cookie Types */}
            <section className="section-card">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="sec-icon w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <Cookie style={{ width: 18, height: 18, color: "#16A34A" }} />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#16A34A",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    03
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Types of Cookies We Use
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {cookieTypes.map((ct, i) => {
                  const Icon = ct.icon;
                  return (
                    <div
                      key={i}
                      className="cookie-type-card rounded-2xl p-5 transition-all duration-200"
                      style={{
                        background: ct.scheme.bg,
                        border: `1px solid ${ct.scheme.border}`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              background: "#fff",
                              border: `1px solid ${ct.scheme.border}`,
                            }}
                          >
                            <Icon
                              style={{
                                width: 16,
                                height: 16,
                                color: ct.scheme.iconColor,
                              }}
                            />
                          </div>
                          <h3
                            className="font-semibold text-gray-800"
                            style={{ fontSize: 15 }}
                          >
                            {ct.title}
                          </h3>
                        </div>
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                          style={{
                            background: ct.scheme.badgeBg,
                            color: ct.scheme.badgeText,
                          }}
                        >
                          {ct.badge}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#4B5563",
                          lineHeight: 1.6,
                          marginBottom: 8,
                        }}
                      >
                        {ct.description}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <span style={{ fontSize: 12, color: "#6B7280" }}>
                          <strong style={{ color: "#374151" }}>
                            Examples:
                          </strong>{" "}
                          {ct.examples}
                        </span>
                      </div>
                      <div
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                        style={{
                          background: "#fff",
                          border: `1px solid ${ct.scheme.border}`,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: ct.scheme.iconColor,
                            display: "inline-block",
                          }}
                        />
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: ct.scheme.durationColor,
                          }}
                        >
                          Duration: {ct.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. Third-Party Cookies */}
            <section className="section-card">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="sec-icon w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <ExternalLink
                    style={{ width: 18, height: 18, color: "#16A34A" }}
                  />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#16A34A",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    04
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Third-Party Cookies
                  </h2>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies from trusted third-party services to enhance your
                experience:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {[
                  {
                    name: "Google Analytics",
                    desc: "Analyzing site usage and performance",
                  },
                  {
                    name: "Facebook",
                    desc: "Social media integration and advertising",
                  },
                  {
                    name: "Payment Processors",
                    desc: "Secure payment processing",
                  },
                  { name: "CDN Services", desc: "Faster content delivery" },
                ].map((tp, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                    style={{
                      background: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "#16A34A" }}
                    />
                    <span style={{ fontSize: 13, color: "#374151" }}>
                      <strong>{tp.name}:</strong> {tp.desc}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
                These third parties have their own privacy policies, and we
                recommend reviewing them to understand how they use your data.
              </p>
            </section>

            {/* 5. Managing Cookies */}
            <section className="section-card">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="sec-icon w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <Settings
                    style={{ width: 18, height: 18, color: "#16A34A" }}
                  />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#16A34A",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    05
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Managing Cookies
                  </h2>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-4">
                You have the right to decide whether to accept or reject
                cookies. Manage them through your browser:
              </p>

              <div
                className="rounded-2xl p-5 mb-4"
                style={{
                  background: "linear-gradient(135deg, #F0FDF4, #ECFDF5)",
                  border: "1.5px solid #BBF7D0",
                }}
              >
                <h3
                  className="font-semibold text-gray-800 mb-3"
                  style={{ fontSize: 15 }}
                >
                  Browser Settings
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      browser: "Google Chrome",
                      path: "Settings → Privacy and Security → Cookies and other site data",
                    },
                    {
                      browser: "Firefox",
                      path: "Options → Privacy & Security → Cookies and Site Data",
                    },
                    {
                      browser: "Safari",
                      path: "Preferences → Privacy → Cookies and website data",
                    },
                    {
                      browser: "Microsoft Edge",
                      path: "Settings → Cookies and site permissions",
                    },
                  ].map((b, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl px-3 py-2"
                      style={{
                        background: "#fff",
                        border: "1px solid #DCFCE7",
                      }}
                    >
                      <span
                        className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: "#16A34A" }}
                      />
                      <span style={{ fontSize: 13, color: "#374151" }}>
                        <strong>{b.browser}:</strong> {b.path}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning note */}
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-3"
                style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
              >
                <span style={{ fontSize: 16, lineHeight: 1.5 }}>⚠️</span>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                  <strong>Note:</strong> If you choose to disable cookies, some
                  features of our platform may not function properly. Essential
                  cookies cannot be disabled as they are necessary for the
                  website to function.
                </p>
              </div>
            </section>

            {/* 6. Consent + Updates */}
            <section className="section-card">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="sec-icon w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <CheckCircle
                    style={{ width: 18, height: 18, color: "#16A34A" }}
                  />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#16A34A",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    06
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Cookie Consent & Updates
                  </h2>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600 leading-relaxed">
                  When you first visit Try-on, you will be asked to accept our
                  use of cookies through a cookie banner. By clicking "Accept
                  All Cookies," you consent to our use of all cookies as
                  described in this policy.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect
                  changes in technology, legislation, or operations. We will
                  notify you of any significant changes by posting the new
                  policy on this page with an updated date.
                </p>
              </div>
            </section>

            {/* 7. Contact */}
            <section className="section-card">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="sec-icon w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <Mail style={{ width: 18, height: 18, color: "#16A34A" }} />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#16A34A",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    07
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Contact Us
                  </h2>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                If you have any questions about our use of cookies or this
                Cookie Policy, please reach out:
              </p>
              <div
                className="rounded-2xl p-5"
                style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "#DCFCE7" }}
                  >
                    <Mail style={{ width: 15, height: 15, color: "#16A34A" }} />
                  </div>
                  <a
                    href="mailto:privacy@tryon.com"
                    className="font-medium transition-colors"
                    style={{ color: "#16A34A", textDecoration: "none" }}
                  >
                    privacy@tryon.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "#DCFCE7" }}
                  >
                    <MapPin
                      style={{ width: 15, height: 15, color: "#16A34A" }}
                    />
                  </div>
                  <span style={{ fontSize: 14, color: "#374151" }}>
                    123 Fashion Street, NY 10001
                  </span>
                </div>
              </div>
            </section>

            {/* CTA Banner */}
            <div
              className="cta-banner rounded-2xl p-7 text-white relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #15803D 0%, #16A34A 50%, #059669 100%)",
              }}
            >
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-white/10 bg-white/5" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full border border-white/10 bg-white/5" />
              <div className="relative">
                <h3 className="text-xl font-bold mb-2">
                  Your Privacy Matters 🌿
                </h3>
                <p
                  className="leading-relaxed mb-5"
                  style={{ color: "#DCFCE7", fontSize: 14 }}
                >
                  At Try-on, we are committed to protecting your privacy and
                  being transparent about how we use cookies. Review our Privacy
                  Policy for full details on data collection and protection.
                </p>
                <Link
                  to="/privacy"
                  className="cta-link inline-flex items-center gap-2 font-semibold rounded-xl px-6 py-3 transition-all duration-200"
                  style={{
                    background: "#fff",
                    color: "#16A34A",
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  Read Privacy Policy
                  <ExternalLink style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer strip */}
          <div
            className="px-8 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{
              background: "linear-gradient(90deg, #F0FDF4, #ECFDF5)",
              borderTop: "1px solid #BBF7D0",
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{ fontSize: 13, color: "#6B7280" }}
            >
              <Shield style={{ width: 15, height: 15, color: "#22C55E" }} />
              <span>
                Cookies are used responsibly — never sold to third parties.
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF" }}>© 2026 Try-on</p>
          </div>
        </div>

        <p
          className="text-center mt-6"
          style={{ fontSize: 12, color: "#9CA3AF" }}
        >
          © 2026 Try-on ·{" "}
          <Link
            to="/privacy"
            style={{ color: "#16A34A", textDecoration: "none" }}
          >
            Privacy Policy
          </Link>{" "}
          ·{" "}
          <Link
            to="/terms"
            style={{ color: "#16A34A", textDecoration: "none" }}
          >
            Terms of Service
          </Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .cp-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
          animation: cpBlob 10s ease-in-out infinite;
        }
        .blob-1 { top:-80px; left:-60px; width:380px; height:380px;
          background: radial-gradient(circle, rgba(74,222,128,0.16), transparent 70%);
          animation-duration: 11s; }
        .blob-2 { bottom:-80px; right:-60px; width:420px; height:420px;
          background: radial-gradient(circle, rgba(16,185,129,0.13), transparent 70%);
          animation-duration: 13s; animation-delay: -4s; }
        .blob-3 { top:40%; left:50%; width:280px; height:280px;
          background: radial-gradient(circle, rgba(22,163,74,0.07), transparent 70%);
          animation: cpBlob3 15s ease-in-out infinite; animation-delay: -7s; }
        @keyframes cpBlob  { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(14px,-14px)scale(1.04)} }
        @keyframes cpBlob3 { 0%,100%{transform:translateX(-50%)scale(1)} 50%{transform:translateX(calc(-50% + 16px))scale(1.06)} }

        .main-card { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .section-card { animation: fadeLeft 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeLeft { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }

        .icon-badge { animation: iconIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
        @keyframes iconIn { from{opacity:0;transform:scale(0.7)rotate(-10deg)} to{opacity:1;transform:scale(1)rotate(0)} }

        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.35} }

        .back-btn { animation: fadeIn 0.3s ease both; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .cookie-type-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(22,163,74,0.08); }

        .cta-link:hover { background: #F0FDF4 !important; box-shadow: 0 4px 12px rgba(0,0,0,0.10); transform: translateY(-1px); }
        .cta-link:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
};

export default CookiePolicy;
