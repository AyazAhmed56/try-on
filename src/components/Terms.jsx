import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

// Terms of Service Component
const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 py-12 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-sm text-gray-500">
                Last updated: December 31, 2025
              </p>
            </div>
          </div>

          <div className="prose prose-purple max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By accessing and using Try-on's virtual outfit trial platform,
                you accept and agree to be bound by the terms and provisions of
                this agreement. If you do not agree to abide by the above,
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                2. Use License
              </h2>
              <p className="leading-relaxed mb-3">
                Permission is granted to temporarily use Try-on's services for
                personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title, and under this
                license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>
                  Use the materials for any commercial purpose or public display
                </li>
                <li>
                  Attempt to reverse engineer any software contained on Try-on's
                  platform
                </li>
                <li>
                  Remove any copyright or proprietary notations from the
                  materials
                </li>
                <li>
                  Transfer the materials to another person or "mirror" the
                  materials on any other server
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                3. User Accounts
              </h2>
              <p className="leading-relaxed">
                When you create an account with us, you guarantee that the
                information you provide us is accurate, complete, and current at
                all times. Inaccurate, incomplete, or obsolete information may
                result in the immediate termination of your account on the
                service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                4. Virtual Try-On Service
              </h2>
              <p className="leading-relaxed">
                Our virtual try-on technology is provided as a visualization
                tool. Results may vary and should not be considered as exact
                representations. Try-on is not responsible for any purchasing
                decisions made based on virtual try-on results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                5. Seller Obligations
              </h2>
              <p className="leading-relaxed mb-3">
                If you are a seller on our platform, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate product descriptions and images</li>
                <li>Honor the prices and terms displayed on your listings</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Maintain valid business licenses and tax registrations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                6. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                In no event shall Try-on or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on Try-on's platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                7. Governing Law
              </h2>
              <p className="leading-relaxed">
                These terms and conditions are governed by and construed in
                accordance with the laws of the jurisdiction in which Try-on
                operates, and you irrevocably submit to the exclusive
                jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                8. Contact Information
              </h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us at{" "}
                <a
                  href="mailto:legal@tryon.com"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  legal@tryon.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-pulse { animation: pulse 4s ease-in-out infinite; }
        .delay-1000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default TermsOfService;
