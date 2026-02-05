import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Heart,
  ShoppingCart,
  Camera,
  Star,
  X,
  ChevronDown,
  ChevronRight,
  Package,
  ArrowLeft,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

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

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("outfits")
      .select(
        `
    id,
    name,
    price,
    category,
    subcategory,
    description,
    stock_quantity,
    material,
    care_instructions,
    brand,
    discount_price,
    created_at,
    outfit_images (
      image_url,
      is_main
    )
  `,
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

  const fetchWishlist = useCallback(async (currentUserId) => {
    try {
      const { data } = await supabase
        .from("wishlist")
        .select("outfit_id")
        .eq("customer_id", currentUserId);

      if (data) {
        setWishlistIds(data.map((item) => item.outfit_id));
      }
    } catch (err) {
      console.error("fetchWishlist error:", err);
    }
  }, []);

  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();

      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (p) =>
          p.category?.toLowerCase().trim() ===
          selectedCategory.toLowerCase().trim(),
      );
    }

    if (selectedSubcategory !== "All") {
      filtered = filtered.filter(
        (p) =>
          p.subcategory?.toLowerCase().trim() ===
          selectedSubcategory.toLowerCase().trim(),
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max,
    );

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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
      case "popular":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
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
    } catch (err) {
      console.error("Error fetching data:", err);
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

  const toggleWishlist = async (productId) => {
    if (!userId) {
      alert("Please log in to add items to wishlist");
      navigate("/login");
      return;
    }

    try {
      const isInWishlist = wishlistIds.includes(productId);

      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("customer_id", userId)
          .eq("outfit_id", productId);

        if (!error) {
          setWishlistIds(wishlistIds.filter((id) => id !== productId));
        }
      } else {
        // Add to wishlist
        const { error } = await supabase.from("wishlist").insert({
          customer_id: userId,
          outfit_id: productId,
        });

        if (!error) {
          setWishlistIds([...wishlistIds, productId]);
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    }
  };

  const addToCart = async (productId) => {
    if (!userId) {
      alert("Please log in to add items to cart");
      navigate("/login");
      return;
    }

    try {
      const { data: existingCart, error: fetchError } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("customer_id", userId)
        .eq("outfit_id", productId)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking cart:", fetchError);
        alert("Failed to add to cart. Please try again.");
        return;
      }

      if (existingCart) {
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
        const { error: insertError } = await supabase.from("cart").insert({
          customer_id: userId,
          outfit_id: productId,
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

  const toggleCategory = (category) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(
        expandedCategories.filter((cat) => cat !== category),
      );
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("All");
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setPriceRange({ min: 0, max: 10000 });
    setSearchQuery("");
  };

  const ProductStats = () => {
    const totalProducts = products.length;
    const avgPrice =
      products.length > 0
        ? products.reduce((sum, p) => sum + p.price, 0) / products.length
        : 0;
    const inStock = products.filter((p) => p.stock > 0).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-purple-500" />
            <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {totalProducts}
            </span>
          </div>
          <p className="text-sm text-gray-600">Total Products</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-pink-500" />
            <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${avgPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-600">Average Price</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {inStock}
            </span>
          </div>
          <p className="text-sm text-gray-600">In Stock</p>
        </div>
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
                Browse Products
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"} found
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
                placeholder="Search products..."
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
        <ProductStats />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div
            className={`lg:w-64 shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-purple-600 cursor-pointer hover:text-pink-600 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedSubcategory("All");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      selectedCategory === "All"
                        ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    All Products
                  </button>
                  {Object.entries(categories).map(
                    ([category, subcategories]) => (
                      <div key={category}>
                        <button
                          onClick={() => {
                            handleCategorySelect(category);
                            if (subcategories.length > 0) {
                              toggleCategory(category);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                            selectedCategory === category
                              ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <span className="font-medium">{category}</span>
                          {subcategories.length > 0 &&
                            (expandedCategories.includes(category) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            ))}
                        </button>
                        {subcategories.length > 0 &&
                          expandedCategories.includes(category) && (
                            <div className="ml-4 mt-1 space-y-1">
                              {subcategories.map((subcategory) => (
                                <button
                                  key={subcategory}
                                  onClick={() => {
                                    handleCategorySelect(category);
                                    handleSubcategorySelect(subcategory);
                                  }}
                                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                                    selectedSubcategory === subcategory &&
                                    selectedCategory === category
                                      ? "bg-purple-100 text-purple-700 font-medium"
                                      : "hover:bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {subcategory}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Price Range: ${priceRange.min} - ${priceRange.max}
                </h4>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        min: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Min Price"
                    min="0"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        max: parseInt(e.target.value) || 10000,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Max Price"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 rounded-xl bg-linear-to-r cursor-pointer from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden h-64">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Package className="w-16 h-16 text-gray-400" />
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all z-10"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            wishlistIds.includes(product.id)
                              ? "fill-pink-500 text-pink-500"
                              : ""
                          }`}
                        />
                      </button>

                      {/* Stock Badge */}
                      {product.stock === 0 && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <button
                          onClick={() => navigate("/try-on")}
                          className="p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-purple-500 hover:text-white transition-all"
                          title="Try On"
                        >
                          <Camera className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => addToCart(product.id)}
                          disabled={product.stock === 0}
                          className={`p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-purple-500 hover:text-white transition-all ${
                            product.stock === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                        {product.subcategory && (
                          <span className="text-xs text-gray-500">
                            {product.subcategory}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-700 mr-2">
                          {product.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({product.stock} in stock)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart(product.id)}
                          disabled={product.stock === 0}
                          className={`px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all ${
                            product.stock === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6"
                  >
                    {/* Image */}
                    <div className="shrink-0 w-full sm:w-32">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 sm:w-32 sm:h-32 object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-48 sm:w-32 sm:h-32 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 flex items-center space-x-2">
                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                        {product.subcategory && (
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {product.subcategory}
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-700 mr-2">
                          {product.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({product.stock} in stock)
                        </span>
                      </div>
                      {product.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto space-y-0 sm:space-y-3">
                      <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="p-2 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition-all"
                          title="Wishlist"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              wishlistIds.includes(product.id)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => navigate("/try-on")}
                          className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-all"
                          title="Try On"
                        >
                          <Camera className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => addToCart(product.id)}
                          disabled={product.stock === 0}
                          className={`p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-all ${
                            product.stock === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-5 h-5" />
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
  );
};

export default BrowseProducts;
