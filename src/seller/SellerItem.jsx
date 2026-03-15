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

/* item card image zoom */
.item-card:hover .item-img { transform:scale(1.07); }
.item-img { transition:transform 0.45s ease; width:100%; height:100%; object-fit:cover; }
`;

const categories = {
  "New Collection/Items": [],
  "Festival Offers": [],
  "Discount Offers": [],
  Men: [
    "Shirts",
    "T-Shirts",
    "Jeans",
    "Trousers",
    "Suits",
    "Jackets",
    "Sweaters",
    "Shorts",
    "Ethnic Wear",
    "Innerwear",
    "Sportswear",
  ],
  Women: [
    "Dresses",
    "Tops",
    "Sarees",
    "Salwar Suits",
    "Lehenga",
    "Jeans",
    "Skirts",
    "Jackets",
    "Ethnic Wear",
    "Western Wear",
    "Innerwear",
    "Sportswear",
  ],
  Kids: [
    "Boys Wear",
    "Girls Wear",
    "Infant Wear",
    "School Uniforms",
    "Party Wear",
    "Casual Wear",
  ],
  "Old Men": [
    "Comfortable Wear",
    "Traditional Wear",
    "Casual Shirts",
    "Trousers",
    "Sweaters",
    "Jackets",
  ],
  "Old Women": [
    "Comfortable Wear",
    "Sarees",
    "Salwar Suits",
    "Casual Wear",
    "Traditional Wear",
  ],
  Newborn: [
    "Bodysuits",
    "Rompers",
    "Sleep Suits",
    "Bibs",
    "Caps",
    "Mittens",
    "Booties",
  ],
  Accessories: [
    "Bags",
    "Wallets",
    "Belts",
    "Ties",
    "Scarves",
    "Hats",
    "Caps",
    "Sunglasses",
    "Watches",
    "Hair Accessories",
  ],
  Jewelleries: [
    "Necklaces",
    "Earrings",
    "Rings",
    "Bracelets",
    "Bangles",
    "Anklets",
    "Pendants",
    "Chains",
    "Brooches",
  ],
  Shoes: [
    "Formal Shoes",
    "Casual Shoes",
    "Sports Shoes",
    "Loafers",
    "Boots",
    "Sneakers",
  ],
  Sandals: [
    "Flat Sandals",
    "Heeled Sandals",
    "Flip Flops",
    "Slippers",
    "Gladiators",
    "Wedges",
  ],
};

/* ── Stat Card ── */
const StatCard = ({ label, value, icon, colorClasses, delay }) => (
  <div
    className={`anim-fade bg-white rounded-2xl border border-green-100 p-5 shadow-sm hover:-translate-y-1 hover:shadow-md hover:shadow-green-100 transition-all`}
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorClasses}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="font-display text-2xl font-bold text-gray-900 m-0">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const SellerItem = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  /* ── All logic unchanged ── */
  useEffect(() => {
    const fetchSellerItems = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("outfits")
        .select(
          `id,name,category,price,discount_price,stock_quantity,created_at,outfit_images(image_url,is_main),outfit_variants(size,color),outfit_reviews(rating)`,
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

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const { error } = await supabase.from("outfits").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete item");
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const statusBadge = (status) => {
    const map = {
      active: "bg-green-500 text-white",
      "low-stock": "bg-yellow-500 text-white",
      "out-of-stock": "bg-red-500 text-white",
    };
    const label = {
      active: "Active",
      "low-stock": "Low Stock",
      "out-of-stock": "Out of Stock",
    };
    return (
      <span
        className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${map[status]}`}
      >
        {label[status]}
      </span>
    );
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={13}
        className={
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }
      />
    ));

  /* ── Loading ── */
  if (loading)
    return (
      <>
        <style>{injectStyles}</style>
        <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50 flex items-center justify-center">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-sm">
              Loading your items…
            </p>
          </div>
        </div>
      </>
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-gradient font-display text-4xl tracking-tight m-0 mb-1">
                My Items
              </h1>
              <p className="text-gray-500 text-sm m-0">
                Manage your listed outfits
              </p>
            </div>
            <Link
              to="/post-item"
              className="bg-green-grad no-underline inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 transition-all"
            >
              <Upload size={16} /> Add New Item
            </Link>
          </div>

          {/* Search + filter */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-green-100 shadow-sm p-5 mb-7">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search items…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-green-100 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
              <div className="relative">
                <Filter
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-5 py-3 border-2 border-green-100 rounded-xl text-sm outline-none focus:border-green-600 bg-white cursor-pointer text-gray-700 transition-all"
                >
                  <option value="all">All Categories</option>
                  {Object.keys(categories).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Items"
              value={items.length}
              icon={<Package size={20} className="text-green-700" />}
              colorClasses="bg-green-50"
              delay="0.05s"
            />
            <StatCard
              label="Active"
              value={items.filter((i) => i.status === "active").length}
              icon={<CheckCircle size={20} className="text-green-600" />}
              colorClasses="bg-green-50"
              delay="0.1s"
            />
            <StatCard
              label="Low Stock"
              value={items.filter((i) => i.status === "low-stock").length}
              icon={<Clock size={20} className="text-yellow-600" />}
              colorClasses="bg-yellow-50"
              delay="0.15s"
            />
            <StatCard
              label="Out of Stock"
              value={items.filter((i) => i.status === "out-of-stock").length}
              icon={<XCircle size={20} className="text-red-500" />}
              colorClasses="bg-red-50"
              delay="0.2s"
            />
          </div>

          {/* Items grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="item-card anim-fade bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-green-100 hover:-translate-y-1.5 transition-all"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="relative h-60 overflow-hidden bg-green-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-img"
                    />
                    {statusBadge(item.status)}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(item.rating)}
                      <span className="text-xs text-gray-400 ml-1">
                        ({item.rating})
                      </span>
                    </div>

                    <h3 className="font-semibold text-base text-gray-900 mb-3 leading-snug">
                      {item.name}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gradient font-display text-2xl font-bold">
                        ₹{item.price}
                      </span>
                      <div className="text-xs text-gray-500">
                        Stock:{" "}
                        <span className="font-semibold text-gray-700">
                          {item.stock_quantity}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mb-4">
                      Reviews:{" "}
                      <span className="font-semibold text-gray-600">
                        {item.reviewsCount}
                      </span>
                    </p>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/seller/items/${item.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-semibold no-underline hover:bg-green-100 transition-colors"
                      >
                        <Eye size={13} /> View
                      </Link>
                      <Link
                        to={`/post-item/${item.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold no-underline hover:bg-blue-100 transition-colors"
                      >
                        <Edit size={13} /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-2 rounded-xl bg-red-50 text-red-600 border-none cursor-pointer hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="anim-fade bg-white/85 backdrop-blur-md rounded-2xl border border-green-100 shadow-sm p-16 text-center">
              <Package size={56} className="mx-auto mb-4 text-green-200" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Items Found
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {searchTerm || filterCategory !== "all"
                  ? "Try adjusting your filters"
                  : "Start by adding your first product"}
              </p>
              <Link
                to="/post-item"
                className="bg-green-grad no-underline inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 transition-all"
              >
                <Upload size={15} /> Add New Item
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerItem;
