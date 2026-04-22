import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Package,
  Plus,
  Grid3x3,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  DollarSign,
  Eye,
  Star,
  MessageSquare,
  Receipt,
  Contact,
  Leaf,
} from "lucide-react";
import { supabase } from "../services/supabase";

const SellerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState([
    { label: "Total Products", value: 0, icon: Package },
    { label: "Total Orders", value: 0, icon: ShoppingBag },
    { label: "Total Revenue", value: "₹0", icon: DollarSign },
  ]);
  const [myItems, setMyItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [seller, setSeller] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // seller shop
      const { data: sellerProfile } = await supabase
        .from("seller_profiles")
        .select("shop_name")
        .eq("user_id", user.id)
        .single();

      // avatar from profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      let avatarUrl = null;

      if (profile?.avatar_url) {
        const { data } = supabase.storage
          .from("avatars") // your storage bucket name
          .getPublicUrl(profile.avatar_url);

        avatarUrl = data.publicUrl;
      }

      setSeller({
        name: sellerProfile?.shop_name || "Seller",
        email: user.email,
        avatar_url: avatarUrl,
      });
      
      if (!user) return;

      const [{ count: productCount }, { count: orderCount }] =
        await Promise.all([
          supabase
            .from("outfits")
            .select("*", { count: "exact", head: true })
            .eq("seller_id", user.id),
          supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .eq("seller_id", user.id),
        ]);

      const { data: revenueRows } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("seller_id", user.id)
        .neq("status", "Cancelled");
      const totalRevenue =
        revenueRows?.reduce((sum, r) => sum + r.total_amount, 0) || 0;

      setStats([
        { label: "Total Products", value: productCount || 0, icon: Package },
        { label: "Total Orders", value: orderCount || 0, icon: ShoppingBag },
        {
          label: "Total Revenue",
          value: `₹${totalRevenue.toLocaleString()}`,
          icon: DollarSign,
        },
      ]);

      const { data: outfits, error } = await supabase
        .from("outfits")
        .select(
          `id, name, price, discount_price, stock_quantity, created_at, outfit_images(image_url, is_main), outfit_reviews(rating)`,
        )
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error(error);
        setMyItems([]);
        return;
      }

      setMyItems(
        (outfits || []).map((o) => {
          const ratings = o.outfit_reviews?.map((r) => r.rating) || [];
          const avgRating =
            ratings.length > 0
              ? ratings.reduce((a, b) => a + b, 0) / ratings.length
              : 0;
          return {
            id: o.id,
            name: o.name,
            price: o.discount_price || o.price,
            stock: o.stock_quantity,
            rating: avgRating,
            image:
              o.outfit_images?.find((i) => i.is_main)?.image_url ||
              "https://via.placeholder.com/400x500?text=No+Image",
          };
        }),
      );

      const { data: orders } = await supabase
        .from("orders")
        .select(`id, total_amount, status, outfits(name)`)
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentOrders(orders || []);
    };

    fetchDashboardData();
  }, []);

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/seller/dashboard",
    },
    { id: "profile", label: "Profile", icon: Contact, path: "/seller/profile" },
    { id: "post-item", label: "Post Item", icon: Plus, path: "/post-item" },
    { id: "my-items", label: "My Items", icon: Grid3x3, path: "/my-items" },
    { id: "orders", label: "Orders", icon: ShoppingBag, path: "/order-list" },
    {
      id: "reviews",
      label: "Reviews",
      icon: MessageSquare,
      path: "/seller/reviews",
    },
    // {
    //   id: "other-sellers",
    //   label: "Other Sellers",
    //   icon: Eye,
    //   path: "/other-sellers-items-reviews",
    // },
    {
      id: "order-receipt",
      label: "Order Receipt",
      icon: Receipt,
      path: "/order-receipt",
    },
  ];

  const statusStyle = (status) => {
    if (status === "Delivered")
      return "bg-green-50 text-green-700 border border-green-100";
    if (status === "Shipped")
      return "bg-blue-50 text-blue-700 border border-blue-100";
    if (status === "Processing")
      return "bg-amber-50 text-amber-700 border border-amber-100";
    return "bg-gray-50 text-gray-600 border border-gray-100";
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-125 h-125 bg-green-100 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-125 h-125 bg-emerald-100 rounded-full blur-3xl opacity-40 animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-100 shadow-xl lg:shadow-sm transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          {/* Logo */}
          <div className="p-5 border-b border-gray-100">
            <div className="px-5 py-5 border-b border-green-100 flex items-center justify-between">
              <Link to="/" className="no-underline">
                <div className="text-gradient font-display text-2xl tracking-tight leading-tight">
                  VirtualFit
                </div>
                <div className="text-gray-400 text-xs mt-0.5">
                  Seller Portal
                </div>
              </Link>

              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden bg-transparent border-none cursor-pointer text-gray-400 p-1 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-4 py-3.5 border-b border-green-100">
              <div className="flex items-center gap-2.5 px-3.5 py-3 bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                {/* <div className="w-10 h-10 rounded-full bg-green-grad flex items-center justify-center text-white font-bold text-base shrink-0 overflow-hidden"> */}
                  {/* {seller?.avatar_url ? (
                    <img
                      src={seller.avatar_url}
                      alt="Seller"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{seller?.name?.[0]?.toUpperCase() || "S"}</span>
                  )} */}
                {/* </div> */}

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate m-0">
                    {seller?.name || "Seller"}
                  </p>
                  <p className="text-xs text-gray-500 truncate m-0">
                    {seller?.email || ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "text-white shadow-sm"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
                style={
                  activeTab === item.id
                    ? {
                        background: "linear-gradient(135deg, #16a34a, #059669)",
                      }
                    : {}
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-100 sticky bottom-0 bg-white">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden mb-5 flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-green-50 rounded-xl transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <h1 className="text-base font-bold text-gray-900">
              Seller Dashboard
            </h1>
            <div
              className="w-9 h-9 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #16a34a, #059669)",
              }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <stat.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* My Items */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">My Items</h2>
              <Link
                to="/my-items"
                className="flex items-center gap-1.5 text-sm text-green-700 hover:text-green-800 font-medium transition-colors"
              >
                View All <Eye className="w-3.5 h-3.5" />
              </Link>
            </div>

            {myItems.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 shadow-sm text-center">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  No Items Yet
                </h3>
                <p className="text-sm text-gray-400 mb-5">
                  Start by adding your first product
                </p>
                <Link
                  to="/post-item"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-300 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #16a34a, #059669)",
                  }}
                >
                  <Plus className="w-4 h-4" /> Post New Item
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myItems.map((item) => (
                  <Link to={`/seller/items/${item.id}`} key={item.id}>
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
                      <div className="overflow-hidden h-52">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-1">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-lg font-bold bg-clip-text text-transparent"
                            style={{
                              backgroundImage:
                                "linear-gradient(135deg, #16a34a, #059669)",
                            }}
                          >
                            ₹{item.price}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs text-gray-500 font-medium">
                              {item.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          Stock:{" "}
                          <span className="font-semibold text-gray-700">
                            {item.stock}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <Link
                to="/order-list"
                className="flex items-center gap-1.5 text-sm text-green-700 hover:text-green-800 font-medium transition-colors"
              >
                View All <Eye className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {recentOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    No Orders Yet
                  </h3>
                  <p className="text-sm text-gray-400">
                    Orders will appear here once customers make purchases
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-green-50/60 border-b border-gray-100">
                        {["Order ID", "Item", "Amount", "Status"].map((h) => (
                          <th
                            key={h}
                            className="text-left py-3.5 px-5 text-xs font-bold text-gray-500 uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-gray-50 hover:bg-green-50/30 transition-colors"
                        >
                          <td className="py-3.5 px-5 text-sm font-semibold text-green-700">
                            #{String(order.id).slice(0, 8)}
                          </td>
                          <td className="py-3.5 px-5 text-sm text-gray-700">
                            {order.outfits?.name}
                          </td>
                          <td className="py-3.5 px-5 text-sm font-semibold text-gray-800">
                            ₹{order.total_amount}
                          </td>
                          <td className="py-3.5 px-5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SellerDashboard;
