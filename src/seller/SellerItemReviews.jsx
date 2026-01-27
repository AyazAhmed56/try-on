import React, { useState, useEffect } from "react";
import {
  Star,
  ThumbsUp,
  MessageCircle,
  Filter,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { Link } from "react-router-dom";

const SellerItemReviews = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH REVIEWS (CORRECT WAY)
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("outfit_reviews")
        .select(
          `
          id,
          rating,
          review_text,
          helpful_count,
          is_verified,
          created_at,
          outfits ( name ),
          customer_profiles ( full_name )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
        return;
      }

      const formatted = data.map((r) => ({
        id: r.id,
        customerName: r.customer_profiles?.full_name || "Anonymous",
        avatar:
          r.customer_profiles?.full_name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "U",
        rating: r.rating,
        date: r.created_at,
        verified: r.is_verified,
        itemName: r.outfits?.name || "Unknown Item",
        review: r.review_text,
        helpful: r.helpful_count || 0,
        images: [],
      }));

      setReviews(formatted);
      setLoading(false);
    };

    fetchReviews();
  }, []);

  // 🔹 RATING STATS (DYNAMIC)
  const ratingStats = {
    average:
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0,
    total: reviews.length,
    distribution: {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    },
  };

  // 🔹 FILTER + SORT
  const filterReviews = (list) => {
    let filtered = [...list];

    if (selectedFilter !== "all") {
      filtered = filtered.filter((r) => r.rating === Number(selectedFilter));
    }

    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "helpful") {
      filtered.sort((a, b) => b.helpful - a.helpful);
    } else if (sortBy === "rating-high") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "rating-low") {
      filtered.sort((a, b) => a.rating - b.rating);
    }

    return filtered;
  };

  const filteredReviews = filterReviews(reviews);

  // 🔹 STAR COMPONENT
  const StarRating = ({ rating, size = "sm" }) => {
    const sizeClass = size === "lg" ? "w-6 h-6" : "w-4 h-4";
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // 🔹 RATING DISTRIBUTION
  const RatingDistribution = () => (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="text-center md:border-r border-gray-200 md:pr-8">
          <div className="text-6xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            {ratingStats.average.toFixed(1)}
          </div>
          <StarRating rating={Math.round(ratingStats.average)} size="lg" />
          <div className="text-sm text-gray-600 mt-3 font-medium">
            Based on {ratingStats.total} reviews
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-4">
            Rating Distribution
          </h3>
          {[5, 4, 3, 2, 1].map((r) => {
            const count = ratingStats.distribution[r];
            const percent = (count / ratingStats.total) * 100 || 0;

            return (
              <div key={r} className="flex items-center gap-3 mb-3">
                <span className="w-14 text-sm font-medium text-gray-700">
                  {r} star
                </span>
                <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-linear-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-10 text-sm font-medium text-gray-700">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // 🔹 REVIEW CARD
  const ReviewCard = ({ review }) => (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 mb-4">
      <div className="flex gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-semibold text-lg shadow-md">
          {review.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-800">
              {review.customerName}
            </h4>
            {review.verified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                ✓ Verified Purchase
              </span>
            )}
          </div>
          <StarRating rating={review.rating} />
          <p className="text-sm text-gray-500 mt-1">
            {new Date(review.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <h5 className="font-semibold text-purple-600 mb-2">{review.itemName}</h5>
      <p className="text-gray-700 leading-relaxed mb-4">{review.review}</p>

      <div className="flex gap-6 text-sm">
        <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span className="font-medium">{review.helpful} Helpful</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">Reply</span>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading reviews...</p>
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

      <div className="relative max-w-6xl mx-auto">
        <Link
          to="/seller/dashboard"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Customer Reviews
          </h1>
          <p className="text-gray-600 text-lg">
            See what customers are saying about your products
          </p>
        </div>

        <RatingDistribution />

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 px-5 py-3 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-all bg-white font-medium text-gray-700"
              >
                <Filter className="w-4 h-4 text-purple-600" />
                <span className="text-sm">
                  {selectedFilter === "all"
                    ? "All Ratings"
                    : `${selectedFilter} Stars`}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showFilterMenu && (
                <div className="absolute top-full mt-2 bg-white border-2 border-purple-200 rounded-lg shadow-xl z-10 min-w-full">
                  {["all", "5", "4", "3", "2", "1"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setSelectedFilter(filter);
                        setShowFilterMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 text-sm font-medium text-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {filter === "all" ? "All Ratings" : `${filter} Stars`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3 border-2 border-purple-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 transition-all"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
            </select>

            <div className="ml-auto text-sm font-medium text-gray-600 bg-purple-50 px-4 py-2 rounded-lg">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>
        </div>

        <div>
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {filteredReviews.length === 0 && !loading && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 text-center shadow-lg">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more reviews
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

export default SellerItemReviews;
