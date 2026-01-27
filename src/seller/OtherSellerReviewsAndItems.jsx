import React, { useEffect, useState } from "react";
import {
  Star,
  Search,
  Filter,
  Package,
  MessageSquare,
  ArrowLeft,
  Store,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

const OtherSellerReviewsAndItems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOtherSellers = async () => {
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
        price,
        seller_id,

        outfit_images (
          image_url,
          is_main
        ),

        outfit_reviews (
          id,
          rating,
          review_text,
          created_at
        )
      `,
        )
        .neq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
        setLoading(false);
        return;
      }

      // 🔁 GROUP BY SELLER
      const grouped = {};

      data.forEach((outfit) => {
        const sellerId = outfit.seller_id;

        if (!grouped[sellerId]) {
          grouped[sellerId] = {
            sellerId,
            sellerName: `Seller ${sellerId.slice(0, 6)}`,
            sellerImage: `https://ui-avatars.com/api/?name=Seller&background=9333ea&color=fff`,
            items: [],
            reviews: [],
          };
        }

        const mainImage =
          outfit.outfit_images?.find((i) => i.is_main)?.image_url ||
          "https://via.placeholder.com/300x400?text=No+Image";

        const avgRating =
          outfit.outfit_reviews.reduce((s, r) => s + r.rating, 0) /
          (outfit.outfit_reviews.length || 1);

        grouped[sellerId].items.push({
          id: outfit.id,
          name: outfit.name,
          price: outfit.price,
          image: mainImage,
          rating: avgRating || 0,
          reviews: outfit.outfit_reviews.length,
        });

        outfit.outfit_reviews.forEach((r) => {
          grouped[sellerId].reviews.push({
            id: r.id,
            customerName: "Customer",
            rating: r.rating,
            comment: r.review_text,
            date: r.created_at,
            itemName: outfit.name,
          });
        });
      });

      setSellers(Object.values(grouped));
      setLoading(false);
    };

    fetchOtherSellers();
  }, []);

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.items.some((i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      seller.reviews.some((r) =>
        r.comment.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    if (filterRating === "all") return matchesSearch;

    return (
      matchesSearch &&
      seller.reviews.some((r) => r.rating >= Number(filterRating))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading other sellers...</p>
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

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Other Sellers – Items & Reviews
          </h1>
          <p className="text-gray-600 text-lg">
            Explore outfits and customer feedback from other sellers
          </p>
        </div>

        {/* Search + Filter + Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Search sellers, items, reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="pl-11 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
              >
                <option value="all">All Ratings</option>
                <option value="5">5★ Only</option>
                <option value="4">4★ & Above</option>
                <option value="3">3★ & Above</option>
              </select>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("items")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === "items"
                  ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
            >
              <Package className="w-4 h-4" />
              Items Only
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === "reviews"
                  ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Reviews Only
            </button>
          </div>
        </div>

        {/* Sellers List */}
        <div className="space-y-8">
          {filteredSellers.map((seller) => (
            <div
              key={seller.sellerId}
              className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {/* Seller Header */}
              <div className="bg-linear-to-r from-purple-600 to-pink-600 p-6 text-white flex items-center gap-4">
                <img
                  src={seller.sellerImage}
                  alt={seller.sellerName}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
                <div className="flex-1">
                  <h2 className="font-bold text-xl mb-1">
                    {seller.sellerName}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-white/90">
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4" />
                      {seller.items.length} items
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {seller.reviews.length} reviews
                    </span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Store className="w-8 h-8 text-white/80" />
                </div>
              </div>

              {/* Items Section */}
              {activeTab !== "reviews" && seller.items.length > 0 && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    Products
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {seller.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-56 w-full object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                            {item.name}
                          </h4>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl font-bold text-purple-600">
                              ₹{item.price}
                            </span>
                            <div className="flex items-center gap-1">
                              {renderStars(item.rating)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {item.reviews} reviews
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              {activeTab !== "items" && seller.reviews.length > 0 && (
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-pink-600" />
                    Customer Reviews
                  </h3>
                  <div className="space-y-4">
                    {seller.reviews.slice(0, 5).map((r) => (
                      <div
                        key={r.id}
                        className="bg-linear-to-br from-purple-50 to-pink-50 p-5 rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {r.customerName}
                            </h4>
                            <p className="text-sm text-purple-600 font-medium">
                              {r.itemName}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(r.rating)}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {r.comment}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(r.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    {seller.reviews.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        + {seller.reviews.length - 5} more reviews
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {activeTab === "items" && seller.items.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No items available</p>
                </div>
              )}

              {activeTab === "reviews" && seller.reviews.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No reviews yet</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSellers.length === 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-lg text-center">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Sellers Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
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

export default OtherSellerReviewsAndItems;
