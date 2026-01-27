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
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TryOnPages() {
  const [activePage, setActivePage] = useState("about");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "customer",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <div className="flex items-center space-x-2">
                <Shirt className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  TryOn
                </span>
              </div>
            </Link>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActivePage("about")}
                className={`px-6 py-2 rounded-md transition-all ${
                  activePage === "about"
                    ? "bg-white shadow-sm text-purple-600 font-medium"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActivePage("contact")}
                className={`px-6 py-2 rounded-md transition-all ${
                  activePage === "contact"
                    ? "bg-white shadow-sm text-purple-600 font-medium"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* About Page */}
      {activePage === "about" && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              About TryOn
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionizing online shopping with virtual try-on technology
              that bridges the gap between sellers and customers
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At TryOn, we believe online shopping should be as confident as
              in-store experiences. Our platform empowers customers to virtually
              try on products before purchasing, while helping sellers reduce
              returns and increase customer satisfaction. We're building the
              future of e-commerce, one virtual fitting room at a time.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-linear-to-br from-purple-100 to-purple-50 rounded-2xl p-8">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                For Customers
              </h3>
              <p className="text-gray-700">
                Try on clothes virtually using our advanced AR technology. See
                how items look on you before buying, ensuring perfect fit and
                style every time. Shop with confidence from the comfort of your
                home.
              </p>
            </div>

            <div className="bg-linear-to-br from-blue-100 to-blue-50 rounded-2xl p-8">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                For Sellers
              </h3>
              <p className="text-gray-700">
                Reduce return rates and increase conversion with virtual try-on.
                Provide customers with an immersive shopping experience that
                builds trust and drives sales. Showcase your products like never
                before.
              </p>
            </div>

            <div className="bg-linear-to-br from-green-100 to-green-50 rounded-2xl p-8">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Instant Results
              </h3>
              <p className="text-gray-700">
                Our real-time rendering technology provides instant virtual
                try-on experiences. No waiting, no complicated setup. Just
                upload your photo and start trying on products immediately.
              </p>
            </div>

            <div className="bg-linear-to-br from-orange-100 to-orange-50 rounded-2xl p-8">
              <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Privacy First
              </h3>
              <p className="text-gray-700">
                Your privacy is our priority. All virtual try-on sessions are
                processed securely, and we never store your photos without
                permission. Shop safely with complete peace of mind.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">500K+</div>
                <div className="text-purple-100">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-purple-100">Partner Sellers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">40%</div>
                <div className="text-purple-100">Reduced Returns</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Page */}
      {activePage === "contact" && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600">
              We'd love to hear from you. Whether you're a customer or a seller,
              we're here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Email
                      </h3>
                      <p className="text-gray-600">support@tryon.com</p>
                      <p className="text-gray-600">sellers@tryon.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Phone
                      </h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-sm text-gray-500">
                        Mon-Fri, 9AM-6PM EST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Address
                      </h3>
                      <p className="text-gray-600">123 Fashion Street</p>
                      <p className="text-gray-600">New York, NY 10001</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Business Hours
                      </h3>
                      <p className="text-gray-600">
                        Monday - Friday: 9AM - 6PM
                      </p>
                      <p className="text-gray-600">Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-3">Quick Support</h3>
                <p className="mb-4">
                  For immediate assistance, check out our Help Center with FAQs
                  for both customers and sellers.
                </p>
                <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Visit Help Center
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-green-700">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I am a *
                    </label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                    >
                      <option value="customer">Customer</option>
                      <option value="seller">Seller</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shirt className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold">TryOn</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 TryOn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
