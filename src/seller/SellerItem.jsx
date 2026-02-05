import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Star,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { supabase } from "../services/supabase";

const SellerItem = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerItems = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("outfits")
        .select(
          `
  id,
  name,
  category,
  price,
  discount_price,
  stock_quantity,
  created_at,

  outfit_images (
    image_url,
    is_main
  ),

  outfit_variants (
    size,
    color
  ),

  outfit_reviews (
    rating
  )
`,
        )
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching items:", error);
        setLoading(false);
        return;
      }

      const formatted = data.map((item) => {
        const ratings = item.outfit_reviews?.map((r) => r.rating) || [];
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;

        const mainImage =
          item.outfit_images.find((img) => img.is_main)?.image_url ||
          "https://via.placeholder.com/300x400?text=No+Image";

        // status derived from stock
        let status = "active";
        if (item.stock_quantity === 0) status = "out-of-stock";
        else if (item.stock_quantity <= 5) status = "low-stock";

        return {
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.discount_price || item.price,
          stock_quantity: item.stock_quantity,
          rating: avgRating.toFixed(1),
          reviewsCount: item.outfit_reviews?.length || 0,
          image: mainImage,
          status,
          variantsCount: item.outfit_variants?.length || 0,
        };
      });

      setItems(formatted);
      setLoading(false);
    };

    fetchSellerItems();
  }, []);

  // 🔍 Search + Filter
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" ||
      item.category?.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 py-12 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <Link
          to="/seller/dashboard"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              My Items
            </h1>
            <p className="text-gray-600">Manage your listed outfits</p>
          </div>
          <Link
            to="/post-item"
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Upload className="w-5 h-5" />
            Add New Item
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-11 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
              >
                <option value="all">All Categories</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Items"
            value={items.length}
            icon={<Package className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            label="Active"
            value={items.filter((i) => i.status === "active").length}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            label="Low Stock"
            value={items.filter((i) => i.status === "low-stock").length}
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            label="Out of Stock"
            value={items.filter((i) => i.status === "out-of-stock").length}
            icon={<XCircle className="w-6 h-6" />}
            color="red"
          />
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "active"
                      ? "bg-green-500 text-white"
                      : item.status === "low-stock"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                  }`}
                >
                  {item.status === "active"
                    ? "Active"
                    : item.status === "low-stock"
                      ? "Low Stock"
                      : "Out of Stock"}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(item.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    ({item.rating})
                  </span>
                </div>

                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-purple-600">
                    ₹{item.price}
                  </span>
                  <div className="text-sm text-gray-600">
                    <p>
                      Stock: <span className="font-semibold">{item.stock}</span>
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Reviews:{" "}
                  <span className="font-semibold">{item.reviewsCount}</span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/seller/items/${item.id}`}
                    className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>

                  <Link
                    to={`/post-item/${item.id}`}
                    className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>

                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-lg text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Items Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your filters"
                : "Start by adding your first product"}
            </p>
            <Link
              to="/post-item"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Upload className="w-5 h-5" />
              Add New Item
            </Link>
          </div>
        )}
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

const StatCard = ({ label, value, icon, color }) => {
  const colorClasses = {
    purple: "from-purple-100 to-pink-100 text-purple-600",
    green: "from-green-100 to-emerald-100 text-green-600",
    yellow: "from-yellow-100 to-orange-100 text-yellow-600",
    red: "from-red-100 to-pink-100 text-red-600",
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 bg-linear-to-br ${colorClasses[color]} rounded-full flex items-center justify-center`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerItem;
