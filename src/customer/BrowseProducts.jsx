import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
  Heart,
  ShoppingCart,
  Camera,
  Star,
  ChevronDown,
  ChevronRight,
  Package,
  ArrowLeft,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const injectStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
* { font-family: 'DM Sans', sans-serif; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulseRing {
  0%   { box-shadow: 0 0 0 0 rgba(22,163,74,0.35); }
  70%  { box-shadow: 0 0 0 8px rgba(22,163,74,0); }
  100% { box-shadow: 0 0 0 0 rgba(22,163,74,0); }
}

.font-display { font-family: 'DM Serif Display', serif; }

.text-gradient {
  background: linear-gradient(135deg, #15803d, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.bg-green-grad { background: linear-gradient(135deg, #15803d, #059669); }

.spinner {
  width: 40px; height: 40px;
  border: 3px solid #dcfce7;
  border-top-color: #15803d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.card-in { animation: fadeUp 0.4s ease both; }
.card-in:nth-child(1) { animation-delay:.04s; }
.card-in:nth-child(2) { animation-delay:.08s; }
.card-in:nth-child(3) { animation-delay:.12s; }
.card-in:nth-child(4) { animation-delay:.16s; }
.card-in:nth-child(5) { animation-delay:.20s; }
.card-in:nth-child(6) { animation-delay:.24s; }

.prod-card:hover .prod-img { transform: scale(1.07); }
.prod-img { transition: transform 0.5s ease; }
.prod-card .img-over { opacity: 0; transition: opacity 0.3s; }
.prod-card:hover .img-over { opacity: 1; }

.list-card { transition: transform 0.25s, box-shadow 0.25s; }
.list-card:hover { transform: translateX(4px); }

.wish-btn { animation: pulseRing 2.5s ease infinite; }
`;

const BrowseProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [userId, setUserId] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);
  const navigate = useNavigate();

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

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
    { value: "popular", label: "Most Popular" },
  ];

  /* ── All logic unchanged ── */
  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("outfits")
      .select(
        `id,name,price,category,subcategory,description,stock_quantity,material,care_instructions,brand,discount_price,created_at,outfit_images(image_url,is_main)`,
      )
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }
    const formatted = data.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      category: p.category?.trim(),
      subcategory: p.subcategory?.trim(),
      description: p.description,
      stock: Number(p.stock_quantity) || 0,
      material: p.material,
      careInstructions: p.care_instructions,
      brand: p.brand,
      discountPrice: p.discount_price,
      image: p.outfit_images?.find((i) => i.is_main)?.image_url || null,
      createdAt: p.created_at,
      rating: 4.5,
    }));
    setProducts(formatted);
    setFilteredProducts(formatted);
  }, []);

  const fetchWishlist = useCallback(async (uid) => {
    try {
      const { data } = await supabase
        .from("wishlist")
        .select("outfit_id")
        .eq("customer_id", uid);
      if (data) setWishlistIds(data.map((i) => i.outfit_id));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const applyFiltersAndSort = useCallback(() => {
    let f = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      f = f.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q),
      );
    }
    if (selectedCategory !== "All")
      f = f.filter(
        (p) =>
          p.category?.toLowerCase().trim() ===
          selectedCategory.toLowerCase().trim(),
      );
    if (selectedSubcategory !== "All")
      f = f.filter(
        (p) =>
          p.subcategory?.toLowerCase().trim() ===
          selectedSubcategory.toLowerCase().trim(),
      );
    f = f.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
    switch (sortBy) {
      case "newest":
        f.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        f.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price-low":
        f.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        f.sort((a, b) => b.price - a.price);
        break;
      case "name":
        f.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "popular":
        f.sort((a, b) => b.rating - a.rating);
        break;
    }
    setFilteredProducts(f);
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    priceRange,
    sortBy,
  ]);

  const fetchUserAndProducts = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await fetchWishlist(user.id);
      }
      await fetchProducts();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, fetchWishlist]);

  useEffect(() => {
    fetchUserAndProducts();
  }, [fetchUserAndProducts]);
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const toggleWishlist = async (id) => {
    if (!userId) {
      alert("Please log in to add items to wishlist");
      navigate("/login");
      return;
    }
    try {
      if (wishlistIds.includes(id)) {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("customer_id", userId)
          .eq("outfit_id", id);
        if (!error) setWishlistIds(wishlistIds.filter((w) => w !== id));
      } else {
        const { error } = await supabase
          .from("wishlist")
          .insert({ customer_id: userId, outfit_id: id });
        if (!error) setWishlistIds([...wishlistIds, id]);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update wishlist.");
    }
  };

  const addToCart = async (productId) => {
    if (!userId) {
      alert("Please log in to add items to cart");
      navigate("/login");
      return;
    }
    try {
      const { data: existing, error: fe } = await supabase
        .from("cart")
        .select("id,quantity")
        .eq("customer_id", userId)
        .eq("outfit_id", productId)
        .maybeSingle();
      if (fe && fe.code !== "PGRST116") {
        alert("Failed to add to cart.");
        return;
      }
      if (existing) {
        const { error } = await supabase
          .from("cart")
          .update({ quantity: existing.quantity + 1 })
          .eq("id", existing.id);
        if (error) {
          alert("Failed to add to cart.");
          return;
        }
      } else {
        const { error } = await supabase
          .from("cart")
          .insert({ customer_id: userId, outfit_id: productId, quantity: 1 });
        if (error) {
          alert("Failed to add to cart.");
          return;
        }
      }
      alert("Added to cart successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to add to cart.");
    }
  };

  const toggleCategory = (cat) =>
    setExpandedCategories(
      expandedCategories.includes(cat)
        ? expandedCategories.filter((c) => c !== cat)
        : [...expandedCategories, cat],
    );
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedSubcategory("All");
  };
  const handleSubcategorySelect = (sub) => setSelectedSubcategory(sub);
  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setPriceRange({ min: 0, max: 10000 });
    setSearchQuery("");
  };

  const totalProducts = products.length;
  const totalPrice = products.reduce((s, p) => s + p.price, 0);
  const inStock = products.reduce((s, p) => s + p.stock, 0);

  return (
    <>
      <style>{injectStyles}</style>

      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-50">
        {/* ── Sticky Header ── */}
        <div className="bg-white border-b border-green-100 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-5">
            {/* Title row */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-gradient font-display text-3xl tracking-tight m-0 leading-tight">
                  Browse Products
                </h1>
                <p className="text-gray-500 text-sm mt-1 mb-0">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"} found
                </p>
              </div>
              <Link
                to="/customer/dashboard"
                className="bg-green-grad flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold no-underline hover:shadow-lg hover:shadow-green-200 transition-all"
              >
                <ArrowLeft size={15} /> Dashboard
              </Link>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2.5 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-44">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search products, categories…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-green-100 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 bg-white transition-all"
                />
              </div>

              {/* View toggle */}
              <div className="flex items-center bg-green-50 rounded-xl p-1 gap-0.5 border border-green-100">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg border-none cursor-pointer transition-all ${viewMode === "grid" ? "bg-white text-green-700 shadow-sm" : "bg-transparent text-gray-400 hover:text-green-600"}`}
                >
                  <LayoutGrid size={17} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg border-none cursor-pointer transition-all ${viewMode === "list" ? "bg-white text-green-700 shadow-sm" : "bg-transparent text-gray-400 hover:text-green-600"}`}
                >
                  <LayoutList size={17} />
                </button>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-green-100 text-sm outline-none focus:border-green-600 bg-white cursor-pointer transition-all text-gray-700"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all ${
                  showFilters
                    ? "bg-green-grad text-white border-transparent shadow-lg shadow-green-200"
                    : "bg-white border-green-100 text-gray-700 hover:border-green-400 hover:text-green-700"
                }`}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: <Package size={20} className="text-green-700" />,
                value: totalProducts,
                label: "Total Products",
              },
              {
                icon: <TrendingUp size={20} className="text-green-700" />,
                value: `₹${totalPrice.toFixed(0)}`,
                label: "Total Value",
              },
              {
                icon: <Sparkles size={20} className="text-green-700" />,
                value: inStock,
                label: "Units In Stock",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="card-in bg-white rounded-2xl border border-green-100 p-6 shadow-sm hover:-translate-y-1 hover:shadow-md hover:shadow-green-100 transition-all"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-green-50 rounded-xl p-2.5">{s.icon}</div>
                  <span className="text-gradient font-display text-3xl font-bold">
                    {s.value}
                  </span>
                </div>
                <p className="text-gray-500 text-sm font-medium m-0">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-6 items-start">
            {/* ── Sidebar ── */}
            {showFilters && (
              <aside className="w-60 shrink-0">
                <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-900 font-bold text-base">
                      Filters
                    </span>
                    <button
                      onClick={clearFilters}
                      className="text-green-700 text-xs font-semibold bg-transparent border-none cursor-pointer hover:text-green-900 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="mb-5">
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">
                      Categories
                    </p>
                    <div className="max-h-80 overflow-y-auto flex flex-col gap-0.5">
                      <button
                        onClick={() => {
                          setSelectedCategory("All");
                          setSelectedSubcategory("All");
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-left border-none cursor-pointer transition-all ${selectedCategory === "All" ? "bg-green-grad text-white" : "bg-transparent text-gray-700 hover:bg-green-50 hover:text-green-700"}`}
                      >
                        All Products
                      </button>

                      {Object.entries(categories).map(([cat, subs]) => (
                        <div key={cat}>
                          <button
                            onClick={() => {
                              handleCategorySelect(cat);
                              if (subs.length > 0) toggleCategory(cat);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-left border-none cursor-pointer transition-all ${selectedCategory === cat ? "bg-green-grad text-white" : "bg-transparent text-gray-700 hover:bg-green-50 hover:text-green-700"}`}
                          >
                            <span>{cat}</span>
                            {subs.length > 0 &&
                              (expandedCategories.includes(cat) ? (
                                <ChevronDown size={13} />
                              ) : (
                                <ChevronRight size={13} />
                              ))}
                          </button>

                          {subs.length > 0 &&
                            expandedCategories.includes(cat) && (
                              <div className="ml-3 mt-0.5 flex flex-col gap-0.5">
                                {subs.map((sub) => (
                                  <button
                                    key={sub}
                                    onClick={() => {
                                      handleCategorySelect(cat);
                                      handleSubcategorySelect(sub);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs border-none cursor-pointer transition-all ${selectedSubcategory === sub && selectedCategory === cat ? "bg-green-100 text-green-700 font-semibold" : "bg-transparent text-gray-600 hover:bg-green-50 hover:text-green-700"}`}
                                  >
                                    {sub}
                                  </button>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div>
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">
                      Price &nbsp;
                      <span className="text-green-700 font-semibold normal-case tracking-normal">
                        ₹{priceRange.min} – ₹{priceRange.max}
                      </span>
                    </p>
                    <div className="flex flex-col gap-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        min="0"
                        placeholder="Min price"
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            min: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border-2 border-green-100 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                      />
                      <input
                        type="number"
                        value={priceRange.max}
                        min="0"
                        placeholder="Max price"
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            max: parseInt(e.target.value) || 10000,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border-2 border-green-100 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </aside>
            )}

            {/* ── Products area ── */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="bg-white rounded-2xl border border-green-50 p-16 text-center shadow-sm">
                  <div className="spinner mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">Loading products…</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-green-50 p-16 text-center shadow-sm">
                  <Package size={52} className="mx-auto text-green-200 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-green-grad text-white px-7 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                /* ── Grid ── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                  {filteredProducts.map((product, idx) => (
                    <div
                      key={product.id}
                      className="prod-card card-in bg-white rounded-2xl border border-green-50 shadow-sm overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:shadow-green-100 transition-all"
                      style={{ animationDelay: `${(idx % 6) * 0.06}s` }}
                      onClick={() =>
                        navigate(`/customer/products/${product.id}`)
                      }
                    >
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="prod-img w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                            <Package size={44} className="text-green-300" />
                          </div>
                        )}

                        {/* Wishlist */}
                        <div className="absolute top-3 right-3 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product.id);
                            }}
                            className={`wish-btn w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer backdrop-blur-sm hover:scale-110 transition-all ${wishlistIds.includes(product.id) ? "bg-pink-50" : "bg-white/90"}`}
                          >
                            <Heart
                              size={15}
                              className={
                                wishlistIds.includes(product.id)
                                  ? "text-pink-500"
                                  : "text-gray-500"
                              }
                              style={{
                                fill: wishlistIds.includes(product.id)
                                  ? "#ec4899"
                                  : "none",
                              }}
                            />
                          </button>
                        </div>

                        {/* Out of stock */}
                        {product.stock === 0 && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                              Out of Stock
                            </span>
                          </div>
                        )}

                        {/* Hover action overlay */}
                        <div className="img-over absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end justify-center gap-2.5 pb-4">
                          <button
                            title="Virtual Try-On"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/customer/try-on/${product.id}`, {
                                state: {
                                  outfit: product,
                                  productImage: product.image,
                                },
                              });
                            }}
                            className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center border-none cursor-pointer text-green-800 backdrop-blur-sm hover:bg-green-700 hover:text-white hover:scale-110 transition-all"
                          >
                            <Camera size={16} />
                          </button>
                          <button
                            title="Add to Cart"
                            disabled={product.stock === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product.id);
                            }}
                            className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center border-none cursor-pointer text-green-800 backdrop-blur-sm hover:bg-green-700 hover:text-white hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {product.category}
                          </span>
                          {product.subcategory && (
                            <span className="text-gray-400 text-xs">
                              {product.subcategory}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 min-h-10">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-3">
                          <Star
                            size={12}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span className="text-xs font-semibold text-gray-700">
                            {product.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-400">
                            · {product.stock} in stock
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gradient font-display text-lg font-bold">
                            ₹{product.price.toFixed(0)}
                          </span>
                          <button
                            disabled={product.stock === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product.id);
                            }}
                            className="bg-green-grad text-white text-xs font-semibold px-4 py-2 rounded-xl border-none cursor-pointer hover:shadow-md hover:shadow-green-200 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ── List ── */
                <div className="flex flex-col gap-3">
                  {filteredProducts.map((product, idx) => (
                    <div
                      key={product.id}
                      className="list-card card-in bg-white rounded-2xl border border-green-50 shadow-sm flex items-center overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-green-100"
                      style={{ animationDelay: `${idx * 0.04}s` }}
                      onClick={() =>
                        navigate(`/customer/products/${product.id}`)
                      }
                    >
                      {/* Thumb */}
                      <div className="shrink-0 w-28 h-28">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                            <Package size={28} className="text-green-300" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 px-4 py-3 min-w-0">
                        <div className="flex gap-2 flex-wrap mb-2">
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {product.category}
                          </span>
                          {product.subcategory && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full">
                              {product.subcategory}
                            </span>
                          )}
                          {product.stock === 0 && (
                            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-1">
                          <Star
                            size={12}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span className="text-xs font-semibold text-gray-700">
                            {product.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-400">
                            · {product.stock} in stock
                          </span>
                        </div>
                        {product.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 m-0">
                            {product.description}
                          </p>
                        )}
                      </div>

                      {/* Price + actions */}
                      <div className="shrink-0 flex flex-col items-end justify-between gap-3 px-4 py-3">
                        <span className="text-gradient font-display text-xl font-bold">
                          ₹{product.price.toFixed(0)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            title="Wishlist"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product.id);
                            }}
                            className={`p-2 rounded-xl border-none cursor-pointer transition-all ${wishlistIds.includes(product.id) ? "bg-pink-50 text-pink-500" : "bg-green-50 text-gray-500 hover:text-pink-500 hover:bg-pink-50"}`}
                          >
                            <Heart
                              size={15}
                              style={{
                                fill: wishlistIds.includes(product.id)
                                  ? "#ec4899"
                                  : "none",
                              }}
                            />
                          </button>
                          <button
                            title="Virtual Try-On"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/customer/try-on/${product.id}`, {
                                state: {
                                  outfit: product,
                                  productImage: product.image,
                                },
                              });
                            }}
                            className="p-2 rounded-xl bg-green-50 text-green-700 border-none cursor-pointer hover:bg-green-700 hover:text-white transition-all"
                          >
                            <Camera size={15} />
                          </button>
                          <button
                            title="Add to Cart"
                            disabled={product.stock === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product.id);
                            }}
                            className="p-2 rounded-xl bg-green-50 text-green-700 border-none cursor-pointer hover:bg-green-700 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowseProducts;
