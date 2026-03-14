import { ArrowUp, Leaf } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .footer-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .footer-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: fBlob 10s ease-in-out infinite;
        }
        .footer-blob-1 {
          top: -40px; left: 15%;
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(34,197,94,0.18), transparent 70%);
          animation-duration: 11s;
        }
        .footer-blob-2 {
          bottom: -40px; right: 15%;
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(16,185,129,0.14), transparent 70%);
          animation-duration: 13s;
          animation-delay: -4s;
        }
        @keyframes fBlob {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(12px,-10px) scale(1.05); }
        }

        /* Top shimmer bar */
        .footer-shimmer {
          height: 2px;
          background: linear-gradient(90deg, transparent, #22C55E, #10B981, #4ADE80, #10B981, #22C55E, transparent);
          background-size: 300% 100%;
          animation: shimmerBar 3s linear infinite;
        }
        @keyframes shimmerBar {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }

        /* Footer link hover */
        .footer-link {
          color: rgba(187,247,208,0.7);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          position: relative;
          transition: color 0.2s ease;
          padding-bottom: 2px;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 100%;
          height: 1px;
          background: #4ADE80;
          transition: right 0.25s ease;
        }
        .footer-link:hover { color: #ffffff; }
        .footer-link:hover::after { right: 0; }

        /* Copyright */
        .footer-copy {
          color: rgba(187,247,208,0.55);
          font-size: 13px;
        }

        /* Scroll to top */
        .scroll-top-btn {
          position: fixed;
          bottom: 32px; right: 32px;
          width: 46px; height: 46px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #16A34A, #10B981);
          box-shadow: 0 4px 16px rgba(22,163,74,0.40);
          z-index: 50;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          overflow: hidden;
        }
        .scroll-top-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #15803D, #059669);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .scroll-top-btn:hover { transform: translateY(-3px) scale(1.08); box-shadow: 0 8px 24px rgba(22,163,74,0.50); }
        .scroll-top-btn:hover::before { opacity: 1; }
        .scroll-top-btn:active { transform: scale(0.96); }
        .scroll-top-btn svg { position: relative; z-index: 1; color: white; }

        .scroll-top-btn.visible   { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
        .scroll-top-btn.invisible { opacity: 0; transform: translateY(12px) scale(0.85); pointer-events: none; }

        /* Leaf icon spin on hover */
        .brand-leaf { transition: transform 0.4s ease; display: inline-block; }
        .footer-brand:hover .brand-leaf { transform: rotate(20deg); }
      `}</style>

      <footer
        className="footer-root relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #052E16 0%, #14532D 45%, #052E16 100%)",
        }}
      >
        {/* Shimmer top border */}
        <div className="footer-shimmer" />

        {/* Background blobs */}
        <div className="footer-blob footer-blob-1" />
        <div className="footer-blob footer-blob-2" />

        {/* Subtle mesh texture */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.04 }}
        >
          <defs>
            <pattern
              id="footer-dots"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.5" cy="1.5" r="1.2" fill="#4ADE80" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-dots)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Brand + copyright */}
            <div className="flex flex-col items-center md:items-start gap-1.5">
              <Link
                to="/"
                className="footer-brand flex items-center gap-2 group"
              >
                <span className="brand-leaf">
                  <Leaf style={{ width: 16, height: 16, color: "#4ADE80" }} />
                </span>
                <span className="font-bold text-white text-sm tracking-wide">
                  Try-on
                </span>
              </Link>
              <p className="footer-copy">
                © {new Date().getFullYear()} Try-on. All rights reserved.
              </p>
            </div>

            {/* Divider on mobile */}
            <div
              className="md:hidden w-24 h-px"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />

            {/* Links */}
            <div className="flex items-center gap-6">
              <Link to="/terms" className="footer-link">
                Terms of Service
              </Link>
              <span
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "rgba(74,222,128,0.35)",
                  display: "inline-block",
                }}
              />
              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
              <span
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "rgba(74,222,128,0.35)",
                  display: "inline-block",
                }}
              />
              <Link to="/cookie" className="footer-link">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top FAB */}
      <button
        onClick={scrollToTop}
        className={`scroll-top-btn ${showScroll ? "visible" : "invisible"}`}
        aria-label="Scroll to top"
      >
        <ArrowUp style={{ width: 20, height: 20 }} />
      </button>
    </>
  );
};

export default Footer;
