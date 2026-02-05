import React, { useState, useEffect } from "react";
import {
  Home,
  ShoppingBag,
  Camera,
  Heart,
  User,
  Package,
  Clock,
  Star,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Settings,
  Bell,
  Search,
  Filter,
  Grid,
  List,
  MapPin,
  CreditCard,
  LogOut,
  ShoppingBagIcon,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabase";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("grid");
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const quickActions = [
    {
      icon: Camera,
      label: "Virtual Try-On",
      color: "from-purple-600 to-pink-600",
      route: "/customer/try-on",
    },
    {
      icon: ShoppingBag,
      label: "Shop Now",
      color: "from-pink-600 to-purple-600",
      route: "/customer/products",
    },
    {
      icon: Package,
      label: "Track Order",
      color: "from-purple-500 to-pink-500",
      route: "/customer/orders",
    },
    {
      icon: Heart,
      label: "My Wishlist",
      color: "from-pink-500 to-purple-500",
      route: "/customer/wishlist",
    },
  ];

  const sidebarLinks = [
    { icon: Home, label: "Dashboard", route: "/customer/dashboard" },
    {
      icon: ShoppingBag,
      label: "Browse Products",
      route: "/customer/products",
    },
    {
      icon: Camera,
      label: "Virtual Try-On",
      route: "/customer/try-on",
      badge: "New",
    },
    { icon: Package, label: "My Orders", route: "/customer/orders" },
    { icon: Heart, label: "Wishlist", route: "/customer/wishlist" },
    { icon: User, label: "Profile", route: "/customer/profile" },
    { icon: ShoppingBag, label: "Cart", route: "/customer/cart" },
    { icon: CreditCard, label: "Payment Methods", route: "/customer/payments" },
    { icon: Bell, label: "Notifications", route: "/customer/notifications" },
    { icon: Settings, label: "Settings", route: "/customer/settings" },
  ];

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  };

  const fetchStats = async (userId) => {
    const [{ count: orderCount }, { count: wishlistCount }] = await Promise.all(
      [
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("customer_id", userId),
        supabase
          .from("wishlist")
          .select("*", { count: "exact", head: true })
          .eq("customer_id", userId),
      ],
    );

    setStats([
      {
        label: "Total Orders",
        value: orderCount || 0,
        icon: Package,
        color: "purple",
      },
      {
        label: "Wishlist Items",
        value: wishlistCount || 0,
        icon: Heart,
        color: "pink",
      },
      { label: "Try-Ons Used", value: "—", icon: Camera, color: "purple" },
      { label: "Saved Amount", value: "—", icon: TrendingUp, color: "pink" },
    ]);
  };

  const fetchRecentOrders = async (userId) => {
    const { data } = await supabase
      .from("orders")
      .select(
        `
      id,
      created_at,
      quantity,
      total_amount,
      status,
      outfits (
        id,
        name,
        outfit_images ( image_url, is_main )
      )
    `,
      )
      .eq("customer_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    const formatted =
      data?.map((order) => ({
        id: order.id,
        date: order.created_at.split("T")[0],
        items: order.quantity,
        total: order.total_amount,
        status: order.status,
        image: order.outfits?.outfit_images?.find((i) => i.is_main)?.image_url,
      })) || [];

    setRecentOrders(formatted);
  };

  const fetchTrendingProducts = async () => {
    const { data } = await supabase
      .from("outfits")
      .select(
        `
      id,
      name,
      price,
      outfit_images ( image_url, is_main )
    `,
      )
      .order("created_at", { ascending: false })
      .limit(4);

    setTrendingProducts(
      data?.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        rating: 4.8,
        image: item.outfit_images?.find((i) => i.is_main)?.image_url,
        tryOn: true,
      })) || [],
    );
  };

  const fetchWishlist = async (userId) => {
    const { data } = await supabase
      .from("wishlist")
      .select(
        `
      outfits (
        id,
        name,
        price,
        outfit_images ( image_url, is_main )
      )
    `,
      )
      .eq("customer_id", userId)
      .limit(6);

    setWishlistItems(
      data?.map((w) => ({
        id: w.outfits.id,
        name: w.outfits.name,
        price: w.outfits.price,
        image: w.outfits.outfit_images?.find((i) => i.is_main)?.image_url,
      })) || [],
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    const loadDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await fetchProfile();
      await fetchStats(user.id);
      await fetchRecentOrders(user.id);
      await fetchTrendingProducts();
      await fetchWishlist(user.id);
    };

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div>
                <h2 className="font-bold text-transparent bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl text-center">
                  VirtualFit
                </h2>
                <p className="text-xs text-gray-500 text-center">
                  Customer Portal
                </p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-linear-to-r from-purple-50 to-pink-50">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold overflow-hidden">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{profile?.name?.[0]?.toUpperCase() || "U"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {profile?.name || "User"}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {profile?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-280px)]">
          {sidebarLinks.map((link, index) => {
            const isActive = location.pathname === link.route;
            const orderCount = link.route === "/orders" && stats[0]?.value;
            const wishlistCount = link.route === "/wishlist" && stats[1]?.value;
            const notificationCount =
              link.route === "/notifications" ? 5 : null;

            return (
              <Link
                to={link.route}
                key={index}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                    : "text-gray-700 hover:bg-purple-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-pink-500 text-white">
                    {link.badge}
                  </span>
                )}
                {(orderCount || wishlistCount || notificationCount) && (
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      isActive ? "bg-white/20" : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {orderCount || wishlistCount || notificationCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {profile?.name?.split(" ")[0] || "User"}! 👋
                  </h1>
                  <p className="text-sm text-gray-600">
                    Ready to find your perfect outfit?
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-64">
                  <Search className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="bg-transparent border-none outline-none ml-2 w-full text-sm"
                  />
                </div>

                {/* Notification Bell */}
                <button
                  onClick={() => navigate("/customer/notifications")}
                  className="relative p-2 rounded-lg hover:bg-gray-100"
                >
                  <Bell className="w-6 h-6 text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${
                      stat.color === "purple"
                        ? "from-purple-500 to-purple-600"
                        : "from-pink-500 to-pink-600"
                    } flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.route)}
                  className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-linear-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {action.label}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    Get Started{" "}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <button
                onClick={() => navigate("/customer/orders")}
                className="flex items-center space-x-2 text-purple-600 hover:text-pink-600 font-semibold transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.id}
                        </p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "In Transit"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                      {order.image && (
                        <img
                          src={order.image}
                          alt="Order"
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sm text-gray-600">
                          {order.items} items
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ${order.total}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/orders")}
                      className="w-full py-2 rounded-xl bg-linear-to-r from-purple-50 to-pink-50 text-purple-700 font-semibold hover:from-purple-100 hover:to-pink-100 transition-all"
                    >
                      Track Order
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Trending Products */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-gray-900">
                  Trending Now
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveView("grid")}
                    className={`p-2 rounded-lg ${activeView === "grid" ? "bg-purple-100 text-purple-700" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveView("list")}
                    className={`p-2 rounded-lg ${activeView === "list" ? "bg-purple-100 text-purple-700" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => navigate("/customer/products")}
                className="flex items-center space-x-2 text-purple-600 hover:text-pink-600 font-semibold transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.length > 0 ? (
                trendingProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all group overflow-hidden"
                  >
                    <div className="relative overflow-hidden">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all">
                        <Heart className="w-5 h-5" />
                      </button>
                      {product.tryOn && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <button
                            onClick={() => navigate("/try-on")}
                            className="w-full py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center space-x-2"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Try On</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-900">
                            {product.rating}
                          </span>
                        </div>
                        <p className="text-lg font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No products available</p>
                </div>
              )}
            </div>
          </div>

          {/* Wishlist Preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Wishlist</h2>
              <button
                onClick={() => navigate("/customer/wishlist")}
                className="flex items-center space-x-2 text-purple-600 hover:text-pink-600 font-semibold transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all group"
                  >
                    <div className="relative mb-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-xl group-hover:scale-105 transition-transform"
                        />
                      )}
                      <button className="absolute top-2 right-2 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-all">
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm font-bold text-purple-600">
                      ${item.price}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-6 text-center py-12">
                  <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Your wishlist is empty</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
