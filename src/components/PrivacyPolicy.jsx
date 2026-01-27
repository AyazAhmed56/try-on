import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

// Privacy Policy Component
const PrivacyPolicy = () => {
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
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-500">
                Last updated: December 31, 2025
              </p>
            </div>
          </div>

          <div className="prose prose-purple max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                1. Information We Collect
              </h2>
              <p className="leading-relaxed mb-3">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Personal information (name, email address, phone number)
                </li>
                <li>Account credentials and profile information</li>
                <li>Photos and images you upload for virtual try-on</li>
                <li>
                  Business information for seller accounts (GST, registration
                  numbers)
                </li>
                <li>Payment and billing information</li>
                <li>Communications and feedback you send to us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                2. How We Use Your Information
              </h2>
              <p className="leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Provide, maintain, and improve our virtual try-on services
                </li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Personalize and improve your experience</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect and prevent fraudulent transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                3. Image Processing and Virtual Try-On
              </h2>
              <p className="leading-relaxed">
                When you use our virtual try-on feature, we process your
                uploaded photos using AI technology. These images are
                temporarily stored for processing purposes and are automatically
                deleted within 30 days. We do not use your images for any
                purpose other than providing the virtual try-on service unless
                you explicitly grant us permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                4. Information Sharing
              </h2>
              <p className="leading-relaxed mb-3">
                We may share your information in the following situations:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  With sellers when you make a purchase through our platform
                </li>
                <li>
                  With service providers who perform services on our behalf
                </li>
                <li>
                  To comply with legal obligations or protect rights and safety
                </li>
                <li>With your consent or at your direction</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                5. Data Security
              </h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                method of transmission over the internet is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                6. Your Rights
              </h2>
              <p className="leading-relaxed mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Object to processing of your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                7. Cookies and Tracking
              </h2>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to collect
                information about your browsing activities. You can control
                cookies through your browser settings, but disabling cookies may
                affect your ability to use certain features of our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                8. Children's Privacy
              </h2>
              <p className="leading-relaxed">
                Our service is not intended for children under 18 years of age.
                We do not knowingly collect personal information from children
                under 18. If you become aware that a child has provided us with
                personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                9. Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a
                  href="mailto:privacy@tryon.com"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  privacy@tryon.com
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

export default PrivacyPolicy;
