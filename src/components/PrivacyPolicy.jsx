import { Link } from "react-router-dom";
import {
  Shield,
  ArrowLeft,
  Database,
  BarChart2,
  Camera,
  Share2,
  Lock,
  UserCheck,
  Cookie,
  Baby,
  Mail,
} from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 1,
      icon: Database,
      title: "Information We Collect",
      tag: "Data Collection",
      tagColor: "emerald",
      content: (
        <>
          <p className="leading-relaxed text-gray-600 mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Personal information (name, email, phone number)",
              "Account credentials and profile information",
              "Photos and images you upload for virtual try-on",
              "Business information for seller accounts (GST, registration numbers)",
              "Payment and billing information",
              "Communications and feedback you send to us",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 bg-green-50/60 rounded-xl px-3 py-2.5 border border-green-100/80"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-sm text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: 2,
      icon: BarChart2,
      title: "How We Use Your Information",
      tag: "Usage",
      tagColor: "green",
      content: (
        <>
          <p className="leading-relaxed text-gray-600 mb-4">
            We use the information we collect to:
          </p>
          <ul className="space-y-2">
            {[
              "Provide, maintain, and improve our virtual try-on services",
              "Process transactions and send related information",
              "Send you technical notices and support messages",
              "Respond to your comments and questions",
              "Personalize and improve your experience",
              "Monitor and analyze trends and usage",
              "Detect and prevent fraudulent transactions",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 3,
      icon: Camera,
      title: "Image Processing and Virtual Try-On",
      tag: "AI Processing",
      tagColor: "teal",
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed text-gray-600">
            When you use our virtual try-on feature, we process your uploaded
            photos using AI technology. These images are temporarily stored for
            processing purposes and are automatically deleted within 30 days.
          </p>
          <div className="flex items-center gap-3 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm text-green-800 font-medium">
              We do not use your images for any purpose other than providing the
              virtual try-on service unless you explicitly grant us permission.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      icon: Share2,
      title: "Information Sharing",
      tag: "Third Parties",
      tagColor: "green",
      content: (
        <>
          <p className="leading-relaxed text-gray-600 mb-4">
            We may share your information in the following situations:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              "With sellers when you make a purchase through our platform",
              "With service providers who perform services on our behalf",
              "To comply with legal obligations or protect rights and safety",
              "With your consent or at your direction",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
          <div className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
            <Shield className="w-3.5 h-3.5" />
            We do not sell your personal information to third parties.
          </div>
        </>
      ),
    },
    {
      id: 5,
      icon: Lock,
      title: "Data Security",
      tag: "Security",
      tagColor: "emerald",
      content: (
        <p className="leading-relaxed text-gray-600">
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. However, no method of
          transmission over the internet is 100% secure, and we cannot guarantee
          absolute security.
        </p>
      ),
    },
    {
      id: 6,
      icon: UserCheck,
      title: "Your Rights",
      tag: "User Rights",
      tagColor: "green",
      content: (
        <>
          <p className="leading-relaxed text-gray-600 mb-4">
            You have the right to:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Access and update your personal information",
              "Request deletion of your account and data",
              "Opt-out of marketing communications",
              "Request a copy of your data",
              "Object to processing of your information",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 bg-green-50/60 rounded-xl px-3 py-2.5 border border-green-100/80"
              >
                <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 10 10"
                  >
                    <path
                      d="M2 5l2.5 2.5L8 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: 7,
      icon: Cookie,
      title: "Cookies and Tracking",
      tag: "Cookies",
      tagColor: "teal",
      content: (
        <p className="leading-relaxed text-gray-600">
          We use cookies and similar tracking technologies to collect
          information about your browsing activities. You can control cookies
          through your browser settings, but disabling cookies may affect your
          ability to use certain features of our service.
        </p>
      ),
    },
    {
      id: 8,
      icon: Baby,
      title: "Children's Privacy",
      tag: "Age Policy",
      tagColor: "green",
      content: (
        <p className="leading-relaxed text-gray-600">
          Our service is not intended for children under 18 years of age. We do
          not knowingly collect personal information from children under 18. If
          you become aware that a child has provided us with personal
          information, please contact us.
        </p>
      ),
    },
    {
      id: 9,
      icon: Mail,
      title: "Contact Us",
      tag: "Get in Touch",
      tagColor: "emerald",
      content: (
        <p className="leading-relaxed text-gray-600">
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
          <a
            href="mailto:privacy@tryon.com"
            className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2 transition-colors"
          >
            privacy@tryon.com
          </a>
        </p>
      ),
    },
  ];

  const tagStyles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    green: "bg-green-50 text-green-700 border-green-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="#16A34A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="back-btn inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-8 transition-all group"
        >
          <span className="w-8 h-8 rounded-full bg-white border border-green-200 flex items-center justify-center shadow-sm group-hover:bg-green-600 group-hover:border-green-600 transition-all duration-200">
            <ArrowLeft className="w-4 h-4 group-hover:text-white transition-colors" />
          </span>
          Back to Home
        </Link>

        {/* Main Card */}
        <div className="main-card bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl shadow-green-100 border border-green-100/60 overflow-hidden">
          {/* Header Banner */}
          <div className="relative bg-linear-to-br from-green-700 via-green-800 to-emerald-900 px-8 md:px-12 py-10 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full bg-white/5 border border-white/10" />
            <div className="absolute -bottom-14 -left-14 w-72 h-72 rounded-full bg-white/5 border border-white/10" />
            <div className="absolute top-4 right-32 w-24 h-24 rounded-full bg-emerald-500/15" />
            <div className="absolute bottom-4 right-16 w-12 h-12 rounded-full bg-green-400/20" />

            <div className="relative flex items-center gap-4">
              <div className="icon-badge w-14 h-14 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-green-500/25 border border-green-400/30 rounded-full px-3 py-0.5 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse-dot" />
                  <span className="text-green-100 text-xs font-medium tracking-wide uppercase">
                    Privacy Document
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Privacy Policy
                </h1>
                <p className="text-green-200 text-sm mt-1">
                  Last updated: December 31, 2025
                </p>
              </div>
            </div>

            {/* Stats strip */}
            <div className="relative mt-8 grid grid-cols-3 gap-4">
              {[
                { value: "30 days", label: "Image Retention" },
                { value: "0", label: "Data Sold" },
                { value: "256-bit", label: "Encryption" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-center backdrop-blur-sm"
                >
                  <div className="text-white font-bold text-lg">
                    {stat.value}
                  </div>
                  <div className="text-green-200 text-xs mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="px-8 md:px-12 py-10 space-y-1">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  className="section-card group relative rounded-2xl border border-transparent hover:border-green-100 hover:bg-green-50/30 transition-all duration-300 p-6 cursor-default"
                  style={{ animationDelay: `${index * 55}ms` }}
                >
                  {/* left accent */}
                  <div className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full bg-linear-to-b from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-start gap-4">
                    {/* Icon column */}
                    <div className="shrink-0 flex flex-col items-center gap-1.5">
                      <div className="section-icon w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center group-hover:bg-green-600 group-hover:border-green-600 transition-all duration-300 shadow-sm">
                        <Icon className="w-5 h-5 text-green-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-[10px] font-bold text-green-300 group-hover:text-green-500 transition-colors">
                        {String(section.id).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-800 transition-colors">
                          {section.title}
                        </h2>
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${tagStyles[section.tagColor]}`}
                        >
                          {section.tag}
                        </span>
                      </div>
                      {section.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-8 md:px-12 py-6 bg-linear-to-r from-green-50 to-emerald-50 border-t border-green-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4 text-green-500" />
              <span>
                Your data is protected and never sold to third parties.
              </span>
            </div>
            <a
              href="mailto:privacy@tryon.com"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-green-200 hover:shadow-lg active:scale-95"
            >
              <Mail className="w-4 h-4" />
              Contact Privacy Team
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          © 2025 Try-on. All rights reserved.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: floatBlob 8s ease-in-out infinite;
        }
        .blob-1 {
          top: -80px; left: -80px;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(74,222,128,0.16), transparent 70%);
          animation-duration: 10s;
        }
        .blob-2 {
          bottom: -100px; right: -60px;
          width: 460px; height: 460px;
          background: radial-gradient(circle, rgba(16,185,129,0.13), transparent 70%);
          animation-duration: 12s;
          animation-delay: -3s;
        }
        .blob-3 {
          top: 35%; left: 50%;
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(22,163,74,0.07), transparent 70%);
          animation-duration: 14s;
          animation-delay: -6s;
        }
        @keyframes floatBlob {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(18px,-18px) scale(1.04); }
          66%       { transform: translate(-14px,14px) scale(0.97); }
        }

        .main-card {
          animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .section-card {
          animation: fadeInLeft 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .back-btn {
          animation: fadeIn 0.3s ease both;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .icon-badge {
          animation: iconBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }
        @keyframes iconBounce {
          from { opacity: 0; transform: scale(0.7) rotate(-8deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        .animate-pulse-dot { animation: pulse-dot 1.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
