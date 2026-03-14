import React, { useState, useEffect, useCallback } from "react";
import {
  Heart,
  ShoppingCart,
  Camera,
  Trash2,
  Grid,
  List,
  SlidersHorizontal,
  Star,
  X,
  Search,
  TrendingUp,
  Package,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  const categories = [
    "All",
    "Dresses",
    "Tops",
    "Bottoms",
    "Outerwear",
    "Accessories",
  ];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
  ];

  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...wishlistItems];
    if (searchQuery.trim())
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      );
    if (filterCategory !== "all")
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === filterCategory.toLowerCase(),
      );
    filtered = filtered.filter(
      (item) =>
        item.price >= (priceRange.min || 0) &&
        item.price <= (priceRange.max || Infinity),
    );
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    setFilteredItems(filtered);
  }, [wishlistItems, searchQuery, filterCategory, priceRange, sortBy]);

  const fetchUserAndWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);
      await fetchWishlist(user.id);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserAndWishlist();
  }, [fetchUserAndWishlist]);
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const fetchWishlist = async (currentUserId) => {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select(
          `id, created_at, outfits(id, name, price, category, description, outfit_images(image_url, is_main))`,
        )
        .eq("customer_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setWishlistItems([]);
        setFilteredItems([]);
        setLoading(false);
        return;
      }
      if (data) {
        const formattedItems = data.map((item) => ({
          wishlistId: item.id,
          id: item.outfit_id,
          name: item.outfits?.name || "Unnamed Item",
          price: parseFloat(item.outfits?.price) || 0,
          category: item.outfits?.category || "Uncategorized",
          description: item.outfits?.description || "",
          image:
            item.outfits?.outfit_images?.find((img) => img.is_main)
              ?.image_url || null,
          addedDate: item.created_at,
          rating: 4.5,
          inStock: true,
        }));
        setWishlistItems(formattedItems);
        setFilteredItems(formattedItems);
      }
    } catch (error) {
      console.error(error);
      setWishlistItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", wishlistId);
      if (error) {
        alert("Failed to remove item.");
        return;
      }
      setWishlistItems((prev) =>
        prev.filter((item) => item.wishlistId !== wishlistId),
      );
      setSelectedItems((prev) => prev.filter((id) => id !== wishlistId));
    } catch (error) {
      alert("Failed to remove item.", error);
    }
  };

  const addToCart = async (outfitId) => {
    try {
      if (!userId) {
        alert("Please log in to add items to cart.");
        return;
      }
      const { data: existingCart, error: fetchError } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("customer_id", userId)
        .eq("outfit_id", outfitId)
        .maybeSingle();
      if (fetchError && fetchError.code !== "PGRST116") {
        alert("Failed to add to cart.");
        return;
      }
      if (existingCart) {
        const { error } = await supabase
          .from("cart")
          .update({ quantity: existingCart.quantity + 1 })
          .eq("id", existingCart.id);
        if (error) {
          alert("Failed to add to cart.");
          return;
        }
      } else {
        const { error } = await supabase
          .from("cart")
          .insert({ customer_id: userId, outfit_id: outfitId, quantity: 1 });
        if (error) {
          alert("Failed to add to cart.");
          return;
        }
      }
      alert("Added to cart successfully!");
    } catch (error) {
      alert("Failed to add to cart.", error);
    }
  };

  const removeSelectedItems = async () => {
    if (selectedItems.length === 0) return;
    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .in("id", selectedItems);
      if (error) {
        alert("Failed to remove items.");
        return;
      }
      setWishlistItems((prev) =>
        prev.filter((item) => !selectedItems.includes(item.wishlistId)),
      );
      setSelectedItems([]);
    } catch (error) {
      alert("Failed to remove items.", error);
    }
  };

  const toggleSelectItem = (wishlistId) => {
    setSelectedItems((prev) =>
      prev.includes(wishlistId)
        ? prev.filter((id) => id !== wishlistId)
        : [...prev, wishlistId],
    );
  };

  const selectAllItems = () => {
    setSelectedItems(
      selectedItems.length === filteredItems.length
        ? []
        : filteredItems.map((item) => item.wishlistId),
    );
  };

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const avgPrice =
    wishlistItems.length > 0 ? totalValue / wishlistItems.length : 0;

  const inputCls =
    "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none transition-all";

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                My Wishlist
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "item" : "items"}{" "}
                {searchQuery || filterCategory !== "all" ? "found" : "saved"}
              </p>
            </div>
            <Link
              to="/customer/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-300 transition-all"
              style={{
                background: "linear-gradient(135deg, #16a34a, #059669)",
              }}
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
          </div>

          {/* Search + Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search wishlist…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none transition-all"
              />
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow text-green-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow text-green-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none cursor-pointer transition-all text-gray-700"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${showFilters ? "text-white border-transparent shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-700"}`}
              style={
                showFilters
                  ? { background: "linear-gradient(135deg, #16a34a, #059669)" }
                  : {}
              }
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Total Items",
              value: wishlistItems.length,
              icon: <Heart className="w-5 h-5 text-green-600" />,
              bg: "bg-green-50",
            },
            {
              label: "Total Value",
              value: `$${totalValue.toFixed(2)}`,
              icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
              bg: "bg-emerald-50",
            },
            {
              label: "Avg Price",
              value: `$${avgPrice.toFixed(2)}`,
              icon: <Package className="w-5 h-5 text-green-700" />,
              bg: "bg-green-50",
            },
          ].map(({ label, value, icon, bg }) => (
            <div
              key={label}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}
              >
                {icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2.5 uppercase tracking-wide">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat.toLowerCase())}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterCategory === cat.toLowerCase() ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"}`}
                      style={
                        filterCategory === cat.toLowerCase()
                          ? {
                              background:
                                "linear-gradient(135deg, #16a34a, #059669)",
                            }
                          : {}
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2.5 uppercase tracking-wide">
                  Price Range: ${priceRange.min} – ${priceRange.max}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        min: parseInt(e.target.value) || 0,
                      })
                    }
                    className={`${inputCls} w-28`}
                    placeholder="Min"
                    min="0"
                  />
                  <span className="text-gray-400 text-sm">to</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        max: parseInt(e.target.value) || 1000,
                      })
                    }
                    className={`${inputCls} w-28`}
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredItems.length}
                onChange={selectAllItems}
                className="w-4 h-4 rounded border-gray-300 accent-green-600 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedItems.length} item(s) selected
              </span>
            </div>
            <button
              onClick={removeSelectedItems}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors border border-red-100"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Selected
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading your wishlist…</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {searchQuery.trim() || filterCategory !== "all"
                ? "No items match your filters"
                : "Your wishlist is empty"}
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              {searchQuery.trim() || filterCategory !== "all"
                ? "Try adjusting your filters"
                : "Start adding items you love!"}
            </p>
            <button
              onClick={() => navigate("/customer/products")}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
              style={{
                background: "linear-gradient(135deg, #16a34a, #059669)",
              }}
            >
              Browse Products
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.wishlistId}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group relative"
              >
                {/* Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.wishlistId)}
                    onChange={() => toggleSelectItem(item.wishlistId)}
                    className="w-4 h-4 rounded border-white shadow accent-green-600 cursor-pointer"
                  />
                </div>

                {/* Image */}
                <div className="relative overflow-hidden h-56">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {[
                      {
                        icon: <Camera className="w-4 h-4" />,
                        onClick: () =>
                          navigate(`/customer/try-on/${item.id}`, {
                            state: {
                              outfit: item.name.toLowerCase().includes("black")
                                ? "black"
                                : "white",
                              productImage: item.image,
                            },
                          }),
                        title: "Try On",
                      },
                      {
                        icon: <ShoppingCart className="w-4 h-4" />,
                        onClick: () => addToCart(item.id),
                        title: "Add to Cart",
                      },
                      {
                        icon: <Trash2 className="w-4 h-4" />,
                        onClick: () => removeFromWishlist(item.wishlistId),
                        title: "Remove",
                        red: true,
                      },
                    ].map(({ icon, onClick, title, red }) => (
                      <button
                        key={title}
                        onClick={onClick}
                        title={title}
                        className={`p-2.5 rounded-full bg-white/90 backdrop-blur-sm transition-all ${red ? "hover:bg-red-500 hover:text-white" : "hover:bg-green-500 hover:text-white"} text-gray-700`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-4">
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-100">
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-2 mb-1.5 text-sm line-clamp-2 h-10">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-gray-600">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-lg font-bold bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #16a34a, #059669)",
                      }}
                    >
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromWishlist(item.wishlistId)}
                      className="p-1.5 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.wishlistId}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.wishlistId)}
                  onChange={() => toggleSelectItem(item.wishlistId)}
                  className="w-4 h-4 rounded border-gray-300 accent-green-600 cursor-pointer shrink-0"
                />

                <div className="shrink-0 w-full sm:w-auto">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full sm:w-20 h-44 sm:h-20 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full sm:w-20 h-44 sm:h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Package className="w-7 h-7 text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-100">
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-sm mt-1.5 mb-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-gray-600">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-3">
                  <span
                    className="text-xl font-bold bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #16a34a, #059669)",
                    }}
                  >
                    ${item.price.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    {[
                      {
                        icon: <Camera className="w-4 h-4" />,
                        onClick: () =>
                          navigate(`/customer/try-on/${item.id}`, {
                            state: {
                              outfit: item.name.toLowerCase().includes("black")
                                ? "black"
                                : "white",
                              productImage: item.image,
                            },
                          }),
                        title: "Try On",
                        cls: "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white",
                      },
                      {
                        icon: <ShoppingCart className="w-4 h-4" />,
                        onClick: () => addToCart(item.id),
                        title: "Add to Cart",
                        cls: "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white",
                      },
                      {
                        icon: <Trash2 className="w-4 h-4" />,
                        onClick: () => removeFromWishlist(item.wishlistId),
                        title: "Remove",
                        cls: "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white",
                      },
                    ].map(({ icon, onClick, title, cls }) => (
                      <button
                        key={title}
                        onClick={onClick}
                        title={title}
                        className={`p-2 rounded-xl transition-all ${cls}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
