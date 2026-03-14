import React, { useState, useEffect } from "react";
import {
  Home,
  ShoppingBag,
  Camera,
  Heart,
  User,
  Package,
  Star,
  ArrowRight,
  Menu,
  X,
  Settings,
  Bell,
  Search,
  CreditCard,
  LogOut,
  ShoppingCart,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabase";

/* Only things Tailwind can't do: @keyframes, gradient-text, sidebar slide, fixed-width sidebar */
const injectStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
* { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
.font-display { font-family: 'DM Serif Display', serif; }

.text-gradient {
  background: linear-gradient(135deg, #15803d, #059669);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.bg-green-grad { background: linear-gradient(135deg, #15803d, #059669); }

@keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideIn  { from { opacity:0; transform:translateX(-14px); } to { opacity:1; transform:translateX(0); } }
@keyframes spin     { to { transform:rotate(360deg); } }
@keyframes pulse    { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.4);opacity:.7;} }

.anim-fade  { animation: fadeUp  0.45s ease both; }
.anim-slide { animation: slideIn 0.35s ease both; }

/* Sidebar — fixed, slide in/out */
.sidebar {
  position: fixed; top:0; left:0; height:100%; width:256px;
  background: white; border-right: 1px solid #dcfce7;
  box-shadow: 4px 0 24px rgba(22,163,74,0.07);
  z-index: 50; display: flex; flex-direction: column;
  transform: translateX(-100%); transition: transform 0.3s ease;
}
.sidebar.open { transform: translateX(0); }
@media(min-width:1024px) { .sidebar { transform: translateX(0) !important; } }

/* Main offset on desktop */
.main-wrap { transition: margin-left 0.3s; }
@media(min-width:1024px) { .main-wrap { margin-left: 256px; } }

/* Notif dot pulse */
.notif-dot {
  position:absolute; top:7px; right:7px; width:8px; height:8px;
  background:#059669; border-radius:50%;
  animation: pulse 2s ease infinite;
}

/* Product card image hover */
.prod-card:hover .prod-img { transform: scale(1.07); }
.prod-img { transition: transform 0.5s ease; width:100%; height:100%; object-fit:cover; }
.prod-card .tryon-over { opacity:0; transition:opacity 0.3s; }
.prod-card:hover .tryon-over { opacity:1; }
`;

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
    { icon: Camera, label: "Virtual Try-On", route: "/customer/products" },
    { icon: ShoppingBag, label: "Shop Now", route: "/customer/products" },
    { icon: Package, label: "Track Order", route: "/customer/orders" },
    { icon: Heart, label: "My Wishlist", route: "/customer/wishlist" },
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
    { icon: ShoppingCart, label: "Cart", route: "/customer/cart" },
    { icon: CreditCard, label: "Payment Methods", route: "/customer/payments" },
    { icon: Bell, label: "Notifications", route: "/customer/notifications" },
    { icon: Settings, label: "Settings", route: "/customer/settings" },
  ];

  /* ── All data-fetching logic unchanged ── */
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
    const [
      { count: orderCount },
      { count: wishlistCount },
      { count: productCount },
      { count: cartCount },
    ] = await Promise.all([
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("customer_id", userId),
      supabase
        .from("wishlist")
        .select("*", { count: "exact", head: true })
        .eq("customer_id", userId),
      supabase.from("outfits").select("*", { count: "exact", head: true }),
      supabase
        .from("cart")
        .select("*", { count: "exact", head: true })
        .eq("customer_id", userId),
    ]);
    setStats([
      { label: "Total Orders", value: orderCount || 0, icon: Package },
      { label: "Wishlist Items", value: wishlistCount || 0, icon: Heart },
      { label: "Total Products", value: productCount || 0, icon: ShoppingBag },
      { label: "Cart Items", value: cartCount || 0, icon: ShoppingCart },
    ]);
  };

  const fetchRecentOrders = async (userId) => {
    const { data } = await supabase
      .from("orders")
      .select(
        `id,created_at,quantity,total_amount,status,outfits(id,name,outfit_images(image_url,is_main))`,
      )
      .eq("customer_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);
    setRecentOrders(
      data?.map((o) => ({
        id: o.id,
        date: o.created_at.split("T")[0],
        items: o.quantity,
        total: o.total_amount,
        status: o.status,
        image: o.outfits?.outfit_images?.find((i) => i.is_main)?.image_url,
      })) || [],
    );
  };

  const fetchTrendingProducts = async () => {
    const { data } = await supabase
      .from("outfits")
      .select(`id,name,price,outfit_images(image_url,is_main)`)
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
      .select(`outfits(id,name,price,outfit_images(image_url,is_main))`)
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
    const load = async () => {
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
    load();
  }, []);

  const statusClasses = (s) => {
    if (s === "Delivered") return "bg-green-100 text-green-700";
    if (s === "In Transit") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <>
      <style>{injectStyles}</style>

      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-50">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/45 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          {/* Logo */}
          <div className="px-5 py-5 border-b border-green-100 flex items-center justify-between">
            <Link to="/" className="no-underline">
              <div className="text-gradient font-display text-2xl tracking-tight leading-tight">
                VirtualFit
              </div>
              <div className="text-gray-400 text-xs mt-0.5">
                Customer Portal
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden bg-transparent border-none cursor-pointer text-gray-400 p-1 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Profile chip */}
          <div className="px-4 py-3.5 border-b border-green-100">
            <div className="flex items-center gap-2.5 px-3.5 py-3 bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="w-10 h-10 rounded-full bg-green-grad flex items-center justify-center text-white font-bold text-base shrink-0 overflow-hidden">
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
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate m-0">
                  {profile?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate m-0">
                  {profile?.email || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-3 overflow-y-auto flex flex-col gap-0.5">
            {sidebarLinks.map((link, i) => {
              const isActive = location.pathname === link.route;
              const notifCount =
                link.route === "/customer/notifications" ? 5 : null;
              return (
                <Link
                  key={i}
                  to={link.route}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium no-underline transition-all ${
                    isActive
                      ? "bg-green-grad text-white shadow-md shadow-green-200"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <link.icon size={16} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-white/25 text-white" : "bg-green-600 text-white"}`}
                    >
                      {link.badge}
                    </span>
                  )}
                  {notifCount && !link.badge && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-green-100 text-green-700"}`}
                    >
                      {notifCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 py-3 border-t border-green-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 bg-transparent border-none cursor-pointer hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="main-wrap">
          {/* Top bar */}
          <header className="bg-white border-b border-green-50 shadow-sm sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center p-2 rounded-xl border-2 border-green-100 bg-white cursor-pointer hover:bg-green-50 transition-colors"
              >
                <Menu size={19} className="text-gray-600" />
              </button>
              <div>
                <p className="text-lg font-bold text-gray-900 m-0">
                  Welcome back, {profile?.name?.split(" ")[0] || "User"}! 👋
                </p>
                <p className="text-xs text-gray-500 m-0">
                  Ready to find your perfect outfit?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="hidden md:flex items-center gap-2 bg-green-50 border-2 border-green-100 rounded-xl px-3.5 py-2 w-52">
                <Search size={15} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search products…"
                  className="bg-transparent border-none outline-none text-sm w-full text-gray-700"
                />
              </div>
              <button
                onClick={() => navigate("/customer/notifications")}
                className="relative p-2.5 rounded-xl border-2 border-green-100 bg-white cursor-pointer hover:bg-green-50 transition-colors"
              >
                <Bell size={19} className="text-gray-600" />
                <span className="notif-dot" />
              </button>
            </div>
          </header>

          {/* ── Page content ── */}
          <main className="px-6 py-7">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-9">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="anim-fade bg-white rounded-2xl border border-green-100 p-5 shadow-sm hover:-translate-y-1.5 hover:shadow-lg hover:shadow-green-100 transition-all"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="w-11 h-11 rounded-xl bg-green-grad flex items-center justify-center text-white mb-3.5">
                    <s.icon size={20} />
                  </div>
                  <p className="text-gradient font-display text-4xl font-bold m-0 mb-1 leading-none">
                    {s.value}
                  </p>
                  <p className="text-gray-500 text-sm m-0">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mb-9">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(a.route)}
                    className="anim-fade bg-white rounded-2xl border border-green-100 p-5 shadow-sm text-left cursor-pointer w-full hover:-translate-y-1.5 hover:shadow-lg hover:shadow-green-100 transition-all group"
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-green-grad flex items-center justify-center text-white mb-3.5 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                      <a.icon size={22} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 m-0 mb-1">
                      {a.label}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 m-0">
                      Get started{" "}
                      <ArrowRight
                        size={13}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="mb-9">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 m-0">
                  Recent Orders
                </h2>
                <button
                  onClick={() => navigate("/customer/orders")}
                  className="flex items-center gap-1 text-green-700 text-sm font-semibold border-none bg-transparent cursor-pointer hover:gap-2 transition-all"
                >
                  View All <ArrowRight size={14} />
                </button>
              </div>
              {recentOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recentOrders.map((o, i) => (
                    <div
                      key={o.id}
                      className="anim-fade bg-white rounded-2xl border border-green-100 p-5 shadow-sm hover:-translate-y-1 hover:shadow-md hover:shadow-green-100 transition-all"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      <div className="flex items-start justify-between mb-3.5">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 m-0">
                            #{String(o.id).slice(0, 8)}…
                          </p>
                          <p className="text-xs text-gray-400 m-0 mt-0.5">
                            {o.date}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClasses(o.status)}`}
                        >
                          {o.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3.5 mb-3.5">
                        {o.image && (
                          <img
                            src={o.image}
                            alt="Order"
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                        )}
                        <div>
                          <p className="text-xs text-gray-500 m-0 mb-0.5">
                            {o.items} item{o.items !== 1 ? "s" : ""}
                          </p>
                          <p className="font-display text-lg font-bold text-gray-900 m-0">
                            ₹{o.total}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate("/customer/orders")}
                        className="w-full py-2.5 rounded-xl bg-green-50 text-green-700 text-sm font-semibold border-none cursor-pointer hover:bg-green-100 transition-colors"
                      >
                        Track Order
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Package size={52} className="mx-auto mb-3 text-green-100" />
                  <p className="text-sm">No orders yet</p>
                </div>
              )}
            </div>

            {/* Trending Products */}
            <div className="mb-9">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-900 m-0">
                    Trending Now
                  </h2>
                  <div className="flex bg-green-50 border border-green-100 rounded-xl p-1 gap-0.5">
                    <button
                      onClick={() => setActiveView("grid")}
                      className={`p-1.5 rounded-lg border-none cursor-pointer transition-all ${activeView === "grid" ? "bg-white text-green-700 shadow-sm" : "bg-transparent text-gray-400 hover:text-green-600"}`}
                    >
                      <LayoutGrid size={14} />
                    </button>
                    <button
                      onClick={() => setActiveView("list")}
                      className={`p-1.5 rounded-lg border-none cursor-pointer transition-all ${activeView === "list" ? "bg-white text-green-700 shadow-sm" : "bg-transparent text-gray-400 hover:text-green-600"}`}
                    >
                      <LayoutList size={14} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/customer/products")}
                  className="flex items-center gap-1 text-green-700 text-sm font-semibold border-none bg-transparent cursor-pointer hover:gap-2 transition-all"
                >
                  View All <ArrowRight size={14} />
                </button>
              </div>

              {trendingProducts.length > 0 ? (
                <div
                  className={
                    activeView === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                      : "flex flex-col gap-3.5"
                  }
                >
                  {trendingProducts.map((p, i) => (
                    <div
                      key={p.id}
                      className={`prod-card anim-fade bg-white border border-green-100 shadow-sm cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:shadow-green-100 transition-all overflow-hidden ${activeView === "list" ? "flex rounded-2xl" : "rounded-2xl"}`}
                      style={{ animationDelay: `${i * 0.07}s` }}
                      onClick={() => navigate(`/customer/products/${p.id}`)}
                    >
                      {/* Image */}
                      <div
                        className={`relative overflow-hidden bg-green-50 ${activeView === "list" ? "w-24 h-24 shrink-0" : "h-56"}`}
                      >
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="prod-img"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={32} className="text-green-300" />
                          </div>
                        )}
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border-none cursor-pointer flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-500 transition-all"
                        >
                          <Heart size={14} />
                        </button>
                        {p.tryOn && (
                          <div className="tryon-over absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/50 to-transparent px-3 pb-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/customer/try-on/${p.id}`);
                              }}
                              className="w-full py-2 rounded-xl bg-green-grad text-white text-xs font-semibold border-none cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Camera size={13} /> Try On
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3.5">
                        <p className="text-sm font-semibold text-gray-900 m-0 mb-2">
                          {p.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star
                              size={12}
                              className="fill-yellow-400 text-yellow-400"
                            />
                            <span className="text-xs font-semibold text-gray-700">
                              {p.rating}
                            </span>
                          </div>
                          <span className="text-gradient font-display text-base font-bold">
                            ₹{p.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingBag
                    size={52}
                    className="mx-auto mb-3 text-green-100"
                  />
                  <p className="text-sm">No products available</p>
                </div>
              )}
            </div>

            {/* Wishlist preview */}
            <div className="mb-9">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 m-0">
                  Your Wishlist
                </h2>
                <button
                  onClick={() => navigate("/customer/wishlist")}
                  className="flex items-center gap-1 text-green-700 text-sm font-semibold border-none bg-transparent cursor-pointer hover:gap-2 transition-all"
                >
                  View All <ArrowRight size={14} />
                </button>
              </div>

              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                  {wishlistItems.map((item, i) => (
                    <div
                      key={item.id}
                      className="anim-fade bg-white rounded-2xl border border-green-100 p-3.5 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md hover:shadow-green-100 transition-all"
                      style={{ animationDelay: `${i * 0.06}s` }}
                      onClick={() => navigate(`/customer/products/${item.id}`)}
                    >
                      <div className="relative mb-2.5">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-28 object-cover rounded-xl"
                          />
                        )}
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-green-600 text-white border-none cursor-pointer flex items-center justify-center hover:bg-green-700 transition-colors"
                        >
                          <Heart size={12} className="fill-white" />
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 truncate m-0 mb-0.5">
                        {item.name}
                      </p>
                      <p className="text-sm font-bold text-green-700 m-0">
                        ₹{item.price}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Heart size={52} className="mx-auto mb-3 text-green-100" />
                  <p className="text-sm">Your wishlist is empty</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
