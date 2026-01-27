import { ArrowUp } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className="bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center  md:space-y-0">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Try-on. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link to="/terms" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/cookie" className="hover:text-white transition-colors duration-200">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300 z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
          }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 2s;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
