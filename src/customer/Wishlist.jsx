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
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
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

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === filterCategory.toLowerCase(),
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (item) => item.price >= priceRange.min && item.price <= priceRange.max,
    );

    // Sorting
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
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  }, []);

  // Fetch user and wishlist on mount
  useEffect(() => {
    fetchUserAndWishlist();
  }, [fetchUserAndWishlist]);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const fetchWishlist = async (currentUserId) => {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select(
          `
    id,
    created_at,

    outfits:outfit_id (
      id,
      name,
      price,
      category,
      description,

      outfit_images (
        image_url,
        is_main
      )
    )
  `,
        )
        .eq("customer_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistItems([]);
        setFilteredItems([]);
        setLoading(false);
        return;
      }

      if (data) {
        const formattedItems = data
          .filter((item) => item.outfits) // Filter out null outfits
          .map((item) => ({
            wishlistId: item.id,
            id: item.outfits.id,
            name: item.outfits.name || "Unnamed Item",
            price: parseFloat(item.outfits.price) || 0,
            category: item.outfits.category || "Uncategorized",
            description: item.outfits.description || "",
            image:
              item.outfits.outfit_images?.find((img) => img.is_main)
                ?.image_url || null,
            addedDate: item.created_at,
            rating: 4.5,
            inStock: true,
          }));

        setWishlistItems(formattedItems);
        setFilteredItems(formattedItems);
      }
    } catch (error) {
      console.error("Error in fetchWishlist:", error);
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
        console.error("Error removing from wishlist:", error);
        alert("Failed to remove item. Please try again.");
        return;
      }

      setWishlistItems((prev) =>
        prev.filter((item) => item.wishlistId !== wishlistId),
      );
      setSelectedItems((prev) => prev.filter((id) => id !== wishlistId));
    } catch (error) {
      console.error("Error in removeFromWishlist:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  const addToCart = async (outfitId) => {
    try {
      if (!userId) {
        alert("Please log in to add items to cart.");
        return;
      }

      // Check if item already in cart
      const { data: existingCart, error: fetchError } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("customer_id", userId)
        .eq("outfit_id", outfitId)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking cart:", fetchError);
        alert("Failed to add to cart. Please try again.");
        return;
      }

      if (existingCart) {
        // Update quantity
        const { error: updateError } = await supabase
          .from("cart")
          .update({ quantity: existingCart.quantity + 1 })
          .eq("id", existingCart.id);

        if (updateError) {
          console.error("Error updating cart:", updateError);
          alert("Failed to add to cart. Please try again.");
          return;
        }
      } else {
        // Add new item
        const { error: insertError } = await supabase.from("cart").insert({
          customer_id: userId,
          outfit_id: outfitId,
          quantity: 1,
        });

        if (insertError) {
          console.error("Error adding to cart:", insertError);
          alert("Failed to add to cart. Please try again.");
          return;
        }
      }

      alert("Added to cart successfully!");
    } catch (error) {
      console.error("Error in addToCart:", error);
      alert("Failed to add to cart. Please try again.");
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
        console.error("Error removing selected items:", error);
        alert("Failed to remove items. Please try again.");
        return;
      }

      setWishlistItems((prev) =>
        prev.filter((item) => !selectedItems.includes(item.wishlistId)),
      );
      setSelectedItems([]);
    } catch (error) {
      console.error("Error in removeSelectedItems:", error);
      alert("Failed to remove items. Please try again.");
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
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.wishlistId));
    }
  };

  const WishlistStats = () => {
    const totalItems = wishlistItems.length;
    const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
    const avgPrice = totalItems > 0 ? totalValue / totalItems : 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-8 h-8 text-pink-500" />
            <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {totalItems}
            </span>
          </div>
          <p className="text-sm text-gray-600">Total Items</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${totalValue.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-600">Total Value</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-pink-500" />
            <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${avgPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-600">Average Price</p>
        </div>
      </div>
    );
  };

  const EmptyState = () => {
    const isFiltered = searchQuery.trim() || filterCategory !== "all";

    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isFiltered
            ? "No items match your filters"
            : "Your wishlist is empty"}
        </h3>
        <p className="text-gray-600 mb-6">
          {isFiltered
            ? "Try adjusting your filters"
            : "Start adding items you love!"}
        </p>
        <button
          onClick={() => navigate("/customer/products")}
          className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all"
        >
          Browse Products
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "item" : "items"}{" "}
                {searchQuery || filterCategory !== "all" ? "found" : "saved"}
              </p>
            </div>
            <Link
              to="/customer/dashboard"
              className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Search and Actions Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-md text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-md text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl border border-gray-200 transition-all flex items-center space-x-2 ${
                showFilters
                  ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <WishlistStats />

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category.toLowerCase())}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        filterCategory === category.toLowerCase()
                          ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Price Range: ${priceRange.min} - ${priceRange.max}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        min: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-28 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Min"
                    min="0"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        max: parseInt(e.target.value) || 1000,
                      })
                    }
                    className="w-28 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-6 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredItems.length}
                onChange={selectAllItems}
                className="w-5 h-5 rounded border-2 cursor-pointer"
              />
              <span className="font-medium text-gray-700">
                {selectedItems.length} item(s) selected
              </span>
            </div>
            <button
              onClick={removeSelectedItems}
              className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove Selected</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState />
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.wishlistId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group relative"
              >
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.wishlistId)}
                    onChange={() => toggleSelectItem(item.wishlistId)}
                    className="w-5 h-5 rounded border-2 border-white shadow-lg cursor-pointer"
                  />
                </div>

                {/* Image */}
                <div className="relative overflow-hidden h-64">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      onClick={() => navigate("/customer/try-on")}
                      className="p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-purple-500 hover:text-white transition-all"
                      title="Try On"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-purple-500 hover:text-white transition-all"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.wishlistId)}
                      className="p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-red-500 hover:text-white transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                    {item.name}
                  </h3>
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-700">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromWishlist(item.wishlistId)}
                      className="p-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-500 hover:text-white transition-all"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.wishlistId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6"
              >
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.wishlistId)}
                  onChange={() => toggleSelectItem(item.wishlistId)}
                  className="w-5 h-5 rounded border-2 cursor-pointer shrink-0"
                />

                {/* Image */}
                <div className="shrink-0 w-full sm:w-auto">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full sm:w-24 h-48 sm:h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-700">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto space-y-0 sm:space-y-3">
                  <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ${item.price.toFixed(2)}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate("/customer/try-on")}
                      className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-all"
                      title="Try On"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-all"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.wishlistId)}
                      className="p-2 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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
