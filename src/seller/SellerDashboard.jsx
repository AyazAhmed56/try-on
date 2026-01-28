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
} from "lucide-react";
import { supabase } from "../services/supabase";

const SellerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState([
    { label: "Total Products", value: 0, icon: Package, color: "purple" },
    { label: "Total Orders", value: 0, icon: ShoppingBag, color: "pink" },
    { label: "Total Revenue", value: "₹0", icon: DollarSign, color: "purple" },
  ]);
  const [myItems, setMyItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    // await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      /* ================= STATS ================= */

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
        {
          label: "Total Products",
          value: productCount || 0,
          icon: Package,
          color: "purple",
        },
        {
          label: "Total Orders",
          value: orderCount || 0,
          icon: ShoppingBag,
          color: "pink",
        },
        {
          label: "Total Revenue",
          value: `₹${totalRevenue.toLocaleString()}`,
          icon: DollarSign,
          color: "purple",
        },
      ]);

      /* ================= MY ITEMS (LIMITED) ================= */

      const { data: outfits } = await supabase
        .from("outfits")
        .select(
          `
        id,
        name,
        price,
        stock,
        outfit_images (
          image_url,
          is_main
        ),
        outfit_reviews (
          rating
        )
      `,
        )
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);

      setMyItems(
        (outfits || []).map((o) => {
          const ratings = o.outfit_reviews.map((r) => r.rating);
          const avgRating =
            ratings.reduce((a, b) => a + b, 0) / (ratings.length || 1);

          return {
            id: o.id,
            name: o.name,
            price: o.price,
            stock: o.stock,
            rating: avgRating,
            image:
              o.outfit_images.find((i) => i.is_main)?.image_url ||
              "https://via.placeholder.com/400x500?text=No+Image",
          };
        }),
      );

      /* ================= RECENT ORDERS ================= */

      const { data: orders } = await supabase
        .from("orders")
        .select(
          `
        id,
        total_amount,
        status,
        outfits (
          name
        )
      `,
        )
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
    { id: "post-item", label: "Post Item", icon: Plus, path: "/post-item" },
    { id: "my-items", label: "My Items", icon: Grid3x3, path: "/my-items" },
    { id: "orders", label: "Orders", icon: ShoppingBag, path: "/order-list" },
    {
      id: "reviews",
      label: "Reviews",
      icon: MessageSquare,
      path: "/seller/reviews",
    },
    {
      id: "other-sellers",
      label: "Other Sellers",
      icon: Eye,
      path: "/other-sellers-items-reviews",
    },
    {
      id: "order-receipt",
      label: "Order Receipt",
      icon: Receipt,
      path: "/order-receipt",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-full"></div>
              <Link to="/">
                <div>
                  <h1 className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Try-on
                  </h1>
                  <p className="text-xs text-gray-600">Seller Dashboard</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-purple-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6 flex items-center justify-between bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-lg">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Seller Dashboard
            </h1>
            <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-full"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 bg-linear-to-br ${
                      stat.color === "purple"
                        ? "from-purple-100 to-pink-100"
                        : "from-pink-100 to-purple-100"
                    } rounded-full flex items-center justify-center`}
                  >
                    <stat.icon
                      className={`w-7 h-7 ${
                        stat.color === "purple"
                          ? "text-purple-600"
                          : "text-pink-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* My Items Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Items
              </h2>
              <Link
                to="/my-items"
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 transition-colors"
              >
                View All
                <Eye className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map((item) => (
                <Link to={`/seller/items/${item.id}`}>
                  <div
                    key={item.id}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-purple-600">
                          ₹{item.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {item.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          Stock:{" "}
                          <span className="font-semibold text-gray-800">
                            {item.stock}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {myItems.length === 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-lg text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Items Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by adding your first product
                </p>
                <Link
                  to="/post-item"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Post New Item
                </Link>
              </div>
            )}
          </div>

          {/* Recent Orders Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Recent Orders
              </h2>
              <Link
                to="/order-list"
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 transition-colors"
              >
                View All
                <Eye className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-linear-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Order ID
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Item
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Amount
                      </th>
                      <th className="text-left py-4 px-6 text-gray-700 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-purple-600">
                          {order.id}
                        </td>
                        <td className="py-4 px-6 text-gray-800">
                          {order.outfits?.name}
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-800">
                          ₹{order.total_amount}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "Processing"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {recentOrders.length === 0 && (
                <div className="p-12 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-gray-600">
                    Orders will appear here once customers make purchases
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

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

export default SellerDashboard;
