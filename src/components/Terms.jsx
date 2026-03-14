import { Link } from "react-router-dom";
import {
  FileText,
  ArrowLeft,
  Shield,
  Scale,
  Users,
  Zap,
  AlertTriangle,
  Globe,
  Mail,
} from "lucide-react";

const TermsOfService = () => {
  const sections = [
    {
      id: 1,
      icon: Scale,
      title: "Acceptance of Terms",
      content: (
        <p className="leading-relaxed text-gray-600">
          By accessing and using Try-on's virtual outfit trial platform, you
          accept and agree to be bound by the terms and provisions of this
          agreement. If you do not agree to abide by the above, please do not
          use this service.
        </p>
      ),
    },
    {
      id: 2,
      icon: Shield,
      title: "Use License",
      content: (
        <>
          <p className="leading-relaxed text-gray-600 mb-4">
            Permission is granted to temporarily use Try-on's services for
            personal, non-commercial transitory viewing only. This is the grant
            of a license, not a transfer of title, and under this license you
            may not:
          </p>
          <ul className="space-y-2">
            {[
              "Modify or copy the materials",
              "Use the materials for any commercial purpose or public display",
              "Attempt to reverse engineer any software contained on Try-on's platform",
              "Remove any copyright or proprietary notations from the materials",
              'Transfer the materials to another person or "mirror" the materials on any other server',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 3,
      icon: Users,
      title: "User Accounts",
      content: (
        <p className="leading-relaxed text-gray-600">
          When you create an account with us, you guarantee that the information
          you provide us is accurate, complete, and current at all times.
          Inaccurate, incomplete, or obsolete information may result in the
          immediate termination of your account on the service.
        </p>
      ),
    },
    {
      id: 4,
      icon: Zap,
      title: "Virtual Try-On Service",
      content: (
        <p className="leading-relaxed text-gray-600">
          Our virtual try-on technology is provided as a visualization tool.
          Results may vary and should not be considered as exact
          representations. Try-on is not responsible for any purchasing
          decisions made based on virtual try-on results.
        </p>
      ),
    },
    {
      id: 5,
      icon: FileText,
      title: "Seller Obligations",
      content: (
        <>
          <p className="leading-relaxed text-gray-600 mb-4">
            If you are a seller on our platform, you agree to:
          </p>
          <ul className="space-y-2">
            {[
              "Provide accurate product descriptions and images",
              "Honor the prices and terms displayed on your listings",
              "Comply with all applicable laws and regulations",
              "Maintain valid business licenses and tax registrations",
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
      id: 6,
      icon: AlertTriangle,
      title: "Limitation of Liability",
      content: (
        <p className="leading-relaxed text-gray-600">
          In no event shall Try-on or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or
          due to business interruption) arising out of the use or inability to
          use the materials on Try-on's platform.
        </p>
      ),
    },
    {
      id: 7,
      icon: Globe,
      title: "Governing Law",
      content: (
        <p className="leading-relaxed text-gray-600">
          These terms and conditions are governed by and construed in accordance
          with the laws of the jurisdiction in which Try-on operates, and you
          irrevocably submit to the exclusive jurisdiction of the courts in that
          location.
        </p>
      ),
    },
    {
      id: 8,
      icon: Mail,
      title: "Contact Information",
      content: (
        <p className="leading-relaxed text-gray-600">
          If you have any questions about these Terms of Service, please contact
          us at{" "}
          <a
            href="mailto:legal@tryon.com"
            className="text-green-600 hover:text-green-700 font-medium transition-colors underline underline-offset-2"
          >
            legal@tryon.com
          </a>
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        {/* Decorative grid dots */}
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
          <span className="back-arrow w-8 h-8 rounded-full bg-white border border-green-200 flex items-center justify-center shadow-sm group-hover:bg-green-600 group-hover:border-green-600 transition-all duration-200">
            <ArrowLeft className="w-4 h-4 group-hover:text-white transition-colors" />
          </span>
          Back to Home
        </Link>

        {/* Card Container */}
        <div className="main-card bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl shadow-green-100 border border-green-100/60 overflow-hidden">
          {/* Header Banner */}
          <div className="header-banner relative bg-linear-to-br from-green-600 via-green-700 to-emerald-800 px-8 md:px-12 py-10 overflow-hidden">
            {/* inner decorative circles */}
            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5 border border-white/10" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-white/5 border border-white/10" />
            <div className="absolute top-6 right-40 w-20 h-20 rounded-full bg-emerald-500/20" />

            <div className="relative flex items-center gap-4">
              <div className="icon-badge w-14 h-14 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-green-500/30 border border-green-400/30 rounded-full px-3 py-0.5 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse-dot" />
                  <span className="text-green-100 text-xs font-medium tracking-wide uppercase">
                    Legal Document
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Terms of Service
                </h1>
                <p className="text-green-200 text-sm mt-1">
                  Last updated: December 31, 2025
                </p>
              </div>
            </div>

            {/* Progress bar deco */}
            <div className="relative mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-full bg-linear-to-r from-green-300 via-emerald-300 to-green-400 progress-bar" />
            </div>
          </div>

          {/* Content */}
          <div className="px-8 md:px-12 py-10 space-y-2">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  className="section-card group relative rounded-2xl border border-transparent hover:border-green-100 hover:bg-green-50/40 transition-all duration-300 p-6 cursor-default"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Left accent line */}
                  <div className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full bg-linear-to-b from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-start gap-4">
                    {/* Section number + icon */}
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      <div className="section-icon w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center group-hover:bg-green-600 group-hover:border-green-600 transition-all duration-300 shadow-sm">
                        <Icon className="w-5 h-5 text-green-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-xs font-bold text-green-300 group-hover:text-green-500 transition-colors">
                        {String(section.id).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 pt-1">
                      <h2 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-green-800 transition-colors">
                        {section.title}
                      </h2>
                      {section.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer strip */}
          <div className="px-8 md:px-12 py-6 bg-linear-to-r from-green-50 to-emerald-50 border-t border-green-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 text-green-500" />
              <span>
                Your use of this service is protected under these terms.
              </span>
            </div>
            <a
              href="mailto:legal@tryon.com"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-green-200 hover:shadow-lg active:scale-95"
            >
              <Mail className="w-4 h-4" />
              Contact Legal
            </a>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-gray-400 mt-6">
          © 2025 Try-on. All rights reserved.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        * { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* Background blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: floatBlob 8s ease-in-out infinite;
        }
        .blob-1 {
          top: -80px; left: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(74,222,128,0.18), transparent 70%);
          animation-duration: 9s;
        }
        .blob-2 {
          bottom: -100px; right: -60px;
          width: 450px; height: 450px;
          background: radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%);
          animation-duration: 11s;
          animation-delay: -3s;
        }
        .blob-3 {
          top: 40%; left: 50%;
          transform: translateX(-50%);
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(22,163,74,0.08), transparent 70%);
          animation-duration: 13s;
          animation-delay: -6s;
        }

        @keyframes floatBlob {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(20px, -20px) scale(1.04); }
          66%       { transform: translate(-15px, 15px) scale(0.97); }
        }
        .blob-3 { animation-name: floatBlob3; }
        @keyframes floatBlob3 {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50%       { transform: translateX(calc(-50% + 20px)) scale(1.06); }
        }

        /* Entry animation for whole card */
        .main-card {
          animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Sections stagger in */
        .section-card {
          animation: fadeInLeft 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Back button entry */
        .back-btn {
          animation: fadeIn 0.3s ease both;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Progress bar shimmer */
        .progress-bar {
          animation: shimmer 2.5s ease-in-out infinite;
          background-size: 200% 100%;
        }
        @keyframes shimmer {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        /* Pulsing dot in badge */
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .animate-pulse-dot { animation: pulse-dot 1.8s ease-in-out infinite; }

        /* Icon badge float on load */
        .icon-badge {
          animation: iconBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }
        @keyframes iconBounce {
          from { opacity: 0; transform: scale(0.7) rotate(-10deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .header-banner { padding: 2rem 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default TermsOfService;
