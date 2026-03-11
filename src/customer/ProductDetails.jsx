import React, { useState, useEffect } from "react";
import {
  Heart,
  ShoppingCart,
  Camera,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  MapPin,
  Mail,
  Phone,
  Store,
  Award,
  Clock,
  Package,
  Check,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [userId, setUserId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

  // Sample sizes - you can make this dynamic based on category
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          await checkWishlistStatus(user.id, id);
        }

        // Fetch product details
        const { data, error } = await supabase
          .from("outfits")
          .select(
            `
          *,
          outfit_images (
            id,
            image_url,
            is_main
          ),
          seller:seller_id (
            id,
            business_name,
            email,
            phone,
            address,
            rating,
            total_sales
          )
        `,
          )
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
          setLoading(false);
          return;
        }

        if (data) {
          // Sort images: main image first, then others
          const sortedImages =
            data.outfit_images?.sort((a, b) => b.is_main - a.is_main) || [];

          setProduct({
            id: data.id,
            name: data.name || "Unnamed Product",
            price: parseFloat(data.price) || 0,
            description: data.description || "No description available.",
            category: data.category || "Uncategorized",
            subcategory: data.subcategory || "",
            stock: data.stock_quantity || 0,
            images: sortedImages,
            seller: data.seller || {
              business_name: "Unknown Seller",
              email: "N/A",
              phone: "N/A",
              rating: 0,
              total_sales: 0,
            },
            rating: 4.5, // You can add this to your database
            reviewCount: 128, // You can add this to your database
            material: data.material || "Premium Quality Fabric",
            care: data.care_instructions || "Machine wash cold, tumble dry low",
            features: data.features || [
              "High-quality material",
              "Comfortable fit",
              "Durable construction",
              "Easy to maintain",
            ],
          });

          // Fetch reviews
          await fetchReviews(id);
        }
      } catch (error) {
        console.error("Error in fetchProductDetails:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  console.log("Product ID:", id);

  const checkWishlistStatus = async (currentUserId, productId) => {
    try {
      const { data } = await supabase
        .from("wishlist")
        .select("id")
        .eq("customer_id", currentUserId)
        .eq("outfit_id", productId)
        .maybeSingle();

      setIsInWishlist(!!data);
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
        id,
        rating,
        comment,
        created_at,
        users(name)
      `,
        )
        .eq("outfit_id", productId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      const formatted = data.map((r) => ({
        id: r.id,
        user: r.users?.name || "Anonymous",
        rating: r.rating,
        comment: r.comment,
        date: r.created_at,
        verified: true,
      }));

      setReviews(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlist = async () => {
    if (!userId) {
      alert("Please log in to add items to wishlist");
      navigate("/login");
      return;
    }

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("customer_id", userId)
          .eq("outfit_id", id);

        if (!error) {
          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        const { error } = await supabase.from("wishlist").insert({
          customer_id: userId,
          outfit_id: id,
        });

        if (!error) {
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    }
  };

  const addToCart = async () => {
    if (!userId) {
      alert("Please log in to add items to cart");
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (product.stock === 0) {
      alert("This product is out of stock");
      return;
    }

    try {
      const { data: existingCart, error: fetchError } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("customer_id", userId)
        .eq("outfit_id", id)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking cart:", fetchError);
        alert("Failed to add to cart. Please try again.");
        return;
      }

      if (existingCart) {
        const { error: updateError } = await supabase
          .from("cart")
          .update({ quantity: existingCart.quantity + quantity })
          .eq("id", existingCart.id);

        if (updateError) {
          console.error("Error updating cart:", updateError);
          alert("Failed to add to cart. Please try again.");
          return;
        }
      } else {
        const { error: insertError } = await supabase.from("cart").insert({
          customer_id: userId,
          outfit_id: id,
          quantity: quantity,
          size: selectedSize,
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

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link
            to="/customer/products"
            className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
              {product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[selectedImage]?.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                      </button>
                    </>
                  )}
                  {/* Wishlist Button */}
                  <button
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-pink-500 hover:text-white transition-all"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isInWishlist ? "fill-pink-500 text-pink-500" : ""
                      }`}
                    />
                  </button>
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-purple-600 shadow-lg"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                {product.category}
              </span>
              {product.subcategory && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  {product.subcategory}
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 font-medium">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-gray-500 line-through text-lg">
                  ${(product.price * 1.3).toFixed(2)}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  Save 30%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Tax included. Shipping calculated at checkout.
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stock > 0 ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Size
              </label>
              <div className="grid grid-cols-6 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      selectedSize === size
                        ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Max: {product.stock} items
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/try-on")}
                className="w-full py-4 px-6 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Try Virtual Try-On</span>
              </button>
              <button
                onClick={addToCart}
                disabled={product.stock === 0 || !selectedSize}
                className="w-full py-4 px-6 rounded-xl bg-white border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <Truck className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-xs font-medium text-gray-900">
                  Free Shipping
                </p>
                <p className="text-xs text-gray-600">Orders over $50</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <RefreshCw className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-xs font-medium text-gray-900">
                  Easy Returns
                </p>
                <p className="text-xs text-gray-600">30-day policy</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <Shield className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-xs font-medium text-gray-900">
                  Secure Payment
                </p>
                <p className="text-xs text-gray-600">SSL encrypted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {["description", "seller", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Product Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Material & Care
                  </h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Material:</strong> {product.material}
                  </p>
                  <p className="text-gray-700">
                    <strong>Care Instructions:</strong> {product.care}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 text-gray-700"
                      >
                        <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "seller" && (
              <div className="space-y-6">
                <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {product.seller.business_name?.[0]?.toUpperCase() ||
                          "S"}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {product.seller.business_name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.seller.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({product.seller.rating?.toFixed(1) || "N/A"})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-purple-600">
                        <Award className="w-5 h-5" />
                        <span className="font-semibold">Verified Seller</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <span>{product.seller.email}</span>
                    </div>
                    {product.seller.phone && (
                      <div className="flex items-center space-x-3 text-gray-700">
                        <Phone className="w-5 h-5 text-purple-600" />
                        <span>{product.seller.phone}</span>
                      </div>
                    )}
                    {product.seller.address && (
                      <div className="flex items-center space-x-3 text-gray-700">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        <span>{product.seller.address}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Store className="w-5 h-5 text-purple-600" />
                      <span>{product.seller.total_sales || 0} Sales</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Seller Policies
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Truck className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Shipping</p>
                        <p className="text-sm text-gray-600">
                          Ships within 2-3 business days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RefreshCw className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Returns</p>
                        <p className="text-sm text-gray-600">
                          30-day return policy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Response Time
                        </p>
                        <p className="text-sm text-gray-600">
                          Usually responds within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Customer Reviews
                    </h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600">
                        {product.rating.toFixed(1)} out of 5
                      </span>
                    </div>
                  </div>
                  <button className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all">
                    Write a Review
                  </button>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-2 border-gray-200 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-semibold text-gray-900">
                              {review.user}
                            </p>
                            {review.verified && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center space-x-1">
                                <Check className="w-3 h-3" />
                                <span>Verified Purchase</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
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
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
