import React, { useState, useEffect } from "react";
import {
  Star,
  ThumbsUp,
  MessageCircle,
  Filter,
  ChevronDown,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { Link } from "react-router-dom";

const StarRating = ({ rating, size = "sm" }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        style={{
          width: size === "lg" ? 22 : 15,
          height: size === "lg" ? 22 : 15,
        }}
        className={
          s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
        }
      />
    ))}
  </div>
);

const SellerItemReviews = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("outfit_reviews")
        .select(
          `id, rating, review_text, helpful_count, is_verified, created_at,
          outfits(name), customer_profiles(full_name)`,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
        return;
      }

      setReviews(
        data.map((r) => ({
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
        })),
      );
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const ratingStats = {
    average: reviews.reduce((s, r) => s + r.rating, 0) / reviews.length || 0,
    total: reviews.length,
    distribution: {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    },
  };

  const filterReviews = (list) => {
    let f = [...list];
    if (selectedFilter !== "all")
      f = f.filter((r) => r.rating === Number(selectedFilter));
    if (sortBy === "recent")
      f.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === "helpful") f.sort((a, b) => b.helpful - a.helpful);
    else if (sortBy === "rating-high") f.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "rating-low") f.sort((a, b) => a.rating - b.rating);
    return f;
  };

  const filteredReviews = filterReviews(reviews);

  // Avatar color pool (green palette)
  const avatarColors = [
    { bg: "#DCFCE7", color: "#15803D" },
    { bg: "#D1FAE5", color: "#065F46" },
    { bg: "#A7F3D0", color: "#047857" },
    { bg: "#6EE7B7", color: "#064E3B" },
  ];
  const getAvatarColor = (name) =>
    avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

  if (loading)
    return (
      <div
        className="sir-root min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#F0FDF4,#fff,#ECFDF5)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#16A34A,#10B981)" }}
          >
            <div
              className="w-10 h-10 rounded-full border-2 border-white/40 border-t-white"
              style={{ animation: "spin 0.9s linear infinite" }}
            />
          </div>
          <p style={{ color: "#16A34A", fontWeight: 600 }}>Loading reviews…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div
      className="sir-root min-h-screen py-12 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg,#F0FDF4 0%,#ffffff 45%,#ECFDF5 100%)",
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.025 }}
        >
          <defs>
            <pattern
              id="sir-dots"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.4" fill="#16A34A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sir-dots)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Back button */}
        <Link
          to="/seller/dashboard"
          className="back-btn inline-flex items-center gap-2 font-medium mb-8 transition-all group"
          style={{ color: "#16A34A", textDecoration: "none" }}
        >
          <span
            className="w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 group-hover:bg-green-600 group-hover:border-green-600"
            style={{
              background: "#fff",
              borderColor: "#BBF7D0",
              boxShadow: "0 1px 4px rgba(22,163,74,0.10)",
            }}
          >
            <ArrowLeft
              style={{ width: 14, height: 14 }}
              className="group-hover:text-white transition-colors"
            />
          </span>
          Back to Dashboard
        </Link>

        {/* Page header */}
        <div className="page-header mb-8">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold mb-3"
            style={{
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              color: "#15803D",
            }}
          >
            <TrendingUp style={{ width: 13, height: 13 }} /> Review Analytics
          </span>
          <h1
            className="font-bold mb-1"
            style={{
              fontSize: "clamp(28px,5vw,40px)",
              background: "linear-gradient(135deg,#15803D,#059669)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Customer Reviews
          </h1>
          <p style={{ color: "#6B7280", fontSize: 16 }}>
            See what customers are saying about your products
          </p>
        </div>

        {/* ── RATING DISTRIBUTION ── */}
        <div
          className="dist-card bg-white rounded-3xl p-8 mb-8"
          style={{
            boxShadow: "0 4px 28px rgba(22,163,74,0.08)",
            border: "1px solid rgba(187,247,208,0.6)",
          }}
        >
          {/* shimmer bar */}
          <div
            className="h-1 rounded-t-3xl -mt-8 mb-8"
            style={{
              background:
                "linear-gradient(90deg,#16A34A,#10B981,#22C55E,#10B981,#16A34A)",
              backgroundSize: "200% 100%",
              animation: "shimBar 3s linear infinite",
              marginLeft: -32,
              marginRight: -32,
              borderRadius: 0,
            }}
          />

          <div className="flex flex-col md:flex-row gap-8">
            {/* Average score */}
            <div
              className="text-center md:pr-8"
              style={{ borderRight: "1px solid #F0FDF4" }}
            >
              <div
                className="font-bold mb-3"
                style={{
                  fontSize: 64,
                  lineHeight: 1,
                  background: "linear-gradient(135deg,#15803D,#059669)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {ratingStats.average.toFixed(1)}
              </div>
              <StarRating rating={Math.round(ratingStats.average)} size="lg" />
              <p
                style={{
                  fontSize: 13,
                  color: "#9CA3AF",
                  marginTop: 10,
                  fontWeight: 500,
                }}
              >
                Based on {ratingStats.total} reviews
              </p>
            </div>

            {/* Bar chart */}
            <div className="flex-1">
              <h3
                className="font-semibold text-gray-800 mb-4"
                style={{ fontSize: 14 }}
              >
                Rating Distribution
              </h3>
              {[5, 4, 3, 2, 1].map((r) => {
                const count = ratingStats.distribution[r];
                const pct = ratingStats.total
                  ? (count / ratingStats.total) * 100
                  : 0;
                return (
                  <div key={r} className="flex items-center gap-3 mb-2.5">
                    <div
                      className="flex items-center gap-1"
                      style={{ minWidth: 52 }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {r}
                      </span>
                      <Star
                        style={{ width: 12, height: 12 }}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    </div>
                    <div
                      className="flex-1 rounded-full overflow-hidden"
                      style={{ height: 10, background: "#F0FDF4" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: "linear-gradient(90deg,#22C55E,#10B981)",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        minWidth: 28,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                        textAlign: "right",
                      }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <div
          className="filter-bar bg-white rounded-2xl p-5 mb-8"
          style={{
            boxShadow: "0 2px 16px rgba(22,163,74,0.06)",
            border: "1px solid rgba(187,247,208,0.5)",
          }}
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="filter-btn flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200"
                style={{
                  background: "#F0FDF4",
                  border: "1.5px solid #BBF7D0",
                  color: "#374151",
                }}
              >
                <Filter style={{ width: 14, height: 14, color: "#16A34A" }} />
                {selectedFilter === "all"
                  ? "All Ratings"
                  : `${selectedFilter} Stars`}
                <ChevronDown
                  style={{ width: 14, height: 14, color: "#9CA3AF" }}
                />
              </button>

              {showFilterMenu && (
                <div
                  className="dropdown absolute top-full mt-2 bg-white rounded-xl shadow-xl z-20 overflow-hidden"
                  style={{
                    minWidth: 140,
                    border: "1px solid #BBF7D0",
                    boxShadow: "0 8px 24px rgba(22,163,74,0.12)",
                  }}
                >
                  {["all", "5", "4", "3", "2", "1"].map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setSelectedFilter(f);
                        setShowFilterMenu(false);
                      }}
                      className="dropdown-item w-full text-left px-4 py-2.5 text-sm font-medium transition-colors"
                      style={{
                        color: selectedFilter === f ? "#16A34A" : "#374151",
                        background:
                          selectedFilter === f ? "#F0FDF4" : "transparent",
                      }}
                    >
                      {f === "all" ? "All Ratings" : `${f} Stars`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all duration-200"
              style={{
                background: "#F9FAFB",
                border: "1.5px solid #E5E7EB",
                color: "#374151",
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#22C55E";
                e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E5E7EB";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
            </select>

            {/* Count badge */}
            <div
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-2"
              style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22C55E",
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#15803D" }}>
                {filteredReviews.length} / {reviews.length} reviews
              </span>
            </div>
          </div>
        </div>

        {/* ── REVIEW CARDS ── */}
        <div className="reviews-list space-y-4">
          {filteredReviews.map((review, idx) => {
            const ac = getAvatarColor(review.customerName);
            return (
              <div
                key={review.id}
                className="review-card bg-white rounded-2xl p-6 transition-all duration-200"
                style={{
                  boxShadow: "0 2px 16px rgba(22,163,74,0.07)",
                  border: "1px solid rgba(187,247,208,0.5)",
                  animationDelay: `${idx * 40}ms`,
                }}
              >
                <div className="flex gap-4 mb-4">
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0"
                    style={{
                      background: ac.bg,
                      color: ac.color,
                      border: `1.5px solid ${ac.bg}`,
                    }}
                  >
                    {review.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4
                        className="font-semibold text-gray-800"
                        style={{ fontSize: 14 }}
                      >
                        {review.customerName}
                      </h4>
                      {review.verified && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{
                            background: "#DCFCE7",
                            color: "#15803D",
                            border: "1px solid #BBF7D0",
                          }}
                        >
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <StarRating rating={review.rating} />
                    <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Item name */}
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#16A34A",
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: "#15803D" }}
                  >
                    {review.itemName}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: 14,
                    color: "#4B5563",
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  {review.review}
                </p>

                {/* Actions */}
                <div className="flex gap-5">
                  <button
                    className="review-action flex items-center gap-1.5 transition-colors duration-150"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6B7280",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    <ThumbsUp style={{ width: 14, height: 14 }} />
                    {review.helpful} Helpful
                  </button>
                  <button
                    className="review-action flex items-center gap-1.5 transition-colors duration-150"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6B7280",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    <MessageCircle style={{ width: 14, height: 14 }} />
                    Reply
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredReviews.length === 0 && !loading && (
          <div
            className="empty-state bg-white rounded-3xl p-14 text-center"
            style={{
              boxShadow: "0 4px 20px rgba(22,163,74,0.07)",
              border: "1px solid rgba(187,247,208,0.5)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "#F0FDF4" }}
            >
              <MessageCircle
                style={{ width: 28, height: 28, color: "#9CA3AF" }}
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No reviews found
            </h3>
            <p style={{ color: "#6B7280", fontSize: 14 }}>
              Try adjusting your filters to see more reviews
            </p>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sir-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .blob { position:absolute; border-radius:50%; filter:blur(88px); pointer-events:none; }
        .blob-1 { top:-60px; left:-60px; width:440px; height:440px;
          background:radial-gradient(circle,rgba(74,222,128,0.18),transparent 70%);
          animation:sirBlob 11s ease-in-out infinite; }
        .blob-2 { bottom:-80px; right:-80px; width:480px; height:480px;
          background:radial-gradient(circle,rgba(16,185,129,0.14),transparent 70%);
          animation:sirBlob 13s ease-in-out infinite; animation-delay:-5s; }
        @keyframes sirBlob { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(16px,-16px)scale(1.04)} }

        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes shimBar { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

        .page-header  { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .dist-card    { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .filter-bar   { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
        .reviews-list { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .empty-state  { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        @keyframes slideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

        .review-card { animation: fadeLeft 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeLeft { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        .review-card:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(22,163,74,0.10) !important; }

        .review-action:hover { color:#16A34A !important; }

        .filter-btn:hover { background:#DCFCE7 !important; border-color:#22C55E !important; }
        .dropdown-item:hover { background:#F0FDF4 !important; color:#16A34A !important; }

        .back-btn { animation: fadeIn 0.3s ease both; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      `}</style>
    </div>
  );
};

export default SellerItemReviews;
