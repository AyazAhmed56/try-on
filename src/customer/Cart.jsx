import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  Heart,
  Tag,
  CreditCard,
  Truck,
  Shield,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../services/supabase";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("carts")
        .select(
          `
          id,
          quantity,
          size,
          color,
          created_at,
          outfits (
            id,
            name,
            category,
            price,
            discount_price,
            stock,
            brand,
            outfit_images (
              image_url,
              is_main
            )
          )
        `,
        )
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
        return;
      }

      const formatted = data.map((item) => {
        const outfit = item.outfits;
        const mainImage =
          outfit.outfit_images?.find((img) => img.is_main)?.image_url ||
          "https://via.placeholder.com/150x200?text=No+Image";

        return {
          cartId: item.id,
          id: outfit.id,
          name: outfit.name,
          category: outfit.category,
          price: outfit.discount_price || outfit.price,
          originalPrice: outfit.discount_price ? outfit.price : null,
          stock: outfit.stock,
          brand: outfit.brand,
          image: mainImage,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        };
      });

      setCartItems(formatted);
      setLoading(false);
    };

    fetchCart();
  }, []);

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    const { error } = await supabase
      .from("carts")
      .update({ quantity: newQuantity })
      .eq("id", cartId);

    if (!error) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartId === cartId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  };

  const removeFromCart = async (cartId) => {
    const { error } = await supabase.from("carts").delete().eq("id", cartId);

    if (!error) {
      setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
    }
  };

  const moveToWishlist = async (item) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("wishlists").insert({
      customer_id: user.id,
      outfit_id: item.id,
    });

    await removeFromCart(item.cartId);
  };

  const applyCoupon = () => {
    // Implement coupon logic
    if (couponCode === "SAVE10") {
      setAppliedCoupon({ code: "SAVE10", discount: 10 });
    } else {
      alert("Invalid coupon code");
    }
  };

  const proceedToCheckout = () => {
    navigate("/customer/checkout");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;
  const tax = (subtotal - discount) * 0.18; // 18% GST
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal - discount + tax + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 py-12 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/customer/dashboard"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">{cartItems.length} items in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-lg text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Your Cart is Empty
            </h3>
            <p className="text-gray-600 mb-6">
              Add items to your cart to get started!
            </p>
            <Link
              to="/customer/all-items"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Items
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex gap-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-40 object-cover rounded-lg shrink-0"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          {item.brand && (
                            <p className="text-sm text-purple-600 font-medium mb-1">
                              {item.brand}
                            </p>
                          )}
                          <h3 className="font-semibold text-lg text-gray-800 mb-2">
                            {item.name}
                          </h3>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>
                              Size:{" "}
                              <span className="font-medium">{item.size}</span>
                            </span>
                            <span>
                              Color:{" "}
                              <span className="font-medium">{item.color}</span>
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-purple-600">
                              ₹{item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-lg text-gray-400 line-through">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Subtotal:{" "}
                            <span className="font-semibold">
                              ₹{item.price * item.quantity}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.cartId, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.cartId, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                              className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => moveToWishlist(item)}
                          className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 font-medium rounded-lg hover:bg-pink-200 transition-colors text-sm"
                        >
                          <Heart className="w-4 h-4" />
                          Move to Wishlist
                        </button>
                        {item.quantity >= item.stock && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Max stock reached
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg sticky top-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                {/* Coupon */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apply Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                      <Tag className="w-4 h-4" />
                      Coupon "{appliedCoupon.code}" applied!
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">
                        -₹{discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (GST 18%)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={proceedToCheckout}
                  className="w-full py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 mb-4"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </button>

                <Link
                  to="/customer/all-items"
                  className="block w-full py-3 text-center bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Benefits */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-purple-600" />
                    <span>Free shipping on orders above ₹500</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span>Secure payment & 100% authentic products</span>
                  </div>
                </div>
              </div>
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

export default Cart;
