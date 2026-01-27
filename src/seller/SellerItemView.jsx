import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { ArrowLeft, Star, Package, Tag, Palette, Ruler } from "lucide-react";

const SellerItemView = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from("outfits")
        .select(
          `
          *,
          outfit_images(*),
          outfit_variants(*),
          outfit_reviews(rating, review_text)
        `,
        )
        .eq("id", id)
        .single();

      if (!error) setItem(data);
    };

    fetchItem();
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading item details...</p>
        </div>
      </div>
    );
  }

  const avgRating =
    item.outfit_reviews.reduce((s, r) => s + r.rating, 0) /
    (item.outfit_reviews.length || 1);

  const mainImage = item.outfit_images.find((i) => i.is_main)?.image_url;
  const additionalImages = item.outfit_images.filter((i) => !i.is_main);
  const uniqueSizes = [...new Set(item.outfit_variants.map((v) => v.size))];
  const uniqueColors = [...new Set(item.outfit_variants.map((v) => v.color))];

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 py-12 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <Link
          to="/my-items"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Items
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg">
              <img
                src={mainImage}
                alt={item.name}
                className="w-full h-96 lg:h-125 object-cover"
              />
            </div>

            {/* Additional Images */}
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {additionalImages.slice(0, 4).map((img, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-lg rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <img
                      src={img.image_url}
                      alt={`${item.name} ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {item.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                      {item.brand || "No Brand"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(avgRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({item.outfit_reviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{item.discount_price || item.price}
                  </span>
                  {item.discount_price && (
                    <span className="text-xl text-gray-400 line-through">
                      ₹{item.price}
                    </span>
                  )}
                </div>
                {item.discount_price && (
                  <span className="text-sm text-green-600 font-medium">
                    Save ₹{item.price - item.discount_price} (
                    {Math.round(
                      ((item.price - item.discount_price) / item.price) * 100,
                    )}
                    % off)
                  </span>
                )}
              </div>

              {/* Stock Info */}
              <div className="flex items-center gap-2 mb-6 p-3 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">
                  Stock Available:{" "}
                  <span className="text-purple-600 font-bold">
                    {item.stock}
                  </span>{" "}
                  units
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Variants Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Available Variants
              </h3>

              {/* Sizes */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Ruler className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-700">
                    Available Sizes:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueSizes.map((size, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium text-sm"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-5 h-5 text-pink-600" />
                  <span className="font-medium text-gray-700">
                    Available Colors:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueColors.map((color, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg font-medium text-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            {(item.material || item.care_instructions) && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Product Details
                </h3>

                {item.material && (
                  <div className="mb-3">
                    <span className="font-medium text-gray-700">Material:</span>
                    <span className="text-gray-600 ml-2">{item.material}</span>
                  </div>
                )}

                {item.care_instructions && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Care Instructions:
                    </span>
                    <span className="text-gray-600 ml-2">
                      {item.care_instructions}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link
                to={`/post-item/${item.id}`}
                className="flex-1 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center"
              >
                Edit Item
              </Link>
              <button className="px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {item.outfit_reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Customer Reviews
            </h2>
            <div className="space-y-4">
              {item.outfit_reviews.slice(0, 3).map((review, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.review_text}</p>
                </div>
              ))}
            </div>
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

export default SellerItemView;
