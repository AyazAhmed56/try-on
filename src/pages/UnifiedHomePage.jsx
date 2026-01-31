import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import {
  ShoppingBag,
  Store,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Package,
  Heart,
  Shield,
  Zap,
  Check,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UnifiedHomePage = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'customer' | 'seller' | null

  /* ---------- FETCH USER ROLE ---------- */
  useEffect(() => {
    let mounted = true;

    const loadUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Guest user
      if (!user) {
        if (mounted) {
          setUserRole(null);
          setLoading(false);
        }
        return;
      }

      // Logged-in user → fetch role
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!error && mounted) {
        setUserRole(data?.role || null);
      }

      if (mounted) setLoading(false);
    };

    loadUserRole();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8 animate-fade-in">
            <div className="w-24 h-24 bg-linear-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <img
                src="/tryon-logo-circular-premium.svg"
                alt="Logo"
                className="w-32 h-32 scale-130 hover:scale-170 ease-in-out object-contain"
              />
            </div>
            <h1 className="text-7xl md:text-8xl h-29 font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Try-on
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 font-medium mb-6">
              Virtual Outfit Try Web Application
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              Experience the future of fashion with AI-powered virtual try-on
              technology. See how outfits look on you before making a purchase!
            </p>
          </div>

          {/* Conditional Dashboard Buttons Based on User Role */}
          {userRole === "customer" && (
            <div className="animate-fade-in-delay">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md mx-auto mb-8">
                <div className="w-16 h-16 bg-linear-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome Back, Customer!
                </h3>
                <p className="text-gray-600 mb-6">
                  Continue your shopping journey
                </p>
                <Link
                  to="/customer/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
                >
                  Go to Shopping
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}

          {userRole === "seller" && (
            <div className="animate-fade-in-delay">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md mx-auto mb-8">
                <div className="w-16 h-16 bg-linear-to-br from-pink-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Store className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome Back, Seller!
                </h3>
                <p className="text-gray-600 mb-6">
                  Manage your store and products
                </p>
                <Link
                  to="/seller/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}

          {/* For guests (not logged in) - Show both options */}
          {!userRole && (
            <div className="animate-fade-in-delay">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                {/* Customer Card */}
                <div className="group bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 bg-linear-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                    <ShoppingBag className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    I'm a Customer
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Browse products and try them virtually before purchasing
                  </p>

                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-purple-600" />
                      Virtual try-on experience
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-purple-600" />
                      Browse latest collections
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-purple-600" />
                      Wishlist & favorites
                    </li>
                  </ul>

                  <Link
                    to="/login"
                    className="block w-full py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Start Shopping
                  </Link>
                </div>

                {/* Seller Card */}
                <div className="group bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 bg-linear-to-br from-pink-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-300">
                    <Store className="w-10 h-10 text-pink-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    I'm a Seller
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Showcase your products with virtual try-on technology
                  </p>

                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-pink-600" />
                      Upload product catalog
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-pink-600" />
                      Manage inventory
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-pink-600" />
                      Track analytics
                    </li>
                  </ul>

                  <Link
                    to="/login"
                    className="block w-full py-4 bg-linear-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Start Selling
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl h-15.5 font-bold text-center mb-16 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Why Choose Try-on?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "AI-Powered",
                description:
                  "Advanced AI technology for realistic virtual try-on experience",
                color: "purple",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description:
                  "Your data is encrypted and protected with industry-leading security",
                color: "pink",
              },
              {
                icon: TrendingUp,
                title: "Growing Marketplace",
                description:
                  "Join thousands of sellers and millions of satisfied customers",
                color: "purple",
              },
              {
                icon: Heart,
                title: "Customer Focused",
                description: "Built with love for the best shopping experience",
                color: "pink",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 bg-linear-to-br from-${feature.color}-100 to-${feature.color === "purple" ? "pink" : "purple"}-100 rounded-full flex items-center justify-center mb-4`}
                >
                  <feature.icon
                    className={`w-7 h-7 text-${feature.color}-600`}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Users, value: "50K+", label: "Happy Customers" },
              { icon: Store, value: "2K+", label: "Active Sellers" },
              { icon: Package, value: "100K+", label: "Products Listed" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg"
              >
                <div className="w-16 h-16 bg-linear-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users experiencing the future of fashion today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Sign Up Now
              </Link>
              <Link
                to="/terms"
                className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white font-semibold rounded-full border-2 border-white hover:bg-white/30 transform hover:scale-105 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        .animate-pulse { animation: pulse 4s ease-in-out infinite; }
        .delay-1000 { animation-delay: 2s; }
        .delay-2000 { animation-delay: 3s; }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-delay { animation: fade-in 1s ease-out 0.3s both; }
      `}</style>
    </div>
  );
};

export default UnifiedHomePage;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { supabase } from "../services/supabaseClient";
// import {
//   ShoppingBag,
//   Store,
//   ArrowRight,
//   Sparkles,
//   TrendingUp,
//   Users,
//   Package,
//   Heart,
//   Shield,
//   Zap,
//   Check,
// } from "lucide-react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// const UnifiedHomePage = () => {
//   const [loading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState(null); // 'customer' | 'seller' | null

//   /* ---------- FETCH USER ROLE ---------- */
//   useEffect(() => {
//     let mounted = true;

//     const loadUserRole = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       // Guest user
//       if (!user) {
//         if (mounted) {
//           setUserRole(null);
//           setLoading(false);
//         }
//         return;
//       }

//       // Logged-in user → fetch role
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("id", user.id)
//         .single();

//       if (!error && mounted) {
//         setUserRole(data?.role || null);
//       }

//       if (mounted) setLoading(false);
//     };

//     loadUserRole();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
//       {/* HERO SECTION */}
//       <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
//         <div className="text-center max-w-5xl mx-auto">
//           <div className="mb-10">
//             <div className="w-24 h-24 bg-linear-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center">
//               <Sparkles className="w-12 h-12 text-white" />
//             </div>

//             <h1 className="text-7xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               Try-on
//             </h1>

//             <p className="text-xl text-gray-600 mt-4">
//               Virtual Outfit Try-On Web Application
//             </p>
//           </div>

//           {/* ================= ROLE BASED VIEW ================= */}

//           {/* CUSTOMER VIEW */}
//           {userRole === "customer" && (
//             <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl max-w-md mx-auto">
//               <ShoppingBag className="w-14 h-14 text-purple-600 mx-auto mb-4" />
//               <h3 className="text-2xl font-bold mb-2">Welcome, Customer</h3>
//               <p className="text-gray-600 mb-6">
//                 Continue exploring and trying outfits virtually
//               </p>

//               <Link
//                 to="/customer/home"
//                 className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full"
//               >
//                 Go to Shopping
//                 <ArrowRight />
//               </Link>
//             </div>
//           )}

//           {/* SELLER VIEW */}
//           {userRole === "seller" && (
//             <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl max-w-md mx-auto">
//               <Store className="w-14 h-14 text-pink-600 mx-auto mb-4" />
//               <h3 className="text-2xl font-bold mb-2">Welcome, Seller</h3>
//               <p className="text-gray-600 mb-6">
//                 Manage your products and track performance
//               </p>

//               <Link
//                 to="/seller/dashboard"
//                 className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-full"
//               >
//                 Go to Dashboard
//                 <ArrowRight />
//               </Link>
//             </div>
//           )}

//           {/* GUEST VIEW */}
//           {!userRole && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
//               {/* CUSTOMER CARD */}
//               <Link
//                 to="/login"
//                 className="bg-white/80 rounded-3xl p-8 shadow-xl hover:scale-105 transition"
//               >
//                 <ShoppingBag className="w-10 h-10 text-purple-600 mx-auto mb-4" />
//                 <h3 className="text-xl font-bold">I’m a Customer</h3>
//                 <p className="text-gray-600 mt-2">
//                   Try outfits virtually before buying
//                 </p>
//               </Link>

//               {/* SELLER CARD */}
//               <Link
//                 to="/login"
//                 className="bg-white/80 rounded-3xl p-8 shadow-xl hover:scale-105 transition"
//               >
//                 <Store className="w-10 h-10 text-pink-600 mx-auto mb-4" />
//                 <h3 className="text-xl font-bold">I’m a Seller</h3>
//                 <p className="text-gray-600 mt-2">
//                   Upload and manage your outfits
//                 </p>
//               </Link>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default UnifiedHomePage;
