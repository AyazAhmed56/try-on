import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Cookie,
  Shield,
  Settings,
  Info,
  CheckCircle,
} from "lucide-react";

const CookiePolicy = () => {
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
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Cookie Policy
              </h1>
              <p className="text-sm text-gray-500">
                Last updated: January 27, 2026
              </p>
            </div>
          </div>

          <div className="prose prose-purple max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Info className="w-6 h-6 text-purple-600" />
                What Are Cookies?
              </h2>
              <p className="leading-relaxed">
                Cookies are small text files that are placed on your computer or
                mobile device when you visit a website. They are widely used to
                make websites work more efficiently and provide information to
                website owners. Cookies help us understand how you use our
                platform and improve your experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                How We Use Cookies
              </h2>
              <p className="leading-relaxed mb-3">
                Try-on uses cookies for various purposes to enhance your
                experience on our virtual outfit trial platform:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To remember your login information and preferences</li>
                <li>To understand how you navigate through our website</li>
                <li>To improve our virtual try-on technology and services</li>
                <li>To provide personalized product recommendations</li>
                <li>To analyze site performance and user behavior</li>
                <li>To prevent fraud and ensure platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Types of Cookies We Use
              </h2>

              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    Essential Cookies
                  </h3>
                  <p className="text-gray-700 mb-2">
                    These cookies are necessary for the website to function
                    properly. They enable basic features like page navigation,
                    secure areas access, and authentication.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Examples:</strong> Session cookies, security
                    cookies, load balancing cookies
                  </p>
                  <p className="text-sm text-purple-700 font-medium mt-2">
                    Duration: Session-based (deleted when you close your
                    browser)
                  </p>
                </div>

                {/* Performance Cookies */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Performance Cookies
                  </h3>
                  <p className="text-gray-700 mb-2">
                    These cookies help us understand how visitors interact with
                    our platform by collecting and reporting information
                    anonymously.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Examples:</strong> Google Analytics, page load
                    times, error tracking
                  </p>
                  <p className="text-sm text-blue-700 font-medium mt-2">
                    Duration: Up to 2 years
                  </p>
                </div>

                {/* Functionality Cookies */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Functionality Cookies
                  </h3>
                  <p className="text-gray-700 mb-2">
                    These cookies allow the website to remember choices you make
                    and provide enhanced, personalized features.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Examples:</strong> Language preferences, user
                    settings, recently viewed items
                  </p>
                  <p className="text-sm text-green-700 font-medium mt-2">
                    Duration: Up to 1 year
                  </p>
                </div>

                {/* Targeting/Advertising Cookies */}
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Cookie className="w-5 h-5 text-pink-600" />
                    Targeting/Advertising Cookies
                  </h3>
                  <p className="text-gray-700 mb-2">
                    These cookies are used to deliver advertisements more
                    relevant to you and your interests. They also help measure
                    the effectiveness of advertising campaigns.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Examples:</strong> Facebook Pixel, Google Ads,
                    retargeting cookies
                  </p>
                  <p className="text-sm text-pink-700 font-medium mt-2">
                    Duration: Up to 2 years
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Third-Party Cookies
              </h2>
              <p className="leading-relaxed mb-3">
                We use cookies from trusted third-party services to enhance your
                experience:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Google Analytics:</strong> For analyzing site usage
                  and performance
                </li>
                <li>
                  <strong>Facebook:</strong> For social media integration and
                  advertising
                </li>
                <li>
                  <strong>Payment Processors:</strong> For secure payment
                  processing
                </li>
                <li>
                  <strong>CDN Services:</strong> For faster content delivery
                </li>
              </ul>
              <p className="leading-relaxed mt-3">
                These third parties have their own privacy policies, and we
                recommend reviewing them to understand how they use your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Managing Cookies
              </h2>
              <p className="leading-relaxed mb-3">
                You have the right to decide whether to accept or reject
                cookies. You can exercise your cookie preferences by:
              </p>

              <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-lg p-6 mb-4 border-2 border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Browser Settings
                </h3>
                <p className="text-gray-700 mb-3">
                  Most web browsers allow you to control cookies through their
                  settings preferences. Here's how to manage cookies in popular
                  browsers:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>
                    <strong>Google Chrome:</strong> Settings → Privacy and
                    Security → Cookies and other site data
                  </li>
                  <li>
                    <strong>Firefox:</strong> Options → Privacy & Security →
                    Cookies and Site Data
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferences → Privacy → Cookies and
                    website data
                  </li>
                  <li>
                    <strong>Microsoft Edge:</strong> Settings → Cookies and site
                    permissions
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> If you choose to disable cookies, some
                  features of our platform may not function properly, and your
                  experience may be limited. Essential cookies cannot be
                  disabled as they are necessary for the website to function.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Cookie Consent
              </h2>
              <p className="leading-relaxed">
                When you first visit Try-on, you will be asked to accept our use
                of cookies through a cookie banner. By clicking "Accept All
                Cookies," you consent to our use of all cookies as described in
                this policy. You can also customize your cookie preferences by
                clicking "Cookie Settings" to choose which types of cookies you
                want to allow.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Updates to This Policy
              </h2>
              <p className="leading-relaxed">
                We may update this Cookie Policy from time to time to reflect
                changes in technology, legislation, our operations, or for other
                operational, legal, or regulatory reasons. We will notify you of
                any significant changes by posting the new policy on this page
                with an updated "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions about our use of cookies or this
                Cookie Policy, please contact us at:
              </p>
              <div className="bg-white rounded-lg p-4 mt-3 border border-gray-200">
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:privacy@tryon.com"
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    privacy@tryon.com
                  </a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Address:</strong> 123 Fashion Street, NY 10001
                </p>
              </div>
            </section>

            <section className="bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-3">
                Your Privacy Matters
              </h3>
              <p className="leading-relaxed mb-4">
                At Try-on, we are committed to protecting your privacy and being
                transparent about how we use cookies. We encourage you to review
                our Privacy Policy for more information about how we collect,
                use, and protect your personal data.
              </p>
              <Link
                to="/privacy"
                className="inline-block px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
              >
                Read Privacy Policy
              </Link>
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

export default CookiePolicy;
