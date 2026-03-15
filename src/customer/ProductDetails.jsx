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

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("outfits")
        .select(
          `
        id,
        name,
        price,
        discount_price,
        description,
        stock_quantity,
        category,
        subcategory,
        material,
        care_instructions,
        seller_id,
        outfit_images(id, image_url, is_main),
        seller_profiles!seller_id(
          user_id,
          shop_name,
          address,
          city,
          state,
          pincode,
          shop_logo
        )
      `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      if (!data) {
        setProduct(null);
        return;
      }

      const sortedImages =
        data.outfit_images?.sort(
          (a, b) => (b.is_main === true) - (a.is_main === true),
        ) || [];

      const seller = Array.isArray(data.seller_profiles)
        ? data.seller_profiles[0]
        : data.seller_profiles;

      setProduct({
        id: data.id,
        name: data.name,
        price: Number(data.price) || 0,
        discountPrice: Number(data.discount_price) || 0,
        description: data.description || "",
        stock: data.stock_quantity || 0,
        images: sortedImages,
        category: data.category || "",
        subcategory: data.subcategory || "",
        material: data.material || "",
        care: data.care_instructions || "",

        rating: 0,
        reviewCount: 0,

        features: ["High Quality", "Comfort Fit", "Stylish Design"],

        seller: seller || {
          shop_name: "Unknown Seller",
          address: "",
          city: "",
          state: "",
          pincode: "",
          shop_logo: null,
        },
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

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
      console.error(error);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const { data, error } = await supabase
        .from("outfit_reviews")
        .select(
          `
    id,
    rating,
    comment,
    created_at,
    profiles(name)
  `,
        )
        .eq("outfit_id", productId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        return;
      }
      setReviews(
        data.map((r) => ({
          id: r.id,
          user: r.profiles?.name || "Anonymous",
          rating: r.rating,
          comment: r.comment,
          date: r.created_at,
          verified: true,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId && id) checkWishlistStatus(userId, id);
  }, [userId, id]);
  useEffect(() => {
    if (id) fetchReviews(id);
  }, [id]);

  const toggleWishlist = async () => {
    if (!userId) {
      alert("Please log in to add items to wishlist");
      navigate("/login");
      return;
    }
    try {
      if (isInWishlist) {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("customer_id", userId)
          .eq("outfit_id", id);
        if (!error) setIsInWishlist(false);
      } else {
        const { error } = await supabase
          .from("wishlist")
          .insert({ customer_id: userId, outfit_id: id });
        if (!error) setIsInWishlist(true);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update wishlist.");
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
        alert("Failed to add to cart.");
        return;
      }
      if (existingCart) {
        const { error } = await supabase
          .from("cart")
          .update({ quantity: existingCart.quantity + quantity })
          .eq("id", existingCart.id);
        if (error) {
          alert("Failed to add to cart.");
          return;
        }
      } else {
        const { error } = await supabase.from("cart").insert({
          customer_id: userId,
          outfit_id: id,
          quantity,
          size: selectedSize,
        });
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

  const handleQuantityChange = (change) => {
    const n = quantity + change;
    if (n >= 1 && n <= product.stock) setQuantity(n);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out: ${product.name}`,
          url: window.location.href,
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  const nextImage = () =>
    setSelectedImage((p) => (p === product.images.length - 1 ? 0 : p + 1));
  const prevImage = () =>
    setSelectedImage((p) => (p === 0 ? product.images.length - 1 : p - 1));

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading product details…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link
            to="/customer/products"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all inline-block"
            style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-500 hover:text-green-600 transition-colors" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden aspect-square">
              {product.images?.length > 0 ? (
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
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow hover:bg-white transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow hover:bg-white transition-all"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={toggleWishlist}
                    className={`absolute top-3 right-3 p-2.5 rounded-full shadow transition-all ${isInWishlist ? "bg-red-50 text-red-500" : "bg-white/90 text-gray-400 hover:text-red-400"}`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isInWishlist ? "fill-red-500" : ""}`}
                    />
                  </button>
                </>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Package className="w-20 h-20 text-gray-300" />
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index ? "border-green-500 shadow-sm" : "border-gray-200 hover:border-green-300"}`}
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
          <div className="space-y-5">
            {/* Category badges */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                {product.category}
              </span>
              {product.subcategory && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {product.subcategory}
                </span>
              )}
            </div>

            {/* Title + Rating */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-700 font-medium">
                    {(product.rating || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-green-50/60 border border-green-100 rounded-2xl p-5">
              <div className="flex items-baseline gap-3">
                <span
                  className="text-3xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #16a34a, #059669)",
                  }}
                >
                  ${product.discountPrice || product.price}
                </span>
                {product.discountPrice > 0 && (
                  <span className="text-gray-400 line-through text-base">
                    ${product.price}
                  </span>
                )}
                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Save 30%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Tax included · Shipping calculated at checkout
              </p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    In Stock{" "}
                    <span className="text-gray-400 font-normal">
                      ({product.stock} available)
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 font-medium">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-10 rounded-xl text-sm font-semibold transition-all border-2 ${
                      selectedSize === size
                        ? "text-white border-transparent shadow-sm"
                        : "bg-white border-gray-200 text-gray-700 hover:border-green-400"
                    }`}
                    style={
                      selectedSize === size
                        ? {
                            background:
                              "linear-gradient(135deg, #16a34a, #059669)",
                          }
                        : {}
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2.5 hover:bg-gray-50 transition-colors disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="px-5 text-sm font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2.5 hover:bg-gray-50 transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  Max: {product.stock}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() =>
                  navigate(`/customer/try-on/${product.id}`, {
                    state: {
                      outfit: product,
                      productImage: product.images?.[0]?.image_url,
                    },
                  })
                }
                className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                }}
              >
                <Camera className="w-4 h-4" /> Try Virtual Try-On
              </button>
              <button
                onClick={addToCart}
                disabled={product.stock === 0 || !selectedSize}
                className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold border-2 border-green-600 text-green-700 bg-white hover:bg-green-50 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: <Truck className="w-5 h-5 text-green-600" />,
                  label: "Free Shipping",
                  sub: "Orders over $50",
                },
                {
                  icon: <RefreshCw className="w-5 h-5 text-green-600" />,
                  label: "Easy Returns",
                  sub: "30-day policy",
                },
                {
                  icon: <Shield className="w-5 h-5 text-green-600" />,
                  label: "Secure Pay",
                  sub: "SSL encrypted",
                },
              ].map(({ icon, label, sub }) => (
                <div
                  key={label}
                  className="text-center p-3.5 bg-white border border-gray-100 rounded-xl shadow-sm"
                >
                  <div className="flex justify-center mb-1.5">{icon}</div>
                  <p className="text-xs font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-100">
            {["description", "seller", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? "text-green-700 border-b-2 border-green-600 bg-green-50/40"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    Product Description
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    Material & Care
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong className="text-gray-800">Material:</strong>{" "}
                    {product.material}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">
                      Care Instructions:
                    </strong>{" "}
                    {product.care}
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {(product.features || []).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 text-sm text-gray-600"
                      >
                        <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "seller" && (
              <div className="space-y-6">
                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #16a34a, #059669)",
                        }}
                      >
                        {product.seller.shop_name?.[0]?.toUpperCase() || "S"}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          {product.seller.shop_name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < Math.floor(product.seller.rating || 0) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.seller.rating?.toFixed(1) || "N/A"})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-green-700 text-sm font-semibold">
                      <Award className="w-4 h-4" /> Verified
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        icon: <Mail className="w-4 h-4 text-green-600" />,
                        val: product.seller.email,
                      },
                      product.seller.phone && {
                        icon: <Phone className="w-4 h-4 text-green-600" />,
                        val: product.seller.phone,
                      },
                      product.seller.address && {
                        icon: <MapPin className="w-4 h-4 text-green-600" />,
                        val: product.seller.address,
                      },
                      {
                        icon: <Store className="w-4 h-4 text-green-600" />,
                        val: `${product.seller.total_sales || 0} Sales`,
                      },
                    ]
                      .filter(Boolean)
                      .map(({ icon, val }, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 text-sm text-gray-600"
                        >
                          {icon} {val}
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    Seller Policies
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        icon: <Truck className="w-4 h-4 text-green-600" />,
                        title: "Shipping",
                        desc: "Ships within 2-3 business days",
                      },
                      {
                        icon: <RefreshCw className="w-4 h-4 text-green-600" />,
                        title: "Returns",
                        desc: "30-day return policy",
                      },
                      {
                        icon: <Clock className="w-4 h-4 text-green-600" />,
                        title: "Response Time",
                        desc: "Usually responds within 24 hours",
                      },
                    ].map(({ icon, title, desc }) => (
                      <div key={title} className="flex items-start gap-3">
                        <div className="mt-0.5">{icon}</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {title}
                          </p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Customer Reviews
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                        />
                      ))}
                      <span className="text-sm text-gray-500">
                        {product.rating.toFixed(1)} out of 5
                      </span>
                    </div>
                  </div>
                  <button
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
                    style={{
                      background: "linear-gradient(135deg, #16a34a, #059669)",
                    }}
                  >
                    Write a Review
                  </button>
                </div>

                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-100 rounded-2xl p-5 bg-white"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {review.user}
                            </p>
                            {review.verified && (
                              <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1 border border-green-100">
                                <Check className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {review.comment}
                      </p>
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
