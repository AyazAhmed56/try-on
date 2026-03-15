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

const injectStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
* { font-family: 'DM Sans', sans-serif; }
.font-display { font-family: 'DM Serif Display', serif; }

.text-gradient {
  background: linear-gradient(135deg,#15803d,#059669);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.bg-green-grad { background: linear-gradient(135deg,#15803d,#059669); }

@keyframes fadeUp   { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
@keyframes floatBlob{ 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-16px) scale(1.04);} }
@keyframes spin     { to{transform:rotate(360deg);} }

.anim-fade { animation: fadeUp 0.4s ease both; }

.blob {
  position:absolute; border-radius:50%; pointer-events:none; filter:blur(80px);
}
.blob-1 { width:420px; height:420px; background:rgba(134,239,172,0.26); top:-60px; left:-80px; animation:floatBlob 7s ease-in-out infinite; }
.blob-2 { width:360px; height:360px; background:rgba(52,211,153,0.18); bottom:40px; right:-60px; animation:floatBlob 9s ease-in-out infinite reverse; }

.spinner {
  width:44px; height:44px;
  border:3px solid #dcfce7; border-top-color:#15803d;
  border-radius:50%; animation:spin 0.8s linear infinite;
}

/* product card image zoom */
.prod-link:hover .prod-img { transform:scale(1.07); }
.prod-img { transition:transform 0.45s ease; width:100%; height:100%; object-fit:cover; }
`;

const OtherSellerReviewsAndItems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── All logic unchanged ── */
  useEffect(() => {
    const fetchOtherSellers = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("outfits")
        .select(
          `id,name,price,seller_id,outfit_images(image_url,is_main),outfit_reviews(id,rating,review_text,created_at)`,
        )
        .neq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
        setLoading(false);
        return;
      }

      const grouped = {};
      data.forEach((outfit) => {
        const sid = outfit.seller_id;
        if (!grouped[sid]) {
          grouped[sid] = {
            sellerId: sid,
            sellerName: `Seller ${sid.slice(0, 6)}`,
            sellerImage: `https://ui-avatars.com/api/?name=Seller&background=15803d&color=fff`,
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
        grouped[sid].items.push({
          id: outfit.id,
          name: outfit.name,
          price: outfit.price,
          image: mainImage,
          rating: avgRating || 0,
          reviews: outfit.outfit_reviews.length,
        });
        outfit.outfit_reviews.forEach((r) => {
          grouped[sid].reviews.push({
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
        size={14}
        className={
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }
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

  /* ── Loading ── */
  if (loading)
    return (
      <>
        <style>{injectStyles}</style>
        <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50 flex items-center justify-center">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-sm">
              Loading other sellers…
            </p>
          </div>
        </div>
      </>
    );

  const tabBtn = (id, label, Icon) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all ${
        activeTab === id
          ? "bg-green-grad text-white shadow-md shadow-green-200"
          : "bg-green-50 text-green-700 hover:bg-green-100"
      }`}
    >
      {Icon && <Icon size={14} />} {label}
    </button>
  );

  return (
    <>
      <style>{injectStyles}</style>

      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-50 py-12 px-4 relative overflow-hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="relative max-w-7xl mx-auto">
          {/* Back link */}
          <Link
            to="/seller/dashboard"
            className="inline-flex items-center gap-1.5 text-green-700 font-medium text-sm no-underline mb-6 hover:gap-2.5 transition-all"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-gradient font-display text-4xl tracking-tight m-0 mb-2">
              Other Sellers – Items &amp; Reviews
            </h1>
            <p className="text-gray-500 text-base m-0">
              Explore outfits and customer feedback from other sellers
            </p>
          </div>

          {/* Search + filter + tabs */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-green-100 shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  className="w-full pl-10 pr-4 py-3 border-2 border-green-100 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                  placeholder="Search sellers, items, reviews…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Rating filter */}
              <div className="relative">
                <Filter
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="pl-10 pr-5 py-3 border-2 border-green-100 rounded-xl text-sm outline-none focus:border-green-600 bg-white cursor-pointer text-gray-700 transition-all"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5★ Only</option>
                  <option value="4">4★ &amp; Above</option>
                  <option value="3">3★ &amp; Above</option>
                </select>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {tabBtn("all", "All")}
              {tabBtn("items", "Items Only", Package)}
              {tabBtn("reviews", "Reviews Only", MessageSquare)}
            </div>
          </div>

          {/* Sellers list */}
          <div className="flex flex-col gap-7">
            {filteredSellers.map((seller, si) => (
              <div
                key={seller.sellerId}
                className="anim-fade bg-white/90 backdrop-blur-md rounded-2xl border border-green-100 shadow-sm overflow-hidden hover:shadow-lg hover:shadow-green-100 transition-all"
                style={{ animationDelay: `${si * 0.07}s` }}
              >
                {/* Seller header */}
                <div className="bg-green-grad px-6 py-5 text-white flex items-center gap-4">
                  <img
                    src={seller.sellerImage}
                    alt={seller.sellerName}
                    className="w-14 h-14 rounded-full border-4 border-white/50 shadow-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-lg m-0 mb-1">
                      {seller.sellerName}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-white/85">
                      <span className="flex items-center gap-1.5">
                        <ShoppingBag size={13} /> {seller.items.length} items
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare size={13} /> {seller.reviews.length}{" "}
                        reviews
                      </span>
                    </div>
                  </div>
                  <Store
                    size={28}
                    className="text-white/60 hidden md:block shrink-0"
                  />
                </div>

                {/* Items section */}
                {activeTab !== "reviews" && seller.items.length > 0 && (
                  <div className="p-6">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <Package size={15} className="text-green-700" /> Products
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {seller.items.map((item) => (
                        <Link
                          key={item.id}
                          to={`/customer/product/${item.id}`}
                          className="prod-link bg-white rounded-2xl border border-green-50 shadow-sm overflow-hidden no-underline hover:shadow-lg hover:shadow-green-100 hover:-translate-y-1 transition-all"
                        >
                          <div className="h-52 overflow-hidden bg-green-50">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="prod-img"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1">
                              {item.name}
                            </h4>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-gradient font-display text-lg font-bold">
                                ₹{item.price}
                              </span>
                              <div className="flex items-center gap-0.5">
                                {renderStars(item.rating)}
                              </div>
                            </div>
                            <p className="text-xs text-gray-400">
                              {item.reviews}{" "}
                              {item.reviews === 1 ? "review" : "reviews"}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews section */}
                {activeTab !== "items" && seller.reviews.length > 0 && (
                  <div
                    className={`p-6 ${activeTab !== "reviews" && seller.items.length > 0 ? "border-t border-green-50" : ""}`}
                  >
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <MessageSquare size={15} className="text-green-700" />{" "}
                      Customer Reviews
                    </h3>
                    <div className="flex flex-col gap-3">
                      {seller.reviews.slice(0, 5).map((r) => (
                        <div
                          key={r.id}
                          className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm m-0">
                                {r.customerName}
                              </p>
                              <p className="text-xs text-green-700 font-medium mt-0.5">
                                {r.itemName}
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {renderStars(r.rating)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed m-0">
                            {r.comment}
                          </p>
                          <p className="text-xs text-gray-400 mt-2 m-0">
                            {new Date(r.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {seller.reviews.length > 5 && (
                        <p className="text-xs text-gray-400 text-center">
                          + {seller.reviews.length - 5} more reviews
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Empty states */}
                {activeTab === "items" && seller.items.length === 0 && (
                  <div className="p-12 text-center text-gray-400">
                    <Package
                      size={44}
                      className="mx-auto mb-3 text-green-200"
                    />
                    <p className="text-sm">No items available</p>
                  </div>
                )}
                {activeTab === "reviews" && seller.reviews.length === 0 && (
                  <div className="p-12 text-center text-gray-400">
                    <MessageSquare
                      size={44}
                      className="mx-auto mb-3 text-green-200"
                    />
                    <p className="text-sm">No reviews yet</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No results */}
          {filteredSellers.length === 0 && (
            <div className="anim-fade bg-white/85 backdrop-blur-md rounded-2xl border border-green-100 shadow-sm p-16 text-center">
              <Store size={56} className="mx-auto mb-4 text-green-200" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Sellers Found
              </h3>
              <p className="text-gray-500 text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OtherSellerReviewsAndItems;
