import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import {
  Star,
  Package,
  Tag,
  Palette,
  Ruler,
  Shirt,
  Sparkles,
  Edit3,
} from "lucide-react";
import BackButtonByRole from "../pages/BackButtonByRole";

const ItemView = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data, error } = await supabase
          .from("outfits")
          .select(
            `
          id,
          name,
          description,
          price,
          discount_price,
          stock_quantity,
          category,
          brand,
          material,
          care_instructions,
          outfit_images(id,image_url,is_main),
          outfit_variants(size,color),
          outfit_reviews(rating, review)
        `,
          )
          .eq("id", id)
          .single();

        if (error) throw error;

        const mainImage =
          data.outfit_images?.find((i) => i.is_main)?.image_url ||
          data.outfit_images?.[0]?.image_url ||
          null;

        setItem(data);
        setActiveImage(mainImage);
      } catch (err) {
        console.error("Error fetching item:", err);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) {
    return (
      <div
        className="iv-root min-h-screen flex items-center justify-center"
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
          <p style={{ color: "#16A34A", fontWeight: 600 }}>
            Loading item details…
          </p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const avgRating = item.outfit_reviews?.length
    ? item.outfit_reviews.reduce((s, r) => s + r.rating, 0) /
      item.outfit_reviews.length
    : 0;
  const mainImage = item.outfit_images.find((i) => i.is_main)?.image_url;
  const additionalImages = item.outfit_images.filter((i) => !i.is_main);
  const uniqueSizes = [...new Set(item.outfit_variants.map((v) => v.size))];
  const uniqueColors = [...new Set(item.outfit_variants.map((v) => v.color))];
  const discount = item.discount_price
    ? Math.round(((item.price - item.discount_price) / item.price) * 100)
    : 0;

  return (
    <div
      className="iv-root min-h-screen py-12 px-4 relative overflow-hidden"
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
              id="iv-dots"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.4" fill="#16A34A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#iv-dots)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <BackButtonByRole />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── LEFT: Images ── */}
          <div className="space-y-4 img-col">
            {/* Main image */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                boxShadow: "0 8px 40px rgba(22,163,74,0.12)",
                border: "1px solid rgba(187,247,208,0.6)",
              }}
            >
              <img
                src={activeImage || mainImage}
                alt={item.name}
                className="w-full object-cover transition-all duration-500"
                style={{ height: 420 }}
              />
            </div>

            {/* Thumbnail strip */}
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {/* Main thumb */}
                <button
                  onClick={() => setActiveImage(mainImage)}
                  className="thumb-btn rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    border:
                      activeImage === mainImage
                        ? "2px solid #16A34A"
                        : "2px solid transparent",
                    boxShadow:
                      activeImage === mainImage
                        ? "0 0 0 2px rgba(22,163,74,0.20)"
                        : "none",
                  }}
                >
                  <img
                    src={mainImage}
                    alt="main"
                    className="w-full h-20 object-cover"
                  />
                </button>

                {additionalImages.slice(0, 3).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img.image_url)}
                    className="thumb-btn rounded-xl overflow-hidden transition-all duration-200"
                    style={{
                      border:
                        activeImage === img.image_url
                          ? "2px solid #16A34A"
                          : "2px solid transparent",
                      boxShadow:
                        activeImage === img.image_url
                          ? "0 0 0 2px rgba(22,163,74,0.20)"
                          : "none",
                    }}
                  >
                    <img
                      src={img.image_url}
                      alt={`img-${i}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="space-y-5 details-col">
            {/* Product Info Card */}
            <div
              className="bg-white rounded-3xl overflow-hidden"
              style={{
                boxShadow: "0 4px 28px rgba(22,163,74,0.08)",
                border: "1px solid rgba(187,247,208,0.6)",
              }}
            >
              {/* shimmer bar */}
              <div
                className="h-1.5"
                style={{
                  background:
                    "linear-gradient(90deg,#16A34A,#10B981,#22C55E,#10B981,#16A34A)",
                  backgroundSize: "200% 100%",
                  animation: "shimBar 3s linear infinite",
                }}
              />

              <div className="p-6">
                {/* Name + badges */}
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                  {item.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: "#DCFCE7",
                      color: "#15803D",
                      border: "1px solid #BBF7D0",
                    }}
                  >
                    {item.category}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: "#D1FAE5",
                      color: "#065F46",
                      border: "1px solid #A7F3D0",
                    }}
                  >
                    {item.brand || "No Brand"}
                  </span>
                </div>

                {/* Rating */}
                <div
                  className="flex items-center gap-3 mb-5 pb-5"
                  style={{ borderBottom: "1px solid #F0FDF4" }}
                >
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        style={{ width: 18, height: 18 }}
                        className={
                          i < Math.round(avgRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-700">
                    {avgRating.toFixed(1)}
                  </span>
                  <span style={{ fontSize: 13, color: "#9CA3AF" }}>
                    ({item.outfit_reviews.length} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span
                      className="font-bold"
                      style={{
                        fontSize: 38,
                        background: "linear-gradient(135deg,#15803D,#059669)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        lineHeight: 1.1,
                      }}
                    >
                      ₹{item.discount_price || item.price}
                    </span>
                    {item.discount_price && (
                      <span
                        style={{
                          fontSize: 20,
                          color: "#D1D5DB",
                          textDecoration: "line-through",
                        }}
                      >
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                  {item.discount_price && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                      style={{
                        background: "#DCFCE7",
                        color: "#15803D",
                        fontSize: 13,
                        fontWeight: 600,
                        border: "1px solid #BBF7D0",
                      }}
                    >
                      🎉 Save ₹{item.price - item.discount_price} ({discount}%
                      off)
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-5"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <Package
                    style={{ width: 18, height: 18, color: "#16A34A" }}
                  />
                  <span style={{ fontSize: 14, color: "#374151" }}>
                    Stock Available:{" "}
                    <span style={{ color: "#16A34A", fontWeight: 700 }}>
                      {item.stock_quantity}
                    </span>{" "}
                    units
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p
                    style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.75 }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Variants Card */}
            <div
              className="bg-white rounded-3xl p-6"
              style={{
                boxShadow: "0 4px 20px rgba(22,163,74,0.07)",
                border: "1px solid rgba(187,247,208,0.5)",
              }}
            >
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Tag style={{ width: 16, height: 16, color: "#16A34A" }} />{" "}
                Available Variants
              </h3>

              {/* Sizes */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Ruler style={{ width: 15, height: 15, color: "#16A34A" }} />
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}
                  >
                    Sizes
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueSizes.map((size, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg font-semibold"
                      style={{
                        background: "#DCFCE7",
                        color: "#15803D",
                        border: "1px solid #BBF7D0",
                        fontSize: 13,
                      }}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette
                    style={{ width: 15, height: 15, color: "#059669" }}
                  />
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}
                  >
                    Colors
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueColors.map((color, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg font-semibold"
                      style={{
                        background: "#D1FAE5",
                        color: "#065F46",
                        border: "1px solid #A7F3D0",
                        fontSize: 13,
                      }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details Card */}
            {(item.material || item.care_instructions) && (
              <div
                className="bg-white rounded-3xl p-6"
                style={{
                  boxShadow: "0 4px 20px rgba(22,163,74,0.07)",
                  border: "1px solid rgba(187,247,208,0.5)",
                }}
              >
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Shirt style={{ width: 16, height: 16, color: "#16A34A" }} />{" "}
                  Product Details
                </h3>
                <div className="space-y-2">
                  {item.material && (
                    <div className="flex items-start gap-2">
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#374151",
                          minWidth: 140,
                        }}
                      >
                        Material:
                      </span>
                      <span style={{ fontSize: 13, color: "#6B7280" }}>
                        {item.material}
                      </span>
                    </div>
                  )}
                  {item.care_instructions && (
                    <div className="flex items-start gap-2">
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#374151",
                          minWidth: 140,
                        }}
                      >
                        Care Instructions:
                      </span>
                      <span style={{ fontSize: 13, color: "#6B7280" }}>
                        {item.care_instructions}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {/* <button
                onClick={() => navigate(`/customer/try-on/${item.id}`)}
                className="action-btn flex-1 py-3.5 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg,#16A34A,#10B981)",
                  boxShadow: "0 4px 16px rgba(22,163,74,0.30)",
                  fontSize: 14,
                }}
              >
                <Sparkles style={{ width: 17, height: 17 }} />
                Virtual Try-On
              </button> */}
              <Link
                to={`/post-item/${item.id}`}
                className="action-btn flex-1 py-3.5 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: "#fff",
                  color: "#16A34A",
                  border: "1.5px solid #BBF7D0",
                  boxShadow: "0 2px 8px rgba(22,163,74,0.08)",
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                <Edit3 style={{ width: 16, height: 16 }} />
                Edit Item
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {item.outfit_reviews.length > 0 && (
          <div className="mt-14 reviews-section">
            <div className="flex items-center gap-3 mb-6">
              <h2
                className="font-bold"
                style={{
                  fontSize: "clamp(22px,4vw,30px)",
                  background: "linear-gradient(135deg,#15803D,#059669)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Customer Reviews
              </h2>
              <span
                className="rounded-full px-3 py-1 text-sm font-semibold"
                style={{
                  background: "#DCFCE7",
                  color: "#15803D",
                  border: "1px solid #BBF7D0",
                }}
              >
                {item.outfit_reviews.length} review
                {item.outfit_reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {item.outfit_reviews.slice(0, 6).map((review, i) => (
                <div
                  key={i}
                  className="review-card bg-white rounded-2xl p-5 transition-all duration-200"
                  style={{
                    boxShadow: "0 2px 16px rgba(22,163,74,0.07)",
                    border: "1px solid rgba(187,247,208,0.5)",
                  }}
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        style={{ width: 14, height: 14 }}
                        className={
                          j < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-200"
                        }
                      />
                    ))}
                    <span
                      style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 4 }}
                    >
                      {review.rating}/5
                    </span>
                  </div>
                  <p
                    style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.65 }}
                  >
                    {review.review}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .iv-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .blob { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
        .blob-1 { top:-60px; left:-60px; width:460px; height:460px;
          background:radial-gradient(circle,rgba(74,222,128,0.18),transparent 70%);
          animation:ivBlob 11s ease-in-out infinite; }
        .blob-2 { bottom:-80px; right:-80px; width:500px; height:500px;
          background:radial-gradient(circle,rgba(16,185,129,0.14),transparent 70%);
          animation:ivBlob 13s ease-in-out infinite; animation-delay:-5s; }
        @keyframes ivBlob { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(18px,-16px)scale(1.04)} }

        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimBar { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

        .img-col  { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .details-col { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .reviews-section { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .thumb-btn:hover { opacity:0.85; transform:scale(1.04); }
        .thumb-btn { cursor:pointer; background:none; padding:0; }

        .review-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(22,163,74,0.11) !important; }

        .action-btn:hover  { transform:translateY(-2px); filter:brightness(1.06); }
        .action-btn:active { transform:scale(0.98); }
      `}</style>
    </div>
  );
};

export default ItemView;
